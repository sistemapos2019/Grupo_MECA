//Campos del formulario
let id = document.querySelector('#id');
let nombreCompleto = document.querySelector('#nombrecompleto');
let login = document.querySelector('#login');
let clave = document.querySelector('#clave');
let pin = document.querySelector('#pin');
//variables 
let tabla = document.querySelector('#tblUsuarios');
let listaUsuarios = []; //para almacenar la lista de usuarios obtenida desde la base de datos
let metodo = 'POST'//para distingir entre el metodo post y put a utilizar (por defecto sera post)
let indexSelected; //almacenara el indice de la fila seleccionada
let formUsuario = document.querySelector('#registroUsuario'); //instancia del formulario 
let mensajeAlert = "Usuario registrado con exito"; //mensaje para mostrar despues de registrar o editiar usuario
let logueo= false;
formUsuario.addEventListener('submit', function(e){guardarUsuario(e, metodo)}); //se agrega un escuchador de eventos para cuando se haga submit (se envie el formulario)
document.querySelector('#btnEditarUsuario').addEventListener('click', function(){editarUsuario()}); //boton editar usuario
document.querySelector('#btnEliminarUsuario').addEventListener('click', function(){eliminarUsuario()});
document.querySelector('body').onload = datosUsuarios(); // cuando el body este cargado se ejecutara la funcion datosUsuarios() para llenar la tabla


//se encarga de traer los datos desde la bd
function datosUsuarios(){
    fetch('http://localhost:3000/api/Usuarios')
        .then(res => res.json())
        .then(res => {
            tablaUsuarios(res)
        })
}

//se encarga de llenar la tabla con los datos obtenidos
function tablaUsuarios(res){
    tabla.innerHTML = ""; //se vacia to tbody de la tabla
    let rol = "";         //para almacenar el rol y asignarlo a la celda de la tabla
    listaUsuarios = res;  //se almacena los datos de los usuarios en un array para luego usarlos

    //se itera para obtener los datos de cada usuario
    for(usuario of res){
        //se compara el rol obtenido si es M sera Mesero y si es G sera Gerente
        if(usuario.rol == "M"){
            rol = "Mesero";
        }
        else{
            rol = "Gerente";
        }

        //se procede a crear la fila con los datos de cada usuario
        tabla.innerHTML += `<tr>
                                    <td>${usuario.id}</td>
                                    <td>${usuario.nombrecompleto}</td>
                                    <td>${rol}</td>
                                </tr>`;
    }

    selecionarFila();

}

//esta funcion se encarga de poder seleccionar una fila de la tabla
function selecionarFila(){

    for(let i = 0; i < tabla.rows.length; i++){
        //se agrega el evento click en cada fila
        tabla.rows[i].addEventListener('click', function(){
            //este es el proceso que realizara la funcion para seleccionar la fila al hacer click
            if(typeof indexSelected === "undefined"){ // si es undefined indicara que no hay fila seleccionada y se agregara la clase selected 
                this.classList.toggle("selected");
                indexSelected = this.rowIndex;        
            }else if(indexSelected == this.rowIndex){ // si damos click en una fila ya seleccionada quitaremos la clase selected
                this.classList.toggle("selected");
                indexSelected = undefined;
            }else{ //si seleccionamos una fila distinta quitamos la clase selected de la fila anterior y la agregamos a la fila actualmente selecionada
                tabla.rows[indexSelected - 1].classList.toggle("selected");
                indexSelected = this.rowIndex;
                this.classList.toggle("selected");
            }
        });
    }
}

//obtendra los datos de la lista de usuarios y asignara el valor a cada campo para editar el usuario selecionado
function editarUsuario(){
    id.value = listaUsuarios[indexSelected - 1].id;
    nombreCompleto.value = listaUsuarios[indexSelected -1 ].nombrecompleto;
    login.value = listaUsuarios[indexSelected - 1].login;
    clave.value = listaUsuarios[indexSelected - 1].clave;
    pin.value =  listaUsuarios[indexSelected - 1].pin;

    if(listaUsuarios[indexSelected - 1].rol == "G"){
        document.querySelector('#formCheck-1').checked = true;
    }else{
        document.querySelector('#formCheck-2').checked = true;
    }

    //indicamos que se utilizara el metodo PUT para enviar los datos
    metodo = 'PUT';
    mensajeAlert = "Usuario editado exitosamente";

}

//esta funcion se encarga de registrar y modificar un usuario
function guardarUsuario(e, metodo){
    e.preventDefault(); // evita que la pagina se recarge
    
    let rol = "";
    if(document.querySelector('#formCheck-1').checked){
        rol = "G";
    }else{
        rol = "M"
    }


    var data = {
        "id": id.value,
        "nombrecompleto": nombreCompleto.value,
        "login": login.value,
        "clave": clave.value,
        "pin": pin.value,
        "rol": rol
    };

    fetch('http://localhost:3000/api/Usuarios', {
        method: metodo,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
     })
        .then(function(response) {
            if(response.ok) {
                alert(mensajeAlert);
                formUsuario.reset();
                datosUsuarios();
                metodo = 'POST'; //se asignan los valores por defecto
                mensajeAlert = "Usuario registrado exitosamente";
                indexSelected = undefined;
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

//se encargara de eliminar un usuario
function eliminarUsuario(){
    
    if(indexSelected !== undefined){
        fetch('http://localhost:3000/api/Usuarios/'+listaUsuarios[indexSelected - 1].id,{
            method: 'DELETE',
        })
            .then(function(response) {
                if(response.ok) {
                    alert('Usuario borrado');
                    datosUsuarios();
                    indexSelected = undefined;
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
    }else{
        alert('Antes tiene que selecionar un usuario');
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
function autenticacion() {
    if (verificarUsuario(listaUsuarios)) {
        if (verificarPass(listaUsuarios)) {
            logueo = true;
            document.querySelector("#loguear").reset()
            $("#credencial").modal('hide');
        }
    }

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