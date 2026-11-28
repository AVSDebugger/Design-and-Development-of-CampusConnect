from flask import Blueprint, request, jsonify
from config import get_db_connection
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta
import secrets
from email_service import send_otp_email

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/api/admin/login", methods=["POST"])
def admin_login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT admin_id, full_name, email, password_hash FROM admins WHERE email = %s",
        (email,)
    )

    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    if admin and check_password_hash(admin[3], password):
        return jsonify({
            "message": "Login Successful!",
            "status": "success",
            "admin_id": admin[0],
            "name": admin[1]
        }), 200

    return jsonify({
        "message": "Invalid email or password",
        "status": "error"
    }), 401
@admin_bp.route("/api/admin/courses", methods=["GET"])
def get_courses():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM courses")
    courses = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "status": "success",
        "courses": [
            {
                "course_id": row[0],
                "course_name": row[1]
            }
            for row in courses
        ]
    })
@admin_bp.route("/api/admin/batches/<int:course_id>", methods=["GET"])
def get_batches(course_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT batch_id, passing_year FROM batches WHERE course_id = %s ORDER BY passing_year",
        (course_id,)
    )

    batches = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "status": "success",
        "batches": [
            {
                "batch_id": row[0],
                "passing_year": row[1]
            }
            for row in batches
        ]
    })
@admin_bp.route("/api/admin/dashboard", methods=["GET"])
def dashboard():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM alumni")
    total_alumni = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM alumni WHERE verification_status = 'Verified'"
    )
    verified = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM alumni WHERE verification_status = 'Pending'"
    )
    pending = cursor.fetchone()[0]

    cursor.close()
    connection.close()

    return jsonify({
        "total_alumni": total_alumni,
        "verified": verified,
        "pending": pending
    })

# ==================================
# ADMIN FORGOT PASSWORD - SEND OTP
# ==================================

@admin_bp.route("/api/admin/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request"
        }), 400

    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({
            "status": "error",
            "message": "Email is required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT admin_id FROM admins WHERE email = %s",
            (email,)
        )

        admin = cursor.fetchone()

        # Do not reveal whether an email is registered
        if not admin:
            return jsonify({
                "status": "success",
                "message": "If the account exists, an OTP will be sent."
            }), 200

        admin_id = admin[0]

        # Generate 6-digit OTP
        otp = str(secrets.randbelow(900000) + 100000)

        # Hash OTP before storing
        otp_hash = generate_password_hash(otp)

        # OTP valid for 5 minutes
        expires_at = datetime.now() + timedelta(minutes=5)

        # Remove previous OTP requests for this admin
        cursor.execute(
            "DELETE FROM admin_password_resets WHERE admin_id = %s",
            (admin_id,)
        )

        # Store new OTP hash
        cursor.execute(
            """
            INSERT INTO admin_password_resets
            (admin_id, otp_hash, expires_at)
            VALUES (%s, %s, %s)
            """,
            (admin_id, otp_hash, expires_at)
        )

        # Send OTP to registered Gmail
        send_otp_email(email, otp)

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "OTP sent successfully to your registered email."
        }), 200

    except Exception:
        if connection:
            connection.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to send OTP. Please try again."
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ==================================
# ADMIN FORGOT PASSWORD - VERIFY OTP
# ==================================

@admin_bp.route("/api/admin/verify-otp", methods=["POST"])
def verify_admin_otp():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request"
        }), 400

    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({
            "status": "error",
            "message": "Email and OTP are required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT r.reset_id, r.otp_hash, r.expires_at,
                   r.attempts, a.admin_id
            FROM admin_password_resets r
            JOIN admins a ON r.admin_id = a.admin_id
            WHERE a.email = %s
            ORDER BY r.created_at DESC
            LIMIT 1
            """,
            (email,)
        )

        reset = cursor.fetchone()

        if not reset:
            return jsonify({
                "status": "error",
                "message": "Invalid or expired OTP"
            }), 400

        reset_id, otp_hash, expires_at, attempts, admin_id = reset

        if attempts >= 5:
            return jsonify({
                "status": "error",
                "message": "Too many attempts. Request a new OTP."
            }), 429

        if datetime.now() > expires_at:
            return jsonify({
                "status": "error",
                "message": "OTP has expired. Request a new OTP."
            }), 400

        if not check_password_hash(otp_hash, otp):

            cursor.execute(
                """
                UPDATE admin_password_resets
                SET attempts = attempts + 1
                WHERE reset_id = %s
                """,
                (reset_id,)
            )

            connection.commit()

            return jsonify({
                "status": "error",
                "message": "Invalid OTP"
            }), 400

        cursor.execute(
            """
            UPDATE admin_password_resets
            SET verified_at = NOW()
            WHERE reset_id = %s
            """,
            (reset_id,)
        )

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "OTP verified successfully"
        }), 200

    except Exception:
        if connection:
            connection.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to verify OTP"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()

# ==================================
# ADMIN FORGOT PASSWORD - RESET PASSWORD
# ==================================

@admin_bp.route("/api/admin/reset-password", methods=["POST"])
def reset_admin_password():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request"
        }), 400

    email = data.get("email", "").strip().lower()
    new_password = data.get("new_password", "")
    confirm_password = data.get("confirm_password", "")

    if not email or not new_password or not confirm_password:
        return jsonify({
            "status": "error",
            "message": "All fields are required"
        }), 400

    if new_password != confirm_password:
        return jsonify({
            "status": "error",
            "message": "Passwords do not match"
        }), 400

    if len(new_password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 8 characters"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT r.reset_id, a.admin_id
            FROM admin_password_resets r
            JOIN admins a ON r.admin_id = a.admin_id
            WHERE a.email = %s
              AND r.verified_at IS NOT NULL
              AND r.expires_at >= NOW()
            ORDER BY r.created_at DESC
            LIMIT 1
            """,
            (email,)
        )

        reset = cursor.fetchone()

        if not reset:
            return jsonify({
                "status": "error",
                "message": "OTP verification required. Please verify OTP again."
            }), 403

        reset_id, admin_id = reset

        # Hash new password
        password_hash = generate_password_hash(new_password)

        cursor.execute(
            """
            UPDATE admins
            SET password_hash = %s
            WHERE admin_id = %s
            """,
            (password_hash, admin_id)
        )

        # Delete used OTP so it cannot be reused
        cursor.execute(
            """
            DELETE FROM admin_password_resets
            WHERE reset_id = %s
            """,
            (reset_id,)
        )

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "Admin password reset successfully. Please login with your new password."
        }), 200

    except Exception:
        if connection:
            connection.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to reset password. Please try again."
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
