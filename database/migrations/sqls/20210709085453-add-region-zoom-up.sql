CREATE TABLE region_zoom (
  id serial NOT NULL PRIMARY KEY,
  region_id integer,
  zoom_level integer,
  priority integer
);
