let id = 0;
let nombre = document.querySelector('#nombre');
let tabla = document.querySelector('#tblCategoria tbody');

let listaCategorias = [];
let metodo = 'POST';
let indexSelected = undefined;
let mensaje = { "titulo": 'Registrar categoria', "msj": "La categoria se ha registrado exitosamente" };
let logueo = false;

document.querySelector('body').onload = datosCategoria();
document.querySelector('#btnEditar').addEventListener('click', function () { editarCategoria() });
document.querySelector('#btnEliminar').addEventListener('click', function(){eliminarCategoria()});

function datosCategoria() {
    fetch('http://localhost:3000/api/Categoria')
        .then(res => res.json())
        .then(res => {
            listaCategorias = res;
            tabla.innerHTML = "";

            for (cat of listaCategorias) {
                tabla.innerHTML += `<tr>
                                <td>${cat.id}</td>
                                <td>${cat.nombre}</td>
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

function guardarCategoria(event) {
    event.preventDefault();

    let categoria = {
        "id": id,
        "nombre": nombre.value
    }

    fetch('http://localhost:3000/api/Categoria', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: metodo,
        body: JSON.stringify(categoria),
    })
        .then(res => res.json())
        .then(datos => {
            console.log(datos);
            limpiar();
            datosCategoria();
        })
        .catch(function (err) {
            console.log(err);
        });

}

function limpiar() {
    metodo = 'POST'
    mensaje = { "titulo": 'Registrar categoria', "msj": "La categoria se ha registrado exitosamente" };
    id = 0;
    nombre.value = "";
}

function editarCategoria() {
    metodo = 'PUT';
    mensaje = { "titulo": 'Editar categoria', "msj": "La categoria se ha editado exitosamente" };

    id = listaCategorias[indexSelected - 1].id;
    nombre.value = listaCategorias[indexSelected - 1].nombre;

}

function eliminarCategoria(){
    fetch('http://localhost:3000/api/Categoria/'+listaCategorias[indexSelected - 1].id, {
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
        
        datosCategoria();
        
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