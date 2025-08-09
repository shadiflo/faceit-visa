<?php
session_start();
require_once 'config.php';
require_once 'FaceitAuth.php';

$auth = new FaceitAuth();

// Check for authorization code
if (!isset($_GET['code'])) {
    header('Location: index.php?error=no_code');
    exit;
}

// Check state parameter for security
if (!isset($_GET['state']) || $_GET['state'] !== $_SESSION['oauth_state']) {
    header('Location: index.php?error=invalid_state');
    exit;
}

// Check for code verifier in session
if (!isset($_SESSION['code_verifier'])) {
    header('Location: index.php?error=no_verifier');
    exit;
}

try {
    // Exchange code for access token
    $tokenResponse = $auth->exchangeCode($_GET['code'], $_SESSION['code_verifier']);
    
    if (!$tokenResponse || !isset($tokenResponse['access_token'])) {
        header('Location: index.php?error=token_failed');
        exit;
    }
    
    // Get user profile
    $user = $auth->getUserProfile($tokenResponse['access_token']);
    
    if (!$user) {
        header('Location: index.php?error=profile_failed');
        exit;
    }
    
    // Store user and token in session
    $auth->setUser($user);
    $_SESSION['faceit_token'] = $tokenResponse['access_token'];
    
    // Clean up temporary session data
    unset($_SESSION['code_verifier']);
    unset($_SESSION['oauth_state']);
    
    // Redirect to success page
    header('Location: index.php?login=success');
    exit;
    
} catch (Exception $e) {
    error_log('FACEIT Auth Error: ' . $e->getMessage());
    header('Location: index.php?error=auth_failed');
    exit;
}
?>