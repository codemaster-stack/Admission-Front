const btn = document.getElementById("trackBtn");

btn.addEventListener("click", trackApplication);

async function trackApplication() {

    const applicationNumber =
        document.getElementById("applicationNumber").value.trim();

    if (!applicationNumber) {

        alert("Enter your application number.");

        return;

    }

    try {

        const response = await fetch(

            `https://admission-api-r5y6.onrender.com/api/admissions/track/${applicationNumber}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const app = data.application;

        document.getElementById("result").innerHTML = `

<h2>${app.applicationStatus}</h2>

<p><strong>Name:</strong>
${app.firstName} ${app.lastName}</p>

<p><strong>Application Number:</strong>
${app.applicationNumber}</p>

<p><strong>Institution:</strong>
${app.school.name}</p>

<p><strong>Programme:</strong>
${app.programme.name}</p>

<p><strong>Payment:</strong>
${app.paymentStatus}</p>

<p><strong>Submitted:</strong>
${new Date(app.createdAt).toLocaleDateString()}</p>

`;

    }

    catch(err){

        console.error(err);

        alert("Unable to track application.");

    }

}