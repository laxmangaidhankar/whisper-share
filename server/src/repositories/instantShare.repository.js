import { pool } from '../config/db.js'

// Requires a UNIQUE constraint or unique index on access_code_hash.
export async function insertInstantShare({
    accessCodeHash,
    encryptedFile,
    salt,
    iv,
    claimTokenHash
}) {
    const { rows } = await pool.query(
        `INSERT INTO instant_shares (
            access_code_hash,
            original_file_name,
            mime_type,
            original_file_size,
            encrypted_file,
            salt,
            iv,
            expires_at,
            claim_token_hash
        ) VALUES (
            $1, 'encrypted.bin', 'application/octet-stream', $2,
            $3, $4, $5, NOW() + INTERVAL '4 hours', $6
        )
        ON CONFLICT (access_code_hash) DO NOTHING
        RETURNING id, created_at, expires_at`,
        [accessCodeHash, encryptedFile.length, encryptedFile, salt, iv, claimTokenHash]
    )

    // The caller must handle null as a collision; it is not a successful insert.
    return rows[0] || null
}

// Metadata does not load the encrypted file or expose the claim-token hash.
export async function findInstantShareMetadataByCodeHash(accessCodeHash) {
    const { rows } = await pool.query(
        `SELECT salt, iv, expires_at
         FROM instant_shares
         WHERE access_code_hash = $1
           AND claim_token_hash IS NOT NULL
           AND expires_at > NOW()`,
        [accessCodeHash]
    )
    return rows[0] || null
}

// One database statement both authorizes and consumes the share. Only one
// concurrent request can receive a row, and the delete commits before the
// controller starts sending its HTTP response.
export async function consumeInstantShare(accessCodeHash, claimTokenHash) {
    const { rows } = await pool.query(
        `DELETE FROM instant_shares
         WHERE access_code_hash = $1
           AND claim_token_hash = $2
           AND expires_at > NOW()
         RETURNING encrypted_file`,
        [accessCodeHash, claimTokenHash]
    )
    return rows[0] || null
}

// This logically deletes expired rows; backups/WAL and already-downloaded
// copies have separate retention rules.
export async function deleteExpiredInstantShares() {
    const result = await pool.query(
        `DELETE FROM instant_shares
         WHERE expires_at IS NOT NULL AND expires_at <= NOW()`
    )
    return result.rowCount
}
