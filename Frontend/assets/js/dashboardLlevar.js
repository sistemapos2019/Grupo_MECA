document.querySelector('body').onload = datosOrdenes();
var id, idMesa, mesero, cliente, total, rapido, preparado;
let indexSelected;
let listaOrdenesActivas= [];
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
    datosOrdenes();
}


function datosOrdenes(){

    var contenido= fetch('http://localhost:3000/api/dashboardllevar')//le paso la url para ir a traer los datos de la api
                .then(res => res.json())
                .then(datos=>{
                tablaOrdenesA(datos)
                });
}

        
function tablaOrdenesA(datos){
    //console.log(datos);
    listaOrdenesActivas= datos;

    console.log(listaOrdenesActivas);
    let valor= listaOrdenesActivas;
    console.log(valor);
    for(k=0; k< valor.length; k++){
        //console.log(valor);
        
            /*for ( i = 0; i < 13; i++) {
                
                if (i==0) {
                    cliente= valor[k].Cliente;
                }
                if (i==2) {
                    id= valor[k].IdOrden;
                    console.log(id);
                }
                if (i==3) {
                    idMesa= valor[k].Mesa;
                    //console.log(id);
                }
                if (i==4) {
                    mesero=  valor[k].Mesero;
                }
                if (i==7) {
                    preparado= valor[k].TiempoPreparado;
                }
                if (i==8) {
                    rapido= valor[k].TiempoRapido;
                }
                if (i==9) {
                    total= valor[k].Total;
                }
            }*/

            document.getElementById("tblOrdenesActivas").innerHTML= ' ';
            if ((valor[k].Estado=='CP')) {
                var clasePreparado= listaOrdenesActivas[k].Preparado;
                //var claseRapido= listaOrdenesActivas[k].Rapido;
                document.getElementById("tblOrdenesActivas").innerHTML += `
                <tr>
                    <td>${valor[k].id}</td>
                    <td>${valor[k].Mesero}</td>
                    <td>${valor[k].Cliente}</td>
                    <td>${valor[k].Total}</td>
                    <td class="${clasePreparado}"><i class = "fas fa-circle"></i></td>
                </tr>
                    
                `
                ;  
            }
            
            
        }
        selecionarFila();
    
}

function selecionarFila(){
    let tabla= document.querySelector('#tblOrdenesActivas');
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

function guardarId(){
    localStorage.setItem("idOrdenSeleccionada", listaOrdenesActivas[indexSelected].id);
    console.log(listaOrdenesActivas[indexSelected]).id;

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
