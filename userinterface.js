
document.getElementById("viewer-btn").addEventListener("click", function() {
    localStorage.setItem("userRole", "viewer");
    window.location.href = "page1(a).html"; 
});

document.getElementById("approver-btn").addEventListener("click", function() {
    localStorage.setItem("userRole", "approver");
    window.location.href = "page2.html"; 
});

document.getElementById("Barcode Department-btn").addEventListener("click", function() {
    localStorage.setItem("userRole", "Barcode Department");
    window.location.href = "page4.html"; 
});

document.getElementById("Overall status-btn").addEventListener("click",function(){
    localStorage.setItem("userRole","Overall status");
    window.location.href = "page6.html"

});