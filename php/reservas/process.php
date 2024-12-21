<?php
// Database connection
$conn = new mysqli("localhost", "root", "", "crud_app");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get inputs from the form
$dia = $_POST['choices2'];
$horario = $_POST['choices1'];

// Prepare and execute the query
$sql = "SELECT * FROM reserva WHERE dia LIKE ? AND horario LIKE ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $dia, $horario);
$stmt->execute();

$result = $stmt->get_result();

// Display results
if ($result->num_rows > 0) {
    echo "<h1>Reservas Encontradas:</h1>";
    echo "<table border='1'>
            <tr>
                <th>ID</th>
                <th>Dia</th>
                <th>Horário</th>
                <th>nome</th>
            </tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['id']}</td>
                <td>{$row['dia']}</td>
                <td>{$row['horario']}</td>
                <td>{$row['nome']}</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "<h1>Nenhuma reserva encontrada.</h1>";
}

$stmt->close();
$conn->close();
?>
