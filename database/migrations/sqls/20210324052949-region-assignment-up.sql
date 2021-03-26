CREATE TABLE region_assignment
(
	id serial NOT NULL PRIMARY KEY,
    map_feature_id uuid NOT NULL,
	zoom_level int4 NOT NULL,
	region_id int4 NOT NULL
);

CREATE UNIQUE INDEX ra_mpf_id_zoom_level_idx ON region_assignment (map_feature_id, zoom_level);
CREATE INDEX ra_zoom_level_idx ON region_assignment (zoom_level);
