const countrySelect = document.getElementById("country");
const schoolSelect = document.getElementById("school");
const facultySelect = document.getElementById("faculty");
const departmentSelect = document.getElementById("department");
const programmeSelect = document.getElementById("programme");
const institutionTypeSelect = document.getElementById("institutionType");

const phoneInput = document.querySelector("#phone");
const guardianPhoneInput = document.querySelector("#guardianPhone");

const phoneConfig = {

    initialCountry: "auto",

    preferredCountries: [
        "ng",
        "gh",
        "ke",
        "za",
        "gb",
        "us",
        "ca"
    ],

    separateDialCode: true,

    nationalMode: false,

    autoPlaceholder: "aggressive",

    loadUtils: () =>
        import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js"),

    geoIpLookup: function (callback) {

        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => callback(data.country_code.toLowerCase()))
            .catch(() => callback("ng"));

    }

};

const iti = window.intlTelInput(phoneInput, phoneConfig);
const guardianIti = window.intlTelInput(guardianPhoneInput, phoneConfig);

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


function startLoading(buttonId, text) {
    const btn = document.getElementById(buttonId);

    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = `
        <span class="spinner"></span>
        ${text}
    `;
}

function stopLoading(buttonId, text) {
    const btn = document.getElementById(buttonId);

    if (!btn) return;

    btn.disabled = false;
    btn.innerHTML = text;
}

// ------------------------------
// LOAD SCHOOLS FROM API
// ------------------------------

async function loadCountries() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/schools/countries"
        );

        const countries = await response.json();

        countrySelect.innerHTML = `
            <option value="">
                Choose Destination
            </option>
        `;

        countries.forEach(country => {

            countrySelect.innerHTML += `
                <option value="${country}">
                    ${country}
                </option>
            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load countries.");

    }

}


// ------------------------------
// LOAD SCHOOLS FROM API
// ------------------------------

async function loadSchools(country = "") {

    try {

        schoolSelect.disabled = true;

        schoolSelect.innerHTML = `
            <option value="">
                Loading institutions...
            </option>
        `;

        let url = "https://admission-api-r5y6.onrender.com/api/schools";

        if (country) {

            url += `?country=${encodeURIComponent(country)}`;

        }

        const response = await fetch(url);

        const schools = await response.json();

        schoolSelect.innerHTML = `
            <option value="">
                Choose Institution
            </option>
        `;

        schools.forEach(school => {

            schoolSelect.innerHTML += `
                <option value="${school._id}">
                    ${school.name}
                </option>
            `;

        });

        schoolSelect.disabled = false;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load institutions.");

        schoolSelect.disabled = true;

    }

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

    // Show current form section
    document.querySelectorAll(".form-step").forEach(section=>{
        section.classList.remove("active");
    });

    document
        .getElementById("step" + step)
        .classList.add("active");


    // Update sidebar
    const steps = document.querySelectorAll(".sidebar .step");

    steps.forEach((item, index)=>{

        item.classList.remove("active");
        item.classList.remove("completed");

        if(index + 1 < step){

            item.classList.add("completed");

        }
        else if(index + 1 === step){

            item.classList.add("active");

        }

    });


    // Buttons
    prevBtn.style.display =
        step === 1 ? "none" : "inline-flex";

    nextBtn.textContent =
        step === totalSteps
        ? "Proceed to Payment"
        : "Next →";

}




nextBtn.addEventListener("click",()=>{


    if(currentStep < totalSteps){


       currentStep++;

showStep(currentStep);

if (currentStep === 7) {

    loadReview();

}


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



function getApplicationData() {

    return {

        // Destination

        country: countrySelect.value,

        institutionType: institutionTypeSelect.value,

        school: schoolSelect.value,

        session: document.getElementById("session").value,

        // Programme

        faculty: document.getElementById("faculty").value,

        department: document.getElementById("department").value,

        programme: document.getElementById("programme").value,

        // Personal Details

        firstName: document.getElementById("firstName").value,

        lastName: document.getElementById("lastName").value,

        email: document.getElementById("email").value,

        phone: iti.getNumber(),

        // Guardian

        guardianName: document.getElementById("guardianName").value,

        guardianPhone: guardianIti.getNumber(),

        guardianRelation: document.getElementById("guardianRelation").value,

        // Education

        previousSchool: document.getElementById("previousSchool").value,

        qualification: document.getElementById("qualification").value,

        qualificationName: document.getElementById("qualificationName").value,

        graduationYear: document.getElementById("graduationYear").value,


        // Payment

        amount: 25

    };

}
// ------------------------------
// SAVE APPLICATION + SEND TO API
// ------------------------------

async function submitApplication() {

    startLoading("nextBtn", "Submitting...");

    // ------------------------------
    // Validate Phone Numbers
    // ------------------------------

    if (!iti.isValidNumber()) {

        alert("Please enter a valid phone number.");

        phoneInput.focus();

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    if (!guardianIti.isValidNumber()) {

        alert("Please enter a valid guardian phone number.");

        guardianPhoneInput.focus();

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    // ------------------------------
    // Get Application Data
    // ------------------------------

    const application = getApplicationData();

    const formData = new FormData();

Object.entries(application).forEach(([key, value]) => {

    formData.append(key, value);

});

formData.append(
    "passport",
    document.getElementById("passport").files[0]
);

formData.append(
    "result",
    document.getElementById("result").files[0]
);

    // ------------------------------
    // Validate Required Fields
    // ------------------------------

    if (!application.country) {

        alert("Please select your destination.");

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    if (!application.institutionType) {

        alert("Please select institution type.");

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    if (!application.school) {

        alert("Please select institution.");

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    // ------------------------------
    // Save Application
    // ------------------------------
    try {

    const response = await fetch(

        "https://admission-api-r5y6.onrender.com/api/admissions",
         

        {

            method: "POST",

            body: formData

        }

    );

    const result = await response.json();

    if (!result.success) {

        alert(result.message);

        stopLoading("nextBtn", "Proceed to Payment");

        return;

    }

    localStorage.setItem(

        "applicationId",

        result.application._id

    );
    localStorage.setItem(
    "paymentCustomer",
    JSON.stringify({

        firstName: application.firstName,

        lastName: application.lastName,

        email: application.email,

        phone: application.phone

    })
);

stopLoading("nextBtn", "Proceed to Payment");

    startFlutterwavePayment(result.application);

}

catch(error){

    console.error(error);

    alert("Unable to submit application.");

    stopLoading("nextBtn","Proceed to Payment");

}

}

async function loadFaculties() {

    const schoolId = schoolSelect.value;

    if (!schoolId) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${schoolId}`
    );

    const faculties = await response.json();

    facultySelect.innerHTML =
        `<option value="">Select Faculty</option>`;

    faculties.forEach(faculty => {

        facultySelect.innerHTML += `
            <option value="${faculty._id}">
                ${faculty.name}
            </option>
        `;

    });

}


async function loadDepartments() {

    const facultyId = facultySelect.value;

    if (!facultyId) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/departments/${facultyId}`
    );

    const departments = await response.json();

    departmentSelect.innerHTML =
        `<option value="">Select Department</option>`;

    departments.forEach(department => {

        departmentSelect.innerHTML += `
            <option value="${department._id}">
                ${department.name}
            </option>
        `;

    });

}



async function loadProgrammes() {

    const departmentId = departmentSelect.value;

    if (!departmentId) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/programmes/${departmentId}`
    );

    const programmes = await response.json();

    programmeSelect.innerHTML =
        `<option value="">Select Programme</option>`;

    programmes.forEach(programme => {

        programmeSelect.innerHTML += `
            <option value="${programme._id}">
                ${programme.name}
            </option>
        `;

    });

}


function loadReview() {
    const passport =
    document.getElementById("passport").files[0];

   const result =
  document.getElementById("result").files[0];

  let passportPreview = "Not uploaded";

if (passport) {

    passportPreview = `
        <img
            src="${URL.createObjectURL(passport)}"
            alt="Passport"
            style="
                width:120px;
                height:120px;
                object-fit:cover;
                border-radius:8px;
                border:1px solid #ddd;
                margin-top:8px;
            ">
    `;

}

    const reviewBox = document.getElementById("reviewBox");

    reviewBox.innerHTML = `
        <h4>Application Summary</h4>

        <p><strong>Country:</strong> ${countrySelect.value}</p>

        <p><strong>Institution Type:</strong> ${institutionTypeSelect.value}</p>

        <p><strong>Institution:</strong> ${
            schoolSelect.options[schoolSelect.selectedIndex]?.text || ""
        }</p>

        <p><strong>Session:</strong> ${document.getElementById("session").value}</p>

        <hr>

        <p><strong>Faculty:</strong> ${
            facultySelect.options[facultySelect.selectedIndex]?.text || ""
        }</p>

        <p><strong>Department:</strong> ${
            departmentSelect.options[departmentSelect.selectedIndex]?.text || ""
        }</p>

        <p><strong>Programme:</strong> ${
            programmeSelect.options[programmeSelect.selectedIndex]?.text || ""
        }</p>

        <hr>

        <p><strong>First Name:</strong> ${document.getElementById("firstName").value}</p>

        <p><strong>Last Name:</strong> ${document.getElementById("lastName").value}</p>

        <p><strong>Email:</strong> ${document.getElementById("email").value}</p>

        <p><strong>Phone:</strong> ${document.getElementById("phone").value}</p>

        <hr>

        <p><strong>Guardian:</strong> ${document.getElementById("guardianName").value}</p>

        <p><strong>Guardian Phone:</strong> ${document.getElementById("guardianPhone").value}</p>

        <p><strong>Relationship:</strong> ${document.getElementById("guardianRelation").value}</p>

        <hr>

        <p><strong>Previous School:</strong> ${document.getElementById("previousSchool").value}</p>

        <p><strong>Highest Qualification:</strong> ${document.getElementById("qualification").value}</p>

        <p><strong>Qualification Name:</strong> ${document.getElementById("qualificationName").value}</p>

        <p><strong>Graduation Year:</strong> ${document.getElementById("graduationYear").value}</p>
        <hr>

        <p><strong>Passport Photograph</strong></p>

        ${passportPreview}

        <br><br>

       <p><strong>Academic Result:</strong>
         ${result
         ? `${result.name} (${result.name.split(".").pop().toUpperCase()} File)`
         : "Not uploaded"}
       </p>
     `;
  }

// ------------------------------
// START
// ------------------------------

loadCountries();
countrySelect.addEventListener("change", function () {

    loadSchools(this.value);

});

schoolSelect.addEventListener("change", loadFaculties);

facultySelect.addEventListener("change", loadDepartments);

departmentSelect.addEventListener("change", loadProgrammes);

showStep(1);

function startFlutterwavePayment(savedApplication) {

    const customer = JSON.parse(
        localStorage.getItem("paymentCustomer")
    );

    if (!customer) {

        alert("Customer information not found.");

        return;

    }

    const currency =
        currencyMap[savedApplication.country] || "USD";

    FlutterwaveCheckout({

        public_key:
            "FLWPUBK_TEST-b557be59f1b553143efee33d3f7831be-X",

        tx_ref:
            "CAMPUSHUB-" + Date.now(),

        amount:
            savedApplication.amount,

        currency:
            currency,

        payment_options:
            "card,banktransfer,ussd",

        customer: {

            email:
                customer.email,

            phone_number:
                customer.phone,

            name:
                customer.firstName +
                " " +
                customer.lastName

        },

        customizations: {

            title:
                "CampusHub Admissions",

            description:
                "University Admission Application Fee",

            logo:
                "images/logo.png"

        },

        callback: async function (payment) {

            if (payment.status !== "successful") {

                alert("Payment was not successful.");

                return;

            }

            try {

                const response = await fetch(

                    "https://admission-api-r5y6.onrender.com/api/payments/verify",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            transaction_id:
                                payment.transaction_id,

                            applicationId:
                                savedApplication._id

                        })

                    }

                );

                const result =
                    await response.json();

                if (!response.ok) {

                    alert(

                        result.message ||

                        "Payment verification failed."

                    );

                    return;

                }

                localStorage.setItem(

                    "applicationNumber",

                    result.application.applicationNumber

                );

                localStorage.removeItem("paymentCustomer");

                localStorage.removeItem("applicationId");

                window.location.href = "success.html";

            }

            catch (error) {

                console.error(error);

                alert("Unable to verify payment.");

            }

        },

        onclose: function () {

            console.log("Payment cancelled.");

        }

    });

}


