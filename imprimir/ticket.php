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

$contenido = $lista[1]->{"datos"}[3]->{"qr"};
QRcode::png($contenido, "imgQR.png", 'L', 8, 0);
$imgQR = EscposImage::load("imgQR.png");

$printer->setJustification(Printer::JUSTIFY_CENTER);

$printer->text("\n"."RESBAR" . "\n\n");
$printer->text($lista[1]->{"datos"}[1]->{"ticket"} . "\n\n");
$printer->setJustification(Printer::JUSTIFY_LEFT);
$printer->text("Número de orden:  " . $lista[1]->{"datos"}[0]->{"idOrden"} . "\n");
$printer->text("Número de mesa:   " . $lista[1]->{"datos"}[0]->{"mesa"} ."\n");
$printer->text("Cliente:          " . $lista[1]->{"datos"}[0]->{"cliente"} ."\n");
$printer->text("Mesero:           " . $lista[1]->{"datos"}[0]->{"mesero"} ."\n");
$printer->setJustification(Printer::JUSTIFY_CENTER);
$printer->text("------------------------------------------------" . "\n");
$printer->text("Producto                                Cantidad" . "\n");
$printer->text("------------------------------------------------"."\n");
/*
	Ahora vamos a imprimir los
	productos
*/
	/*Alinear a la izquierda para la cantidad y el nombre*/
	foreach($lista[0]->{"Productos"} as $producto){
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text($producto->{"nombre"});
            /* calculamos espacios */
            $tamanio = strlen($producto->{"nombre"});
            $espacio = 40 - $tamanio;
            $cadena = "";
            for ($i=0; $i < $espacio; $i++) { 
                $cadena = $cadena . " ";
            }
		$printer->text($cadena . $producto->{"cantidad"} . "\n");

	}
/*
    Observacion de la orden
*/
$printer->setJustification(Printer::JUSTIFY_LEFT);
$printer->text("------------------------------------------------");
$printer->text("Obervación: \n");
$printer->text($lista[1]->{"datos"}[2]->{"observacion"} . "\n");

/*
	Podemos poner también un pie de página
*/
$printer->setJustification(Printer::JUSTIFY_CENTER);
$printer->text("------------------------------------------------");
//qr
$printer->feed(1);
$printer -> bitImage($imgQR);
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
