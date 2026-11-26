import mysql.connector
import os

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.environ.get("DB_PASSWORD"),
        database="campus_connect"
    )