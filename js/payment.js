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





const amount = 25;



document.getElementById("amount").innerHTML =

`${amount}`;



document.getElementById("currency").innerHTML =

currency;




// ------------------------------
// FLUTTERWAVE PAYMENT
// ------------------------------


document

.getElementById("payButton")

.addEventListener("click",()=>{


FlutterwaveCheckout({


    public_key:

    "FLWPUBK-e99f1608aec1655f849f6b63fe25a7cb-X",


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



    callback:function(payment){


        console.log(payment);



      if(payment.status === "successful"){


    localStorage.setItem(

        "flutterwavePayment",

        JSON.stringify(payment)

    );


    window.location.href="success.html";





        }


    },



    onclose:function(){


        console.log(

        "Payment cancelled"

        );


    }


});



});