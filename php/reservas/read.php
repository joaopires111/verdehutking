<?php
// read.php
include './db.php';

$stmt = $pdo->query("SELECT * FROM reserva");
$reserv = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($reserv);
?>
