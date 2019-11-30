<?php
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "pos";

/* $idOrden = $_POST["idOrden"];
$idProducto = $_POST["idProducto"] */

$detalle = json_decode($_POST["json"]);
$idOrden = $detalle->{"idOrden"};
$idProducto = $detalle->{"idProducto"};

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// sql to delete a record
$sql = "DELETE FROM `pos`.`detalleorden` WHERE (`idOrden` = $idOrden ) and (`idProducto` =  $idProducto )";

if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}

$conn->close();
?>
