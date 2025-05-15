document.addEventListener("DOMContentLoaded", async function () {
  await fetchApprovers();
  restoreViewerCheckboxState();
});

async function fetchApprovers() {
  const API_KEY = "AIzaSyBOSEXl0sNOQqgAqSEkRMNDi5SmRib7MXQ";  
  const SPREADSHEET_ID = "1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4";
  const APPROVER_RANGE = "Sheet3!A2:A6";  

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
          <td><input type="checkbox" id="approved_${index}"></td>
        `;
        tableBody.appendChild(tableRow);
      });

      console.log("Approver list updated successfully in Viewer mode!");
    } else {
      console.error("No approver names found.");
    }
  } catch (error) {
    console.error("Error fetching approvers:", error);
  }
}

function restoreViewerCheckboxState() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState === "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    checkbox.disabled = true;
    checkbox.style.opacity = "0.6";
    checkbox.style.cursor = "not-allowed";
  });

  console.log("Viewer Mode: All checkboxes are restored and locked as read-only.");
}
