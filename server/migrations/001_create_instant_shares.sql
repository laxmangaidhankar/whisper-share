CREATE TABLE instant_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    access_code_hash CHAR(64) UNIQUE NOT NULL,

    original_file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(150),
    original_file_size BIGINT NOT NULL,

    encrypted_file BYTEA NOT NULL,

    salt BYTEA NOT NULL,
    iv BYTEA NOT NULL,
    claim_token_hash CHAR(64),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- For finding expired shares
CREATE INDEX idx_instant_shares_expires_at
ON instant_shares(expires_at);