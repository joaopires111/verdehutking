<?php
include './db.php';

$uploadDir = '../img_uploads/';  // Folder where images are stored
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$id = $_POST['id'];
$nome = $_POST['nome'];
$tipo = $_POST['tipo'];
$ingredientes = $_POST['ingredientes'];

// Fetch the current image path from the database
$stmt = $pdo->prepare("SELECT image FROM pratos WHERE id = :id");
$stmt->execute([':id' => $id]);
$currentItem = $stmt->fetch(PDO::FETCH_ASSOC);
$currentImage = $currentItem['image'];

$imagePath = $currentImage;  // Default to existing image path

// Check if a new image file is uploaded
if (!empty($_FILES['image']['name'])) {
    // Generate a new filename
    $fileName = time() . "_" . basename($_FILES['image']['name']);
    $targetFile = $uploadDir . $fileName;

// Move uploaded file
if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {

    // Delete old image (optional)
    if ($currentImage && file_exists(__DIR__ . "/../" . str_replace('php/', '', $currentImage))) {
        unlink(__DIR__ . "/../" . str_replace('php/', '', $currentImage));  // Fix old image path
    }
    
    // Save new image path
    $imagePath = "php/img_uploads/" . $fileName;
}
}

// Update database with new data
$stmt = $pdo->prepare("UPDATE pratos SET nome = :nome, tipo = :tipo, ingredientes = :ingredientes, image = :image WHERE id = :id");
$stmt->execute([
    ':nome' => $nome,
    ':tipo' => $tipo,
    ':ingredientes' => $ingredientes,
    ':image' => $imagePath,
    ':id' => $id
]);

echo json_encode(['message' => 'Item updated successfully']);
?>
