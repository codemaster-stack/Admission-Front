// =========================
// LOAD FEATURED SCHOOLS
// =========================

async function loadSchools() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/schools"
        );

        const schools = await response.json();

        const container = document.getElementById("schoolCards");

        container.innerHTML = "";

        // Show only the first 6 schools
        schools.slice(0, 6).forEach(school => {

            container.innerHTML += `

                <div class="school-card">

                    <h3>${school.name}</h3>

                    <p>

                        <strong>Country:</strong>
                        ${school.country}

                    </p>

                    <p>

                        <strong>Type:</strong>
                        ${school.type}

                    </p>

                </div>

            `;

        });

        document.getElementById("schoolCount").textContent =
            schools.length;

    }

    catch (error) {

        console.error(error);

    }

}

loadSchools();


// =========================
// TOTAL APPLICATIONS
// =========================

async function loadApplications() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admissions"
        );

        const data = await response.json();

        if (data.success) {

            document.getElementById("applicationCount").textContent =
                data.applications.length;

        }

    }

    catch (error) {

        console.error(error);

    }

}

loadApplications();


// =========================
// LOAD PROGRAMMES
// =========================

async function loadProgrammes() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admin/programmes"
        );

        const programmes = await response.json();

        const container =
            document.getElementById("programmeCards");

        container.innerHTML = "";

        programmes.slice(0,6).forEach(programme => {

            container.innerHTML += `

                <div class="programme-card">

                    <h3>${programme.name}</h3>

                    <p>

                        <strong>Level:</strong>

                        ${programme.level}

                    </p>

                    <p>

                        <strong>Duration:</strong>

                        ${programme.duration}

                    </p>

                    <a href="/apply">

                        Apply Now

                    </a>

                </div>

            `;

        });

        document.getElementById("programmeCount").textContent =
            programmes.length;

    }

    catch(error){

        console.error(error);

    }

}

loadProgrammes();


document.getElementById("programmeCount").textContent = "...";