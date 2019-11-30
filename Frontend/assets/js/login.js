let user = document.querySelector('#usuario');
let pass = document.querySelector('#pass');

let listaUsuarios = [];
let nombre = "";//usuario que inicio sesion
let rol = "";
let nombreCompleto = "";//usuario para reistro de bitacora
let idUsuario = "";//registro de bitacora
let loginPantalla = "";
let tickectPreparado = "";
let tickectRapido = "";
let empresa = "";
let direccion = "";

document.querySelector('body').onload = verificarSesion();

function iniciarSesion(event){
    event.preventDefault()

    fetch('http://localhost:3000/api/Usuarios')
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            listaUsuarios = res;
            
            
            if(verificarUsuario()){
                if(verificarPass()){
                    crearSesion();
                    limpiarFormulario();
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function verificarUsuario() {
    let existe = false;

    for(usuario of listaUsuarios){
        if(usuario.login == user.value){
            nombre = usuario.nombrecompleto;
            nomobreCompleto = usuario.nombreCompleto;
            idUsuario = usuario.id;
            rol = usuario.rol;
            existe = true;
            break;
        }

    }
    return existe;
}

function verificarPass() {
    let existe = false;

    for(usuario of listaUsuarios){
        if(usuario.clave == pass.value || usuario.pin == pass.value){
            existe = true;
            break;
        }

    }
    return existe;
}

function verificarSesion(){
    if(localStorage.getItem("sesion") == "true"){
        location.replace('dashboard.html');
    }else{
        obtenerParametro();
    }
}

function crearSesion(){
    localStorage.setItem("sesion", true);
    localStorage.setItem("nombreSesion", nombre);
    localStorage.setItem("Usuario", nombreCompleto);
    localStorage.setItem("idUsuario", idUsuario)
    localStorage.setItem("Rol", rol);
    localStorage.setItem("loginPantalla", loginPantalla);
    localStorage.setItem("ticketPreparado", tickectPreparado);
    localStorage.setItem("ticketRapido", tickectRapido);
    localStorage.setItem("empresa", empresa);
    localStorage.setItem("direccion", direccion)

    location.replace('dashboard.html');
}

function limpiarFormulario(){
    document.querySelector('#formLogin').reset()
}

function obtenerParametro(){
    fetch('http://localhost:3000/api/Parametros')
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            tickectPreparado = res[7].valor;
            tickectRapido = res[8].valor;
            loginPantalla = res[11].valor;
            empresa = res[1];
            direccion = res[6];
        })
        .catch(function (err) {
            console.log(err);
        });
}