
window.history.pushState(null, "", window.location.href);
window.addEventListener("popstate", function (event) {
    window.history.pushState(null, "", window.location.href);
    alert("⚠ Back navigation is disabled on this page.");
});


window.onbeforeunload = function (event) {
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave this page?";
};


        
        
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("verified").checked = localStorage.getItem("verified") === "true";
            document.getElementById("markDone").checked = localStorage.getItem("markDone") === "true";
        });

        function storeVerificationStatus(id) {
            localStorage.setItem(id, document.getElementById(id).checked);
        }

        function toggleAlertInputs() {
            const alertInputs = document.getElementById("alertInputs");
            alertInputs.style.display = alertInputs.style.display === "none" ? "block" : "none";
        }

        function confirmSubmission() {
            if (confirm("Are you sure you want to submit?")) {
                window.location.href = "page5.html";
            }
        }
        function validateAndSubmit() {
    const barcodeSelected = document.querySelector('input[name="barcodeAttached"]:checked');
    const paymentSelected = document.querySelector('input[name="paymentDepartment"]:checked');

    if (!barcodeSelected || !paymentSelected) {
        alert("⚠ Please select Yes or No for both Barcode Attached and Proceeded to Payment Department before submitting.");
    } else {
        if (confirm("Are you sure you want to submit?")) {
            window.location.href = "page5.html"; 
        }
    }
}

    