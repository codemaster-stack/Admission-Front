const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadApplication() {

    try {

        const response = await fetch(

            `https://admission-api-r5y6.onrender.com/api/admissions/${id}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const app = data.application;

        document.getElementById("applicationCard").innerHTML = `

<div class="application-card">

<h2>${app.applicationNumber}</h2>

<p><strong>Status:</strong> ${app.applicationStatus}</p>

<p><strong>Payment:</strong> ${app.paymentStatus}</p>

<hr>

<h3>Personal Details</h3>

<p><strong>Name:</strong>
${app.firstName} ${app.lastName}</p>

<p><strong>Email:</strong>
${app.email}</p>

<p><strong>Phone:</strong>
${app.phone}</p>

<hr>

<h3>Academic Information</h3>

<p><strong>Country:</strong>
${app.country}</p>

<p><strong>Institution:</strong>
${app.school.name}</p>

<p><strong>Faculty:</strong>
${app.faculty.name}</p>

<p><strong>Department:</strong>
${app.department.name}</p>

<p><strong>Programme:</strong>
${app.programme.name}</p>

<p><strong>Session:</strong>
${app.session}</p>

<hr>

<h3>Guardian</h3>

<p><strong>Name:</strong>
${app.guardianName}</p>

<p><strong>Phone:</strong>
${app.guardianPhone}</p>

<p><strong>Relationship:</strong>
${app.guardianRelation}</p>

<hr>

<h3>Previous Education</h3>

<p><strong>School:</strong>
${app.previousSchool}</p>

<p><strong>Qualification:</strong>
${app.qualification}</p>

<p><strong>Qualification Name:</strong>
${app.qualificationName}</p>

<p><strong>Graduation Year:</strong>
${app.graduationYear}</p>

<hr>

<h3>Payment</h3>

<p><strong>Amount:</strong>
${app.currency} ${app.amountPaid}</p>

<p><strong>Method:</strong>
${app.paymentMethod}</p>

<p><strong>Transaction:</strong>
${app.transactionId}</p>

<hr>

<button
class="approve-btn"
onclick="approveApplication()">

Approve

</button>

<button
class="reject-btn"
onclick="rejectApplication()">

Reject

</button>

</div>

`;

    }

    catch(error){

        console.error(error);

    }

}

loadApplication();

async function updateStatus(status) {

    try {

        const response = await fetch(

            `https://admission-api-r5y6.onrender.com/api/admissions/${id}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    applicationStatus: status

                })

            }

        );

        const result = await response.json();

        if (result.success) {

            alert(`Application ${status}.`);

            loadApplication();

        } else {

            alert(result.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to update application.");

    }

}

function approveApplication() {

    updateStatus("Approved");

}

function rejectApplication() {

    updateStatus("Rejected");

}