


document.addEventListener("DOMContentLoaded", function () {
    const invoiceNo = localStorage.getItem("invoiceNo");
    const approverName = localStorage.getItem("approverName");

    const approvalMessage = document.querySelector(".container p");

    if (invoiceNo && approverName) {
        approvalMessage.textContent = `The bill ${invoiceNo} has been approved by ${approverName}.`;
    } else {
        approvalMessage.textContent = "Bill has been approved !!!";
    }
});
