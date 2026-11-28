
from config import get_db_connection
from werkzeug.security import generate_password_hash
from getpass import getpass

email = input("Enter Admin Email: ").strip().lower()
new_password = getpass("Enter New Admin Password: ")

if len(new_password) < 8:
    print("Password must contain at least 8 characters.")
    exit()

connection = get_db_connection()
cursor = connection.cursor()

hashed_password = generate_password_hash(new_password)

cursor.execute(
    """
    UPDATE admins
    SET password_hash = %s
    WHERE email = %s
    """,
    (hashed_password, email)
)

connection.commit()

if cursor.rowcount == 1:
    print("Admin Password Updated Successfully!")
else:
    print("Admin Email Not Found.")

cursor.close()
connection.close()
