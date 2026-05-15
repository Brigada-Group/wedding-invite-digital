<?php
declare(strict_types=1);

$ctx = require __DIR__ . '/_bootstrap.php';
$config = $ctx['config'];
$familiesFile = $ctx['families_file'];
$seedFile = $ctx['seed_file'];

session_name('wi_edit');
session_start();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$flash = null;

// ─── Auth ────────────────────────────────────────────────────────────────────
$isLoggedIn = !empty($_SESSION['authed']);

if ($method === 'POST' && ($_POST['action'] ?? '') === 'login') {
    $submitted = (string) ($_POST['password'] ?? '');
    $expected = (string) $config['password'];
    if ($expected !== '' && hash_equals($expected, $submitted)) {
        $_SESSION['authed'] = true;
        header('Location: /edit/');
        exit;
    }
    $flash = ['type' => 'error', 'text' => 'Fjalëkalimi është gabim.'];
    $isLoggedIn = false;
}

if (($_GET['logout'] ?? '') === '1') {
    $_SESSION = [];
    session_destroy();
    header('Location: /edit/');
    exit;
}

if (!$isLoggedIn) {
    render_login($flash);
    exit;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function read_families(string $familiesFile, string $seedFile): array {
    $path = file_exists($familiesFile) ? $familiesFile : $seedFile;
    if (!file_exists($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function normalize_slug(string $slug): string {
    $slug = strtolower(trim($slug));
    $slug = preg_replace('/[^a-z0-9\-]+/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    return trim($slug, '-');
}

function validate_families(array $input): array {
    $out = [];
    $errors = [];
    foreach ($input as $slug => $family) {
        $slug = normalize_slug((string) $slug);
        if ($slug === '') continue;

        if (!is_array($family)) {
            $errors[] = "Family '$slug' is not an object";
            continue;
        }
        $name = isset($family['name']) ? trim((string) $family['name']) : '';
        $members = $family['members'] ?? [];
        if ($name === '') {
            $errors[] = "Family '$slug' is missing a name";
            continue;
        }
        if (!is_array($members)) {
            $errors[] = "Family '$slug' has invalid members list";
            continue;
        }
        $cleanMembers = [];
        foreach ($members as $m) {
            $m = trim((string) $m);
            if ($m !== '') $cleanMembers[] = $m;
        }
        if (count($cleanMembers) === 0) {
            $errors[] = "Family '$slug' has no members";
            continue;
        }
        $out[$slug] = ['name' => $name, 'members' => $cleanMembers];
    }
    return ['families' => $out, 'errors' => $errors];
}

function save_families(string $familiesFile, array $families): void {
    // Backup first (best-effort — fresh installs have no file to back up).
    if (file_exists($familiesFile)) {
        @copy($familiesFile, $familiesFile . '.bak');
    }
    $json = json_encode($families, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    $tmp = $familiesFile . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        throw new RuntimeException('Could not write tmp file: ' . $tmp);
    }
    if (!rename($tmp, $familiesFile)) {
        @unlink($tmp);
        throw new RuntimeException('Could not move tmp into place');
    }
}

// ─── Save handler ────────────────────────────────────────────────────────────
if ($method === 'POST' && ($_POST['action'] ?? '') === 'save') {
    $mode = $_POST['mode'] ?? 'structured';
    $parsed = null;

    if ($mode === 'raw') {
        $raw = (string) ($_POST['raw_json'] ?? '');
        $parsed = json_decode($raw, true);
        if (!is_array($parsed)) {
            $flash = ['type' => 'error', 'text' => 'JSON i pavlefshëm: ' . json_last_error_msg()];
        }
    } else {
        // Three parallel arrays — index N of each describes one family row.
        $slugs = $_POST['slug'] ?? [];
        $names = $_POST['name'] ?? [];
        $membersBlobs = $_POST['members'] ?? [];
        $parsed = [];
        if (is_array($slugs)) {
            $count = count($slugs);
            for ($i = 0; $i < $count; $i++) {
                $slug = (string) ($slugs[$i] ?? '');
                if ($slug === '') continue;
                $name = (string) ($names[$i] ?? '');
                $membersBlob = (string) ($membersBlobs[$i] ?? '');
                $members = array_values(array_filter(
                    array_map('trim', preg_split('/\r?\n/', $membersBlob)),
                    fn($s) => $s !== ''
                ));
                $parsed[$slug] = ['name' => $name, 'members' => $members];
            }
        }
    }

    if ($flash === null && $parsed !== null) {
        $result = validate_families($parsed);
        if (count($result['errors']) > 0) {
            $flash = ['type' => 'error', 'text' => implode('; ', $result['errors'])];
        } else {
            try {
                save_families($familiesFile, $result['families']);
                $flash = ['type' => 'success', 'text' => 'U ruajt me sukses (' . count($result['families']) . ' familje).'];
            } catch (Throwable $e) {
                $flash = ['type' => 'error', 'text' => 'Gabim gjatë ruajtjes: ' . $e->getMessage()];
            }
        }
    }
}

// ─── Render editor ───────────────────────────────────────────────────────────
$families = read_families($familiesFile, $seedFile);
render_editor($families, $flash, $familiesFile);

// ─── View functions ──────────────────────────────────────────────────────────
function render_login(?array $flash): void { ?>
<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hyrje — Editori i ftesës</title>
<?php render_styles(); ?>
</head>
<body class="login-body">
  <form method="post" class="login-card">
    <h1>Editori i Familjeve</h1>
    <p class="muted">Vendos fjalëkalimin për të vazhduar.</p>
    <?php if ($flash): ?>
      <div class="flash flash-<?= htmlspecialchars($flash['type']) ?>"><?= htmlspecialchars($flash['text']) ?></div>
    <?php endif; ?>
    <input type="hidden" name="action" value="login">
    <input type="password" name="password" autofocus placeholder="Fjalëkalimi" required>
    <button type="submit">Hyr</button>
  </form>
</body>
</html>
<?php }

function render_editor(array $families, ?array $flash, string $familiesFile): void {
    $count = count($families);
    $rawJson = json_encode($families, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Editori i Familjeve</title>
<?php render_styles(); ?>
</head>
<body>
  <header class="topbar">
    <div>
      <h1>Editori i Familjeve</h1>
      <p class="muted small">
        <?= $count ?> familje &middot;
        ruajtur në <code><?= htmlspecialchars($familiesFile) ?></code>
      </p>
    </div>
    <nav>
      <button type="button" id="toggleMode" class="ghost">Modaliteti i avancuar (JSON)</button>
      <a href="?logout=1" class="ghost">Dilni</a>
    </nav>
  </header>

  <?php if ($flash): ?>
    <div class="flash flash-<?= htmlspecialchars($flash['type']) ?>"><?= htmlspecialchars($flash['text']) ?></div>
  <?php endif; ?>

  <form method="post" id="editorForm">
    <input type="hidden" name="action" value="save">
    <input type="hidden" name="mode" id="modeInput" value="structured">

    <section id="structuredEditor">
      <div class="toolbar">
        <button type="button" id="addFamilyBtn" class="primary">+ Shto familje</button>
        <span class="muted small">Çdo familje ka një ID (slug), një emër dhe një listë anëtarësh (një rresht për anëtar).</span>
      </div>
      <div id="familyList">
        <?php foreach ($families as $slug => $family): ?>
          <?php render_family_row($slug, $family); ?>
        <?php endforeach; ?>
      </div>
    </section>

    <section id="rawEditor" hidden>
      <label for="rawJson" class="muted small">Modifiko JSON drejtpërdrejt. Vetëm për përdoruesit me përvojë.</label>
      <textarea id="rawJson" name="raw_json" rows="28" spellcheck="false"><?= htmlspecialchars($rawJson) ?></textarea>
    </section>

    <div class="save-bar">
      <button type="submit" class="primary big">Ruaj ndryshimet</button>
    </div>
  </form>

  <template id="familyTemplate">
    <?php render_family_row('', ['name' => '', 'members' => []], true); ?>
  </template>

  <script>
    (function () {
      const list = document.getElementById('familyList');
      const tpl = document.getElementById('familyTemplate');
      const addBtn = document.getElementById('addFamilyBtn');
      const toggleBtn = document.getElementById('toggleMode');
      const modeInput = document.getElementById('modeInput');
      const structured = document.getElementById('structuredEditor');
      const raw = document.getElementById('rawEditor');

      addBtn.addEventListener('click', () => {
        const frag = tpl.content.cloneNode(true);
        list.appendChild(frag);
        list.lastElementChild.querySelector('input[name="slug[]"]').focus();
      });

      list.addEventListener('click', (e) => {
        if (e.target.matches('[data-remove]')) {
          const row = e.target.closest('.family-row');
          row.remove();
        }
      });

      toggleBtn.addEventListener('click', () => {
        const showRaw = !raw.hidden ? false : true;
        raw.hidden = !showRaw;
        structured.hidden = showRaw;
        modeInput.value = showRaw ? 'raw' : 'structured';
        toggleBtn.textContent = showRaw ? 'Modaliteti strukturuar' : 'Modaliteti i avancuar (JSON)';
      });
    })();
  </script>
</body>
</html>
<?php }

function render_family_row(string $slug, array $family, bool $forTemplate = false): void {
    $name = (string) ($family['name'] ?? '');
    $members = is_array($family['members'] ?? null) ? $family['members'] : [];
    $membersText = implode("\n", $members);
?>
    <div class="family-row">
      <div class="row-head">
        <input type="text" name="slug[]" placeholder="slug-i-familjes" value="<?= htmlspecialchars($slug) ?>" pattern="[a-z0-9\-]+" required>
        <input type="text" name="name[]" placeholder="Emri i familjes" value="<?= htmlspecialchars($name) ?>" required>
        <button type="button" class="ghost danger" data-remove>×</button>
      </div>
      <textarea name="members[]" rows="<?= max(3, count($members) + 1) ?>" placeholder="Një anëtar për rresht"><?= htmlspecialchars($membersText) ?></textarea>
    </div>
<?php }

function render_styles(): void { ?>
<style>
  :root {
    --pink: #e8b4b8;
    --pink-dark: #c4878c;
    --charcoal: #2a2a2a;
    --charcoal-light: #6b6b6b;
    --off-white: #faf7f5;
    --line: #ece1e1;
    --error: #b00020;
    --success: #1b6e3c;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Outfit', system-ui, -apple-system, Segoe UI, sans-serif; color: var(--charcoal); background: var(--off-white); }
  h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; margin: 0; }
  .muted { color: var(--charcoal-light); }
  .small { font-size: 13px; }
  code { background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid var(--line); font-size: 12px; }

  /* Login */
  .login-body { display: grid; place-items: center; min-height: 100vh; padding: 24px; }
  .login-card { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 32px; width: 100%; max-width: 360px; display: grid; gap: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }
  .login-card h1 { font-size: 28px; }
  .login-card input { padding: 12px 14px; border-radius: 8px; border: 1px solid var(--line); font-size: 16px; }
  .login-card button { padding: 12px 14px; border-radius: 8px; border: none; background: var(--pink); color: #fff; font-size: 15px; cursor: pointer; }
  .login-card button:hover { background: var(--pink-dark); }

  /* Editor */
  .topbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--line); background: #fff; gap: 16px; flex-wrap: wrap; }
  .topbar h1 { font-size: 24px; }
  .topbar nav { display: flex; gap: 8px; align-items: center; }
  form { padding: 24px; max-width: 1100px; margin: 0 auto; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .family-row { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 16px; margin-bottom: 14px; }
  .row-head { display: grid; grid-template-columns: 220px 1fr auto; gap: 10px; margin-bottom: 10px; }
  .row-head input { padding: 9px 11px; border-radius: 7px; border: 1px solid var(--line); font-size: 14px; font-family: inherit; }
  textarea { width: 100%; padding: 10px 12px; border-radius: 7px; border: 1px solid var(--line); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.5; resize: vertical; }
  button, a.ghost { font-family: inherit; }
  .primary { padding: 9px 14px; border-radius: 7px; border: none; background: var(--pink); color: #fff; font-size: 14px; cursor: pointer; }
  .primary:hover { background: var(--pink-dark); }
  .primary.big { padding: 13px 28px; font-size: 15px; }
  .ghost { padding: 9px 14px; border-radius: 7px; border: 1px solid var(--line); background: #fff; color: var(--charcoal); font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
  .ghost:hover { background: var(--off-white); }
  .ghost.danger { color: var(--error); border-color: rgba(176, 0, 32, 0.2); padding: 4px 10px; font-size: 18px; line-height: 1; }
  .save-bar { position: sticky; bottom: 0; background: linear-gradient(to top, var(--off-white) 70%, transparent); padding: 18px 0 0; text-align: right; }
  .flash { padding: 12px 16px; border-radius: 8px; margin: 16px 24px 0; max-width: 1100px; margin-left: auto; margin-right: auto; }
  .flash-error { background: rgba(176, 0, 32, 0.08); border: 1px solid rgba(176, 0, 32, 0.2); color: var(--error); }
  .flash-success { background: rgba(27, 110, 60, 0.08); border: 1px solid rgba(27, 110, 60, 0.2); color: var(--success); }

  @media (max-width: 640px) {
    .row-head { grid-template-columns: 1fr; }
    .topbar { padding: 16px; }
  }
</style>
<?php }
