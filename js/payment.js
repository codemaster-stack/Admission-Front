/* ===========================================
   CAMPUSHUB FLUTTERWAVE PAYMENT
=========================================== */


const application = JSON.parse(

    localStorage.getItem("campushubAdmission")

);



if(!application){

    alert("No admission application found.");

    window.location.href = "index.html";

}



// ------------------------------
// COUNTRY CURRENCY SETTINGS
// ------------------------------

const currencyMap = {


    "Nigeria":"NGN",

    "Ghana":"GHS",

    "Kenya":"KES",

    "South Africa":"ZAR",

    "United Kingdom":"GBP",

    "United States":"USD",

    "Canada":"CAD",

    "Australia":"AUD",

    "India":"INR"


};



const currency =

currencyMap[application.country] || "USD";





const amount = application.amount;



document.getElementById("amount").innerHTML =

`${amount}`;



document.getElementById("currency").innerHTML =

currency;


document

.getElementById("payButton")

.addEventListener("click",()=>{


FlutterwaveCheckout({


    public_key:

    "FLWPUBK_TEST-b557be59f1b553143efee33d3f7831be-X",


    tx_ref:

    "CAMPUSHUB-" + Date.now(),


    amount: amount,


    currency: currency,


    payment_options:

    "card,banktransfer,ussd",



    customer:{


        email:

        application.email,


        phone_number:

        application.phone,


        name:

        application.firstName +

        " " +

        application.lastName


    },



    customizations:{


        title:

        "CampusHub Admissions",


        description:

        "University Admission Application Fee",


        logo:

        "images/logo.png"


    },



 callback: async function (payment) {

    console.log("========== CALLBACK START ==========");
    console.log(payment);

    if (payment.status !== "successful") {

        console.log("Payment not successful");

        return;

    }

    console.log("About to call backend...");

    try {

        console.log("Sending request to verify endpoint...");

       const response = await fetch(
    "https://admission-api-r5y6.onrender.com/api/payments/verify",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            transaction_id: payment.transaction_id,
            application
        })
    }
);

console.log("Response received:", response.status);

const result = await response.json();

console.log(result);

if (!response.ok) {

    alert(result.message || "Payment verification failed.");

    return;

}

if (result.success) {

    localStorage.setItem(
        "flutterwavePayment",
        JSON.stringify(payment)
    );

    localStorage.setItem(
        "applicationNumber",
        result.application.applicationNumber
    );

    window.location.href = "success.html";

} else {

    alert(result.message || "Payment verification failed.");

}

    } catch (error) {

        console.error(error);
        alert("Unable to verify payment.");

    }

},



    onclose:function(){


        console.log(

        "Payment cancelled"

        );


    }


});



});