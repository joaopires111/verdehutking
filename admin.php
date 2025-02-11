<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.html"); // Redirect to login page
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VerdeHut ADMINISTRADOR</title>
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />


    <link href="./css/bootstrap.min.css" rel="stylesheet">
    <link href="./css/styles.css" rel="stylesheet">
    <script src="./js/three/jquery-3.5.1.min.js"></script>
    <script src="./js/three/popper.min.js"></script>
    <script src="./js/three/bootstrap.min.js"></script>
</head>
<body class="d-flex flex-column align-items-center text-center">
<style>
    body{
        background-image: url('assets/img/rosa.jpg');
}
</style>
<img src="assets\img\so texto verde hut.png" class="mt-5 img-fluid" alt="verdehutlogo" width="25%" height="25%">
<h2 class="mt-1 mb-5">ADMINISTRADOR</h2>
<div  class="mt-5">
    <h5>Area de administração de bases de dados, selecione um dos menus à esquerda.</h5>
</div>
<div class="sidediv" id="sidebar-container"></div>
<script>
$(document).ready(function(){$("#sidebar-container").load("sidebar.php");});
</script>
</body>

</html>