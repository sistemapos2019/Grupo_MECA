document.querySelector('body').onload = getParametros();

let idOrden = "";
let tipo = "";
let orden = "";

async function getParametros(){
    let url = window.location;
    let partes = url.toString().split("?");
    let parametros = partes[1].split("&");
    let valores = [];
    valores.push(parametros[0].split("="))
    valores.push(parametros[1].split("="))

    idOrden = valores[0][1];
    tipo = valores[1][1];

    orden = await getOrden();

    await putOrden();
}

async function getOrden(){
    try {
        let response = await fetch('http://'+localStorage.getItem("ip")+':3000/api/Ordens/'+idOrden);
        let data = await response.json();
        return data;
    } catch (error) {
     console.log(error);   
    }
}

async function actualizar(orden){
    try {
        let response = await fetch('http://'+localStorage.getItem("ip")+':3000/api/Ordens');
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

function mostrarAlerta() {

    $("#alert").show('fade');
}
