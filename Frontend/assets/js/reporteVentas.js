let  logueo = false
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
}


$("#btnMotrarVM").on("click", function(event) {
    var formulario= document.getElementById("frmFechaM");
    var datos= new FormData(formulario);

    var fecha1= datos.get("fechaM");
    //var fecha2= datos.get("fechaHS");
    console.log("fecha: "+fecha1);
    //console.log(fecha2);
    var date1= new Date(fecha1);
    //var date2= new Date(fecha2);
    //console.log(date1.getUTCMonth());
    var contenido= fetch('http://localhost:3000/api/Ordens')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos=>{
        inventarioSemanal(datos, date1)
        });
});

function inventarioSemanal(datos, date1){ 

    var dataFiltradaPorMes = [];
    var consolidadosPorDia = [];
    var mesFiltro = date1.getUTCMonth();
    var anioFiltro = date1.getUTCFullYear();

    $.each(datos, function(indice, registroVenta) {
        registroVenta.fecha = new Date(registroVenta.fecha);
        if (mesFiltro == registroVenta.fecha.getUTCMonth() && anioFiltro == registroVenta.fecha.getUTCFullYear()) {
            dataFiltradaPorMes.push(registroVenta);
        }
    });

    for (var dia = 1; dia <= 31; dia++) {
        var consolidado = { dia: dia, documentoMinimo: -1, documentoMaximo: 0, venta: 0, propina: 0, ventaMasPropina: 0 };
        $.each(dataFiltradaPorMes, function(indice, registroVenta) {
            //console.log(dia);
            //console.log(registroVenta.fecha.getUTCDate());
            //console.log(registroVenta.fecha);
            if (dia == registroVenta.fecha.getUTCDate()) {
                //console.log(registroVenta);
                consolidado.venta += registroVenta.total;
                consolidado.propina += registroVenta.propina;
                consolidado.ventaMasPropina += registroVenta.total + registroVenta.propina;
                if (consolidado.documentoMinimo == -1 || registroVenta.id < consolidado.documentoMinimo) {
                    consolidado.documentoMinimo = registroVenta.id;
                }
                if (registroVenta.id > consolidado.documentoMaximo) {
                    consolidado.documentoMaximo = registroVenta.id;
                }
                //console.log(consolidado);
            }
        });
        //console.log(consolidado);
        if (consolidado.ventaMasPropina > 0) {
            consolidadosPorDia.push(consolidado);
        }
    }

    //console.log(consolidadosPorDia);
    var totalGravadas=0;
    var iva=0;
    var ventasTotal;
    document.getElementById("tblInventarioM").innerHTML = '' ;
    for (let k = 0; k < consolidadosPorDia.length; k++) {
        totalGravadas = totalGravadas+consolidadosPorDia[k].ventaMasPropina;
        
        document.getElementById("tblInventarioM").innerHTML += `
                <tr>
                    <td>${consolidadosPorDia[k].dia}</td>
                    <td>${consolidadosPorDia[k].documentoMinimo}</td>
                    <td>${consolidadosPorDia[k].documentoMaximo}</td>
                    <td>$${consolidadosPorDia[k].venta.toFixed(2)}</td>
                    <td>$${consolidadosPorDia[k].propina.toFixed(2)}</td>
                    <td>$${consolidadosPorDia[k].ventaMasPropina.toFixed(2)}</td>
                </tr>
                
                `
                ;
            
    }
    //desde aqui
    iva= totalGravadas*0.13
    ventasTotal= totalGravadas+iva;

    $('#ventasGravadas').val(totalGravadas.toFixed(2));
    $('#iva').val(iva.toFixed(2));
    $('#ventasTotales').val(ventasTotal.toFixed(2));

/*
    console.log(datos);
    document.getElementById("tblInventarioM").innerHTML = '' ;
    var total=0;
    for(let valor of datos){
        //var date3= new Date(valor.fecha);
        //console.log(date2.getUTCDate());
        //console.log(date2.getUTCMonth());
        //console.log(date2.getUTCFullYear());
         console.log("hola xD");
        
        if (date1.getUTCMonth()==valor.fecha.getUTCMonth && date1.getUTCFullYear()==valor.fecha.getUTCFullYear()) {
            
            
                total=total+valor.total;
                document.getElementById("tblInventarioM").innerHTML += `
                <tr>
                    <td>${valor.id}</td>
                    <td>${valor.total}</td>
                </tr>
                
                `
                ;
            
            
        }
    }*/
    

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