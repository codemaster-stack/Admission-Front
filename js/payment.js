/* ===========================================
   CAMPUSHUB FLUTTERWAVE PAYMENT
=========================================== */

const applicationId = localStorage.getItem("applicationId");

const customer = JSON.parse(
    localStorage.getItem("paymentCustomer")
);

// if (!applicationId || !customer) {

//     alert("Application not found.");

//     window.location.href = "/index";

// }

let application = null;

const currencyMap = {

    "Nigeria": "NGN",

    "Ghana": "GHS",

    "Kenya": "KES",

    "South Africa": "ZAR",

    "United Kingdom": "GBP",

    "United States": "USD",

    "Canada": "CAD",

    "Australia": "AUD",

    "India": "INR"

};

// ------------------------------------
// LOAD APPLICATION FROM DATABASE
// ------------------------------------

async function loadApplication() {

    try {

        const response = await fetch(

            `https://admission-api-r5y6.onrender.com/api/admissions/${applicationId}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            window.location.href = "index";

            return;

        }

        application = data.application;

        const currency =
            currencyMap[application.country] || "USD";

        document.getElementById("amount").textContent =
            application.amount;

        document.getElementById("currency").textContent =
            currency;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load application.");

    }

}

loadApplication();

// ------------------------------------
// PAYMENT
// ------------------------------------

function startFlutterwavePayment() {

    if (!application) {

        alert("Application not loaded.");

        return;

    }

    const currency =
        currencyMap[application.country] || "USD";

    FlutterwaveCheckout({

        // Paste ALL your existing FlutterwaveCheckout code here unchanged

    });

}

document
.getElementById("payButton")
.addEventListener("click", startFlutterwavePayment);