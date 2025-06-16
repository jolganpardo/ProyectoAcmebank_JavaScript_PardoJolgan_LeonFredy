import { datosIniciar} from "./config/db.js";
import { localGet } from "./home.js";

var puntos = new Intl.NumberFormat('es-CO').format;

async function cargarDatosRetirar() {
    const user = await localGet();
    
    const datosUser = await datosIniciar(user.id);
    if (datosUser.ok){
        document.getElementById("saldoRetirar").value = puntos(datosUser.datos.saldo)
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    alert("hola");
    cargarDatosRetirar()
});

