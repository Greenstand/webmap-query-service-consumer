CREATE TABLE capture_map
(
    id uuid NOT NULL PRIMARY KEY,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    point_geometry geometry(POINT, 4326) NOT NULL,
    gps_accuracy smallint NULL,
    field_user_id int8 NOT NULL,
    field_user_photo_url varchar NULL,
    field_username varchar NOT NULL,
    device_identifier varchar NULL,
    note varchar NULL,
    attributes jsonb NULL, 
    tracking_session_id uuid NULL,
    map_name jsonb NULL,
    token_id uuid NULL,
    wallet_name varchar NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX capture_mp_fieldusr_idx ON capture_map (field_user_id);
CREATE INDEX capture_mp_fieldusrname_id ON capture_map (field_username);
CREATE INDEX capture_mp_crdate_idx ON capture_map (created_at);
CREATE INDEX capture_mp_trckgsess_idx ON capture_map (tracking_session_id);
CREATE INDEX capture_mp_token_idx ON capture_map (token_id);
CREATE INDEX capture_mp_wallet_idx ON capture_map (wallet_name);
CREATE INDEX capture_mp_attrbs_idx ON capture_map USING GIN (attributes);
CREATE INDEX capture_mp_map_name_idx ON capture_map USING GIN (map_name jsonb_path_ops)