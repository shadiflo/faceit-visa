<?php
session_start();
require_once 'config.php';
require_once 'FaceitAuth.php';

$auth = new FaceitAuth();

// Check if already logged in
if ($auth->isAuthenticated()) {
    header('Location: index.php');
    exit;
}

// Get auth URL and redirect
$authUrl = $auth->getAuthUrl();
header('Location: ' . $authUrl);
exit;
?>