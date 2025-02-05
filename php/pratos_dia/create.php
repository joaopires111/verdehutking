<?php
// create.php
include './db.php';

$data = json_decode(file_get_contents('php://input'), true);
$quente = $data['quente'];
$salada = $data['salada'];
$entrada = $data['entrada'];
$dia = $data['dia'];
$horario = $data['horario'];
try {
$stmt = $pdo->prepare("INSERT INTO pratos_dia (id_prato_quente, id_salada, id_entrada, dia, horario) VALUES (:quente, :salada, :entrada, :dia, :horario)");
$stmt->execute([':quente' => $quente, ':salada' => $salada, ':entrada' => $entrada, ':dia' => $dia, ':horario' => $horario]);
echo json_encode(['message' => 'Item created successfully']);
} catch (PDOException $e) {
    http_response_code(500); // Send an appropriate HTTP status code
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
