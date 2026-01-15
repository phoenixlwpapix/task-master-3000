const { generateKeyPairSync, createPublicKey } = require('crypto');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Generating RSA 2048 key pair...");
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Prepare JWKS
const keyObject = createPublicKey(publicKey);
const jwk = keyObject.export({ format: 'jwk' });
jwk.use = "sig";
jwk.alg = "RS256";
const jwks = { keys: [jwk] };
const jwksString = JSON.stringify(jwks);

// Find convex CLI bin
const convexBin = path.join(__dirname, 'node_modules', 'convex', 'bin', 'main.js');
console.log("Using Convex CLI at:", convexBin);

function setEnv(name, value) {
    console.log(`Setting ${name}...`);
    // Use '--' to safely pass values that might look like flags or contain newlines
    const res = spawnSync(process.execPath, [convexBin, 'env', 'set', name, '--', value], {
        stdio: 'inherit',
        encoding: 'utf-8'
    });

    if (res.status !== 0) {
        console.error(`Failed to set ${name}. Exit code: ${res.status}`);
        process.exit(1);
    }
}

// 1. Set JWT_PRIVATE_KEY (Raw PEM with newlines, safer with -- )
// Note: Docs say replace newlines with spaces, but my previous success used newlines with --
// Let's try raw first. If it fails, we fall back to space-replacement.
// However, standard PKCS8 parsers expect newlines or spaces.
setEnv('JWT_PRIVATE_KEY', privateKey);

// 2. Set JWKS
setEnv('JWKS', jwksString);

console.log("Success! Keys configured.");
