import { registrarUsuarios } from "../js/config/db.js";

function validarDatosResgistroUsuario(){
    
    const contra = document.getElementById("password").value
    const contraVeri = document.getElementById("passwordVerificacion").value
    if(contra !== contraVeri){
        alert("Contraseña no coinciden")
        return
    }
    const datos = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        tipoIdentificacion: document.getElementById("tipoIdentificacion").value,
        documento: document.getElementById("documento").value,
        genero: document.getElementById("genero").value,
        celular: document.getElementById("celular").value,
        correo: document.getElementById("correo").value,
        ciudad: document.getElementById("ciudad").value,
        password: document.getElementById("password").value,
        direccion: document.getElementById("direccion").value
    };
    console.log(datos);
    registrarUsuarios(document.getElementById("documento").value, datos);
}
document.addEventListener("DOMContentLoaded", ()=>{
    const btnRegistroUsuario = document.getElementById("btn-registrar-usuario");
    btnRegistroUsuario.addEventListener("click", (event)=>{
        event.preventDefault();
        validarDatosResgistroUsuario();
        
    }
    )
})