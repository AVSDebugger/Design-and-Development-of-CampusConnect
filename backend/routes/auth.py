
from flask import Blueprint, request, jsonify
from config import get_db_connection
from werkzeug.security import check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/alumni/login", methods=["POST"])
def alumni_login():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request data"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT alumni_id, full_name, email,
                   password_hash, verification_status
            FROM alumni
            WHERE email = %s
            """,
            (email,)
        )

        alumni = cursor.fetchone()

        if not alumni:
            return jsonify({
                "status": "error",
                "message": "Invalid email or password"
            }), 401

        if not check_password_hash(alumni[3], password):
            return jsonify({
                "status": "error",
                "message": "Invalid email or password"
            }), 401

        if alumni[4] != "Verified":
            return jsonify({
                "status": "error",
                "message": "Your account is pending admin verification"
            }), 403

        return jsonify({
            "status": "success",
            "message": "Login successful!",
            "alumni": {
                "alumni_id": alumni[0],
                "name": alumni[1],
                "email": alumni[2]
            }
        }), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({
            "status": "error",
            "message": "Login failed. Please try again."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
