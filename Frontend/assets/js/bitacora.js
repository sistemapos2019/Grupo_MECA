let fechaDesde = document.querySelector('#fechaDesde');
let fechaHasta = document.querySelector('#fechaHasta');
let tabla = document.querySelector('#tblBitacora tbody');
let alerta = document.querySelector('#msj');

let url = 'http://localhost:3000/api/Bitacoras';
let listaBitacora = [];
let listaUsuarios = [];
let borrar = 0; // si es 0 se borrara por rango si es 1 se borrara toda la bitacora
let logueo = false;

document.querySelector('body').onload = datos();
fechaDesde.addEventListener('input', function () { filtrar() });
fechaHasta.addEventListener('input', function () { filtrar() });
document.querySelector('#btnCerrarAlert').addEventListener('click', function () { cerrarAlerta() });
$('#avisoBitacora').on('show.bs.modal', function () { modal() }); // evento se ejecuta antes de que modal se carge
document.querySelector('#btnEliminarRango').addEventListener('click', function () {
    borrar = 0;
    verificar()
});
document.querySelector('#btnEliminar').addEventListener('click', function () {
    borrar = 1;
    verificar();
    
});
document.querySelector('#btnEliminarBitacora').addEventListener('click', function () { eliminarBitacora() });

function datos() {
    datosUsuario();
    datosBitacora();
}

function datosUsuario() {
    fetch('http://localhost:3000/api/Usuarios')
        .then(res => res.json())
        .then(res => {
            listaUsuarios = res;
        })
}

function datosBitacora() {
    fetch(url)
        .then(res => res.json())
        .then(res => { tablaBitacora(res) })
}

function tablaBitacora(res) {
    tabla.innerHTML = "";
    let fechaHora = [];
    listaBitacora = res;

    for (bitacora of res) {
        fechaHora = bitacora.fecha.split("T");

        tabla.innerHTML += `<tr>
                                <td>${fechaHora[0]}</td>
                                <td>${fechaHora[1].substr(0, 8)}</td>
                                <td>${bitacora.suceso}</td>
                                <td>${listaUsuarios.find(buscarUsuario(bitacora.idUsuario)).nombrecompleto}</td>
                             </tr>`;
    }
}

function buscarUsuario(idUsuario) {
    return function (usuario) {
        return usuario.id == idUsuario;
    }
}

//fitrara los registros por fecha
function filtrar() {

    if (fechaDesde.value != "" & fechaHasta.value == "") {
        url = 'http://localhost:3000/api/Bitacoras?filter[where][fecha][regexp]=' + fechaDesde.value;
    } else if (fechaDesde.value != "" & fechaHasta.value != "") {
        fechaHasta.stepUp(1);
        url = 'http://localhost:3000/api/Bitacoras?filter[where][fecha][between][0]=' + fechaDesde.value + '&filter[where][fecha][between][1]=' + fechaHasta.value;
        fechaHasta.stepDown(1);
    } else {
        fechaHasta.value = "";
        url = 'http://localhost:3000/api/Bitacoras';
    }

    datosBitacora();
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

//modifica el contenido del modal y la url para borrar los registros
function modal() {
    let mensaje = '';
    let titulo = '';
    //se podra borrar por un dia especifico, por un rango de fechas o toda la bitacora
    if (borrar == 0) {

        if (fechaDesde.value != "" && fechaHasta.value != "") {
            titulo = 'Eliminar por rango';
            mensaje = 'Se borrán todos los registros de la bitacora de la fecha ' + fechaDesde.value + ' al ' + fechaHasta.value
        } else {
            titulo = 'Eliminar por día';
            mensaje = 'Se borrarán todos los registros de la bitacora de la fecha ' + fechaDesde.value
        }

    } else {
        titulo = 'Eliminar bitcora';
        mensaje = 'Se borrará todo el registro que exixte actualmente en la bitacora '
    }

    $('#avisoBitacora').find('.modal-body p').text(mensaje);
    $('#avisoBitacora').find('.modal-title').text(titulo);
}

//verifica si los campos date estan vacios al eliminar y si hay registros para eliminar
function verificar() {
    url = 'http://localhost:3000/api/Bitacoras';
    //si es 0 verifica que los campos date correspondientes no esten vacios
    if (borrar == 0) {
        if (fechaDesde.value == "") {
            alerta.innerHTML = "Seleccione una fecha primero"
            mostrarAlerta();
        } else {
            //verica que los datos de registros no sean vacios
            if (listaBitacora && listaBitacora.length > 0) {
                $('#avisoBitacora').modal('show');
            } else {
                alerta.innerHTML = "No hay registros para borrar"
                mostrarAlerta();
                console.log(listaBitacora.length)
            }
        }
    }else{
        //trae los registros de la base de datos
        datosBitacora();
        //si es 1 solo se verifica que existan registros
        
        setTimeout(function () {
            if (listaBitacora && listaBitacora.length > 0) {
                $('#avisoBitacora').modal('show');
            } else {
                alerta.innerHTML = "No hay registros para borrar"
                mostrarAlerta();
            }
        }, 100);
        
    }
}

function limpiar(){
    fechaDesde.value = "";
    fechaHasta.value = "";
    url = 'http://localhost:3000/api/Bitacoras';
}

function eliminarBitacora() {
    $('#avisoBitacora').modal('hide');
    let items = 0; //items borrados

    for (bitacora of listaBitacora){
        fetch(url+'/'+bitacora.id,{
            method: 'DELETE',
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
        
        items+=1;
    }

    if(listaBitacora.length == items){
        limpiar();
        datosBitacora();
    }
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