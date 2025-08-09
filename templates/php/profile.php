<?php
session_start();
require_once 'config.php';
require_once 'FaceitAuth.php';

$auth = new FaceitAuth();
$user = $auth->getCurrentUser();

// Redirect if not authenticated
if (!$user) {
    header('Location: login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - FACEIT OAuth2</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="navbar-brand">
            <h1>FACEIT PHP App</h1>
        </div>
        
        <div class="navbar-menu">
            <a href="index.php" class="nav-link">Home</a>
            <a href="profile.php" class="nav-link active">Profile</a>
        </div>
        
        <div class="navbar-auth">
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
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="profile-header">
                <img src="<?php echo htmlspecialchars($user['avatar']); ?>" 
                     alt="Profile Avatar" class="profile-avatar">
                <div class="profile-info">
                    <h2><?php echo htmlspecialchars($user['nickname']); ?></h2>
                    <?php if (isset($user['level'])): ?>
                        <p class="profile-level">Level <?php echo $user['level']; ?></p>
                    <?php endif; ?>
                    <?php if (isset($user['country'])): ?>
                        <p class="profile-country">Country: <?php echo htmlspecialchars($user['country']); ?></p>
                    <?php endif; ?>
                </div>
            </div>

            <div class="profile-details">
                <h3>Profile Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Player ID:</label>
                        <span class="monospace"><?php echo htmlspecialchars($user['player_id'] ?? $user['user_id']); ?></span>
                    </div>
                    <div class="info-item">
                        <label>Nickname:</label>
                        <span><?php echo htmlspecialchars($user['nickname']); ?></span>
                    </div>
                    <?php if (isset($user['email'])): ?>
                    <div class="info-item">
                        <label>Email:</label>
                        <span><?php echo htmlspecialchars($user['email']); ?></span>
                    </div>
                    <?php endif; ?>
                    <?php if (isset($user['level'])): ?>
                    <div class="info-item">
                        <label>Level:</label>
                        <span><?php echo $user['level']; ?></span>
                    </div>
                    <?php endif; ?>
                    <?php if (isset($user['country'])): ?>
                    <div class="info-item">
                        <label>Country:</label>
                        <span><?php echo htmlspecialchars($user['country']); ?></span>
                    </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="raw-data">
                <h3>Raw User Data</h3>
                <pre><?php echo htmlspecialchars(json_encode($user, JSON_PRETTY_PRINT)); ?></pre>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 FACEIT Integration Demo. Powered by <a href="https://github.com/shadiflo/faceit-visa">faceit-visa</a></p>
        </div>
    </footer>
</body>
</html>