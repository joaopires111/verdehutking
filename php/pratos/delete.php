<?php
// delete.php
include './db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

$stmt = $pdo->prepare("DELETE FROM items WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(['message' => 'Item deleted successfully']);
?>
