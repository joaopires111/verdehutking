<?php
include './db.php';

$uploadDir = '../img_uploads/';  // Folder to store images
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);  // Create folder if not exists
}

$nome = $_POST['nome'];
$tipo = $_POST['tipo'];
$ingredientes = $_POST['ingredientes'];

// Handle file upload
$imagePath = null;
if (!empty($_FILES['image']['name'])) {
    $fileName = time() . "_" . basename($_FILES['image']['name']);  // Unique filename
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = "php/img_uploads/" . $fileName;  // Save relative path in database
    }
}

// Insert into database
$stmt = $pdo->prepare("INSERT INTO pratos (nome, tipo, ingredientes, image) VALUES (:nome, :tipo, :ingredientes, :image)");
$stmt->execute([
    ':nome' => $nome,
    ':tipo' => $tipo,
    ':ingredientes' => $ingredientes,
    ':image' => $imagePath
]);

echo json_encode(['message' => 'Item created successfully']);
?>
