<?php
include './db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

// Fetch the image path before deleting the item
$stmt = $pdo->prepare("SELECT image FROM pratos WHERE id = :id");
$stmt->execute([':id' => $id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if ($item && !empty($item['image'])) {
    $imagePath = __DIR__ . "/../" . str_replace('php/', '', $item['image']); 

    if (file_exists($imagePath)) {
        unlink($imagePath);

}}

// Delete the item from the database
$stmt = $pdo->prepare("DELETE FROM pratos WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(["message" => "Item deleted successfully"]);
?>
