<?php
/**
 * PDAcademy – Präsentation (PHP)
 * Einstiegspunkt für Netcup Webhosting.
 */
$base = __DIR__;
require $base . '/includes/header.php';

foreach ($slides as $slide):
    $id = $slide['id'];
    $dataSlide = (int) $slide['data_slide'];
    $cssClass = trim('slide ' . ($slide['css_class'] ?? ''));
?>
    <section id="<?= htmlspecialchars($id) ?>" class="<?= htmlspecialchars($cssClass) ?>" data-slide="<?= $dataSlide ?>" aria-label="Folie <?= $dataSlide ?>">
      <div class="slide-inner">
        <?php if (!empty($slide['title'])): ?>
          <h1 class="slide__title"><?= htmlspecialchars($slide['title']) ?></h1>
          <?php if (!empty($slide['subtitle'])): ?>
            <p class="slide__subtitle"><?= htmlspecialchars($slide['subtitle']) ?></p>
          <?php endif; ?>
          <?php if (!empty($slide['lead'])): ?>
            <p class="slide__lead"><?= htmlspecialchars($slide['lead']) ?></p>
          <?php endif; ?>
        <?php else: ?>
          <h2 class="slide__heading"><?= htmlspecialchars($slide['heading'] ?? '') ?></h2>
          <p class="slide__text"><?= htmlspecialchars($slide['content'] ?? '') ?></p>
        <?php endif; ?>
      </div>
    </section>
<?php
endforeach;

require $base . '/includes/footer.php';
