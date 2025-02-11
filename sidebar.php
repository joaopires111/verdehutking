<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.html"); // Redirect to login page
    exit();
}
?>

        <a href="/admin.php"  class="btn btn-outline-primary">
          <div class="content-clip">
            <div class="button-text">
              <div class="bold">Admin.</div>
            </div>
            <div class="button-text">
              <div class="bold">Admin.</div>
            </div>
          </div>
        </a>

        <a href="/admin_pratos.php"  class="btn btn-outline-primary">
          <div class="content-clip">
            <div class="button-text">
              <div class="bold">Pratos</div>
            </div>
            <div class="button-text">
              <div class="bold">Pratos</div>
            </div>
          </div>
        </a>

        <a href="/admin_pratos_dia.php"  class="btn btn-outline-primary">
          <div class="content-clip">
            <div class="button-text">
              <div class="bold">Pratos Dia</div>
            </div>
            <div class="button-text">
              <div class="bold">Pratos Dia</div>
            </div>
          </div>
        </a>

        <a href="/admin_reservas.php"  class="btn btn-outline-primary">
          <div class="content-clip">
            <div class="button-text">
              <div class="bold">Reservas</div>
            </div>
            <div class="button-text">
              <div class="bold">Reservas</div>
            </div>
          </div>
        </a>

        <a href="./logout.php"  class="btn btn-outline-danger">
          <div class="content-clip">
            <div class="button-text">
              <div class="bold">SAIR</div>
            </div>
            <div class="button-text">
              <div class="bold">SAIR</div>
            </div>
          </div>
        </a>