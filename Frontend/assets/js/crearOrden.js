let id = document.querySelector("#idMesaC");
let mesaC = document.querySelector("#cmbMesasC");
let clientes = document.querySelector("#clienteC");
let meseros = document.querySelector("#meseroC");
let tipo = document.querySelector("#opcionesC");
let formaPago = document.querySelector("#pagoC");
let observacion = document.querySelector("#observacion");
let categorias = document.querySelector("#divCategorias");
let tabla = document.querySelector("#tblCrearOrden");
var idCrear, mesa, cliente, mesero;
idCrear=0;
let logueo= false;

let listaUsuarios = [];
let productosOrden = []; //alamacena los productos que existen en la orden
let nuevosProductos = []; //almacena los nuevos prodcutos que se agregaran a la orden
let productos = []; //Lista de todos los productos
let listaCategoria = [];
let listaDias= [];

for (let i = 0; i < 9; i++) {
    listaDias[i] = (i+1);
    
}


document.querySelector("body").onload = comprobarSesion();

function comprobarSesion(){
    console.log(typeof localStorage.getItem("sesion"))
    if(localStorage.getItem("sesion") == "true"){
        ad = document.querySelector("#Administrar");
        es = document.querySelector("#Estadisticas");
        //co = document.querySelector("#cobrar");

        if(localStorage.getItem("Rol") == "M"){
            ad.style.display = "none";
            es.style.display = "none";
            //co.style.display = "none";
        }
    }else{
        console.log("dnfkd")
        location.replace("index.html");
    }
    //aqui
    datos();
}

function cerrarSesion(){
    localStorage.setItem("sesion", false)
    location.replace("index.html");
}
//document.querySelector("#resumen").onload = cargarDatosModal();

function enviar(data1, data2){

}

$("#enviar").on("click", function(event) {
    //$(".modal-body").onload(cargarDatosModal(), function(){
    if (nuevosProductos.length > 0) {
        $("#resumen").modal({ show: true });
        cargarDatosModal();
    }else{
        mostrarAlerta("alert-danger", "No hay prodcutos para enviar");
    }
});


function cargarDatosModal(){

    var formulario= document.getElementById("formularioCrearOrden");
    var datos= new FormData(formulario);

    var id= datos.get("idOrdenC");
    var opt= document.getElementById("cmbMesasC");
    mesa= opt.options[opt.selectedIndex].value;
    cliente= datos.get("clienteC");
    mesero= datos.get("meseroC");

    $('#ordenMC').val(idCrear);
    $('#mesaMC').val(mesa);
    $('#clienteMC').val(cliente);
    $('#meseroMC').val(mesero);
    var tot=0;
    document.getElementById("tblModalResumen").innerHTML = ' ';
    for (let j = 0; j < productos.length; j++) {
        
        for (let i = 0; i < nuevosProductos.length; i++) {
            //console.log(productos[j].id);
            if (productos[j].id == nuevosProductos[i].idproducto) {
                tot=tot+((nuevosProductos[i].cantidad)*(nuevosProductos[i].preciounitario));
                document.getElementById("tblModalResumen").innerHTML += `
                <tr>
                    <td>${productos[j].nombre}</td>
                    <td>${nuevosProductos[i].cantidad}</td>
                    <td>$${nuevosProductos[i].preciounitario}</td>
                    <td>$${(nuevosProductos[i].cantidad)*(nuevosProductos[i].preciounitario)}</td>
                </tr>
                
                `
                ;
            }
            
        
        }
        console.log(nuevosProductos);
        
    }
    
    console.log(tot);

    document.getElementById("modalTotal").innerHTML = '' ;
    document.getElementById("modalTotal").innerHTML += `
        
                <td>$${tot}</td>

            
            `
        ;

   
}


$("#enviarOrd").on("click", function(event) {

    var formulario= document.getElementById("formularioCrearOrden");
    var datos= new FormData(formulario);

    var id= datos.get("idOrdenC");
    var opt= document.getElementById("cmbMesasC");
    mesa= opt.options[opt.selectedIndex].value;
    if(mesa == "null"){
        mesa = null;
    }
    console.log(typeof mesa);
    cliente= datos.get("clienteC");
    mesero= datos.get("meseroC");
    var rcomer= document.getElementById("rbtnComerC").checked;
    var rllevar= document.getElementById("rbtnLlevarC").checked;
    var refectivo= document.getElementById("rbtnEfectivoC").checked;
    var rtarjeta= document.getElementById("rbtnTarjetaC").checked;
    var llevar, formaPago;
    if (rcomer==true) {
        llevar= 0
        //console.log(imprimirP);
    }
    if (rllevar==true) {
        llevar = 1
        //console.log(tiempoR);
    }
    if (refectivo==true) {
        formaPago = "E"
        //console.log(login);
    }
    if (rtarjeta==true) {
        formaPago="T";
    }
    if(mesa == null){
        llevar = 1;
    }
    //var observaciones= datos.get("observacion")
    var observaciones= document.getElementById("observacion").value;
    var estado="";

    if (llevar==1) {
        estado="CP"
        
    }
    if(llevar==0){
        estado="AA"
    }
    
    var fecha= new Date();
    var d;

    for (let i = 0; i < listaDias.length; i++) {
        if (fecha.getUTCDate()==listaDias[i]) {
            d= "0"+fecha.getUTCDate();
            
        }
        
    }
    //console.log(d);
    console.log("fecha "+fecha)
    /* fecha= fecha.getUTCFullYear()+"-"+(fecha.getUTCMonth()+1)+"-"+d; */
    //console.log("fecha "+fecha.getUTCDate())

    var total=0;
    for (let i = 0; i < nuevosProductos.length; i++) {
        total= total + (nuevosProductos[i].cantidad*nuevosProductos[i].preciounitario);
        //console.log(nuevosProductos[i]);
    }
    fetch('http://localhost:3000/api/Ordens', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({"id": idCrear, 
                            "idmesa": mesa,
                            "idusuario": localStorage.getItem("idUsuario"),
                            "fecha": fecha,
                            "llevar": llevar,
                            "estado": estado,
                            "observacion": observaciones,
                            "total": total,
                            "propina": 0,
                            "formapago": formaPago,
                            "cliente": cliente
                        }),
    })
    .then(res => res.json())
    .then(datos=>{
        console.log(datos);
        
        //tablaCategorias();
        
    })

    console.log(nuevosProductos.length);
    var i= idCrear+1;
    var prodd, cantt, precc;
    //console.log(id);
    detalles();
        
});

async function postDetalleOrden(dOrden) {
    try {
        let response = await fetch('http://localhost:3000/api/Detalleordens', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(dOrden)
            
        })
        let data= await response.json();
        return data;
    } catch (error) {
        console.log("error en la llamada api,"+error);
        
    }
}

async function detalles(){


    for (let j = 0; j < nuevosProductos.length; j++) {
        let d = await postDetalleOrden (nuevosProductos[j]);
        console.log("linea "+d);
        
    } 
       
    var suceso= "Creo la orden " + idCrear ;
    guardarBitacoraAccion(suceso);
    imprimir();
    $('#resumen').modal('hide');
    mostrarAlerta("alert-success", "LA ORDEN " + idCrear + " HA SIDO CREADO EXITOSAMENTE");
    
    
    setTimeout(function () {
        location.replace("dashboard.html");
    }, 2000);
}



function datos() {
    meseros.value = localStorage.getItem("Usuario");
    mesas()
    //datosUsuario();
    datosCategoria();
    datosProductos();
    //cargarProductos();
    //datosOrden();
    //datosDetalleOrden();
}

function mesas(){

    var contenido= fetch('http://localhost:3000/api/Mesas')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(mes=>{
                    datosOrdenes(mes)
                });
}

function datosOrdenes(mes){
    let listaPP= [];
    var contenido= fetch('http://localhost:3000/api/Ordens')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(ord=>{
                    listaPP= ord;
                    var n= listaPP.length;
                    if (listaPP.length==0) {
                    idCrear= 1;
                    $('#idOrdenC').val(idCrear);
                    }else{
                        idCrear= listaPP[n-1].id+1;
                        $('#idOrdenC').val(idCrear);
                        
                    }
                    console.log(listaPP[n-1]);
                    console.log(idCrear);
                    crearOrden(ord, mes)
                });
}

function crearOrden(ord, mes){
    console.log(ord);
    console.log(ord.length);
    var me="";
    for(let valor of mes){
        me= me+valor.id;
    }
    var select = document.getElementsByName("cmbMesasC")[0];

    for (value in me) {
        var option = document.createElement("option");
        option.text = me[value];
        select.add(option);
    }


    //cargarProductos();
    $("#rbtnComerC").prop("checked", true);
    $("#rbtnEfectivoC").prop("checked", true);
    
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

function nombreProducto(idProd){
    return function (prod) {
        return prod.id == idProd;
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

//actualiza la cantidad del producto aumentando 1
function aumentar(prod){

    if(nuevosProductos.length > 0){
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        let existe = false; //en caso de que la lista tenga productos pero este no exista en la lista
        for(elementoProd of nuevosProductos){
            if(elementoProd.idproducto == prod.id){
                elementoProd.cantidad += 1
                existe = true; 
                break;
            }
        }
        if(existe == false){
            //si no existe en la lista lo agregamos
            console.log(idCrear+"idorden");
            nuevosProductos.push({"idorden": idCrear, "idproducto": prod.id, "cantidad": 1, "preciounitario": prod.precio});
        }
    }else{
        console.log(idCrear+"idorden");
        //si la lista esta vacia lo agregamos
        nuevosProductos.push({"idorden": idCrear, "idproducto": prod.id, "cantidad": 1, "preciounitario": prod.precio});
    }

    //actualiza la tabla
    cargarProductos(prod.idcategoria);

}

//actualiza la cantidad del producto disminuyendo 1
function disminuir(prod){
    if(nuevosProductos.length > 0){
        //si la lista tiene prodcutos buscamos el producto para actualizar su cantidad
        for (let i = 0; i < nuevosProductos.length; i++) {
            if(nuevosProductos[i].idproducto == prod.id){
                nuevosProductos[i].cantidad -= 1
                if(nuevosProductos[i].cantidad == 0){
                    //si la cantidad del producto despues de actualizarlo es 0 lo eliminamos de la lista
                    nuevosProductos.splice(i,1);
                }
                break;
            }
        }
    }//si la lista esta vacia no se hace nada

    cargarProductos(prod.idcategoria);
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
            if(productos[i].idcategoria == idCategoria){
                tabla.innerHTML += `<tr>
                                        <td>${productos[i].nombre}</td>
                                        <td>$${productos[i].precio}</td>
                                        <td><button class="btn btn-primary btn-tabla" type="button" onclick="disminuir(productos[${i}])">-</button></td>
                                        <td>${cantidad}</td>
                                        <td><button class="btn btn-primary btn-tabla" type="button" onclick="aumentar(productos[${i}]);">+</button></td>
                                    </tr>`
            }
        }
       
    }

}


function mostrarAlerta(tipoAlerta, mensaje) {

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

function guardarBitacoraAccion(suceso){
    console.log("guardar bitacoras");
    var fecha;
    var date1 = new Date();
    fecha= date1.getUTCFullYear()+"-"+date1.getUTCMonth()+"-"+date1.getUTCDate();
    var hora= date1.getHours()+ ":" + date1.getMinutes()+ ":" +date1.getSeconds();

    fetch('http://localhost:3000/api/bitacoras', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(
            {"idUsuario": localStorage.getItem("idUsuario"), 
            "fecha": date1, 
            "suceso": suceso}),
    })
    .then(res => res.json())
    .then(datos=>{
        //console.log(datos);
        
        //tablaCategorias();
        
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
        {"idOrden": localStorage.getItem("idOrden"), "mesa": mesaC.options[mesaC.selectedIndex].value, "cliente": clientes.value, "mesero": meseros.value},
        {"ticket": "Ticket Preparado"},
        {"observacion": observacion.value},
        {"qr": "http://192.168.49.31:80/ResbarWeb/qr.html?O="+localStorage.getItem("idOrden")+"&T=P"});
    datosR.push(
        {"idOrden": localStorage.getItem("idOrden"), "mesa": mesaC.options[mesaC.selectedIndex].value, "cliente": clientes.value, "mesero": meseros.value},
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