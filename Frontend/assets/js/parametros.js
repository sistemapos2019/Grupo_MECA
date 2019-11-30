
let empresa = document.querySelector('#empresa');
let descripcion = document.querySelector('#descripcion');
let direccion = document.querySelector('#direccion');
let telefono = document.querySelector('#telefono');
let nit = document.querySelector('#nit');
let giro = document.querySelector('#giro');
let entorno = document.querySelector('#entorno');
let tiempoR = document.querySelector('#tOrdenRapida');
let tiempoP = document.querySelector('#tPreparadoOrden');
let logueo = false;
let propina = document.querySelector('#propina');

let listaParametros = [];

document.querySelector('body').onload = datosParametros();
document.querySelector('#btnCerrarAlert').addEventListener('click', function(){cerrarAlerta()});

function datosParametros() {
    fetch('http://localhost:3000/api/Parametros')
        .then(res => res.json())
        .then(res => {
            listaParametros = res;

            empresa.value = listaParametros[1].valor;
            descripcion.value = listaParametros[2].valor;
            direccion.value = listaParametros[6].valor;
            telefono.value = listaParametros[3].valor;
            nit.value = listaParametros[4].valor;
            giro.value = listaParametros[5].valor;
            entorno.value = listaParametros[0].valor;

            if (listaParametros[7].valor.toLowerCase() == "si") {
                document.querySelector('#checkPrintP-1').checked = true;
            } else {
                document.querySelector('#checkPrintP-2').checked = true;
            }
            if (listaParametros[8].valor.toLowerCase() == "si") {
                document.querySelector('#checkPrintR-1').checked = true;
            } else {
                document.querySelector('#checkPrintR-2').checked = true;
            }
            if (listaParametros[11].valor.toLowerCase() == "0") {
                document.querySelector('#checkLogin-1').checked = true;
            } else {
                document.querySelector('#checkLogin-2').checked = true;
            }

            tiempoR.value = listaParametros[9].valor;
            tiempoP.value = listaParametros[10].valor;
            propina.value = listaParametros[12].valor;
        });
}

function mostrarAlerta() {
    $("#alert").show('fade');
    setTimeout(function () {
        $("#alert").hide('fade');
    }, 5000);
}

function cerrarAlerta() {
    $('#alert').hide('fade');
}

function modificarParametros(event) {
    event.preventDefault();

    let imprTicketPP = "";
    let imprTicketPR = "";
    let loginPantalla = "";

    if (document.querySelector('#checkPrintP-1').checked) {
        imprTicketPP = "Si";
    } else {
        imprTicketPP = "No";
    }
    if (document.querySelector('#checkPrintR-1').checked) {
        imprTicketPR = "Si";
    } else {
        imprTicketPR = "No";
    }
    if (document.querySelector('#checkLogin-1').checked) {
        loginPantalla = "0";
    } else {
        loginPantalla = "1";
    }

    let data = [
        {
            "id": 1,
            "nombre": "ModoEntorno",
            "valor": entorno.value
        },
        {
            "id": 2,
            "nombre": "Nombre",
            "valor": empresa.value
        },
        {
            "id": 3,
            "nombre": "Descripcion",
            "valor": descripcion.value
        },
        {
            "id": 4,
            "nombre": "Telefono",
            "valor": telefono.value
        },
        {
            "id": 5,
            "nombre": "NIT",
            "valor": nit.value
        },
        {
            "id": 6,
            "nombre": "giro",
            "valor": giro.value
        },
        {
            "id": 7,
            "nombre": "direccion",
            "valor": direccion.value
        },
        {
            "id": 8,
            "nombre": "Imprimir Ticket de productos preparados",
            "valor": imprTicketPP
        },
        {
            "id": 9,
            "nombre": "Imprimir Ticket de productos NO preparados o rapidos",
            "valor": imprTicketPR
        },
        {
            "id": 10,
            "nombre": "tiempo maximo ordenes RAPIDAS (minutos)",
            "valor": tiempoR.value
        },
        {
            "id": 11,
            "nombre": "tiempo maximo Preparacion de Orden",
            "valor": tiempoP.value
        },
        {
            "id": 12,
            "nombre": "Login en cada pantalla",
            "valor": loginPantalla
        },
        {
            "id": 12,
            "nombre": "Propina",
            "valor": propina.value
        }

    ]

    for (let index = 0; index < 12; index++) {
        console.log(data[index]);
        fetch('http://localhost:3000/api/Parametros', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data[index])
         })
            .then(function(response) {
                if(response.ok) {
                    return response.text()
                } else {
                    throw "Error en la llamada Ajax";
                }

            })
            .then(function(texto) {
                console.log(texto);
             })
            .catch(function(err) {
                console.log(err);
            });

    }
    mostrarAlerta();
}

function redirigir(url){
    if(localStorage.getItem("loginPantalla") == 1){
        $("#credencial").modal("show");
        $('#credencial').on('hidden.bs.modal', function (e) {
            if(logueo == true){
                window.location.href  = url;
            }
         })
    }else{
        window.location.href  = url;
    }
}

//inicio logueo
function autenticacion(){
    let listaUsuarios = [];
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
            console.log(listaUsuarios)
            if(verificarUsuario(listaUsuarios)){
                if(verificarPass(listaUsuarios)){
                    logueo = true;
                    document.querySelector("#loguear").reset()
                    $("#credencial").modal('hide');
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function verificarUsuario(listaUsuarios) {
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

function verificarPass(listaUsuarios) {
    let existe = false;

    for(usuario of listaUsuarios){
        if(usuario.clave == pass.value || usuario.pin == pass.value){
            existe = true;
            localStorage.setItem("Usuario", usuario.nombrecompleto);
            localStorage.setItem("idUsuario", usuario.id)
            break;
        }

    }
    return existe;
}