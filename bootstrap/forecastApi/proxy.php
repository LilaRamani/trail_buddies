<?php
// File Name: proxy.php

$api_key = '200e4b0adde1dcf733e2eca4b88066ab';

$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . urldecode($_GET['url']);
$url = file_get_contents($url);

//print_r($url);

echo $url;
