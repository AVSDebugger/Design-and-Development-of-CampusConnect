
from flask import Blueprint, request, jsonify
from config import get_db_connection
from werkzeug.security import generate_password_hash
import re
import mysql.connector

alumni_bp = Blueprint("alumni", __name__)


@alumni_bp.route("/api/alumni/register", methods=["POST"])
def alumni_register():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request data"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phone = data.get("phone", "").strip()
    course = data.get("course", "").strip()
    passing_year = data.get("passingYear")
    prn = data.get("prn", "").strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    # Validate required fields
    if not all([name, email, phone, course, passing_year, prn, password]):
        return jsonify({
            "status": "error",
            "message": "All fields are required"
        }), 400

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        return jsonify({
            "status": "error",
            "message": "Invalid email address"
        }), 400

    if not re.match(r"^[6-9]\d{9}$", phone):
        return jsonify({
            "status": "error",
            "message": "Invalid mobile number"
        }), 400

    if len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 8 characters"
        }), 400

    if password != confirm_password:
        return jsonify({
            "status": "error",
            "message": "Passwords do not match"
        }), 400

    try:
        passing_year = int(passing_year)
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Invalid passing year"
        }), 400

    if passing_year < 1980 or passing_year > 2035:
        return jsonify({
            "status": "error",
            "message": "Invalid passing year"
        }), 400

    hashed_password = generate_password_hash(password)

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Find selected course
        cursor.execute(
            "SELECT course_id FROM courses WHERE course_name = %s",
            (course,)
        )

        course_data = cursor.fetchone()

        if not course_data:
            return jsonify({
                "status": "error",
                "message": "Selected course not found"
            }), 400

        course_id = course_data[0]

        # Insert alumni registration
        cursor.execute(
            """
            INSERT INTO alumni
            (full_name, email, phone, course_id,
             passing_year, prn, password_hash)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                name, email, phone, course_id,
                passing_year, prn, hashed_password
            )
        )

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "Registration submitted successfully! Your account is pending admin verification."
        }), 201

    except mysql.connector.IntegrityError:
        if connection:
            connection.rollback()

        return jsonify({
            "status": "error",
            "message": "Email or PRN number is already registered"
        }), 409

    except Exception as e:
        if connection:
            connection.rollback()

        print("Registration Error:", e)

        return jsonify({
            "status": "error",
            "message": "Registration failed. Please try again."
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
