<?php

class FaceitAuth {
    private $clientId;
    private $clientSecret;
    private $redirectUri;
    private $apiBase = 'https://api.faceit.com';
    private $accountsBase = 'https://accounts.faceit.com';
    
    public function __construct() {
        $this->clientId = $_ENV['FACEIT_CLIENT_ID'] ?? '';
        $this->clientSecret = $_ENV['FACEIT_CLIENT_SECRET'] ?? '';
        $this->redirectUri = ($_ENV['BASE_URL'] ?? 'http://localhost:8000') . '/callback.php';
    }
    
    /**
     * Generate authorization URL with PKCE
     */
    public function getAuthUrl() {
        $codeVerifier = $this->base64UrlEncode(random_bytes(32));
        $codeChallenge = $this->base64UrlEncode(hash('sha256', $codeVerifier, true));
        
        // Store code verifier in session
        $_SESSION['code_verifier'] = $codeVerifier;
        $_SESSION['oauth_state'] = bin2hex(random_bytes(16));
        
        $params = http_build_query([
            'redirect_popup' => 'true',
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
            'redirect_uri' => $this->redirectUri,
            'state' => $_SESSION['oauth_state']
        ]);
        
        return $this->accountsBase . '/accounts?' . $params;
    }
    
    /**
     * Exchange authorization code for access token
     */
    public function exchangeCode($code, $codeVerifier) {
        $data = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'code_verifier' => $codeVerifier,
            'code_challenge_method' => 'S256'
        ];
        
        $headers = [
            'Authorization: Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret),
            'Content-Type: application/x-www-form-urlencoded'
        ];
        
        $response = $this->makeRequest(
            $this->apiBase . '/auth/v1/oauth/token',
            'POST',
            http_build_query($data),
            $headers
        );
        
        return $response ? json_decode($response, true) : null;
    }
    
    /**
     * Get user profile using access token
     */
    public function getUserProfile($accessToken) {
        $headers = [
            'Authorization: Bearer ' . $accessToken
        ];
        
        $response = $this->makeRequest(
            $this->apiBase . '/auth/v1/resources/userinfo',
            'GET',
            null,
            $headers
        );
        
        return $response ? json_decode($response, true) : null;
    }
    
    /**
     * Get current authenticated user from session
     */
    public function getCurrentUser() {
        return $_SESSION['faceit_user'] ?? null;
    }
    
    /**
     * Store user in session
     */
    public function setUser($user) {
        $_SESSION['faceit_user'] = $user;
    }
    
    /**
     * Clear user session
     */
    public function logout() {
        unset($_SESSION['faceit_user']);
        unset($_SESSION['faceit_token']);
        unset($_SESSION['code_verifier']);
        unset($_SESSION['oauth_state']);
    }
    
    /**
     * Check if user is authenticated
     */
    public function isAuthenticated() {
        return isset($_SESSION['faceit_user']);
    }
    
    /**
     * Make HTTP request using cURL
     */
    private function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_USERAGENT => 'FaceitVisa-PHP/1.0'
        ]);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            error_log('cURL Error: ' . curl_error($ch));
            curl_close($ch);
            return false;
        }
        
        curl_close($ch);
        
        if ($httpCode >= 200 && $httpCode < 300) {
            return $response;
        }
        
        error_log("HTTP Error $httpCode: $response");
        return false;
    }
    
    /**
     * Base64 URL encode
     */
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

?>