/* ===========================================
   CAMPUSHUB ADMISSIONS WIZARD
=========================================== */


// ------------------------------
// HTML ELEMENTS
// ------------------------------

const countrySelect = document.getElementById("country");
const schoolSelect = document.getElementById("school");


// ------------------------------
// COUNTRIES
// ------------------------------

const countries = [

    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "United Kingdom",
    "United States",
    "Canada",
    "Australia",
    "India"

];


function loadCountries(){

    countrySelect.innerHTML =
    `
    <option value="">
        Choose Country
    </option>
    `;


    countries.forEach(country=>{

        countrySelect.innerHTML +=
        `
        <option value="${country}">
            ${country}
        </option>
        `;

    });

}



// ------------------------------
// SCHOOLS
// ------------------------------

function loadSchools(){


    const schools = [

        {
            id:1,
            name:"CampusHub Demo University"
        },

        {
            id:2,
            name:"Global Technology University"
        },

        {
            id:3,
            name:"International Business School"
        }

    ];


    schoolSelect.innerHTML =
    `
    <option value="">
        Choose Institution
    </option>
    `;


    schools.forEach(school=>{


        schoolSelect.innerHTML +=
        `
        <option value="${school.id}">
            ${school.name}
        </option>
        `;


    });


}



// ------------------------------
// MULTI STEP WIZARD
// ------------------------------

let currentStep = 1;

const totalSteps = 8;


const nextBtn =
document.getElementById("nextBtn");


const prevBtn =
document.getElementById("prevBtn");



function showStep(step){


    document
    .querySelectorAll(".form-step")
    .forEach(section=>{

        section.classList.remove("active");

    });



    document
    .getElementById("step"+step)
    .classList.add("active");



    prevBtn.style.display =
    step === 1 ? "none" : "block";



    nextBtn.textContent =
    step === totalSteps
    ? "Submit Application"
    : "Next →";


}




nextBtn.addEventListener("click",()=>{


    if(currentStep < totalSteps){


        currentStep++;

        showStep(currentStep);


    }

    else{


        submitApplication();


    }


});




prevBtn.addEventListener("click",()=>{


    if(currentStep > 1){


        currentStep--;

        showStep(currentStep);


    }


});




// ------------------------------
// SAVE APPLICATION + PAYMENT
// ------------------------------

function submitApplication(){


    const application = {


        firstName:
        document.getElementById("firstName").value,


        lastName:
        document.getElementById("lastName").value,


        email:
        document.getElementById("email").value,


        phone:
        document.getElementById("phone").value,


        country:
        countrySelect.value,


        school:
        schoolSelect.value,


        session:
        document.getElementById("session").value,


        amount: 25


    };



    if(!application.school){

        alert("Please select institution.");

        return;

    }



    if(!application.country){

        alert("Please select your country.");

        return;

    }



    localStorage.setItem(

        "campushubAdmission",

        JSON.stringify(application)

    );



    // Move applicant to Flutterwave payment page

    window.location.href = "payment.html";


}



// ------------------------------
// START
// ------------------------------

loadCountries();

loadSchools();

showStep(1);