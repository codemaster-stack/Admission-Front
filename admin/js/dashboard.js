
// =============================
// SAVE ADMISSION FEE
// =============================

async function saveAdmissionFee() {

    try {

        const admissionFee = Number(
            document.getElementById("admissionFee").value
        );

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/settings",
            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    admissionFee

                })

            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Admission fee updated successfully.");

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to update admission fee.");

    }

}

// =============================
// LOAD DASHBOARD
// =============================

async function loadDashboard() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admissions"
        );

        const data = await response.json();

        if (!data.success) return;

        const applications = data.applications;

        document.getElementById("totalApplications").textContent =
            applications.length;

        document.getElementById("submittedApplications").textContent =
            applications.filter(a => a.applicationStatus === "Submitted").length;

        document.getElementById("approvedApplications").textContent =
            applications.filter(a => a.applicationStatus === "Approved").length;

        document.getElementById("rejectedApplications").textContent =
            applications.filter(a => a.applicationStatus === "Rejected").length;

        document.getElementById("paidApplications").textContent =
            applications.filter(a => a.paymentStatus === "Paid").length;

        const tbody = document.querySelector("#recentApplications tbody");

        tbody.innerHTML = "";

        applications.slice(0, 10).forEach(app => {

            tbody.innerHTML += `
                <tr>
                    <td>${app.applicationNumber}</td>
                    <td>${`${app.firstName} ${app.lastName}`}</td>
                    <td>${app.applicationStatus}</td>
                    <td>
                        <a href="/admin/application-details?id=${app._id}">
                            View
                        </a>
                    </td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadDashboard();

document
.getElementById("saveFeeBtn")
.addEventListener("click", saveAdmissionFee);

loadAdmissionFee();