import {consignar, datosIniciar} from "./config/db.js";
import {localGet, capitalizarCadaPalabra} from "./home.js"
async function cagarDatosConsignaciones() {
    const datos = await localGet();
    const datosUser = await datosIniciar(datos.id);
    const btnConsignar = document.getElementById("consignar-dinero");
    const inputMonto = document.getElementById("montoConsignaciones");

    document.getElementById("numeroCuentaConsignaciones").value = datosUser.datos.cuenta
    document.getElementById("numeroCuentaConsignaciones").disabled = true;

    document.getElementById("nombreConsignaciones").value = capitalizarCadaPalabra(datosUser.datos.nombre+" "+datosUser.datos.apellido);
    document.getElementById("nombreConsignaciones").disabled = true;

    btnConsignar.addEventListener("click", async () => {
            const valor = inputMonto.value;
            const clienteId = datos.id;
            const resultado = await consignar(clienteId, valor);
    
            if (!resultado.ok) {
                alert(resultado.error);
                return;
            }
    
            alert(`Consigancion exitosa. Nuevo saldo: ${resultado.saldo}`);
            window.top.location.reload();
        });
}
document.addEventListener("DOMContentLoaded", ()=>{
    
    cagarDatosConsignaciones();
})