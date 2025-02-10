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
    <title>VerdeHut PRATOS</title>
    <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />

    <link href="./css/styles.css" rel="stylesheet">
    <link href="./css/bootstrap.min.css" rel="stylesheet">
    <script src="./js/three/jquery-3.5.1.min.js"></script>
    <script src="./js/three/popper.min.js"></script>
    <script src="./js/three/bootstrap.min.js"></script>
</head>

<body class=" d-flex flex-column align-items-center text-center">

<style>
    body{
        background-image: url('assets/img/rosa.jpg');
}
</style>

<img src="assets\img\so texto verde hut.png" class="mt-5 img-fluid" alt="verdehutlogo" width="25%" height="25%">
<h2 class="text-success mt-1 mb-5">ADMINISTRADOR</h2>

<div class="sidediv" id="sidebar-container"></div>

<div class="w-75 d-flex flex-column">
<!-- CRUD LIST -->
    <h3 class="text-success">PRATOS</h3>
    <!-- Create Item -->
    <div class="text-center mb-3">
      <label for="tipo2" class="fs-5">tipo:</label>
      <select id="tipo2" name="tipo" class="">
            <option value="quente">quente</option>
            <option value="salada">salada</option>
            <option value="entrada">entrada</option>
        </select>
      <button class="btn btn-warning"  onclick="filtrartipo(document.getElementById('tipo2').value)">filtrar</button>
      <button class="btn btn-primary" onclick="fetchItems()">ver todos</button>
      <button class="btn btn-success"  data-toggle="modal" data-target="#createmodal">Criar prato</button>
    </div>
        <!-- Item List -->
    <div id="items-list" class="mb-5"></div>
</div>
<!--UPDATE MODAL -->
    <div id="uploadmodal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar prato</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
    <table class="table table-hover text-center align-middle">
        <th><input type="number" id="update_id" class="form-control" placeholder="id" disabled></th>
        <th><input type="text" id="update_nome" class="form-control" placeholder="nome"></th>
        <th><select id="update_tipo" name="update_tipo" class="form-control" disabled>
            <option value="quente">quente</option>
            <option value="salada">salada</option>
            <option value="entrada">entrada</option>
        </select></th>
        <th><textarea id="update_ingredientes" class="form-control" placeholder="ingredientes"></textarea></th>
        <th><input type="file" class="form-control" id="fileInput2" accept="image/*"></th>
        <th><a class="btn btn-success" onclick="updateItem()" data-dismiss="modal">guardar</a></th>
    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!--modal end-->

<!--DELETE MODAL -->
        <div id="deleteModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Apagar</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="deletemodaltext">Tem a certeza que pretende apagar?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn" data-dismiss="modal">Apagar</button>
                </div>
            </div>
        </div>
    </div>

    <!--CREATE MODAL -->
    <div id="createmodal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Criar prato</h5>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <table class="table table-hover text-center align-middle mb-3">
        <tr>
        <th><input type="text" id="nome" class="form-control" placeholder="nome"></th>
        <th><select id="tipo" name="tipo" class="form-control">
            <option value="quente">quente</option>
            <option value="salada">salada</option>
            <option value="entrada">entrada</option>
        </select></th>
        <th><textarea id="ingredientes" class="form-control" placeholder="ingredientes"></textarea></th>
        <th><input type="file" class="form-control" id="fileInput" accept="image/*"></th>
        <th><a class="btn btn-success" onclick="createItem()">criar</a></th>
    </tr>
    </table>
        <h5 id="imgwarning" class="text-danger" hidden> Selecione uma imagem !</h5>
        <h5 id="pratocriado" class="text-success" hidden> Prato criado</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <!--modal end-->


<script src="./js/crud_pratos.js"></script>
<script>
$(document).ready(function(){
$("#sidebar-container").load("sidebar.php");
});
    fetchItems();
    modalload();
</script>
</body>