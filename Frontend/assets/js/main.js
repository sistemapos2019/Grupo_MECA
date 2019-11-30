
var url;
var pagina;


$('#avisoBitacora').on('show.bs.modal', function (event) { 
    var button = $(event.relatedTarget);
    var borrar = button.data('borrar');
    var modal = $(this)
    
        if(borrar==0){
            modal.find('.modal-body p').text('Se borrará el registro de la biatacora de la fecha xx/xx/xxxx a xx/xx/xxxx');
        }else{
            modal.find('.modal-body p').text('Se borrará todo el registro de la biatacora');
        }
});
/*
document.querySelector('#btnCancelarCobrar').addEventListener('click' , function(){
    cerrarCobrar();
});*/

function cerrarCobrar(){
    $("#cobrarOrden").hide();
}


/*document.querySelector('#btn-credencial-aceptar').addEventListener('click' , function(){
usuarios();
console.log("credencial-aceptar");
});*/

$("#btn-credencial-aceptar").on("click", function(event) {
    console.log("credencial-aceptar");
    usuarios();
}); 

function usuarios(){

    var usuario= document.getElementById("user").value;
    var pin= document.getElementById("pin").value;
    console.log(usuario);
    console.log(pin);

    var contenido= fetch('http://localhost:3000/api/Usuarios')//le paso la url para ir a traer los datos de la api
    .then(res => res.json())
    .then(data=>{
        //console.log(data.valor)
        console.log("entrando al for");
        data.forEach(element => {
            if((element.login== usuario && element.pin== pin) || (element.login== usuario && element.clave== pin) ){//comparo  el jason si el parametro de login es 1
                
                if((url=="crearOrden.html" && element.rol=="M") || (url=="ampliarOrden.html"&& element.rol=="M")){
                    window.location.href= url;
                }else if(element.rol=="G"){
                    if(url=="cobrarOrden.html"){
                        $("#credencial").hide();
                        $("#cobrarOrden").modal("show");
    
                    }else{
                        window.location.href= url;

                    }
                }
            } 
        });
    })
}

function login(){

    var usuario= document.getElementById("usuarioLogin").value;
    var pin= document.getElementById("pinLogin").value;
    console.log(usuario);
    console.log(pin);

    var contenido= fetch('http://localhost:3000/api/Usuarios')//le paso la url para ir a traer los datos de la api
    .then(res => res.json())
    .then(data=>{
        //console.log(data.valor)
        console.log("entrando al for");
        data.forEach(element => {
            if((element.login== usuario && element.pin== pin) || (element.login== usuario && element.clave== pin) ){//comparo  el jason si el parametro de login es 1
                
                if(element.rol=="G"){
                    console.log("gerente");
                    url="dashboard.html";
                    window.location.href= url;
                }else if(element.rol=="M"){
                    console.log("mesero");
                    window.location.href= url;
                }
            } 
        });
    })
}

function obtenerDatos(){  //obtengo los datos
    
    var contenido= fetch('http://localhost:3000/api/parametros/12')//le paso la url para ir a traer los datos de la api
    .then(res => res.json())
    .then(data=>{
        console.log(data.valor);

        if(data.valor== "1"){//comparo  el jason si el parametro de login es 1
            
            $("#credencial").modal("show");
            console.log("credencial");

        }
        if(data.valor== "0"){
            
            if(pagina== "index.html"){
                login();
            }
            if(url=="cobrarOrden.html") {
                $("#cobrarOrden").modal("show");
                
            }else{
                console.log("prueba");
                window.location.href= url;

            }  
                
        }
        })

    }


$("#cancelarCobrar").on("click", function(event) {
    console.log("cancelarCobrar.html");
    url="dashboard.html";
    $("#cobrarOrden").hide();
    window.location.href= url;
    //obtenerDatos();
});

$("#btnLoginIndex").on("click", function(event) {
    console.log("index.html");
    url="dashboardMesero.html";
    pagina= "index.html"
    obtenerDatos();
});

$("#crearMesero").on("click", function(event) {
    console.log("crearOrdenMesero.html");
    url="crearOrdenMesero.html";
    obtenerDatos();
});

$("#ampliarMesero").on("click", function(event) {
    console.log("ampliarOrdenMesero.html");
    url="ampliarOrdenMesero.html";
    obtenerDatos();
}); 

$("#crear").on("click", function(event) {
    console.log("crearOrden.html");
    url="crearOrden.html";
    obtenerDatos();
});

$("#ampliar").on("click", function(event) {
    console.log("ampliarOrden.html");
    url="ampliarOrden.html";
    obtenerDatos();
}); 

$("#modificar").on("click", function(event) {
    console.log("modificarOrden.html");
    url="modificarOrden.html";
    obtenerDatos();
}); 

$("#cobrar").on("click", function(event) {
    console.log("cobrarOrden.html");
    url="cobrarOrden.html";
    obtenerDatos();
}); 

$("#bitacora").on("click", function(event) {
    console.log("bitacora.html");
    url="bitacora.html";
    obtenerDatos();
}); 

$("#categorias").on("click", function(event) {
    console.log("categorias.html");
    url="categorias.html";
    obtenerDatos();
});

$("#mesas").on("click", function(event) {
    console.log("mesas.html");
    url="mesas.html";
    obtenerDatos();
});

$("#parametros").on("click", function(event) {
    console.log("parametros.html");
    url="parametros.html";
    obtenerDatos();
}); 

$("#productos").on("click", function(event) {
    console.log("productos.html");
    url="productos.html";
    obtenerDatos();
}); 

$("#registrarCompras").on("click", function(event) {
    console.log("registrarCompras.html");
    url="registrarCompras.html";
    obtenerDatos();
}); 

$("#usuario").on("click", function(event) {
    console.log("usuario.html");
    url="usuario.html";
    obtenerDatos();
}); 

$("#inventario").on("click", function(event) {
    console.log("inventario.html");
    url="inventario.html";
    obtenerDatos();
}); 

$("#reporteCompras").on("click", function(event) {
    console.log("reporteCompras.html");
    url="reporteCompras.html";
    obtenerDatos();
}); 

$("#reporteVentas").on("click", function(event) {
    console.log("reporteVentas.html");
    url="reporteVentas.html";
    obtenerDatos();
}); 

$("#ventasDiarias").on("click", function(event) {
    console.log("ventasDiarias.html");
    url="ventasDiarias.html";
    obtenerDatos();
}); 

$("#ventasSemanales").on("click", function(event) {
    console.log("ventasSemanales.html");
    url="ventasSemanales.html";
    obtenerDatos();
});

$("#agreMesas").on("click", function(event) {
    $("#modalMesas").modal("show");
});

$("#modMesas").on("click", function(event) {
    $("#modalMesasMod").modal("show");
});
 
