CREATE TABLE raw_capture_cluster
(
	id serial NOT NULL PRIMARY KEY,
	count int4 NULL,
	zoom_level int4 NULL,
	"location" geometry(POINT, 4326) NULL
);