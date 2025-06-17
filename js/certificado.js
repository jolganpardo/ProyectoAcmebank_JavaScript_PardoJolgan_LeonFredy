import { datosIniciar } from "./config/db.js";
import { localGet } from "./home.js"

const datos = await localGet();
const datosUser = await datosIniciar(datos.id);

document.getElementById("fecha-certificado").textContent = fechaLargaActual();
document.getElementById("nombre-user-certificado").textContent = datosUser.datos.nombre+" "+datosUser.datos.apellido;
document.getElementById("documento-certificado").textContent = formatearCedula(datosUser.datos.documento);

const cuerpoTabla = document.getElementById("cuerpo-tabla-certificado");

const fila = document.createElement("tr");

const celda1 = document.createElement("td");
celda1.textContent = datosUser.datos.tipoCuenta; 
fila.appendChild(celda1);

const celda2 = document.createElement("td");
celda2.textContent = datosUser.datos.cuenta; 
fila.appendChild(celda2);

const celda3 = document.createElement("td");
celda3.textContent = datosUser.datos.fechaCreacion; 
fila.appendChild(celda3);

const celda4 = document.createElement("td");
celda4.textContent = datosUser.datos.estado; 
fila.appendChild(celda4);

cuerpoTabla.appendChild(fila);


function formatearCedula(cedula) {
    return cedula.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

    const btndescargar = document.getElementById("descargar-certificado");
    btndescargar.addEventListener("click", () => {
        const contenido = document.getElementById("certificado-pdf").innerHTML;

        const estilos = `
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: white;
                color: black;
                margin: 2rem;
            }

            h1 {
                color: #1a2b6d;
                font-size: 28px;
                margin-bottom: 1rem;
            }
            h3 {
                color: #0c2e60;
                font-weight: bold;
                font-size: 22px;
            }

            p {
                font-size: 16px;
                line-height: 1.6;
            }

            .nombre-certificado {
                font-weight: bold;
                color: #1f3b8a;
            }

            #documento-Certificado {
                color: black;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                background: white;
                border-radius: 6px;
                overflow: hidden;
            }

            th {
                background-color: #1a2b6d;
                color: white;
                padding: 12px;
                text-align: left;
            }

            td {
                padding: 12px;
                border-top: 1px solid #ccc;
            }

            #nota-certificado {
                margin-top: 1.5rem;
                background-color: #eef2fa;
                padding: 12px;
                border-left: 4px solid #1a2b6d;
                border-radius: 4px;
                font-size: 14px;
                color: black;
            }

            #fecha-certificado {
                color: black;
                font-size: 14px;
            }
        </style>`;

            const ventana = window.open('', '', 'width=800,height=600');
            ventana.document.write(`
            <html>
                <head>
                    <title>Certificado Bancario</title>
                    ${estilos}
                </head>
                <body>
                    ${contenido}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    <\/script>
                </body>
            </html>
        `);
            ventana.document.close();
        });

function fechaLargaActual() {
    const ahora = new Date();

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(ahora);

    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}