
document.addEventListener("DOMContentLoaded", async function () {
    await fetchApprovers();
    initializeApprovalState(); 
    restoreCheckboxState();
});

function initializeApprovalState() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    
    checkboxes.forEach((checkbox, index) => {
        const previousCheckbox = index > 0 ? checkboxes[index - 1] : null; 
        if (index === 0) {
            checkbox.disabled = false;
            checkbox.style.opacity = "1";
            checkbox.style.cursor = "pointer";
        }
        else if (previousCheckbox && previousCheckbox.checked) {
            checkbox.disabled = false;
            checkbox.style.opacity = "1";
            checkbox.style.cursor = "pointer";
        }
        else {
            checkbox.disabled = true;
            checkbox.style.opacity = "0.5";
            checkbox.style.cursor = "not-allowed";
        }
    });

    console.log("Initial approval state applied correctly!");
}
function checkApproval() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    
    checkboxes.forEach((checkbox, index) => {
        if (index > 0) {
            const previousCheckbox = checkboxes[index - 1];
            checkbox.disabled = !previousCheckbox.checked;
            checkbox.style.opacity = checkbox.disabled ? "0.5" : "1";
            checkbox.style.cursor = checkbox.disabled ? "not-allowed" : "pointer";
        }
    });

    console.log("🔄 Progressive approval sequence applied!");
}
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => { 
        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", checkApproval);
        });

        checkApproval();
    }, 500);
});

document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "viewer") {
        console.log("Viewer detected, disabling checkboxes."); 
        const checklistItems = document.querySelectorAll("#checklist input[type='checkbox']");

        checklistItems.forEach(item => {
            item.disabled = true; 
            item.style.opacity = "0.6"; 
            item.style.cursor = "not-allowed"; 
        });

        document.querySelectorAll(".approval-actions").forEach(button => {
            button.style.display = "none";
        });
    }
});

const API_KEY = "AIzaSyBOSEXl0sNOQqgAqSEkRMNDi5SmRib7MXQ";
const SPREADSHEET_ID = "1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4"; 
const APPROVER_RANGE = "Sheet3!A2:A6";

async function fetchApprovers() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${APPROVER_RANGE}?key=${API_KEY}`
        );
        const data = await response.json();

        if (data.values) {
            const tableBody = document.getElementById("approvalTableBody");
            tableBody.innerHTML = "";

            data.values.forEach((row, index) => {
                const approverName = row[0];

                const tableRow = document.createElement("tr");
                tableRow.innerHTML = `
                    <td>${approverName}</td>
                    <td><input type="checkbox" id="approved_${index}" onchange="confirmCheckboxChange('approved_${index}'); checkApproval();"></td>
                `;
                tableBody.appendChild(tableRow);
            });

            console.log("Approver list updated successfully!");
        } else {
            console.error("No approver names found.");
        }
    } catch (error) {
        console.error("Error fetching approvers:", error);
    }
}

function confirmCheckboxChange(checkboxId) {
    const checkbox = document.getElementById(checkboxId);

    if (checkbox.checked) {
        const confirmation = confirm("Approved! This action is now saved.");
        
        if (!confirmation) {
            checkbox.checked = false;
        } else {
            localStorage.setItem(checkboxId, "true"); 
        }
    } else {
        localStorage.removeItem(checkboxId); 
    }
}
function restoreCheckboxState() {
    setTimeout(() => {
        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        
        checkboxes.forEach((checkbox, index) => {
            const savedState = localStorage.getItem(checkbox.id);

            if (savedState === "true") {
                checkbox.checked = true; 
                checkbox.disabled = false; 
                checkbox.style.opacity = "1";
                checkbox.style.cursor = "pointer";

                if (index + 1 < checkboxes.length) {
                    const nextCheckbox = checkboxes[index + 1];
                    nextCheckbox.disabled = false;
                    nextCheckbox.style.opacity = "1";
                    nextCheckbox.style.cursor = "pointer";
                }
            }
            checkbox.addEventListener("change", () => confirmCheckboxChange(checkbox.id));
        });
    }, 500); 
}
function saveApprovalState(checkboxId) {
    let storedApprovals = JSON.parse(localStorage.getItem("approvals")) || {}; 
    storedApprovals[checkboxId] = document.getElementById(checkboxId).checked;
    localStorage.setItem("approvals", JSON.stringify(storedApprovals)); 
}
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            saveApprovalState(checkbox.id); 
        });
    });

    console.log("Approvals are now correctly stored in localStorage!");
});
