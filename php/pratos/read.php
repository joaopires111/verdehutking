<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include './db.php';

try {
    $stmt = $pdo->query("SELECT * FROM pratos");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode($items);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}   
?>
