import { datosIniciar, retirar } from "./config/db.js";
import { localGet } from "./home.js"

var puntos = new Intl.NumberFormat('es-CO').format;

async function cargarDatosRetiros() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);
    const btnRetirar = document.getElementById("retirar-dinero");
    const inputValor = document.getElementById("cantRetirar");

    document.getElementById("saldo-retirar").textContent = "$ " + puntos(datosUser.datos.saldo);

    btnRetirar.addEventListener("click", async () => {
        const valor = inputValor.value;
        const clienteId = datos.id;
        const resultado = await retirar(clienteId, valor);

        if (!resultado.ok) {
            alert(resultado.error);
            return;
        }

        alert(`Retiro exitoso. Nuevo saldo: ${resultado.saldo}`);
        inputValor.value = "";

        // Crear el movimiento en el mismo formato que los demás
        const movimiento = {
            tipo: "retiro",
            valor: valor,
            fecha: new Date().toISOString(),
            descripcion: "Retiro en línea",
            referencia: resultado.resumen.referencia
        };

        // Enviar mensaje al iframe padre
        window.parent.postMessage({ 
            tipo: "consignacionExitosa", // puedes cambiar el nombre a "retiroExitoso" si quieres
            movimiento: movimiento
        }, "*");
    });
}

document.addEventListener("DOMContentLoaded", () => {

    cargarDatosRetiros();
})
