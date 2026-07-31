const API =
"https://admission-api-r5y6.onrender.com/api/admin/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const res = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await res.json();

        if (!res.ok) {

            document.getElementById("message").textContent =
                data.message;

            return;

        }

        localStorage.setItem("token", data.token);

        window.location.href = "/dashboard";

    }

    catch (err) {

        document.getElementById("message").textContent =
            "Network Error";

    }

});