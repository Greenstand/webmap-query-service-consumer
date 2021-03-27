CREATE TABLE capture_cluster
(
	id serial NOT NULL PRIMARY KEY,
	count int4 NOT NULL,
	zoom_level int4 NULL,
	"location" geometry(POINT, 4326) NULL
);
