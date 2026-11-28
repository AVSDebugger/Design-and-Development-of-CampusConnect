
fetch("http://127.0.0.1:5000/api/alumni/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "",
        password: "your_password"
    })
})
.then(async response => {
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", data);
})
.catch(error => console.log("Error:", error));
