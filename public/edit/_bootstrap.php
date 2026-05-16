<?php
// Shared bootstrap: loads config + resolves the families.json path.
// Both edit/index.php and families.json.php include this.

declare(strict_types=1);

// Forge does atomic deploys (releases/<id>/public/edit/...). A config
// file inside the release dir is wiped on every deploy, so look first
// in the stable storage/ sibling that survives deploys.
// edit/ → public/ → releases/<id>/ → <site>/  (4 levels up)
$candidates = [
    dirname(__DIR__, 4) . '/storage/config.local.php', // /home/forge/<site>/storage/config.local.php
    __DIR__ . '/config.local.php',                     // local-dev fallback (gitignored)
];

$configPath = null;
foreach ($candidates as $candidate) {
    if (file_exists($candidate)) {
        $configPath = $candidate;
        break;
    }
}

$examplePath = __DIR__ . '/config.example.php';

if ($configPath) {
    $config = require $configPath;
} elseif (file_exists($examplePath)) {
    // Falling back to the example lets local `php -S` runs work without
    // copying anything — but the default password is "change-me", which
    // is intentionally easy to spot in logs if it ever leaks to prod.
    $config = require $examplePath;
} else {
    http_response_code(500);
    exit('Editor config missing: copy config.example.php to config.local.php');
}

$storageDir = $config['storage_dir'] ?? null;
if (!$storageDir) {
    // Local-dev fallback: stash next to this file. Gitignored.
    $storageDir = __DIR__;
}

if (!is_dir($storageDir)) {
    http_response_code(500);
    exit('Storage directory does not exist: ' . htmlspecialchars($storageDir));
}

$familiesFile = $storageDir === __DIR__
    ? $storageDir . '/families.local.json'
    : $storageDir . '/families.json';

// Seed (committed) is used as the fallback on a fresh deploy where the
// storage file doesn't exist yet, and as the recovery option from /edit.
$seedFile = __DIR__ . '/families.seed.json';

return [
    'config' => $config,
    'storage_dir' => $storageDir,
    'families_file' => $familiesFile,
    'seed_file' => $seedFile,
];
