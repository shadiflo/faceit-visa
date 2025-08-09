<?php
session_start();
require_once 'config.php';
require_once 'FaceitAuth.php';

$auth = new FaceitAuth();
$auth->logout();

// Redirect to home page
header('Location: index.php?logout=success');
exit;
?>