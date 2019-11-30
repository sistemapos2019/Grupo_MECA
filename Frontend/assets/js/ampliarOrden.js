let id = document.querySelector("#id");
let mesa = document.querySelector("#idMesa");
let cliente = document.querySelector("#cliente");
let mesero = document.querySelector("#idUsuario");
let tipo = document.querySelector("#llevar");
let formaPago = document.querySelector("#formaPago");
let observacion = document.querySelector("#observacion");
let categorias = document.querySelector("#grupoCat");
let tabla = document.querySelector("#tblProductos tbody");
let logueo = false;

let listaUsuarios = [];
let productosOrden = []; //alamacena los productos que existen en la orden
let nuevosProductos = []; //almacena los nuevos prodcutos que se agregaran a la orden
let productos = []; //Lista de todos los productos
let listaCategoria = [];

document.querySelector('#aceptar').addEventListener('click', function(){
    if(nuevosProductos.length > 0){
        $('#resumen').modal('show');
    }else{
        mostrarAlerta("alert-danger", "No hay productos agregados en la lista");
    }
});
$('#resumen').on('show.bs.modal', function () { cargarResumen() });

function datos() {
    datosUsuario();
    datosCategoria();
    datosProductos();
    datosOrden();
    datosDetalleOrden();
}

//carga una lista de usuarios
function datosUsuario() {
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
        })
        .catch(function (err) {
            console.log(err);
        });
}

//carga las categorias
function datosCategoria() {
    fetch('http://localhost:3000/api/Categoria')
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            listaCategoria = res;

            categorias.innerHTML = "";

            for (cat of res) {
                //se le agrega el evento onclick con el metodo cargarProductos y se le pasa como parametro el id de la categoria para filtrar los productos
                categorias.innerHTML += `<button class="btn btn-primary" type="button" onclick="cargarProductos(${cat.id})">${cat.nombre}</button>`
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

//carga todos los productos
function datosProductos() {
    fetch('http://localhost:3000/api/Productos')
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            productos = res;
        })
        .catch(function (err) {
            console.log(err);
        });
}

//carga los datos de la orden id, mesero, cliente, mesa etc
function datosOrden() {
    fetch('http://localhost:3000/api/Ordens/' + localStorage.getItem("idOrden"))
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            id.innerHTML = res.id;
            mesa.innerHTML = res.idmesa;
            cliente.innerHTML = res.cliente;
            mesero.innerHTML = listaUsuarios.find(buscarUsuario(res.idusuario)).nombrecompleto;
            if (res.llevar == 0) {
                tipo.innerHTML = "Comer aqui";
            } else {
                tipo.innerHTML = "Llevar";
            }
            if (res.formapago == "E") {
                formaPago.innerHTML = "Efectivo";
            } else {
                formaPago.innerHTML = "Tarjeta de credito";
            }
            observacion.value = res.observacion;
        })
        .catch(function (err) {
            console.log(err);
        });
}

//busca el nombre de usuario atra vez de un id
function buscarUsuario(idUser) {
    return function (usuario) {
        return usuario.id == idUser;
    }
}

//carga los productos que se han pedido en la orden
function datosDetalleOrden() {
    fetch('http://localhost:3000/api/Detalleordens?filter[where][idorden]=' + localStorage.getItem("idOrden"))
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw "Error en la llamada Ajax, estado " + response.code;
            }

        })
        .then(res => {
            productosOrden = res;
            cargarProductos(1);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function cargarProductos(idCategoria) {
    tabla.innerHTML = ""

    //se recorre la lista de todos los productos
    for (let i = 0; i < productos.length; i++) {
        //si el producto existe en la orden no se mostrara en la tabla
        if (productosExistentes(productos[i].id) == false) {
            let cantidad = 0;
            //si el producto no existe en la lista productosOrden se verifica la lista nuevosProductos tengan productos
            for (let j = 0; j < nuevosProductos.length; j++) {
                //si el la lista de los nuevos productos tiene datos se busca el producto especifico y guardamos su cantidad para reflejarlo en la tabla
                if (productos[i].id == nuevosProductos[j].idproducto) {
                    cantidad = nuevosProductos[j].cantidad;
                    break;
                }
            }

            //filtra los productos a mostrar en la tabla por categoria
            if (productos[i].idcategoria == idCategoria) {
                tabla.innerHTML += `<tr>
                                        <td>${productos[i].nombre}</td>
                                        <td>${productos[i].precio}</td>
                                        <td><button class="btn btn-primary btn-tabla" type="button" onclick="disminuir(productos[${i}])">-</button></td>
                                        <td>${cantidad}</td>
                                        <td><button class="btn btn-primary btn-tabla" type="button" onclick="aumentar(productos[${i}]);">+</button></td>
                                    </tr>`
            }
        }
    }

}

//verifica si el producto existe en la onden del cliente
function productosExistentes(idProducto) {
    let existe = false;

    for (prod of productosOrden) {
        if (prod.idproducto == idProducto) {
            existe = true;
            break;
        }
    }

    return existe;
}

//actualiza la cantidad del producto disminuyendo 1
function disminuir(prod) {
    if (nuevosProductos.length > 0) {
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        for (let i = 0; i < nuevosProductos.length; i++) {
            if (nuevosProductos[i].idproducto == prod.id) {
                nuevosProductos[i].cantidad -= 1
                if (nuevosProductos[i].cantidad == 0) {
                    //si la cantidad del producto despues de actualizarlo es 0 lo eliminamos de la lista
                    nuevosProductos.splice(i, 1);
                }
                break;
            }
        }
    }//si la lista esta vacia no se hace nada

    cargarProductos(prod.idcategoria);
}

//actualiza la cantidad del producto aumentando 1
function aumentar(prod) {

    if (nuevosProductos.length > 0) {
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        let existe = false; //en caso de que la lista tenga productos pero este no exista en la lista
        for (elementoProd of nuevosProductos) {
            if (elementoProd.idproducto == prod.id) {
                elementoProd.cantidad += 1
                existe = true;
                break;
            }
        }
        if (existe == false) {
            //si no existe en la lista lo agregamos
            nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.id, "cantidad": 1, "preciounitario": prod.precio });
        }
    } else {
        //si la lista esta vacia lo agregamos
        nuevosProductos.push({ "idorden": localStorage.getItem("idOrden"), "idproducto": prod.id, "cantidad": 1, "preciounitario": prod.precio });
    }

    //actualiza la tabla
    cargarProductos(prod.idcategoria);

}

function nombreProducto(idProd) {
    return function (prod) {
        return prod.id == idProd;
    }
}

function cargarResumen() {
    let tablaResumen = document.querySelector('#tblResumen tbody');
    let total = 0;

    document.querySelector('#idOrdenModal').innerHTML = id.innerHTML;
    document.querySelector('#mesaModal').innerHTML = mesa.innerHTML;
    document.querySelector('#clienteModal').innerHTML = cliente.innerHTML;
    document.querySelector('#meseroModal').innerHTML = mesero.innerHTML;


    tablaResumen.innerHTML = "";
    for (let index = 0; index < nuevosProductos.length; index++) {
        tablaResumen.innerHTML += `<tr>
                                <td>${productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre}</td>
                                <td>${nuevosProductos[index].cantidad}</td>
                                <td>${nuevosProductos[index].preciounitario}</td>
                                <td>${(nuevosProductos[index].preciounitario) * (nuevosProductos[index].cantidad)}</td>
                            </tr>`

        total += ((nuevosProductos[index].preciounitario) * (nuevosProductos[index].cantidad));
    }
    document.querySelector('#total').innerHTML = total;
}

async function enviarOrden() {
    for (let index = 0; index < nuevosProductos.length; index++) {
        let d = await putDetalleOrden(nuevosProductos[index]);
        console.log(d);
    }

    imprimir();
    nuevosProductos = [];
    productosOrden = [];
    //datosDetalleOrden();
    $('#resumen').modal('hide');
    mostrarAlerta("alert-success", "Se ha realizado la operación con exito");    
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
    setTimeout( async function () {
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
        if(productoPreparado(nuevosProductos[index].idproducto) == true){
            productosP.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": nuevosProductos[index].cantidad});
            preparado = true;
        }else{
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
        let e = await ticket(dataP);
        console.log(e);
    }
    if(localStorage.getItem("ticketRapido").toLowerCase() === "si" && rapido == true){
        let c = await ticket(dataR);
        console.log(c);
    }

}

async function ticket(data){
    try {
        let response = await $.ajax({
                                "method": "POST",
                                "url": "http://localhost:80/imprimir/ticket.php",
                                "data": {"json": data}
                            });

        //let info = await response.json();
        return response;
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
    console.log(detalleOrden);
    try {
        let response = await fetch('http://localhost:3000/api/Detalleordens', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(detalleOrden),
            });
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en la llamada de la api ,"+error)
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
    if(verificarUsuario(listaUsuarios)){
        if(verificarPass(listaUsuarios)){
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

document.querySelector("body").onload = datos();