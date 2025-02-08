<?php
session_start();
if (isset($_SESSION['user'])) {
    echo "Session exists: " . $_SESSION['user'];
} else {
    echo "No session set!";
}
?>