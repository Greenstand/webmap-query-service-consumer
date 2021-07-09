CREATE TABLE region (
  id serial NOT NULL PRIMARY KEY,
  type_id integer,
  name character varying,
  metadata jsonb,
  geom public.geometry(MultiPolygon,4326),
  centroid public.geometry(Point,4326)
);
