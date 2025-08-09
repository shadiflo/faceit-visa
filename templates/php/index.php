<?php
session_start();
require_once 'config.php';
require_once 'FaceitAuth.php';

$auth = new FaceitAuth();
$user = $auth->getCurrentUser();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FACEIT OAuth2 - PHP</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="navbar-brand">
            <h1>FACEIT PHP App</h1>
        </div>
        
        <div class="navbar-menu">
            <a href="index.php" class="nav-link">Home</a>
            <a href="profile.php" class="nav-link">Profile</a>
        </div>
        
        <div class="navbar-auth">
            <?php if ($user): ?>
                <div class="user-info">
                    <img src="<?php echo htmlspecialchars($user['avatar']); ?>" 
                         alt="Avatar" class="user-avatar">
                    <div class="user-details">
                        <span class="user-nickname"><?php echo htmlspecialchars($user['nickname']); ?></span>
                        <?php if (isset($user['level'])): ?>
                            <span class="user-level">Level <?php echo $user['level']; ?></span>
                        <?php endif; ?>
                    </div>
                </div>
                <a href="logout.php" class="btn btn-danger">Logout</a>
            <?php else: ?>
                <a href="login.php" class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19Z"/>
                    </svg>
                    Login with FACEIT
                </a>
            <?php endif; ?>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <?php if (isset($_GET['error'])): ?>
                <div class="error-message">
                    <?php 
                    $errors = [
                        'auth_failed' => 'Authentication failed. Please try again.',
                        'token_failed' => 'Failed to exchange authorization code.',
                        'profile_failed' => 'Failed to retrieve user profile.',
                        'no_code' => 'No authorization code received.',
                        'no_verifier' => 'Session expired. Please try again.'
                    ];
                    echo $errors[$_GET['error']] ?? 'An error occurred during authentication.';
                    ?>
                </div>
            <?php endif; ?>

            <h2>Welcome to FACEIT PHP Integration</h2>
            
            <?php if ($user): ?>
                <div class="welcome-message">
                    <p>Hello, <strong><?php echo htmlspecialchars($user['nickname']); ?></strong>! 
                    You are successfully authenticated with FACEIT.</p>
                    <p><a href="profile.php">View your full profile →</a></p>
                </div>
            <?php else: ?>
                <div class="login-prompt">
                    <p>Please log in with your FACEIT account to access your profile and gaming statistics.</p>
                    <a href="login.php" class="btn btn-primary btn-large">Get Started</a>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 FACEIT Integration Demo. Powered by <a href="https://github.com/shadiflo/faceit-visa">faceit-visa</a></p>
        </div>
    </footer>
</body>
</html>