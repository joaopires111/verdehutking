<?php
// create.php
include './db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];
$description = $data['description'];

$stmt = $pdo->prepare("INSERT INTO items (name, description) VALUES (:name, :description)");
$stmt->execute([':name' => $name, ':description' => $description]);
//?? ainda n sei
echo json_encode(['message' => 'Item created successfully']);
?>
