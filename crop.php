<?php

$tx = 0;        // translateX
$ty = 0;        // translateX
$scale = 2;     // scale
$bw = 500;      // box container width
$bh = 400;      // box container height
$iw = 1024;     // image width
$ih = 768;      // image height

$mx = $iw - $bw;
$my = $ih - $bh;

$x = 0;
$y = 0;
$width = $bw;
$height = $bh;


$x = $mx - (($iw - $bw) / $scale) - $tx * $scale;
$width = $iw / $scale;

$y = $my - (($ih - $bh) / $scale) - $ty * $scale;
$height = $ih / $scale;

$im = imagecreatefromjpeg("Koala.jpg");

$src = imagecrop($im, ['x' => abs($x), 'y' => abs($y), 'width' => $width, 'height' => $height]);

imagejpeg($src, "Koala_Crop.jpg");

echo "<img src='Koala_Crop.jpg' /> <br /><br />";

echo "x = $x, y = $y, width = $width, height = $height";




