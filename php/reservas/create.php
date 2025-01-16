<?php
// create.php
include './db.php';

$data = json_decode(file_get_contents('php://input'), true);
$nome = $data['nome'];
$telemovel = $data['telemovel'];
$mesa = $data['i'];
$dia = $data['dia'];
$horario = $data['horario'];
try {
    $stmt = $pdo->prepare("INSERT INTO reserva (nome, telemovel, mesa, dia, horario) VALUES (:nome, :telemovel, :mesa, :dia, :horario)");
    $stmt->execute([':nome' => $nome, ':telemovel' => $telemovel, ':mesa' => $mesa, ':dia' => $dia, ':horario' => $horario]);
    echo json_encode(['message' => 'Item created successfully']);
    echo $nome, $telemovel, $mesa, $dia, $horario;
} catch (PDOException $e) {
    http_response_code(500); // Send an appropriate HTTP status code
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
