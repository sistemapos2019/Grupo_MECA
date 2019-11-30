let id = document.querySelector('#id');
let nombre = document.querySelector('#nombre');
let precio = document.querySelector('#precio');
let invetario = document.querySelector('#inventario');
let idcategoria = document.querySelector('#idcategoria');

let tabla = document.querySelector('#tblProductos tbody');
let listaProductos = [];
let listaCategorias = [];
let indexSelected; 
let metodo = 'POST';
let mensajeAlert = "Producto agregado con exito";
let formProducto = document.querySelector('#registroCompras');
let logueo = false;
formProducto.addEventListener('submit', function(e){guardarProducto(e, metodo, mensajeAlert)}); 
document.querySelector('#btnEditarProducto').addEventListener('click', function(){editarProducto()});
document.querySelector('#btnEliminarProducto').addEventListener('click', function(){eliminarProducto()});
document.querySelector('body').onload = datosCategoria();
document.querySelector('body').onload = datosProducto();


//se encarga de traer los datos desde la bd
function datosProducto(){
    fetch('http://localhost:3000/api/Productos')
        .then(res => res.json())
        .then(res => {
            tablaProductos(res)
        })
}

//se encarga de llenar la tabla con los datos obtenidos
function tablaProductos(res){
    tabla.innerHTML = ""; 
    let preparado = "";
    listaProductos = res;

    for(prod of res){
        if(prod.preparado == 1){
            preparado = "Si";
        }
        else{
            preparado = "No";
        }
        
        tabla.innerHTML += `<tr>
                                <td>${prod.id}</td>
                                <td>${prod.nombre}</td>
                                <td>${prod.precio}</td>
                                <td>${preparado}</td>
                                <td>${listaCategorias.find(buscarCategoria(prod.idcategoria)).nombre}</td>
                             </tr>`;
    }

    selecionarFila();

}

function buscarCategoria(idCat){
    return function(categoria){
        return categoria.id == idCat;
    }
}

function datosCategoria(){
    
    fetch('http://localhost:3000/api/Categoria')
        .then(res => res.json())
        .then(res => {
            listaCategorias = res;
            for(let i = 0; i < listaCategorias.length; i++){
                llenarComboBox(listaCategorias[i].id, listaCategorias[i].nombre)
            }
        })
}

function llenarComboBox(valor, texto){
    let combobox = document.querySelector('select');
    let option = document.createElement('option');
    option.value = valor;
    option.text = texto
    combobox.appendChild(option)
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

//obtendra los datos de la lista de productoa y asignara el valor a cada campo para editar el producto selecionado
function editarProducto(){
    id.value = listaProductos[indexSelected - 1].id;
    nombre.value = listaProductos[indexSelected -1 ].nombre;
    precio.value = listaProductos[indexSelected - 1].precio;
    inventario.value = listaProductos[indexSelected - 1].inventario;

    if(listaProductos[indexSelected - 1].preparado == 1){
        document.querySelector('#formCheck-1').checked = true;
    }else{
        document.querySelector('#formCheck-2').checked = true;
    }

    for(let i = 1; i < idcategoria.length; i++){
        if(listaProductos[indexSelected - 1].idcategoria == idcategoria[i].value){
            idcategoria.selectedIndex = listaProductos[indexSelected - 1].idcategoria;
            break;
        }
    }

    metodo = 'PUT';
    mensajeAlert = "Producto editado exitosamente";

}

//esta funcion se encarga de registrar y modificar un producto
function guardarProducto(e, metodo, mensajeAlert){
    e.preventDefault();
    
    let preparado;
    if(document.querySelector('#formCheck-1').checked){
        preparado = 1;
    }else{
        preparado = 0;
    }

    let idCat = idcategoria[idcategoria.selectedIndex].value;

    let data = {
        "id": parseInt(id.value),
        "nombre": nombre.value,
        "precio": parseFloat(precio.value),
        "inventario": parseInt(invetario.value),
        "preparado": preparado,
        "idcategoria": parseInt(idCat)
      };

    fetch('http://localhost:3000/api/Productos', {
        method: metodo,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
     })
        .then(function(response) {
            if(response.ok) {
                return response.text()
            } else {
                console.log(response.status);
                throw "Error en la llamada Ajax codigo de respuesta" +response.code;
            }
     
        })
        .then(function(texto) {
            console.log(texto);
            alert(mensajeAlert);
            formProducto.reset();
            metodo = 'POST';
            mensajeAlert = "Producto agregado con exito";
            datosProducto();
         })
        .catch(function(err) {
            console.log(err);
        });
}

//se encargara de eliminar un producto
function eliminarProducto(){
    
    if(indexSelected !== undefined){
        fetch('http://localhost:3000/api/Productos/'+listaProductos[indexSelected - 1].id,{
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
                datosProducto();
                alert('Producto borrado');
            })
            .catch(function(err) {
                console.log(err);
            });
    }else{
        alert('Antes tiene que selecionar un Producto');
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