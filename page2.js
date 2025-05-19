

const API_KEY = "AIzaSyBOSEXl0sNOQqgAqSEkRMNDi5SmRib7MXQ"; 
const SPREADSHEET_ID = "1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4"; 
const DEPARTMENT_ID="Sheet2!A2:B6";
const APPROVER_RANGE = "Sheet3!A2:A7";
const UPDATE_RANGE = "Sheet3!B2:B7";

    const departmentSelect = document.getElementById("deptName");
    const hodField = document.getElementById("hod");
    const departmentSheetPath = "./data/department.xlsx";
     async function fetchDepartmentData() {
        try {
            const response = await fetch(departmentSheetPath);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const deptData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            updateDepartmentDropdown(deptData);
        } catch (error) {
            console.error("Error fetching department data:", error);
        }
    }
function updateDepartmentDropdown(deptList) {
        departmentSelect.innerHTML = "<option value=''>Select Department</option>";
        deptList.forEach(row => {
            let option = document.createElement("option");
            option.value = row[0]; 
            option.text = row[0];
            departmentSelect.appendChild(option);
        });

        departmentSelect.addEventListener("change", function () {
            let selectedDept = departmentSelect.value;
            let hodEntry = deptList.find(row => row[0] === selectedDept);
            hodField.value = hodEntry ? hodEntry[1] : "";
        });
    }
  fetchDepartmentData();
    document.addEventListener("DOMContentLoaded", function () {
    const deptInput = document.getElementById("deptName");
    const savedDept = localStorage.getItem("deptName");

    if (savedDept) {
        deptInput.value = savedDept;
    }
});

async function fetchApproverNames() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${APPROVER_RANGE}?key=${API_KEY}`
        );
        const data = await response.json();

        if (data.values) {
            const approverDropdown = document.getElementById("approverName");
            approverDropdown.innerHTML = '<option value="">Select Approver</option>'; 

            data.values.forEach(row => {
                const approver = row[0];
                approverDropdown.innerHTML += `<option value="${approver}">${approver}</option>`;
            });

            console.log("Approver list updated successfully!");
        } else {
            console.error("No approver names found.");
        }
    } catch (error) {
        console.error(" Error fetching approvers:", error);
    }
}
async function updateSheetData() {
    const approver = document.getElementById("approverName").value;
    const verification = document.getElementById("markAsDone").value === "yes" ? "Approved" : "Not Approved";

    const values = [[approver, verification]]; 

    const requestBody = { values };

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${UPDATE_RANGE}?valueInputOption=RAW&key=${API_KEY}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            }
        );
        
        const result = await response.json();
        
        if (result.updatedCells) {
            console.log("Successfully updated verification status in Sheet 3!");
        } else {
            console.error("Failed to update Sheet 3.");
        }
    } catch (error) {
        console.error("Error updating sheet:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchApproverNames);
document.getElementById("approverName").addEventListener("change", updateSheetData);
document.getElementById("markAsDone").addEventListener("change", updateSheetData);
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const markAsDoneSelect = document.getElementById("markAsDone");

        if (markAsDoneSelect) {
            console.log("Found 'markAsDone' select field!");
            markAsDoneSelect.addEventListener("change", updateSheetData);
        } else {
            console.error("Error: 'markAsDone' select field not found.");
        }
    }, 500); 
});


document.addEventListener("DOMContentLoaded", function () {
    console.log("Validation script loaded successfully!");

    const form = document.querySelector("form");
    if (!form) {
        console.error("Form element not found!");
        return;
    }

    form.addEventListener("submit", function (event) {
        console.log("Checking form inputs before submission...");
        
        const deptName = document.getElementById("deptName").value.trim();
        const invoiceNo = document.getElementById("invoiceNo").value.trim();
        const sesNo = document.getElementById("sesNo").value.trim();
        const approverName = document.getElementById("approverName").value;
        const markAsDone = document.getElementById("markAsDone").value;

        let errors = [];

        if (!deptName) errors.push(" Department Name is required.");
        if (!invoiceNo) errors.push(" Invoice Number is required.");
        if (!sesNo) errors.push("SES Number is required.");
        if (!approverName) errors.push(" Approver Name is required.");
        if (!markAsDone) errors.push("Verification selection is required.");

        if (errors.length > 0) {
            console.warn("Form submission blocked due to missing fields:", errors);
            alert("Please complete all required fields:\n\n" + errors.join("\n"));
            event.preventDefault(); 
        } else {
            console.log(" All fields are filled! Form can be submitted.");
        }
    });
});

document.querySelectorAll(".approver-name").forEach((approver) => {
    approver.addEventListener("click", function () {
        localStorage.setItem("selectedApprover", approver.textContent); 
        window.location.href = "page3.html"; 
    });
});
