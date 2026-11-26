from flask import Blueprint, request, jsonify
from config import get_db_connection
from werkzeug.security import check_password_hash

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