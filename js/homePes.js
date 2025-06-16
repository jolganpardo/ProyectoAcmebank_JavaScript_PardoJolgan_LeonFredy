var activaPestana = "pest-principal";

function pestanaActiva(id) {
    document.getElementById(activaPestana).style.display = "none";
    document.getElementById(id).style.display = "block";
    activaPestana = id;
}

document.addEventListener("DOMContentLoaded", () => {
    pestanaActiva("pest-principal");
});

// Hacer visible la función al HTML
window.pestanaActiva = pestanaActiva;
