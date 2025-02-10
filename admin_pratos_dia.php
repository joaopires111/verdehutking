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
    <title>VerdeHut PRATOS DIA</title>
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />

    <link href="./css/styles.css" rel="stylesheet">
    <link href="./css/bootstrap.min.css" rel="stylesheet">
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
<h2 class="text-success mt-1 mb-5">ADMINISTRADOR</h2>

<div class="sidediv" id="sidebar-container"></div>

<div class="text-center mb-3">
<!-- CRUD LIST -->
    <h3 class="text-success">PRATOS DO DIA
    </h3>
    <!-- Item List -->
    <div class="text-center mb-3">
      <label for="dia" class="fs-5">Dia:</label>
      <input type="date" id="dia" name="dia" class="fs-6 mx-2">
      <label for="horario" class="fs-5 mx-2">Horário:</label>
      <select id="horario" name="horario" class="fs-6">
        <option value="almoco">almoço</option>
        <option value="jantar">jantar</option>
      </select>
      <button class="btn btn-warning"  onclick="filtrardiahorario(document.getElementById('dia').value, document.getElementById('horario').value)">Filtrar</button>
      <button class="btn btn-primary" onclick="fetchItems1()">Ver todos</button>
      <button class="btn btn-success" data-toggle="modal" data-target="#createModal">Criar pratos do dia</button>
    </div>

    <div id="items-list2" class="mb-5"> 
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

    <div id="createModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content ">
                <div class="modal-header">
                    <h5 class="modal-title">Criar pratos do dia</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="rounded-4 border overflow-hidden">
                    <table class="table table-hover text-center align-middle">
                    <thead>
            <tr>
                <th>Prato Quente</th>
                <th>Salada</th>
                <th>Entrada</th>
                <th>Dia</th>
                <th>Horario</th>
                <th></th>
            </tr>
        </thead>
        <TBody>
        <tr>
        <th><select id="quente2" name="prato quente" class="form-control">
        </select></th>
        <th><select id="salada2" name="prato quente" class="form-control">
        </select></th>
        <th><select id="entrada2" name="prato quente" class="form-control">
        </select></th>        
        <th><input type="date" id="dia2" name="dia" class="form-control"></th>
        <th><select id="horario2" name="horario" class="form-control">
            <option value="almoco">almoço</option>
            <option value="jantar">jantar</option>
        </select></th>
        <th><a class="btn btn-success" onclick="createItem2()">criar</a> </th>
        </tr>
    </TBody>
    </table>
    <h6 id="aviso-dia-horario" class="text-danger" hidden>Dia e Horario já preenchidos !!</h6>
    <h6 id="aviso-prato-criado" class="text-success" hidden>Pratos do dia criado</h6>
    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>





<script src="./js/db_pratos_dia.js"></script>
<script>
        function setDefaultDate2() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Month is 0-indexed
        const year = today.getFullYear();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        document.getElementById('dia2').value = formattedDate;  // Set value to today's date
        document.getElementById('dia').value = formattedDate;  // Set value to today's date
        console.log(formattedDate);
    }
        setDefaultDate2(); // Set today's date for dia
        fetchItems1();
        fetchItems2();
        modalload();
        $(document).ready(function(){$("#sidebar-container").load("sidebar.php");});

</script>

</div>
</body>