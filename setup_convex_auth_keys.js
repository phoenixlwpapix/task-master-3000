const { generateKeyPairSync, createPublicKey } = require('crypto');
const { spawnSync } = require('child_process');
const fs = require('fs');

console.log("Generating RSA 2048 key pair...");
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// 1. Prepare JWT_PRIVATE_KEY
// Docs recommend: .trimEnd().replace(/\n/g, " ")
const privateKeyFormatted = privateKey.trimEnd().replace(/\n/g, " ");

// 2. Prepare JWKS
const keyObject = createPublicKey(publicKey);
const jwk = keyObject.export({ format: 'jwk' });
jwk.use = "sig";
jwk.alg = "RS256";
const jwks = { keys: [jwk] };
const jwksString = JSON.stringify(jwks);

console.log("Setting Environment Variables...");

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function setEnv(name, value) {
    console.log(`Setting ${name}...`);
    const res = spawnSync(npx, ['convex', 'env', 'set', name, value], {
        stdio: 'inherit',
        encoding: 'utf-8'
    });
    if (res.status !== 0) {
        console.error(`Failed to set ${name}`);
        process.exit(1);
    }
}

setEnv('JWT_PRIVATE_KEY', privateKeyFormatted);
setEnv('JWKS', jwksString);

console.log("Success! Keys configured.");
