import requests
from getpass import getpass

url = "http://127.0.0.1:5000/api/admin/login"

data = {
    "email": "savi@gmail.com",
    "password": getpass("Enter Admin Password: ")
}

response = requests.post(url, json=data)

print(response.status_code)
print(response.json())