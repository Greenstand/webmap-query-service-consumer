CREATE TABLE raw_capture_map
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
    status varchar NOT NULL,
    tracking_session_id uuid NULL,
    map_name jsonb NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX mp_rcapture_status_idx ON raw_capture_map (status);
CREATE INDEX mp_rcapture_fieldusr_idx ON raw_capture_map (field_user_id);
CREATE INDEX mp_rcapture_fieldusrname_idx ON raw_capture_map (field_username);
CREATE INDEX mp_rcapture_crdate_idx ON raw_capture_map (created_at);
CREATE INDEX mp_rcapture_trckgsess_idx ON raw_capture_map (tracking_session_id);
CREATE INDEX mp_rcapture_attrbs_idx ON raw_capture_map USING GIN (attributes);
CREATE INDEX mp_rcpature_map_name_idx ON raw_capture_map USING GIN (map_name jsonb_path_ops);
