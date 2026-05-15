<?php
// Copy this file to config.local.php on the server and edit the values.
// config.local.php is gitignored — it never ships with the repo.

return [
    // Shared password for /edit. Rotate by editing this file on the server.
    'password' => 'change-me',

    // Absolute path to the directory where families.json lives.
    // On Forge: '/home/forge/<your-site>/storage'
    // For local php -S testing: leave null to fall back to public/edit/ itself.
    'storage_dir' => null,
];
