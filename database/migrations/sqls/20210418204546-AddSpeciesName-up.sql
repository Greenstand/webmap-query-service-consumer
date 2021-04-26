/* Replace with your SQL commands */
ALTER TABLE capture_feature ADD COLUMN species_name varchar;
CREATE INDEX capturef_spcsname_idx ON capture_feature (species_name);