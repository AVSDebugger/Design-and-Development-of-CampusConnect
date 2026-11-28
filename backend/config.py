import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password=os.environ.get("DB_PASSWORD"),
        database="campus_connect"
    )