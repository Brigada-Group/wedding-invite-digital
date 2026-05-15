<?php
// Read-only JSON endpoint. Serves the live families.json from storage
// (writable by /edit/), falling back to the committed seed when storage
// is empty or unreadable — so the page never blanks out.

declare(strict_types=1);

$ctx = require __DIR__ . '/edit/_bootstrap.php';

$path = file_exists($ctx['families_file']) ? $ctx['families_file'] : $ctx['seed_file'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

if (!file_exists($path)) {
    echo '{}';
    exit;
}

readfile($path);
