document.addEventListener("DOMContentLoaded", function () {
    console.log("Approver mode active—editing enabled.");
    
});
document.addEventListener("DOMContentLoaded", function () {
    const approvalCheckboxes = document.querySelectorAll(".approval-table input[type='checkbox']");
    
    approvalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            localStorage.setItem(checkbox.id, checkbox.checked); 
        });

    
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState !== null) {
            checkbox.checked = savedState === "true"; 
        }
    });
});

