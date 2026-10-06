let patients = JSON.parse(
    localStorage.getItem("patients")
) || [];

let visits = JSON.parse(
    localStorage.getItem("visits")
) || [];


// ==============================
// ADD PATIENT
// ==============================

function addPatient() {

    const name =
        document.getElementById("patientName").value.trim();

    const phone =
        document.getElementById("patientPhone").value.trim();

    const age =
        document.getElementById("patientAge").value;

    const address =
        document.getElementById("patientAddress").value.trim();

    const problem =
        document.getElementById("patientProblem").value.trim();


    if (!name) {
        alert("Please enter patient name.");
        return;
    }


    const patient = {

        id: Date.now(),

        name: name,

        phone: phone,

        age: age,

        address: address,

        problem: problem,

        createdAt: new Date().toISOString()

    };


    patients.push(patient);

    saveData();

    alert("Patient saved successfully.");

    document.getElementById("patientName").value = "";
    document.getElementById("patientPhone").value = "";
    document.getElementById("patientAge").value = "";
    document.getElementById("patientAddress").value = "";
    document.getElementById("patientProblem").value = "";

    updateApp();

}


// ==============================
// ADD VISIT
// ==============================

function addVisit() {

    const patientId =
        document.getElementById("visitPatient").value;

    const date =
        document.getElementById("visitDate").value;

    const problem =
        document.getElementById("visitProblem").value;

    const treatment =
        document.getElementById("treatment").value;

    const fee =
        Number(document.getElementById("sessionFee").value) || 0;

    const paid =
        Number(document.getElementById("paidAmount").value) || 0;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const note =
        document.getElementById("visitNote").value;


    if (!patientId) {
        alert("Please select a patient.");
        return;
    }


    if (!date) {
        alert("Please select visit date.");
        return;
    }


    const patient =
        patients.find(p => p.id == patientId);


    const due = Math.max(fee - paid, 0);


    const visit = {

        id: Date.now(),

        patientId: patient.id,

        patientName: patient.name,

        date: date,

        problem: problem,

        treatment: treatment,

        fee: fee,

        paid: paid,

        due: due,

        paymentMethod: paymentMethod,

        note: note

    };


    visits.push(visit);

    saveData();

    alert("Visit saved successfully.");

    document.getElementById("visitProblem").value = "";
    document.getElementById("treatment").value = "";
    document.getElementById("sessionFee").value = "";
    document.getElementById("paidAmount").value = "";
    document.getElementById("visitNote").value = "";

    updateApp();

}


// ==============================
// SAVE DATA
// ==============================

function saveData() {

    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );

    localStorage.setItem(
        "visits",
        JSON.stringify(visits)
    );

}


// ==============================
// PATIENT DROPDOWN
// ==============================

function loadPatientDropdown() {

    const select =
        document.getElementById("visitPatient");

    select.innerHTML =
        '<option value="">Select Patient</option>';


    patients.forEach(patient => {

        const option =
            document.createElement("option");

        option.value = patient.id;

        option.textContent =
            patient.name +
            (patient.phone ? " - " + patient.phone : "");

        select.appendChild(option);

    });

}


// ==============================
// DISPLAY PATIENTS
// ==============================

function displayPatients() {

    const search =
        document.getElementById("searchPatient")
        .value
        .toLowerCase();

    const list =
        document.getElementById("patientList");

    list.innerHTML = "";


    const filtered =
        patients.filter(patient =>

            patient.name
                .toLowerCase()
                .includes(search)

            ||

            patient.phone
                .toLowerCase()
                .includes(search)

        );


    filtered.forEach(patient => {

        const patientVisits =
            visits.filter(
                v => v.patientId == patient.id
            );


        const totalDue =
            patientVisits.reduce(
                (sum, v) => sum + Number(v.due),
                0
            );


        const div =
            document.createElement("div");

        div.className = "patient";


        div.innerHTML = `

            <strong>${patient.name}</strong>

            <br>

            📞 ${patient.phone || "N/A"}

            <br>

            Age: ${patient.age || "N/A"}

            <br>

            Problem:
            ${patient.problem || "N/A"}

            <br>

            Visits: ${patientVisits.length}

            <br>

            <span class="${totalDue > 0 ? "due" : "paid"}">
                Due: ৳${totalDue}
            </span>

        `;


        list.appendChild(div);

    });

}


// ==============================
// DISPLAY VISITS
// ==============================

function displayVisits() {

    const list =
        document.getElementById("visitList");

    list.innerHTML = "";


    const sortedVisits =
        [...visits].sort(
            (a,b) =>
            new Date(b.date) -
            new Date(a.date)
        );


    sortedVisits.forEach(visit => {

        const div =
            document.createElement("div");

        div.className = "visit";


        div.innerHTML = `

            <strong>${visit.patientName}</strong>

            <br>

            📅 ${visit.date}

            <br>

            Problem:
            ${visit.problem || "N/A"}

            <br>

            Treatment:
            ${visit.treatment || "N/A"}

            <br>

            Fee:
            ৳${visit.fee}

            <br>

            Paid:
            <span class="paid">
                ৳${visit.paid}
            </span>

            <br>

            Due:
            <span class="${visit.due > 0 ? "due" : "paid"}">
                ৳${visit.due}
            </span>

            <br>

            Payment:
            ${visit.paymentMethod}

        `;


        list.appendChild(div);

    });

}


// ==============================
// DASHBOARD
// ==============================

function updateDashboard() {

    document.getElementById(
        "totalPatients"
    ).textContent = patients.length;


    document.getElementById(
        "totalVisits"
    ).textContent = visits.length;


    const income =
        visits.reduce(
            (sum, v) =>
            sum + Number(v.paid),
            0
        );


    const due =
        visits.reduce(
            (sum, v) =>
            sum + Number(v.due),
            0
        );


    document.getElementById(
        "totalIncome"
    ).textContent = income;


    document.getElementById(
        "totalDue"
    ).textContent = due;

}


// ==============================
// MONTHLY REPORT
// ==============================

function monthlyReport() {

    const now =
        new Date();

    const month =
        now.toISOString().slice(0,7);


    const monthVisits =
        visits.filter(
            v => v.date.startsWith(month)
        );


    const totalVisits =
        monthVisits.length;


    const income =
        monthVisits.reduce(
            (sum,v) =>
            sum + Number(v.paid),
            0
        );


    const due =
        monthVisits.reduce(
            (sum,v) =>
            sum + Number(v.due),
            0
        );


    const patientsThisMonth =
        new Set(
            monthVisits.map(
                v => v.patientId
            )
        ).size;


    document.getElementById(
        "monthlyReport"
    ).innerHTML = `

        <div class="patient">

            <strong>
                Current Month Report
            </strong>

            <br><br>

            👥 Patients:
            ${patientsThisMonth}

            <br>

            📋 Visits:
            ${totalVisits}

            <br>

            💰 Paid:
            ৳${income}

            <br>

            ⚠️ Due:
            ৳${due}

        </div>

    `;

}


// ==============================
// UPDATE EVERYTHING
// ==============================

function updateApp() {

    loadPatientDropdown();

    displayPatients();

    displayVisits();

    updateDashboard();

}


// ==============================
// START APP
// ==============================

document.getElementById(
    "visitDate"
).value =
new Date().toISOString().split("T")[0];


updateApp();
