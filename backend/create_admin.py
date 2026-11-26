from config import get_db_connection
from werkzeug.security import generate_password_hash
from getpass import getpass

name = input("Enter Admin Name: ")
email = input("Enter Admin Email: ")
password = getpass("Enter Admin Password: ")

hashed_password = generate_password_hash(password)

connection = get_db_connection()
cursor = connection.cursor()

cursor.execute(
    """INSERT INTO admins (full_name, email, password_hash)
       VALUES (%s, %s, %s)""",
    (name, email, hashed_password)
)

connection.commit()

cursor.close()
connection.close()

print("Admin Account Created Successfully!")