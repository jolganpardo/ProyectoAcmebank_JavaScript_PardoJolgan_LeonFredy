import { datosIniciar, pagarServicio } from "./config/db.js";
import { localGet } from "./home.js";


var puntos = new Intl.NumberFormat('es-CO').format;

async function cargarDatosServicios() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);

    document.getElementById('pagar-servicios').addEventListener('click', async function(e) {
        e.preventDefault();
        const servicio = document.getElementById('servicio').value;
        const monto = parseFloat(document.getElementById('monto').value);

        if (!servicio || isNaN(monto) || monto <= 0) {
            alert('Por favor, selecciona un servicio y un monto válido.');
            return;
        }

        const clienteId = datos.id;
        const pago = await pagarServicio(clienteId, servicio, monto);

        if (!pago.ok) {
            alert(pago.error);
            return;
        }

        alert(`Pago de ${puntos(monto)} realizado para el servicio de ${servicio}. Nuevo saldo: $${puntos(pago.saldo)}`);
        // Generar referencia única si no la da el backend
        const referencia = pago.resumen.referencia;
        // Enviar solo un mensaje al padre con los datos del movimiento
        window.parent.postMessage({
            tipo: "consignacionExitosa",
            movimiento: {
                referencia: referencia,
                tipo: "pago",
                descripcion: "Consignación por canal electrónico",
                valor: parseInt(monto),
                fecha: new Date().toISOString()
            }
        }, "*");

    });
}
document.addEventListener("DOMContentLoaded", () => {

    cargarDatosServicios();
})

