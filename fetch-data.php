<?php
header("Content-Type: application/json");
//deactivate CORS
header("Access-Control-Allow-Origin: *"); // Allows any origin
// Connect to the database
$servername = "localhost";   // XAMPP usually uses localhost
$username = "root";          // Default XAMPP username for MySQL
$password = "";              // Leave empty if there's no password
$dbname = "verdehutdb";   // Replace with the name of your database

//create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Sample SQL query
$sql = "SELECT * FROM pratos";
$result = $conn->query($sql);

$data = array();// Initializes an empty array to store query results
if ($result->num_rows > 0) {// Checks if the query returned any rows
    
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Output data as JSON
echo json_encode($data);

$conn->close();
?>
