let id = 0;
let nombreMesaA = document.querySelector('#mesaA');
let nombreMesaB = document.querySelector('#mesaE');
let mesa =  "";
let modalMesaA = $('#mesasA');
let modalMesaE = $('#mesasE');
let tabla = document.querySelector('#tblMesas tbody');

let listaMesas = [];
let indexSelected = undefined;
let metodo = 'POST';
let logueo = false;

document.querySelector('body').onload = datosMesa();
document.querySelector('#Editar').addEventListener('click', function(){editarMesa()});
document.querySelector('#Eliminar').addEventListener('click', function(){eliminarMesa()});

function datosMesa() {
    fetch('http://localhost:3000/api/Mesas')
        .then(res => res.json())
        .then(res => {
            listaMesas = res;
            tabla.innerHTML = "";

            for (elemento of listaMesas) {
                tabla.innerHTML += `<tr>
                                <td>${elemento.id}</td>
                                <td>${elemento.mesa}</td>
                             </tr>`;
            }
            selecionarFila();
        })
        .catch(function (err) {
            console.log(err);
        });


}

function selecionarFila() {
    for (let i = 0; i < tabla.rows.length; i++) {
        //se agrega el evento click en cada fila
        tabla.rows[i].addEventListener('click', function () {
            //este es el proceso que realizara la funcion para seleccionar la fila al hacer click
            if (typeof indexSelected === "undefined") { // si es undefined indicara que no hay fila seleccionada y se agregara la clase selected 
                this.classList.toggle("selected");
                indexSelected = this.rowIndex;
            } else if (indexSelected == this.rowIndex) { // si damos click en una fila ya seleccionada quitaremos la clase selected
                this.classList.toggle("selected");
                indexSelected = undefined;
            } else { //si seleccionamos una fila distinta quitamos la clase selected de la fila anterior y la agregamos a la fila actualmente selecionada
                tabla.rows[indexSelected - 1].classList.toggle("selected");
                indexSelected = this.rowIndex;
                this.classList.toggle("selected");
            }
        });
    }
}

function guardarMesa(event) {
    event.preventDefault();
    if(metodo == 'PUT'){
        nombreMesaA.value = nombreMesaB.value
    }
    let mesa = {
        "id": id,
        "mesa": nombreMesaA.value
    }

    fetch('http://localhost:3000/api/Mesas', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: metodo,
        body: JSON.stringify(mesa),
    })
        .then(res => res.json())
        .then(datos => {
            console.log(datos);
            limpiar();
            datosMesa();
            modalMesaA.modal('hide');
            modalMesaE.modal('hide');
            indexSelected = undefined;
        })
        .catch(function (err) {
            console.log(err);
        });

}

function limpiar() {
    metodo = 'POST'
    // mensaje = { "titulo": 'Registrar categoria', "msj": "La categoria se ha registrado exitosamente" };
    id = 0;
    nombreMesaA.value = "";
    nombreMesaB.value = "";
    indexSelected = undefined;
}

function editarMesa() {
    metodo = 'PUT';
    // mensaje = { "titulo": 'Editar categoria', "msj": "La categoria se ha editado exitosamente" };

    id = listaMesas[indexSelected - 1].id;
    nombreMesaB.value = listaMesas[indexSelected - 1].mesa;



}

function eliminarMesa(){
    fetch('http://localhost:3000/api/Mesas/'+listaMesas[indexSelected - 1].id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({}),
    })
    .then(res => res.json())
    .then(datos=>{
        //console.log(datos);
        
        limpiar();
        datosMesa();
        indexSelected = undefined;
        
    })
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