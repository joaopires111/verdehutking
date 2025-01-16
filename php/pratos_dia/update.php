<?php
// update.php
include './db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$name = $data['name'];
$description = $data['description'];

$stmt = $pdo->prepare("UPDATE items SET name = :name, description = :description WHERE id = :id");
$stmt->execute([':name' => $name, ':description' => $description, ':id' => $id]);

echo json_encode(['message' => 'Item updated successfully']);
?>
