
let id = document.querySelector("#id");
let mesa = document.querySelector("#idMesa");
let cliente = document.querySelector("#cliente");
let mesero = document.querySelector("#idUsuario");
let observacion = document.querySelector("#observacion")
let tabla = document.querySelector("#tblProductos tbody");

let listaUsuarios = [];
let productosOrden = []; //alamacena los productos que existen en la orden
let productosResumen = [] //estatica
let nuevosProductos = []; //almacena los nuevos prodcutos que se agregaran a la orden
let productos = []; //Lista de todos los productos
let mesas = [];
let indexSelected = undefined;
let logueo = false;

document.querySelector('#eliminar').addEventListener('click', function(){
    if(indexSelected != undefined){
        $('#modalEliminar').modal('show');
    }else{
        mostrarAlerta("alert-danger", "No hay ningun producto seleccionado en la lista");
    }
});
document.querySelector('#aceptar').addEventListener('click', function(){$('#resumen').modal('show');});
$('#resumen').on('show.bs.modal', function () { cargarResumen() });
$('#modalEliminar').on('show.bs.modal', function () { cargarEliminar() });

function comprobarSesion(){
    if(localStorage.getItem("sesion") == "true"){
        ad = document.querySelector("#Administrar");
        es = document.querySelector("#Estadisticas");

        if(localStorage.getItem("Rol") == "M"){
            ad.style.display = "none";
            es.style.display = "none";
        }
        cargarDatos();
    }else{
        location.replace("index.html");
    }
}

function cerrarSesion(){
    localStorage.setItem("sesion", false)
    location.replace("index.html");
}

async function cargarDatos() {
    await cargarMesas();
    await cargarOrden();
    productos = await getProductos();
    productosOrden = await getDetalleOrden();
    productosResumen = await getDetalleOrden();
    for (let i = 0; i < productosResumen.length; i++) {
        nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": productosResumen[i].idproducto, "cantidad": 0, "preciounitario": productosResumen[i].preciounitario });
    }
    cargarTabla();
}

async function cargarMesas(){
    mesas = await getMesa();

    for (let i = 0; i < mesas.length; i++) {
        let options = document.createElement('option');
        options.value = mesas[i].id;
        options.text = mesas[i].mesa;
        mesa.appendChild(options)
    }

    listaUsuarios = await getUsuario();
}

async function cargarOrden(){
    let orden = await getOrden();
    id.value = orden.id;
    mesa.value = orden.idmesa;
    cliente.value = orden.cliente;
    mesero.value = listaUsuarios.find(buscarUsuario(orden.idusuario)).nombrecompleto;
    if (orden.llevar == 0) {
        document.querySelector("#tipo-1").checked = true;
    } else {
        document.querySelector("#tipo-2").checked = true;
    }
    if (orden.formapago == "E") {
        document.querySelector("#pago-1").checked = true;
    } else {
        document.querySelector("#pago-2").checked = true;
    }
    observacion.value = orden.observacion;
}

async function cargarTabla(){
    tabla.innerHTML = "";

    for (let i = 0; i < productosOrden.length; i++) {
        tabla.innerHTML += `<tr>
                                <td>${productos.find(nombreProducto(productosOrden[i].idproducto)).nombre}</td>
                                <td>${productosOrden[i].preciounitario}</td>
                                <td><button class="btn btn-primary btn-tabla" type="button" onclick="disminuir(productosOrden[${i}])">-</button></td>
                                <td>${productosOrden[i].cantidad}</td>
                                <td><button class="btn btn-primary btn-tabla" type="button" onclick="aumentar(productosOrden[${i}])">+</button></td>
                            </tr>`
    }

    selecionarFila();
}

//carga una lista de usuarios
async function getUsuario() {
    try {
        let response = await fetch('http://localhost:3000/api/Usuarios');
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la función getUsuarios(), "*error);
    }
}

//carga las categorias
async function getMesa() {
    try {
        let response = await fetch('http://localhost:3000/api/Mesas');
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la función getCategoria, "+error);
    }
}

//carga todos los productos
async function getProductos() {
    try {
        let response = await fetch('http://localhost:3000/api/Productos');
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la funcion getProductos, "+error)
    }
}

//carga los datos de la orden id, mesero, cliente, mesa etc
async function getOrden() {
    try {
        let response = await fetch('http://localhost:3000/api/Ordens/' + localStorage.getItem("idOrden"));
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la función getOrden, "+error);
    }
}

//busca el nombre de usuario atra vez de un id
function buscarUsuario(idUser) {
    return function (usuario) {
        return usuario.id == idUser;
    }
}

//carga los productos que se han pedido en la orden
async function getDetalleOrden() {
    try {
        let response = await fetch('http://localhost:3000/api/Detalleordens?filter[where][idorden]=' + localStorage.getItem("idOrden"));
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la función getDetalleOrden(), "+error)
    }
}

//actualiza la cantidad del producto disminuyendo 1
function disminuir(prod) {
    if (nuevosProductos.length > 0) {
        let existe = false;
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        for (let i = 0; i < nuevosProductos.length; i++) {
            if (nuevosProductos[i].idproducto == prod.idproducto) {
                nuevosProductos[i].cantidad -= 1
                existe = true;
                break;
            }
        }
        if(existe == false){
            nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.idproducto, "cantidad": -1, "preciounitario": prod.preciounitario });
        }
    }else{
        nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.idproducto, "cantidad": -1, "preciounitario": prod.preciounitario });
    }

    for (let i = 0; i < productosOrden.length; i++) {
        if (productosOrden[i].idproducto == prod.idproducto) {
            productosOrden[i].cantidad -= 1;
            if (productosOrden[i].cantidad == 0) {
                //si la cantidad del producto despues de actualizarlo es 0 lo eliminamos de la lista
                productosOrden.splice(i, 1);
            }
            break;
        }
    }

    cargarTabla();
}

//actualiza la cantidad del producto aumentando 1
function aumentar(prod) {
    if (nuevosProductos.length > 0) {
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        let existe = false; //en caso de que la lista tenga productos pero este no exista en la lista
        
        for (elementoProd of nuevosProductos) {
            if (elementoProd.idproducto == prod.idproducto) {
                elementoProd.cantidad += 1
                existe = true;
                break;
            }
        }
        if (existe == false) {
            //si no existe en la lista lo agregamos
            nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.idproducto, "cantidad": 1, "preciounitario": prod.preciounitario });
        }
    } else {
        //si la lista esta vacia lo agregamos
        nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.idproducto, "cantidad": 1, "preciounitario": prod.preciounitario });
    }
    for(elementoProd of productosOrden){
        if (elementoProd.idproducto == prod.idproducto) {
            elementoProd.cantidad += 1;
            break;
        }
    }
    //actualiza la tabla
    cargarTabla();

}

function nombreProducto(idProd) {
    return function (prod) {
        return prod.id == idProd;
    }
}

function cargarResumen() {
    let tablaResumen = document.querySelector('#tblResumen tbody');
    let total = 0;

    document.querySelector('#idOrdenModal').innerHTML = id.value;
    document.querySelector('#mesaModal').innerHTML = mesa.value;
    document.querySelector('#clienteModal').innerHTML = cliente.value;
    document.querySelector('#meseroModal').innerHTML = mesero.value;


    tablaResumen.innerHTML = "";
    for (let index = 0; index < productosResumen.length; index++) {
        let nuevaCantidad = "";
        let cantidad = 0;
        for (let i = 0; i < nuevosProductos.length; i++) {
            if(productosResumen[index].idproducto == nuevosProductos[i].idproducto){
                if(nuevosProductos[i].cantidad != 0){
                    let signo = "";
                    if(nuevosProductos[i].cantidad > 0){
                        signo = "+";
                    }
                    //nuevaCantidad = signo +" "+Math.abs(nuevosProductos[i].cantidad);
                    nuevaCantidad = "("+signo+nuevosProductos[i].cantidad+")";
                    cantidad = nuevosProductos[i].cantidad;
                }
            }
        }
        tablaResumen.innerHTML += `<tr>
                                <td>${productos.find(nombreProducto(productosResumen[index].idproducto)).nombre}</td>
                                <td>${productosResumen[index].cantidad} ${nuevaCantidad}</td>
                                <td>${productosResumen[index].preciounitario}</td>
                                <td>${(productosResumen[index].preciounitario) * (productosResumen[index].cantidad+cantidad)}</td>
                            </tr>`

    }
    for (let i = 0; i < productosOrden.length; i++) {
        total += ((productosOrden[i].preciounitario) * (productosOrden[i].cantidad));
    }
    document.querySelector('#total').innerHTML = total;
}

async function enviarOrden() {
    for (let index = 0; index < nuevosProductos.length; index++) {
        nuevosProductos[index].cantidad = productosResumen[index].cantidad + nuevosProductos[index].cantidad;
        if(nuevosProductos[index].cantidad == 0){
            
            let e = await deleteDetalleOrden(localStorage.getItem("idOrden"), nuevosProductos[index].idproducto);
            console.log(e);
        }else{
            await putDetalleOrden(nuevosProductos[index]);
        }
    }

    
    //imprimir();
    nuevosProductos = [];
    productosOrden = [];
    //cargarDatos();
    $('#resumen').modal('hide');
    mostrarAlerta("alert-success", "Se ha realizado la operación exito");
    setTimeout(function () {
        location.replace("dashboard.html");
    }, 2000);
}

async function mostrarAlerta(tipoAlerta, mensaje) {

    if(tipoAlerta == "alert-success"){
        document.querySelector('#alert').classList.remove('alert-danger');
        document.querySelector('#alert').classList.add('alert-success');
    }else{
        document.querySelector('#alert').classList.remove('alert-success');
        document.querySelector('#alert').classList.add('alert-danger');
    }

    document.querySelector('#texto').innerHTML = mensaje;

    $("#alert").show('fade');
    setTimeout(function () {
        $("#alert").hide('fade');
    }, 2000);
}

function cerrarAlerta() {
    $('#alert').hide('fade');
}

async function imprimir(){
    let preparado = false;
    let rapido = false;
    let productosP = [];
    let productosR = [];
    let datosP = [];
    let datosR = [];

    for (let index = 0; index < nuevosProductos.length; index++) {
        if(productoPreparado(nuevosProductos[index].idproducto) == true && nuevosProductos[index].cantidad > 0){
            productosP.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": nuevosProductos[index].cantidad});
            preparado = true;
        }else if((nuevosProductos[index].idproducto) == false && nuevosProductos[index].cantidad > 0){
            productosR.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": nuevosProductos[index].cantidad});
            rapido  = true;
        }
    }

    datosP.push(
        {"idOrden": id.innerHTML, "mesa": mesa.innerHTML, "cliente": cliente.innerHTML, "mesero": mesero.innerHTML},
        {"ticket": "Ticket Preparado"},
        {"observacion": observacion.value},
        {"qr": "http://192.168.49.31:80/ResbarWeb/qr.html?O="+localStorage.getItem("idOrden")+"&T=P"});
    datosR.push(
        {"idOrden": id.innerHTML, "mesa": mesa.innerHTML, "cliente": cliente.innerHTML, "mesero": mesero.innerHTML},
        {"ticket": "Ticket Rápido"},
        {"observacion": ""},
        {"qr": "http://192.168.49.31:80/ResbarWeb/qr.html?O="+localStorage.getItem("idOrden")+"&T=R"});

    let dataP = JSON.stringify([{"Productos": productosP}, {"datos": datosP}]);
    let dataR = JSON.stringify([{"Productos": productosR}, {"datos": datosR}]);

    if(localStorage.getItem("ticketPreparado").toLowerCase() === "si" && preparado == true){
        ticket(dataP);
    }
    if(localStorage.getItem("ticketRapido").toLowerCase() === "si" && rapido == true){
        ticket(dataR);
    }

}

async function ticket(data){
    try {
        let response = /* await */ $.ajax({
                                "method": "POST",
                                "url": "http://localhost:80/imprimir/ticket.php",
                                "data": {"json": data}
                            });

        //let info = await response.json();
        return response
    } catch (error) {
        console.log("Error: "+ error)
    }
}


function productoPreparado(idProd){
    let preparado = false;
    for (let i = 0; i < productos.length; i++) {
        if(idProd == productos[i].id){
            if(productos[i].preparado == 1){
                preparado = true;
                break;
            }
        }
    }
    console.log(preparado);
    return preparado;
}

async function putDetalleOrden(detalleOrden){
    try {
        let response = await fetch('http://localhost:3000/api/Detalleordens', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(detalleOrden),
            });
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la llamada de la api ,"+error)
    }
}

async function deleteDetalleOrden(idOrden, idProd){
    try {
        let data = JSON.stringify({"idOrden": idOrden, "idProducto": idProd});
        let response = await $.ajax({
                                "method": "POST",
                                "url": "http://localhost:80/imprimir/delete.php",
                                "data": {"json": data}
                            });

        //let info = await response.json();
        return response
    } catch (error) {
        console.log("Error: "+ error)
    }

}

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

function cargarEliminar(){
    document.querySelector("#prod").innerHTML = productos.find(nombreProducto(productosOrden[indexSelected-1].idproducto)).nombre;
}

function eliminar(){
    
    for (let i = 0; i < nuevosProductos.length; i++) {
        if(nuevosProductos[i].idproducto == productosOrden[indexSelected-1].idproducto){
            nuevosProductos[i].cantidad = productosResumen[i].cantidad * - 1;
        }
    }

    productosOrden.splice(indexSelected-1, 1);
    cargarTabla();
    $("#modalEliminar").modal("hide");
    indexSelected = undefined;
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

document.querySelector("body").onload = comprobarSesion();