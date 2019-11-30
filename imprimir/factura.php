<?php
header("Access-Control-Allow-Methods: GET, POST");
header('Access-Control-Allow-Origin: *');
require_once("phpqrcode.php");

$lista = json_decode($_POST['json']);

require __DIR__ . '/autoload.php'; //Nota: si renombraste la carpeta a algo diferente de "ticket" cambia el nombre en esta línea
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\Printer;

/*
Este ejemplo imprime un hola mundo en una impresora de tickets
en Windows.
La impresora debe estar instalada como genérica y debe estar
compartida
 */

/*
Conectamos con la impresora
 */

/*
Aquí, en lugar de "POS-58" (que es el nombre de mi impresora)
escribe el nombre de la tuya. Recuerda que debes compartirla
desde el panel de control
 */

$nombre_impresora = "POS-Printer";

$connector = new WindowsPrintConnector($nombre_impresora);
//$connector = new FilePrintConnector($nombre_impresora);
$printer = new Printer($connector);

/* $contenido = $lista[1]->{"datos"}[2]->{"qr"};
QRcode::png($contenido, "facturaQR.png", 'L', 8, 0);
$imgQR = EscposImage::load("facturaQR.png"); */

$printer->setJustification(Printer::JUSTIFY_CENTER);

$printer->text("\n"."RESBAR" . "\n\n");
//$printer->text($lista[1]->{"datos"}[1]->{"ticket"} . "\n\n");
$printer->setJustification(Printer::JUSTIFY_LEFT);
$printer->text("fecha:     " . $lista[1]->{"datos"}[0]->{"fecha"} ."\n");
$printer->text("Empresa:   " . $lista[1]->{"datos"}[0]->{"empresa"} . "\n");
$printer->text("Dirección: " . $lista[1]->{"datos"}[0]->{"direccion"} ."\n");
//$printer->text("Hora:      " . $lista[1]->{"datos"}[0]->{"cliente"} ."\n");
$printer->text("Mesero:    " . $lista[1]->{"datos"}[0]->{"mesero"} ."\n");
$printer->text("Cliente:   " . $lista[1]->{"datos"}[0]->{"cliente"} ."\n");
$printer->setJustification(Printer::JUSTIFY_CENTER);
$printer->text("------------------------------------------------" . "\n");
//p-8,24 pu-2,6 st-8
$printer->text("Producto                        PU      subTotal" . "\n");
//$printer->text("Producto                                Cantidad" . "\n");
$printer->text("------------------------------------------------"."\n");
/*
	Ahora vamos a imprimir los
	productos
*/
	/*Alinear a la izquierda para la cantidad y el nombre*/
	foreach($lista[0]->{"Productos"} as $producto){
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text($producto->{"nombre"} . "x" . $producto->{"cantidad"});
            /* calculamos espacios */
            $tamanio = strlen($producto->{"nombre"});
            $espacio = 32 - $tamanio;
            $cadena = "";
            for ($i=0; $i < $espacio; $i++) { 
                $cadena = $cadena . " ";
            }
		$printer->text($cadena . $producto->{"pu"});
            /* calculamos espacios */
            $tamanio = strlen($producto->{"pu"});
            $espacio = 8 - $tamanio;
            $cadena = "";
            for ($i=0; $i < $espacio; $i++) { 
                $cadena = $cadena . " ";
            }
        $printer->text($cadena . $producto->{"subtotal"} . "\n");
	}
/*
    Observacion de la orden
*/
$printer->setJustification(Printer::JUSTIFY_RIGHT);
$printer->text("------------------------------------------------");
$printer->text("Total : $" . $lista[1]->{"datos"}[0]->{"total"});


/*
	Podemos poner también un pie de página
*/
$printer->feed(1);
//
/*
Cortamos el papel. Si nuestra impresora
no tiene soporte para ello, no generará
ningún error
 */
$printer->cut();

/*
Para imprimir realmente, tenemos que "cerrar"
la conexión con la impresora. Recuerda incluir esto al final de todos los archivos
 */
$printer->close();