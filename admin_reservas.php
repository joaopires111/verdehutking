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
    <title>VerdeHut RESERVAS</title>
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />


    <link href="./css/bootstrap.min.css" rel="stylesheet">
    <link href="./css/styles.css" rel="stylesheet">
    <script src="./js/three/jquery-3.5.1.min.js"></script>
    <script src="./js/three/popper.min.js"></script>
    <script src="./js/three/bootstrap.min.js"></script>
    <script type="importmap">
            {
              "imports": {
                "three": "./js/three/three.module.js",
                "gtlf": "./js/three/GLTFLoader.js",
                "orbit": "./js/three/OrbitControls.js"
              }
            }
          </script>
</head>

<body class="d-flex flex-column align-items-center text-center">
<style>
    body{
        background-image: url('assets/img/rosa.jpg');
}
</style>
<img src="assets\img\so texto verde hut.png" class="mt-5 img-fluid" alt="verdehutlogo" width="25%" height="25%">
<h2 class="mt-1 mb-5">ADMINISTRADOR</h2>
<div class="sidediv" id="sidebar-container"></div>


    <div class="text-center mb-3">
    <div class="mb-3">
    <h3 class="">RESERVAS</h3>
      <label for="dia" class="fs-5">Dia:</label>
      <input type="date" id="dia" name="dia" class="fs-6 mx-2">
      <label for="horario" class="fs-5 mx-2">Horário:</label>
      <select id="horario" name="horario" class="fs-6">
        <option value="almoco">almoço</option>
        <option value="jantar">jantar</option>
      </select>
      <button class="btn btn-warning mb-1"  onclick="filtrardiahorario(document.getElementById('dia').value, document.getElementById('horario').value);aplicar(document.getElementById('dia').value, document.getElementById('horario').value)">filtrar</button>
      <button class="btn btn-success mb-1" onclick="vertodas();reset()">ver todos</button>
      </div>
      <div id="todas_reservas" class="d-flex flex-column mb-5"></div>

    </div>

            <!-- Bootstrap Delete Confirmation Modal -->
            <div id="deleteModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Apagar</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Tem a certeza que pretende apagar ?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn" data-dismiss="modal">Apagar</button>
                </div>
            </div>
        </div>
    </div>
    <script src="./js/three_reservas.js" type="module"></script>
    <script src="./js/db_reservas.js"></script>
    <script>
    $(document).ready(function(){$("#sidebar-container").load("sidebar.php");});
    function setDefaultDate2() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Month is 0-indexed
        const year = today.getFullYear();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        document.getElementById('dia').value = formattedDate;  // Set value to today's date
        console.log(formattedDate);
    }
    setDefaultDate2();
    modalload();
    </script>
</body>

</html>