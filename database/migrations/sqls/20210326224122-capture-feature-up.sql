CREATE TABLE capture_feature
(
    id uuid NOT NULL PRIMARY KEY,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    location geometry(POINT, 4326) NOT NULL,
    field_user_id int8 NOT NULL,
    field_username varchar NOT NULL,
    device_identifier varchar NULL,
    attributes jsonb NULL, 
    tracking_session_id uuid NULL,
    map jsonb NULL,
    token_id uuid NULL,
    wallet_name varchar NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX capturef_fieldusr_idx ON capture_feature (field_user_id);
CREATE INDEX capturef_fieldusrname_id ON capture_feature (field_username);
CREATE INDEX capturef_crdate_idx ON capture_feature (created_at);
CREATE INDEX capturef_trckgsess_idx ON capture_feature (tracking_session_id);
CREATE INDEX capturef_token_idx ON capture_feature (token_id);
CREATE INDEX capturef_wallet_idx ON capture_feature (wallet_name);
CREATE INDEX capturef_attrbs_idx ON capture_feature USING GIN (attributes);
CREATE INDEX capturef_map_idx ON capture_feature USING GIN (map)