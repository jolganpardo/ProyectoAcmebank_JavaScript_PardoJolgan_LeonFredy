var activaPestana = "pest-Consignacion";

function pestanaActiva(id) {
    document.getElementById(activaPestana).style.display = "none";
    document.getElementById(id).style.display = "block";
    activaPestana = id;
}

document.addEventListener("DOMContentLoaded", () => {
    pestanaActiva("pest-Consignacion");
});

window.pestanaActiva = pestanaActiva;
