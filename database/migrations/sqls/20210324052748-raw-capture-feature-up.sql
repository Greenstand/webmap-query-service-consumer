CREATE TABLE raw_capture_feature
(
    id uuid NOT NULL PRIMARY KEY,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    location geometry(POINT, 4326) NOT NULL,
    gps_accuracy smallint NULL,
    field_user_id int8 NOT NULL,
    field_user_photo_url varchar NULL,
    field_username varchar NOT NULL,
    device_identifier varchar NULL,
    note varchar NULL,
    attributes jsonb NULL, 
    status varchar NOT NULL,
    tracking_session_id uuid NULL,
    map_name jsonb NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX rcapturef_status_idx ON raw_capture_feature (status);
CREATE INDEX rcapturef_fieldusr_idx ON raw_capture_feature (field_user_id);
CREATE INDEX rcapturef_fieldusrname_idx ON raw_capture_feature (field_username);
CREATE INDEX rcapturef_crdate_idx ON raw_capture_feature (created_at);
CREATE INDEX rcapturef_trckgsess_idx ON raw_capture_feature (tracking_session_id);
CREATE INDEX rcapturef_attrbs_idx ON raw_capture_feature USING GIN (attributes);
CREATE INDEX rcapturef_map_name_idx ON raw_capture_feature USING GIN (map_name jsonb_path_ops);
