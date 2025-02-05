<?php
// read.php
include './db.php';

$stmt = $pdo->query("SELECT 
        dia.id,
        quente.nome AS quente_nome, 
        salada.nome AS salada_nome, 
        entrada.nome AS entrada_nome,

        quente.image AS quente_image, 
        salada.image AS salada_image, 
        entrada.image AS entrada_image,

        quente.tipo AS quente_tipo, 
        salada.tipo AS salada_tipo, 
        entrada.tipo AS entrada_tipo,
                
        dia.horario, 
        dia.dia

    FROM pratos_dia dia
    JOIN pratos quente ON quente.id = dia.id_prato_quente
    JOIN pratos salada ON salada.id = dia.id_salada
    JOIN pratos entrada ON entrada.id = dia.id_entrada
    ORDER BY dia.id ASC;
    ");
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($items);
?>
