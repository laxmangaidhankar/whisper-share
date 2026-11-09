ALTER TABLE instant_shares
ADD COLUMN IF NOT EXISTS claim_token_hash CHAR(64);
