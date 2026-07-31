// =============================
// LOAD ADMISSION FEE
// =============================

async function loadAdmissionFee() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/settings"
        );

        const data = await response.json();

        if (data.success) {

            document.getElementById("admissionFee").value =
                data.setting.admissionFee;

        }

    } catch (error) {

        console.error(error);

    }

}


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

document
.getElementById("saveFeeBtn")
.addEventListener("click", saveAdmissionFee);

loadAdmissionFee();