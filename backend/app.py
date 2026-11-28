from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.alumni import alumni_bp
from flask import Flask
from config import get_db_connection
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:5500"}
})
app.register_blueprint(admin_bp)
app.register_blueprint(alumni_bp)
app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return "Campus Connect Admin Backend is Running!"

@app.route("/test-db")
def test_db():
    connection = get_db_connection()
    connection.close()
    return "MySQL Connected Successfully!"

if __name__ == "__main__":
    app.run(debug=True)