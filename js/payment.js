/* ===========================================
   CAMPUSHUB FLUTTERWAVE PAYMENT
=========================================== */

// const applicationId = localStorage.getItem("applicationId");

// const customer = JSON.parse(
//     localStorage.getItem("paymentCustomer")
// );

// if (!applicationId || !customer) {

//     alert("Application not found.");

//     window.location.href = "/index";

// }

// let application = null;

// const currencyMap = {

//     "Nigeria": "NGN",

//     "Ghana": "GHS",

//     "Kenya": "KES",

//     "South Africa": "ZAR",

//     "United Kingdom": "GBP",

//     "United States": "USD",

//     "Canada": "CAD",

//     "Australia": "AUD",

//     "India": "INR"

// };

// ------------------------------------
// LOAD APPLICATION FROM DATABASE
// ------------------------------------

// async function loadApplication() {

//     try {

//         const response = await fetch(

//             `https://admission-api-r5y6.onrender.com/api/admissions/${applicationId}`

//         );

//         const data = await response.json();

//         if (!data.success) {

//             alert(data.message);

//             window.location.href = "/index";

//             return;

//         }

//         application = data.application;

//         const currency =
//             currencyMap[application.country] || "USD";

//         document.getElementById("amount").textContent =
//             application.amount;

//         document.getElementById("currency").textContent =
//             currency;

//     }

//     catch (error) {

//         console.error(error);

//         alert("Unable to load application.");

//     }

// }

// loadApplication();

// ------------------------------------
// PAYMENT
// ------------------------------------

// document
// .getElementById("payButton")
// .addEventListener("click", function () {

//     if (!application) {

//         alert("Application not loaded.");

//         return;

//     }

//     const currency =
//         currencyMap[application.country] || "USD";

//     FlutterwaveCheckout({

//         public_key:

//         "FLWPUBK_TEST-b557be59f1b553143efee33d3f7831be-X",

//         tx_ref:

//         "CAMPUSHUB-" + Date.now(),

//         amount:

//         application.amount,

//         currency:

//         currency,

//         payment_options:

//         "card,banktransfer,ussd",

//         customer: {

//             email:

//             customer.email,

//             phone_number:

//             customer.phone,

//             name:

//             customer.firstName +

//             " " +

//             customer.lastName

//         },

//         customizations: {

//             title:

//             "CampusHub Admissions",

//             description:

//             "University Admission Application Fee",

//             logo:

//             "images/logo.png"

//         },

//         callback: async function (payment) {

//             if (payment.status !== "successful") {

//                 alert("Payment was not successful.");

//                 return;

//             }

//             try {

//                 const response = await fetch(

//                     "https://admission-api-r5y6.onrender.com/api/payments/verify",

//                     {

//                         method: "POST",

//                         headers: {

//                             "Content-Type": "application/json"

//                         },

//                         body: JSON.stringify({

//                             transaction_id:

//                             payment.transaction_id,

//                             applicationId

//                         })

//                     }

//                 );

//                 const result =
//                     await response.json();

//                 if (!response.ok) {

//                     alert(

//                         result.message ||

//                         "Payment verification failed."

//                     );

//                     return;

//                 }

//                 localStorage.setItem(

//                     "applicationNumber",

//                     result.application.applicationNumber

//                 );

//                 localStorage.removeItem("paymentCustomer");

//                 localStorage.removeItem("applicationId");

//                 window.location.href =
//                     "success.html";

//             }

//             catch (error) {

//                 console.error(error);

//                 alert("Unable to verify payment.");

//             }

//         },

//         onclose: function () {

//             console.log("Payment cancelled.");

//         }

//     });

// });