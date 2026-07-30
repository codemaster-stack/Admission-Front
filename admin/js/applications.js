async function loadApplications() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admissions"
        );

        const data = await response.json();

        const tbody = document.querySelector("#applicationsTable tbody");

        tbody.innerHTML = "";

        data.applications.forEach(app => {

            tbody.innerHTML += `

<tr>

<td>${app.applicationNumber}</td>

<td>${app.firstName} ${app.lastName}</td>

<td>${app.school.name}</td>

<td>${app.programme.name}</td>

<td>${app.applicationStatus}</td>

<td>${app.paymentStatus}</td>

<td>

<button onclick="viewApplication('${app._id}')">

View

</button>

</td>

</tr>

`;

        });

    }

    catch(error){

        console.error(error);

    }

}

function viewApplication(id){

    window.location.href =
        `application-details.html?id=${id}`;

}

loadApplications();