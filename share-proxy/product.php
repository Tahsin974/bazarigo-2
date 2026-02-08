<?php
header("Content-Type: text/html; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$id = $_GET['id'] ?? '';

if ($id === '') {
    http_response_code(400);
    echo 'Invalid product ID';
    exit;
}

$apiUrl = 'https://api.bazarigo.com/share/product/' . rawurlencode($id);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT'] ?? 'facebookexternalhit/1.1',
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);

$html = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$html) {
    http_response_code(500);
    echo 'Preview unavailable';
    exit;
}

// Remove any meta refresh just in case
$html = preg_replace(
    '/<meta[^>]+http-equiv=["\']refresh["\'][^>]*>/i',
    '',
    $html
);

echo $html;
