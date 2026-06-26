<?php
// Auto-version static asset URLs with the file's mtime. Cloudflare, the
// browser cache, and any intermediate proxy all see a fresh URL the
// moment the file changes — and a stable URL until then, so caching
// still works at full strength.
function asset(string $path): string {
    $abs = __DIR__ . '/' . ltrim($path, '/');
    $v = @filemtime($abs);
    $suffix = $v ? ('?v=' . $v) : '';
    return htmlspecialchars($path . $suffix, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Ftesë Dasme — Matina & Loti</title>
  <meta name="description" content="Jeni të ftuar të festoni dasmën e Matina & Loti Gashi">
  <meta name="theme-color" content="#FAF8F4">

  <!-- Critical assets: start loading these in parallel with the HTML parse. -->
  <link rel="preload" as="image" href="<?= asset('Final-poster.webp') ?>" type="image/webp">
  <link rel="preload" as="image" href="<?= asset('main.webp') ?>" type="image/webp">
  <link rel="preload" as="video" href="<?= asset('main-intro.mp4') ?>" type="video/mp4">

  <link rel="stylesheet" href="<?= asset('style.css') ?>">
</head>
<body>

  <!-- ═══ ENVELOPE SCENE ═══ -->
  <div class="envelope-scene" id="envelopeScene">
    <img src="<?= asset('frame_top.webp') ?>" alt="" class="frame-top" decoding="async">
    <img src="<?= asset('frame_bottom.webp') ?>" alt="" class="frame-bottom" decoding="async">
    <div class="envelope-wrapper" id="envelopeWrapper">
      <div class="envelope-stage">
        <img src="<?= asset('Final-poster.webp') ?>" alt="" class="envelope-fallback" decoding="async">
        <video
          id="envelopeIntro"
          class="envelope-video"
          src="<?= asset('Final.mp4') ?>"
          poster="<?= asset('Final-poster.webp') ?>"
          muted
          playsinline
          preload="auto"
          aria-hidden="true"></video>
      </div>

      <!-- Tap prompt -->
      <span class="tap-prompt">Prekni për të hapur ftesën</span>
    </div>
  </div>

  <!-- ═══ INVITATION ═══ -->
  <div class="invitation-overlay" id="invitationOverlay">

    <div class="corner-flourish top-left"></div>
    <div class="corner-flourish top-right"></div>
    <div class="corner-flourish bottom-left"></div>
    <div class="corner-flourish bottom-right"></div>

    <!-- Floating gold particles -->
    <div class="gold-particles" id="goldParticles"></div>

    <div class="invitation-content">

      <!-- ═══ Section: Hero — overline → photo → monogram → greeting → names → ornament ═══ -->
      <section class="invite-section hero-block">
        <span class="overline">Po martohemi</span>

        <!-- Hero photo — still image fades into animated intro -->
        <div class="hero-photo" id="heroPhoto">
          <img src="<?= asset('main.webp') ?>" alt="Loti & Matina" class="hero-fallback" decoding="async" fetchpriority="high">
          <video
            id="heroIntro"
            class="hero-video hero-intro"
            src="<?= asset('main-intro.mp4') ?>"
            poster="<?= asset('main.webp') ?>"
            muted
            playsinline
            preload="auto"
            aria-hidden="true"></video>
        </div>

        <div class="monogram">
          <span>L&M</span>
        </div>

        <div class="family-greeting" id="familyGreeting">
          <span class="label">Jeni të ftuar me nderim</span>
          <span class="family-name" id="familyName"></span>
          <span class="invited-text">të festoni dasmën e</span>
        </div>

        <div class="couple-section">
          <h1 class="couple-name">
            <span class="name-animate">Loti</span>
            <span class="ampersand">&amp;</span>
            <span class="name-animate">Matina</span>
          </h1>
        </div>

        <span class="ornament">✦</span>
      </section>

      <!-- ═══ Section: Countdown ═══ -->
      <section class="invite-section countdown-block">
        <span class="overline">Deri në ditën tonë</span>
        <h2 class="section-title">Numërojmë bashkë</h2>
        <span class="ornament small">✦</span>

        <div class="countdown reveal" id="countdown">
          <div class="countdown-box">
            <span class="countdown-num" id="cdDays">000</span>
            <span class="countdown-label">Ditë</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="cdHours">00</span>
            <span class="countdown-label">Orë</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="cdMins">00</span>
            <span class="countdown-label">Min</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-num" id="cdSecs">00</span>
            <span class="countdown-label">Sek</span>
          </div>
        </div>
      </section>

      <!-- ═══ Section: Event Details + CTAs ═══ -->
      <section class="invite-section details-block">
        <span class="overline">Bashkohuni me ne</span>
        <h2 class="section-title">Detajet</h2>
        <span class="ornament small">✦</span>

        <div class="details-section">
          <div class="detail-row anim-item">
            <div class="detail-label">Data</div>
            <div class="detail-value">E Shtunë, 4 Korrik 2026</div>
          </div>
          <div class="detail-row anim-item">
            <div class="detail-label">Ora</div>
            <div class="detail-value">19:00 — 19:30</div>
            <div class="detail-sub">Pritje e mysafirëve</div>
          </div>
          <div class="detail-row anim-item">
            <div class="detail-label">Vendi</div>
            <div class="detail-value">Hills Restaurant</div>
            <div class="detail-sub">Ferizaj, Kosovë</div>
          </div>
        </div>

        <div class="action-buttons reveal">
          <a href="#" class="btn btn-primary" id="rsvpBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.935 1.389 5.611L0 24l6.597-1.332A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.855 0-3.63-.5-5.181-1.441l-.372-.22-3.856.777.813-3.741-.242-.385A9.772 9.772 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818S21.818 6.586 21.818 12 17.414 21.818 12 21.818z"/></svg>
            Konfirmo Pjesëmarrjen
          </a>
          <a href="#" class="btn btn-decline" id="declineBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Më vjen keq, nuk mundem
          </a>
          <a href="#" class="btn btn-outline" id="calendarBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Ruaje në Kalendar
          </a>
        </div>
      </section>

      <!-- ═══ Section: Venue + Map ═══ -->
      <section class="invite-section venue-block">
        <span class="overline">Vendi</span>
        <h2 class="section-title">Hills Restaurant</h2>
        <p class="section-sub">Ferizaj, Kosovë</p>
        <span class="ornament small">✦</span>

        <div class="map-section reveal">
          <div class="venue-image-container">
            <img src="<?= asset('image.jpeg') ?>" alt="Hills Restaurant — Vendi i Dasmës" class="venue-image" loading="lazy" decoding="async">
            <div class="venue-image-caption">Hills Restaurant</div>
          </div>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3481.2168232819986!2d21.106019606503757!3d42.37015864053435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547f70a162d831%3A0x15b7d561b690fc41!2sThe%20Hills!5e0!3m2!1sen!2sus!4v1780175124169!5m2!1sen!2sus"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <!-- ═══ Footer ═══ -->
      <footer class="invite-section footer-note reveal">
        <p>Do të ishim të nderuar me praninë tuaj<br>ndërsa fillojmë këtë kapitull të ri së bashku.</p>
        <span class="hearts">&#9829; &#9829; &#9829;</span>
        <span class="hashtag">#LotiMatina2026</span>
      </footer>

    </div>
  </div>

  <!-- Family data is baked in server-side and delivered inline. The page is
       served from "/" (allowed by nginx), whereas a direct fetch of a *.php
       endpoint is dropped by the server's scanner-block rule — so inlining is
       the only reliable delivery path. Edit public/families.data.json + redeploy. -->
  <script>
    window.__FAMILIES__ = <?= (@file_get_contents(__DIR__ . '/families.data.json') ?: '{}') ?>;
  </script>
  <script src="<?= asset('script.js') ?>"></script>
</body>
</html>
