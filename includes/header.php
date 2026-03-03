<?php
$site_title = 'PDAcademy – Für die öffentliche Hand von morgen';
$slides = require __DIR__ . '/../config/slides.php';
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($site_title) ?></title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header" role="banner">
    <div class="header-inner">
      <a href="#<?= htmlspecialchars($slides[0]['id']) ?>" class="logo">PDAcademy</a>
      <nav class="nav-skip" aria-label="Slides">
        <?php foreach ($slides as $s): ?>
          <a href="#<?= htmlspecialchars($s['id']) ?>"><?= htmlspecialchars($s['nav_label']) ?></a>
        <?php endforeach; ?>
      </nav>
      <div class="slide-dots" role="tablist" aria-label="Folien"></div>
    </div>
  </header>

  <main class="presentation" role="main">
