
let applications = [];

async function loadApplications() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admissions"
        );

        const data = await response.json();
       applications = data.applications;
        document.getElementById("totalApplications").textContent =
applications.length;

document.getElementById("submittedApplications").textContent =
applications.filter(app =>
app.applicationStatus === "Submitted").length;

document.getElementById("approvedApplications").textContent =
applications.filter(app =>
app.applicationStatus === "Approved").length;

document.getElementById("rejectedApplications").textContent =
applications.filter(app =>
app.applicationStatus === "Rejected").length;

document.getElementById("paidApplications").textContent =
applications.filter(app =>
app.paymentStatus === "Paid").length;

    
renderApplications(applications);

    }

    catch(error){

        console.error(error);

    }

}

function renderApplications(list) {

    const tbody =
        document.querySelector("#applicationsTable tbody");

    tbody.innerHTML = "";

    list.forEach(app => {

        tbody.innerHTML += `

<tr>

<td>${app.applicationNumber}</td>

<td>${app.firstName} ${app.lastName}</td>

<td>${app.school.name}</td>

<td>${app.programme.name}</td>

<td>

<span class="status-badge status-${app.applicationStatus.toLowerCase()}">

${app.applicationStatus}

</span>

</td>

<td>

<span class="status-badge payment-${app.paymentStatus.toLowerCase()}">

${app.paymentStatus}

</span>

</td>

<td>

<button
class="view-btn"
onclick="viewApplication('${app._id}')">

View

</button>

</td>

</tr>

`;

    });

}

function viewApplication(id){

    window.location.href =
        `/admin/application-details?id=${id}`;

}


function filterApplications() {

    const keyword =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const status =
        document.getElementById("statusFilter").value;

    const filtered =
        applications.filter(app => {

            const matchesSearch =

                app.applicationNumber.toLowerCase().includes(keyword)

                ||

                (`${app.firstName} ${app.lastName}`)
                .toLowerCase()
                .includes(keyword)

                ||

                app.email.toLowerCase()
                .includes(keyword);

            const matchesStatus =

                status === "All"

                ||

                app.applicationStatus === status;

            return matchesSearch && matchesStatus;

        });

    renderApplications(filtered);

}

document
.getElementById("searchInput")
.addEventListener("keyup", filterApplications);

document
.getElementById("statusFilter")
.addEventListener("change", filterApplications);

loadApplications();

// loadDashboard();

// document
// .getElementById("saveFeeBtn")
// .addEventListener("click", saveAdmissionFee);

// loadAdmissionFee();