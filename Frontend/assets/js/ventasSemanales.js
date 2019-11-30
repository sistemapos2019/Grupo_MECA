document.querySelector("body").onload = comprobarSesion();
let logueo = false;

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

$("#btnMotrarVS").on("click", function(event) {
    var formulario= document.getElementById("frmFechaS");
    var datos= new FormData(formulario);

    var fecha1= datos.get("fechaDS");
    var fecha2= datos.get("fechaHS");
    console.log(fecha1);
    console.log(fecha2);
    var date1= new Date(fecha1);
    var date2= new Date(fecha2);
    //console.log(date1.getUTCMonth());
    var contenido= fetch('http://localhost:3000/api/Ordens')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos=>{
        inventarioSemanal(datos, date1, date2)
        });
});

function inventarioSemanal(datos, date1, date2){
    document.getElementById("tblInventarioS").innerHTML = '' ;
    var total=0;
    for(let valor of datos){
        var date3= new Date(valor.fecha);
        //console.log(date2.getUTCDate());
        //console.log(date2.getUTCMonth());
        //console.log(date2.getUTCFullYear());
        
        if (date1.getUTCDate()<date2.getUTCDate() && date1.getUTCMonth()==date2.getUTCMonth() && date1.getUTCFullYear()==date2.getUTCFullYear()) {
            
            if ((date3.getUTCDate()>=date1.getUTCDate() && date3.getUTCDate()<=date2.getUTCDate()) && date1.getUTCMonth()==date3.getUTCMonth() && date1.getUTCFullYear()==date3.getUTCFullYear()) {
                //console.log(fecha);
                fecha=date3.getUTCDate()+"/"+(date3.getUTCMonth()+1)+"/"+date3.getUTCFullYear();
                total=total+valor.total;
                document.getElementById("tblInventarioS").innerHTML += `
                <tr>
                    <td>${fecha}</td>
                    <td>$${valor.total.toFixed(2)}</td>
                </tr>
                
                `
                ;
            }
            
        }
    }
    document.getElementById("tblInventarioSTotal").innerHTML = '' ;
    document.getElementById("tblInventarioSTotal").innerHTML += `
        
                <td>${total}</td>

            
            `
        ;

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