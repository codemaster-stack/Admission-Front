const schoolList = document.getElementById("schoolList");

// ----------------------
// LOAD SCHOOLS
// ----------------------

function startLoading(buttonId, text) {

    const btn = document.getElementById(buttonId);

    btn.disabled = true;

    btn.innerHTML = `
        <span class="spinner"></span>
        ${text}
    `;

}

function stopLoading(buttonId, text) {

    const btn = document.getElementById(buttonId);

    btn.disabled = false;

    btn.innerHTML = text;

}



async function loadSchools() {

    try {

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/schools"
        );

        const schools = await response.json();

        let html = `
            <h2>Schools</h2>

            <table border="1" cellspacing="0" cellpadding="10" width="100%">

                <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Type</th>
                </tr>
        `;

        schools.forEach(school => {

            html += `
                <tr>
                    <td>${school.name}</td>
                    <td>${school.country}</td>
                    <td>${school.type}</td>
                </tr>
            `;

        });

        html += "</table>";

        schoolList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        schoolList.innerHTML = "Unable to load schools.";

    }

}

  async function loadFacultyManager() {

    try {

        console.log("loadFacultyManager started");

        const response = await fetch("https://admission-api-r5y6.onrender.com/api/schools");
        console.log("Fetch completed");

        const schools = await response.json();
        console.log("Schools:", schools.length);

        console.log("Before select");

        const select = document.getElementById("facultySchool");

         console.log("After select");
         console.log(select);
       

      let options = `<option value="">Choose School</option>`;

schools.forEach(school => {

    options += `
        <option value="${school._id}">
            ${school.name}
        </option>
    `;

});

select.innerHTML = options;

        console.log("Dropdown populated");

    } catch (err) {

        console.error(err);

    }

    document
    .getElementById("facultySchool")
    .addEventListener("change", loadFaculties);

document
    .getElementById("saveFaculty")
    .addEventListener("click", saveFaculty);
}

async function loadDepartmentManager() {

    console.log("Department manager started");

    const response = await fetch("https://admission-api-r5y6.onrender.com/api/schools");

    console.log(response.status);

    const schools = await response.json();

    console.log(schools.length);

    const select = document.getElementById("departmentSchool");

    console.log(select);

    let options = `<option value="">Choose School</option>`;

    schools.forEach(school => {

        options += `
            <option value="${school._id}">
                ${school.name}
            </option>
        `;

    });

    select.innerHTML = options;

    console.log("Department schools loaded");

    document
        .getElementById("departmentSchool")
        .addEventListener("change", loadDepartmentFaculties);

    document
        .getElementById("saveDepartment")
        .addEventListener("click", saveDepartment);

}

async function loadDepartmentFaculties() {

    const schoolId = document.getElementById("departmentSchool").value;

    const facultySelect = document.getElementById("departmentFaculty");

    if (!schoolId) {

        facultySelect.innerHTML =
            `<option value="">Select Faculty</option>`;

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${schoolId}`
    );

    const faculties = await response.json();

    let options = `<option value="">Select Faculty</option>`;

    faculties.forEach(faculty => {

        options += `
            <option value="${faculty._id}">
                ${faculty.name}
            </option>
        `;

    });

    facultySelect.innerHTML = options;

    facultySelect.addEventListener("change", loadDepartments);

}


async function saveDepartment() {

    startLoading("saveDepartment", "Saving...");

    try {

        const faculty = document.getElementById("departmentFaculty").value;

        const name = document.getElementById("departmentName").value.trim();

        if (!faculty) {

            alert("Please select a faculty.");

            return;

        }

        if (!name) {

            alert("Enter department name.");

            return;

        }

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admin/departments",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    faculty,
                    name
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            document.getElementById("departmentName").value = "";

            await loadDepartments();

        } else {

            alert("Unable to save department.");

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    } finally {

        stopLoading("saveDepartment", "Add Department");

    }

}


async function loadDepartments() {

    const facultyId = document.getElementById("departmentFaculty").value;

    if (!facultyId) {

        document.getElementById("departmentList").innerHTML =
            "Select a faculty.";

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/departments/${facultyId}`
    );

    const departments = await response.json();

    let html = "<h3>Departments</h3><ul>";

    departments.forEach(department => {

        html += `
            <li>
                ${department.name}

                <button onclick="editDepartment('${department._id}','${department.name}')">
                    ✏️ Edit
                </button>

                <button onclick="deleteDepartment('${department._id}')">
                    🗑 Delete
                </button>

            </li>
        `;

    });

    html += "</ul>";

    document.getElementById("departmentList").innerHTML = html;

}


async function editDepartment(id, currentName) {

    const newName = prompt("Edit Department Name", currentName);

    if (!newName) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/departments/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName
            })
        }
    );

    const result = await response.json();

    if (result.success) {

        loadDepartments();

    } else {

        alert("Unable to update department.");

    }

}



async function deleteDepartment(id) {

    if (!confirm("Delete this department?")) {

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/departments/${id}`,
        {
            method: "DELETE"
        }
    );

    const result = await response.json();

    if (result.success) {

        loadDepartments();

    } else {

        alert("Unable to delete department.");

    }

}



async function loadFaculties() {

    const schoolId = document.getElementById("facultySchool").value;

    if (!schoolId) {

        document.getElementById("facultyList").innerHTML =
            "Select a school.";

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${schoolId}`
    );

    const faculties = await response.json();

    let html = "<h3>Faculties</h3><ul>";

    faculties.forEach(faculty => {

        html += `
<li>
    ${faculty.name}

    <button onclick="editFaculty('${faculty._id}','${faculty.name}')">
    ✏️ Edit
</button>

<button onclick="deleteFaculty('${faculty._id}')">
    🗑 Delete
</button>
</li>
`;

    });

    html += "</ul>";

    document.getElementById("facultyList").innerHTML = html;

}


async function saveFaculty() {

    startLoading("saveFaculty", "Saving...");

    try {

        const school = document.getElementById("facultySchool").value;

        const name = document.getElementById("facultyName").value.trim();

        if (!school) {

            alert("Please select a school.");

            return;

        }

        if (!name) {

            alert("Enter faculty name.");

            return;

        }

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admin/faculties",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    school,
                    name
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            document.getElementById("facultyName").value = "";

            await loadFaculties();

        } else {

            alert("Unable to save faculty.");

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    } finally {

        stopLoading("saveFaculty", "Add Faculty");

    }

}


async function deleteFaculty(id) {

    if (!confirm("Delete this faculty?")) {

        return;

    }

    const response = await fetch(

        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${id}`,

        {

            method: "DELETE"

        }

    );

    const result = await response.json();

    if (result.success) {

        loadFaculties();

    } else {

        alert("Unable to delete faculty.");

    }

}


async function editFaculty(id, currentName) {

    const newName = prompt("Edit Faculty Name", currentName);

    if (!newName) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName
            })
        }
    );

    const result = await response.json();

    if (result.success) {

        loadFaculties();

    } else {

        alert("Unable to update faculty.");

    }

}


async function loadProgrammeManager() {

    const response = await fetch("https://admission-api-r5y6.onrender.com/api/schools");

    const schools = await response.json();

    const select = document.getElementById("programmeSchool");

    let options = `<option value="">Choose School</option>`;

    schools.forEach(school => {

        options += `
            <option value="${school._id}">
                ${school.name}
            </option>
        `;

    });

    select.innerHTML = options;

    document
        .getElementById("programmeSchool")
        .addEventListener("change", loadProgrammeFaculties);

    document
        .getElementById("saveProgramme")
        .addEventListener("click", saveProgramme);

}



async function loadProgrammeFaculties() {

    const schoolId = document.getElementById("programmeSchool").value;

    const facultySelect = document.getElementById("programmeFaculty");

    if (!schoolId) {

        facultySelect.innerHTML =
            `<option value="">Select Faculty</option>`;

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/faculties/${schoolId}`
    );

    const faculties = await response.json();

    let options = `<option value="">Select Faculty</option>`;

    faculties.forEach(faculty => {

        options += `
            <option value="${faculty._id}">
                ${faculty.name}
            </option>
        `;

    });

    facultySelect.innerHTML = options;

    facultySelect.addEventListener(
        "change",
        loadProgrammeDepartments
    );

}


async function loadProgrammeDepartments() {

    const facultyId = document.getElementById("programmeFaculty").value;

    const departmentSelect = document.getElementById("programmeDepartment");

    if (!facultyId) {

        departmentSelect.innerHTML =
            `<option value="">Select Department</option>`;

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/departments/${facultyId}`
    );

    const departments = await response.json();

    let options = `<option value="">Select Department</option>`;

    departments.forEach(department => {

        options += `
            <option value="${department._id}">
                ${department.name}
            </option>
        `;

    });

    departmentSelect.innerHTML = options;

    departmentSelect.addEventListener(
        "change",
        loadProgrammes
    );

}


async function loadProgrammes() {

    const departmentId = document.getElementById("programmeDepartment").value;

    if (!departmentId) {

        document.getElementById("programmeList").innerHTML =
            "Select a department.";

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/programmes/${departmentId}`
    );

    const programmes = await response.json();

    let html = "<h3>Programmes</h3><ul>";

    programmes.forEach(programme => {

        html += `
            <li>
                ${programme.name} (${programme.duration} ${programme.duration === 1 ? "Year" : "Years"})

                <button onclick="editProgramme('${programme._id}')">
                    ✏️ Edit
                </button>

                <button onclick="deleteProgramme('${programme._id}')">
                    🗑 Delete
                </button>
            </li>
        `;

    });

    html += "</ul>";

    document.getElementById("programmeList").innerHTML = html;

}


async function saveProgramme() {

    startLoading("saveProgramme", "Saving...");

    try {

        const department = document.getElementById("programmeDepartment").value;

        const name = document.getElementById("programmeName").value.trim();

        const duration = Number(document.getElementById("programmeDuration").value);

        const level = document.getElementById("programmeLevel").value;

        if (isNaN(duration) || duration <= 0) {

            alert("Duration must be a valid number (e.g. 4). Do not include 'Years'.");

            return;

        }

        if (!department) {

            alert("Please select a department.");

            return;

        }

        if (!name) {

            alert("Enter programme name.");

            return;

        }

        const response = await fetch(
            "https://admission-api-r5y6.onrender.com/api/admin/programmes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    department,
                    name,
                    duration,
                    level
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            document.getElementById("programmeName").value = "";
            document.getElementById("programmeDuration").value = "";

            await loadProgrammes();

        } else {

            alert("Unable to save programme.");

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    } finally {

        stopLoading("saveProgramme", "Add Programme");

    }

}


async function editProgramme(id) {

    const newName = prompt("Edit Programme Name");

    if (!newName) return;

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/programmes/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName
            })
        }
    );

    const result = await response.json();

    if (result.success) {

        loadProgrammes();

    } else {

        alert("Unable to update programme.");

    }

}


async function deleteProgramme(id) {

    if (!confirm("Delete this programme?")) {

        return;

    }

    const response = await fetch(
        `https://admission-api-r5y6.onrender.com/api/admin/programmes/${id}`,
        {
            method: "DELETE"
        }
    );

    const result = await response.json();

    if (result.success) {

        loadProgrammes();

    } else {

        alert("Unable to delete programme.");

    }

}


// ----------------------
// MENU
// ----------------------

document.getElementById("schoolBtn").onclick =  async () => {
    startLoading("schoolBtn", "Loading...");
    try {
    document.getElementById("schoolsPage").style.display = "block";
    document.getElementById("facultiesPage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("programmesPage").style.display = "none";

    await loadSchools();

     } finally {

        stopLoading("schoolBtn", "Schools");

    }

};

document.getElementById("facultyBtn").onclick =  async () => {
    startLoading("facultyBtn", "Loading...");

    try {
    document.getElementById("schoolsPage").style.display = "none";
    document.getElementById("facultiesPage").style.display = "block";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("programmesPage").style.display = "none";

    await loadFacultyManager();

     } finally {

        stopLoading("facultyBtn", "Faculties");

    }

};

document.getElementById("departmentBtn").onclick =  async () => {

    startLoading("departmentBtn", "Loading...");
    try {
    document.getElementById("schoolsPage").style.display = "none";
    document.getElementById("facultiesPage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "block";
    document.getElementById("programmesPage").style.display = "none";

    await loadDepartmentManager();

     } finally {

        stopLoading("departmentBtn", "Departments");

    }

};


document.getElementById("programmeBtn").onclick =  async () => {

    startLoading("programmeBtn", "Loading...");
    try {
    document.getElementById("schoolsPage").style.display = "none";
    document.getElementById("facultiesPage").style.display = "none";
    document.getElementById("departmentsPage").style.display = "none";
    document.getElementById("programmesPage").style.display = "block";

    await loadProgrammeManager();
    
     } finally {

        stopLoading("programmeBtn", "Programmes");

    }

};
