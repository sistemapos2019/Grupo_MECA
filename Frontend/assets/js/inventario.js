//document.querySelector('body').onload = datosUsuario();
let da;
var id, nombre, inv, cat;
let logueo = false;

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
    datosUsuario();
}


function datosUsuario(){
    var contenido= fetch('http://localhost:3000/api/Categoria')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(data=>{
                gCat(data)
                });

                function gCat(data){
                    da= data;
                    var contenido= fetch('http://localhost:3000/api/Productos')//le paso la url para ir a traer los datos de la api
                    .then(res => res.json())
                    .then(datos=>{
                    tablaInventario(datos, da)
                    }); 
                }
}

function tablaInventario(datos, da){
    console.log(datos);
    console.log(da);  
    for(let valor of datos){
    //console.log(valor);
    
        for ( i = 0; i < 6; i++) {
            if (i==0) {
                id= valor.id;
            }
            if (i==1) {
                nombre= valor.nombre;
            }
            if (i==3) {
                inv= valor.inventario;
            }
            if (i==2) {
                for(let v of da){
                    if (valor.idcategoria==v.id) {
                        cat= v.nombre;
                    }

                }
                
            }
            
        }
        document.getElementById("tblInventario").innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${nombre}</td>
                <td>${cat}</td>
                <td>${inv}</td>
            </tr>
                
            `
            ;
        
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