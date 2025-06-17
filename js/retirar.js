import { datosIniciar, retirar } from "./config/db.js";
import { localGet } from "./home.js"

var puntos = new Intl.NumberFormat('es-CO').format;

async function cagarDatosRetiros() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);
    const saldo = await datosUser.datos.saldo;
    const btnRetirar = document.getElementById("retirar-dinero");
    const inputValor = document.getElementById("cantRetirar");

    btnRetirar.addEventListener("click", async () => {
        const valor = inputValor.value;
        const clienteId = datos.id;
        const resultado = await retirar(clienteId, valor);

        if (!resultado.ok) {
            alert(resultado.error);
            return;
        }

        alert(`Consignación exitosa. Nuevo saldo: ${resultado.saldo}`);
        window.top.location.reload();
    });
}
document.addEventListener("DOMContentLoaded", () => {

    cagarDatosRetiros();
})
