import {datosIniciar} from "./config/db.js";
import {localGet, capitalizarCadaPalabra} from "./home.js"
async function cagarDatosConsignaciones() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);
    console.log(datosUser.datos.cuenta)
    document.getElementById("numeroCuentaConsignaciones").value = datosUser.datos.cuenta
    document.getElementById("numeroCuentaConsignaciones").disabled = true;

    document.getElementById("nombreConsignaciones").value = capitalizarCadaPalabra(datosUser.datos.nombre+" "+datosUser.datos.apellido);
    document.getElementById("nombreConsignaciones").disabled = true;

}
document.addEventListener("DOMContentLoaded", ()=>{
    
    cagarDatosConsignaciones();
})