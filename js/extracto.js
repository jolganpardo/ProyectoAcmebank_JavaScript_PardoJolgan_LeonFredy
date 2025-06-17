import { datosIniciar, cargarMovimientos } from "./config/db.js";
import { localGet } from "./home.js";

let movimientos = [];

async function arreglarDatos() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);
    document.getElementById("nombre-cliente").textContent = `${datosUser.datos.nombre} ${datosUser.datos.apellido}`;
    document.getElementById("documento-cliente").textContent = formatearCedula(datosUser.datos.documento);
    document.getElementById("numero-cuenta").textContent = datosUser.datos.cuenta;

    const datosMov = await cargarMovimientos(datos.id);

    movimientos = [];

    if (datosMov.retiros.exists()) {
        Object.values(datosMov.retiros.val()).forEach(mov => {
            movimientos.push({ ...mov, tipoMovimiento: "Retiro" });
        });
    }
    if (datosMov.consignaciones.exists()) {
        Object.values(datosMov.consignaciones.val()).forEach(mov => {
            movimientos.push({ ...mov, tipoMovimiento: "Consignación" });
        });
    }
    if (datosMov.servicios.exists()) {
        Object.values(datosMov.servicios.val()).forEach(mov => {
            movimientos.push({ ...mov, tipoMovimiento: "Pago Servicio" });
        });
    }

    mostrarTabla(movimientos);
}

function mostrarTabla(lista) {
    const tbody = document.getElementById("tabla-extracto");
    tbody.innerHTML = "";

    lista.forEach(mov => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td data-label="Fecha">${formatearFecha(mov.fecha)}</td>
            <td data-label="Referencia">${mov.referencia || "-"}</td>
            <td data-label="Tipo">${mov.tipoMovimiento}</td>
            <td data-label="Descripción">${mov.descripcion || mov.concepto || "-"}</td>
            <td data-label="Valor">$${formatearNumero(mov.valor)}</td>
        `;
        tbody.appendChild(fila);
    });
}

function formatearNumero(num) {
    return Number(num).toLocaleString('es-CO');
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO');
}

function formatearCedula(cedula) {
    return cedula.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

document.getElementById("filtrar").addEventListener("click", () => {
    const año = document.getElementById("año-select").value;
    const mes = document.getElementById("mes-select").value;

    const listaFiltrada = movimientos.filter(mov => {
        const fecha = new Date(mov.fecha);
        return (
            fecha.getFullYear() == año &&
            (fecha.getMonth() + 1).toString().padStart(2, "0") === mes
        );
    });

    mostrarTabla(listaFiltrada);
});
document.addEventListener("DOMContentLoaded", async () => {

    const mesActual = (new Date().getMonth() + 1).toString().padStart(2, "0");

    document.getElementById("mes-select").value = mesActual;

    await arreglarDatos();
});

document.getElementById("descargar-pdf").addEventListener("click", () => {
    const año = document.getElementById("año-select").value;
    const mes = document.getElementById("mes-select").value;

    const movimientosFiltrados = movimientos.filter(mov => {
        const fecha = new Date(mov.fecha);
        return (
            fecha.getFullYear() == año &&
            (fecha.getMonth() + 1).toString().padStart(2, "0") === mes
        );
    });

    const cliente = document.getElementById("nombre-cliente").textContent;
    const documento = document.getElementById("documento-cliente").textContent;
    const cuenta = document.getElementById("numero-cuenta").textContent;

    let tablaHtml = `
        <h1>Extracto Bancario</h1>
        <p><b>Cliente:</b> ${cliente}</p>
        <p><b>Documento:</b> ${documento}</p>
        <p><b>N° de cuenta:</b> ${cuenta}</p>
        <p><b>Periodo:</b> ${mes}/${año}</p>

        <table border="1" cellspacing="0" cellpadding="6" style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #1a2b6d; color: white;">
                <tr>
                    <th>Fecha</th>
                    <th>Referencia</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
    `;

    movimientosFiltrados.forEach(mov => {
        tablaHtml += `
            <tr>
                <td>${formatearFecha(mov.fecha)}</td>
                <td>${mov.referencia || "-"}</td>
                <td>${mov.tipoMovimiento}</td>
                <td>${mov.descripcion || mov.concepto || "-"}</td>
                <td>$${formatearNumero(mov.valor)}</td>
            </tr>
        `;
    });

    tablaHtml += `</tbody></table>`;

    const estilos = `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 2rem;
            color: black;
        }
        h1 {
            color: #1a2b6d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 8px;
        }
        th {
            background-color: #1a2b6d;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>`;

    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
        <html>
        <head><title>Extracto Bancario</title>${estilos}</head>
        <body>
        ${tablaHtml}
        <script>
            window.onload = function() {
                window.print();
                window.onafterprint = () => window.close();
            };
        <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
});
