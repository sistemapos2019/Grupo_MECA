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


$("#btnMotrarVD").on("click", function(event) {
    var formulario= document.getElementById("frmFechaD");
    var datos= new FormData(formulario);

    var fecha= datos.get("fechaD");
    console.log(fecha);
    var date1= new Date(fecha);
    //console.log(date1.getUTCMonth());
    var contenido= fetch('http://localhost:3000/api/Ordens')//le paso la url para ir a traer los datos de la api
        .then(res => res.json())
        .then(datos=>{
        inventarioDiario(datos, date1)
        });
});

function inventarioDiario(datos, date1, fecha){
    document.getElementById("tblInventarioD").innerHTML = '' ;
    var total=0;
    for(let valor of datos){
        var date2= new Date(valor.fecha);
        //console.log(date2.getUTCDate());
        //console.log(date2.getUTCMonth());
        //console.log(date2.getUTCFullYear());
        
        if (date1.getUTCDate()==date2.getUTCDate() && date1.getUTCMonth()==date2.getUTCMonth() && date1.getUTCFullYear()==date2.getUTCFullYear()) {
            console.log(fecha);
            fecha=date1.getDate()+"/"+(date1.getUTCMonth()+1)+"/"+date1.getUTCFullYear();
            total=total+valor.total;
            document.getElementById("tblInventarioD").innerHTML += `
            <tr>
                <td>${fecha}</td>
                <td>${valor.id}</td>
                <td>$${valor.total.toFixed(2)}</td>
            </tr>
            
            `
        ;
            
        }
    }
    document.getElementById("tblInventarioDTotal").innerHTML = '' ;
    document.getElementById("tblInventarioDTotal").innerHTML += `
        
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