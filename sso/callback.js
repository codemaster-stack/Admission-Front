const SSO_API =
    "https://admission-api-r5y6.onrender.com/api/admin/sso";

const message =
    document.getElementById("message");

(async function () {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const code =
            params.get("code");

        if (!code) {

            message.textContent =
                "Invalid SSO request.";

            return;
        }

        const res = await fetch(SSO_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                code
            })

        });

        const data = await res.json();

        if (!res.ok || !data.success) {

            message.textContent =
                data.message ||
                "SSO login failed.";

            return;
        }

        // Store the normal tertiary JWT
        localStorage.setItem(
            "token",
            data.token
        );

        // Remove the SSO code from the browser URL
        window.history.replaceState(
            {},
            document.title,
            "/sso/callback"
        );

        // Continue to dashboard
        window.location.replace(
            "/admin/dashboard"
        );

    }

    catch (error) {

        console.error(
            "SSO CALLBACK ERROR:",
            error
        );

        message.textContent =
            "Unable to complete automatic login.";

    }

})();