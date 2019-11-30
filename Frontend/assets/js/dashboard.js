var id, idMesa, mesero, cliente, total, rapido, preparado;
let indexSelected = undefined;
let listaOrdenesActivas= [];
let listaOrdenesLlevar = [];
let listaOrdenes = [];
let listaResumen= [];
let listaRes= [];
var propinaCo=0;
var totalCambio=0;
var totaltt;
let logueo = false;
let tabla = document.querySelector("#tblOrdenesActivas tbody");
let productos = [];
let nuevosProd = [];

document.querySelector("body").onload = comprobarSesion();

function comprobarSesion() {
    if (localStorage.getItem("sesion") == "true") {
        ad = document.querySelector("#Administrar");
        es = document.querySelector("#Estadisticas");
        co = document.querySelector("#cobrar");

        if (localStorage.getItem("Rol") == "M") {
            ad.style.display = "none";
            es.style.display = "none";
            co.style.display = "none";
        }
    } else {
        location.replace("index.html");
    }
    //aqui

    datosOrdenes();
}

function cerrarSesion() {
    localStorage.setItem("sesion", false);
    window.location.reload();
}


function datosOrdenes() {

    var contenido = fetch('http://localhost:3000/api/dashboardprincipal')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos => {
            listaOrdenes = datos;
            for (let i = 0; i < listaOrdenes.length; i++) {
                if(listaOrdenes[i].Estado == 'AA'){
                    listaOrdenesActivas.push(listaOrdenes[i]);
                    console.log("AA")
                }else{
                    listaOrdenesLlevar.push(listaOrdenes[i]);
                    console.log("CP")
                }
            };
            tablaOrdenesA();
        });

    var contenido = fetch('http://localhost:3000/api/Ordens')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(dat => {
            listaRes = dat;
        });
}


function tablaOrdenesA() {
    //console.log(datos);
    //listaOrdenesActivas = datos;
    tabla.innerHTML = "";

    for (let k = 0; k < listaOrdenesActivas.length; k++) {
        //if ((listaOrdenesActivas[k].Estado == 'AA')) {
            var clasePreparado = listaOrdenesActivas[k].Preparado;
            var claseRapido = listaOrdenesActivas[k].Rapido;

            tabla.innerHTML += `
                <tr>
                    <td>${listaOrdenesActivas[k].idOrden}</td>
                    <td>${listaOrdenesActivas[k].Mesa}</td>
                    <td>${listaOrdenesActivas[k].Mesero}</td>
                    <td>${listaOrdenesActivas[k].Cliente}</td>
                    <td>$${listaOrdenesActivas[k].Total}</td>
                    <td class="${claseRapido}"><i class = "fas fa-circle"></i></td>
                    <td class="${clasePreparado}"><i class = "fas fa-circle"></i></td>
                </tr>`;
        //}
    }
    selecionarFila();
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

//Filtrado jQuery
$("#searchFiltro").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tblOrdenesActivas tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

function crearOrden(){
    if(localStorage.getItem("loginPantalla") == 1){
        $("#credencial").modal("show");
        $('#credencial').on('hidden.bs.modal', function (e) {
            if(logueo == true){
                window.location.href  = "crearOrden.html";
            }
         })
    }else{
        window.location.href  = "crearOrden.html";
    }
}

function ampliarOrden(){
    if(indexSelected != undefined){
        guardarId();
        if(localStorage.getItem("loginPantalla") == 1){
            $("#credencial").modal("show");
            $('#credencial').on('hidden.bs.modal', function (e) {
                if(logueo == true){
                    window.location.href  = "ampliarOrden.html";
                }
             })
        }else{
            window.location.href  = "ampliarOrden.html";
        }
    }else{
        alert("error");
    }
}

function modificarOrden(){
    if(indexSelected != undefined){
        guardarId();
        if(localStorage.getItem("loginPantalla") == 1){
            $("#credencial").modal("show");
            $('#credencial').on('hidden.bs.modal', function (e) {
                if(logueo == true){
                    window.location.href  = "modificarOrden.html";
                }
             })
        }else{
            window.location.href  = "modificarOrden.html";
        }
    }else{
        alert("error");
    }
}

/* function cobrarOrden(){
    if(indexSelected != undefined){
        guardarId();
        if(localStorage.getItem("loginPantalla") == 1){
            $("#credencial").modal("show");
            $('#credencial').on('hidden.bs.modal', function (e) {
                if(logueo == true){
                    $("#modalCobrar").modal("show");
                    logueo = false;
                };
             })
        }else{
            $("#modalCobrar").modal("show");
        }
    }else{
        alert("error");
    }
} */

function cobrarOrden(){
    if(indexSelected != undefined){
        guardarId();
        if(localStorage.getItem("loginPantalla") == 1){
            $("#credencial").modal("show");
            $('#credencial').on('hidden.bs.modal', function (e) {
                if(logueo == true){
                    $("#cobrarOrden").modal("show");
                    parametros();
                    logueo = false;
                };
             })
        }else{
            $("#cobrarOrden").modal("show");
            parametros();
        }
    }else{
        alert("error");
    }
}

function parametros() {
    var contenido = fetch('http://localhost:3000/api/parametros')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos => {
            parametroPropina(datos)
        });
}

function parametroPropina(datos){
    if (datos[12].id==13) {
        var str= datos[12].valor;
        var separador= "%";
        var array= str.split(separador);
        console.log(listaOrdenesActivas);
        console.log(array[0]);
        
        var pos=0;
        //listaResumen= listaOrdenesActivas;
        for(k=0; k< listaOrdenesActivas.length; k++){
            if (listaOrdenesActivas[k].Estado=='AA') {
                listaResumen[pos]= listaOrdenesActivas[k];
                pos=pos+1;
                
            }

        }
        //console.log(listaResumen);
        propinaCo= listaResumen[indexSelected-1].Total* (array[0]/100);

        $('#idOrdenCo').val(listaResumen[indexSelected-1].id);
        $('#subtotalCo').val(listaResumen[indexSelected-1].Total.toFixed(2));
        $('#propinaCo').val(propinaCo.toFixed(2));
        
        totaltt= listaResumen[indexSelected-1].Total.toFixed(2);
        //$('#cambioCo').val();
        totalCambio= propinaCo+listaResumen[indexSelected-1].Total;
        $('#totalResumen').val(totalCambio.toFixed(2));
        
        detalles();
        
    }
}
function detalles(){
    var contenido= fetch('http://localhost:3000/api/Detalleordens')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(data=>{
                    var contenido= fetch('http://localhost:3000/api/Productos')//le paso la url para ir a traer los datos de la api
                        .then(res => res.json())
                        .then(data2=>{
                            productos = data2;
                            cargarModalDetalles(data,data2)
                        });
                //cargarModalDetalles(data)
                });
}

function cargarModalDetalles(data,data2){
    console.log(data2);
    var tt=0;
    document.getElementById("tblResumenCobrar").innerHTML= " ";
    for (let w = 0; w < data.length; w++) {
        if ((data[w].idorden)==(listaResumen[indexSelected-1].id)) {
            var nombreProd=" ";
            for (let q = 0; q < data2.length; q++) {
                if (data[w].idproducto == data2[q].id) {
                    nombreProd= data2[q].nombre;
                
                }
                
            }
            
            document.getElementById("tblResumenCobrar").innerHTML += `
            <tr>
                <td>${nombreProd}</td>
                <td>${data[w].cantidad}</td>
                <td>${data[w].preciounitario}</td>
                <td>${((data[w].cantidad)*(data[w].preciounitario)).toFixed(2)}</td>
            </tr>
                
            `
            ;

            nuevosProd.push({"nombre": nombreProd, "cantidad": data[w].cantidad, "pu": "$"+data[w].preciounitario, "subtotal": "$"+((data[w].cantidad)*(data[w].preciounitario)).toFixed(2) });
        }
        
    }

    document.getElementById("modalTotalResumen").innerHTML = totaltt;
    

   
}

$("#okCobrarOrden").on("click", function(event) {
    //$(".modal-body").onload(cargarDatosModal(), function(){
        $("#cobrarOrden").modal("hide");   
        $("#cambioCobrar").modal("show");
        cambio();
        /*for (let i = 0; i < nuevosProductos.length; i++) {
            console.log(nuevosProductos[i]);
        } */
});

function cambio(){
    $('#totalCambio').val(totalCambio.toFixed(2));

}

$("#cambioOrdenM").on("click", function(event) {
    console.log("hahahhaha");
    var efec="";
    efec= document.getElementById("efectivoCambio").value;
    console.log(efec);
    var tt= 0;
    if (efec>=totalCambio) {
        tt=efec-totalCambio;
        console.log(tt);
        $('#cambioCambio').val(tt.toFixed(2));
        $("#cobrarOrdenM").removeAttr( "disabled" );
        $("#cobrarOrdenM").attr("enabled");
    }else{
        alert("no alcanza");
    }
    
    
    

});

$("#cobrarOrdenM").on("click", function(event) {
    console.log(listaRes);
    console.log( $('#cambioCambio').val());
    for (let r = 0; r < listaRes.length; r++) {
        if (listaRes[r].id == listaResumen[indexSelected-1].id) {

            var id=0;
    id= listaResumen[indexSelected-1].id;
    url= 'http://localhost:3000/api/Ordens/';
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            
            "id": listaRes[r].id,
            "idmesa":listaRes[r].idmesa,
            "idusuario": listaRes[r].idusuario,
            "fecha": listaRes[r].fecha,
            "llevar": listaRes[r].llevar,
            "estado": "CC",
            "observacion": listaRes[r].observacion,
            "tiempopreparado": null,
            "tiemporapido": null,
            "total": totalCambio,
            "propina": propinaCo,
            "formapago": listaRes[r].formapago,
            "cliente": listaRes[r].cliente
          }),
    })
    .then(res => res.json())
    .then(datos=>{
        imprimir(listaRes[r]);
        setTimeout(function(){
            location.replace("dashboard.html");
        }, 2000);
        
        //tablaCategorias();
        
    })
            
        }
        
    }
});

//min codigo
function facturaCobro(){
    if(indexSelected != undefined){
        guardarId();
        if(localStorage.getItem("loginPantalla") == 1){
            $("#credencial").modal("show");
            $('#credencial').on('hidden.bs.modal', function (e) {
                if(logueo == true){
                    factura();
                };
             })
        }else{
            factura();
        }

        //codigo
    }else{
        alert("error");
    }
}

function factura(){
    nuevosProd = [];
    let propina = 0;
    let d = [];
    var contenido = fetch('http://localhost:3000/api/parametros')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos => {
            var str = datos[12].valor;
            var separador = "%";
            var array = str.split(separador);
            propina = array[1];
        });

    var contenido = fetch('http://localhost:3000/api/Detalleordens')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(data => {
            d = data;
            var contenido = fetch('http://localhost:3000/api/Productos')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(data2 => {
                    productos = data2;

                    for (let i = 0; i < d.length; i++) {
                        if(listaOrdenesActivas[indexSelected-1].id == d[i].idOrden){
                            for (let q = 0; q < productos.length; q++) {
                                if (d[i].idproducto == productos[q].id) {
                                    nombreProd= productos[q].nombre;
                                
                                }
                                
                            }
                            nuevosProd.push({"nombre": nombreProd, "cantidad": d[i].cantidad, "pu": "$"+d[i].preciounitario, "subtotal": "$"+((d[i].cantidad)*(d[i].preciounitario)).toFixed(2) });
                        }
                    }
                    imprimir(listaOrdenesActivas[indexSelected-1]);
                });
            //cargarModalDetalles(data)
        });
    

}

//fin codigo

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

//fin logueo

function guardarId() {
    localStorage.setItem("idOrden", listaOrdenesActivas[indexSelected-1].id);

};


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

//refresca la pagina
/* $(document).ready(function()
    {
       $("#tblOrd").contextmenu({
       delegate: ".RightClickMenu",
       menu: [
          {title: "Add", action: function(event, ui) {
         // Do something
      }},
      {title: "----"},
      {title: "Refresh", action: function(event, ui) {
         // Do something
      }}
     ]
   });
});

function redirigir(){
    location.replace("dashboardLlevar.html");
} */

async function imprimir(orden){
    /* let preparado = false;
    let rapido = false;
    let productosP = [];
    let productosR = [];
    let datosP = [];
    let datosR = []; */
    let datos = [];

    //productosP.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": listaResumen[index].cantidad});
    /* for (let index = 0; index < nuevosProductos.length; index++) {
        if(productoPreparado(nuevosProductos[index].idproducto) == true){
            productosP.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": nuevosProductos[index].cantidad});
            preparado = true;
        }else{
            productosR.push({"nombre": productos.find(nombreProducto(nuevosProductos[index].idproducto)).nombre, "cantidad": nuevosProductos[index].cantidad});
            rapido  = true;
        }
    } */
    console.log(nuevosProd);

    datos.push(
        {"empresa": localStorage.getItem("empresa"), "fecha": orden.fecha, "cliente": orden.cliente, "mesero": localStorage.getItem("Usuario"), "direccion": localStorage.getItem("direccion"), "total": orden.total},
        {"ticket": ""});
   /*  datosR.push(
        {"idOrden": localStorage.getItem("idOrden"), "mesa": mesaC.options[mesaC.selectedIndex].value, "cliente": clientes.value, "mesero": meseros.value},
        {"ticket": "Ticket Rápido"},
        {"observacion": ""},
        {"qr": "http://192.168.49.31:80/ResbarWeb/qr.html?O="+localStorage.getItem("idOrden")+"&T=R"}); */

    console.log(datos);

    let data = JSON.stringify([{"Productos": nuevosProd}, {"datos": datos}]);
    /* let dataR = JSON.stringify([{"Productos": productosR}, {"datos": datosR}]); */

    /* if(localStorage.getItem("ticketPreparado").toLowerCase() === "si" && preparado == true){
       // let e = await ticket(dataP);
        console.log(e);
    }
    if(localStorage.getItem("ticketRapido").toLowerCase() === "si" && rapido == true){
       // let c = await ticket(dataR);
        console.log(c);
    } */

    let a = await ticket(data);
    console.log(a);

}

async function ticket(data){
    console.log("imprimiendo")
    try {
        let response = await $.ajax({
                                "method": "POST",
                                "url": "http://localhost:80/imprimir/factura.php",
                                "data": {"json": data}
                            });

        //let info = await response.json();
        return response;
    } catch (error) {
        console.log("Error: "+ error)
    }
}

function nombreProducto(idProd) {
    return function (prod) {
        return prod.id == idProd;
    }
}