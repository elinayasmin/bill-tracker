document.addEventListener("DOMContentLoaded", function () {
    const vendorDropdown = document.getElementById("vendorDropdown");
    const vendorSheetPath = "./data/vendor.xlsx"; 

    async function fetchVendorData() {
        try {
            const response = await fetch(vendorSheetPath);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const vendors = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat();

            updateVendorDropdown(vendors);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    function updateVendorDropdown(vendorList) {
        vendorDropdown.innerHTML = "<option value=''>Select Vendor</option>";
        vendorList.forEach(name => {
            let option = document.createElement("option");
            option.value = name;
            option.text = name;
            vendorDropdown.appendChild(option);
        });

        localStorage.setItem("vendors", JSON.stringify(vendorList)); 
    }

    fetchVendorData(); 
    const departmentSelect = document.getElementById("department");
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
    document.getElementById("invoice").addEventListener("input", function () {
        localStorage.setItem("invoiceNumber", this.value);
    });

    document.getElementById("current-date").value = new Date().toISOString().split("T")[0];
    const searchInput = document.getElementById("search-invoice");
    searchInput.addEventListener("input", function () {
        let filter = searchInput.value.toLowerCase();
        let rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {
            let invoiceName = row.cells[0].textContent.toLowerCase();
            row.style.display = invoiceName.includes(filter) ? "" : "none";
        });
    });

    function updateInvoiceSummary() {
        let totalInvoices = document.querySelectorAll("tbody tr").length;
        let approvedInvoices = document.querySelectorAll("tbody tr input:checked").length;

        document.getElementById("total-invoices").textContent = totalInvoices;
        document.getElementById("approved-invoices").textContent = approvedInvoices;
    }

    document.querySelectorAll("tbody input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", updateInvoiceSummary);
    });

    updateInvoiceSummary();
    document.getElementById("notify-btn").addEventListener("click", function () {
        let approvedCount = document.getElementById("approved-invoices").textContent;
        alert(`There are ${approvedCount} approved invoices.`);
    });
});

        document.addEventListener("DOMContentLoaded", function () {
            console.log("Validation script loaded successfully!");

            const form = document.getElementById("billTrackerForm");
            if (!form) {
                console.error("Form element not found!");
                return;
            }

            form.addEventListener("submit", function (event) {
                console.log(" Checking form inputs before submission...");

                const vendorName = document.getElementById("vendorDropdown").value.trim();
                const invoiceNo = document.getElementById("invoice").value.trim();
                const department = document.getElementById("department").value;
                const hodName = document.getElementById("hod").value.trim();
                const dateSubmit = document.getElementById("date-submit").value;
                const currentDate = document.getElementById("current-date").value;

                let errors = [];

                if (!vendorName) errors.push(" Vendor Name is required.");
                if (!invoiceNo) errors.push("Invoice Number is required.");
                if (!department) errors.push(" Department selection is required.");
                if (!hodName) errors.push("HOD name is required.");
                if (!dateSubmit) errors.push("Date of Submission is required.");
                if (!currentDate) errors.push("Current Date is required.");

                if (errors.length > 0) {
                    console.warn("Form submission blocked due to missing fields:", errors);
                    alert("⚠ Please complete all required fields:\n\n" + errors.join("\n"));
                    event.preventDefault(); 
                } else {
                    console.log("All fields are filled! Form can be submitted.");
                }
            });
        });
    

        