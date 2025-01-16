<?php
// read.php
include './db.php';

$stmt = $pdo->query("SELECT * FROM pratos_dia");
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($items);
?>
