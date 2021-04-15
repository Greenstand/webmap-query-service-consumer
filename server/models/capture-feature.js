const { Repository } = require('./Repository');

const captureFeatureFromMessage = ({
    id,
    lat,
    lon,
    field_user_id,
    field_username,
    attributes,
    species_name,
    created_at,
 }) => {
     
     Object.freeze({
     id,
     lat,
     lon,
     field_user_id,
     field_username,
     attributes,
     species_name,
     created_at
  });
}

const createCaptureFeature = (captureFeatureRepo) => (async captureFeature => {
    const repository = new Repository(captureFeatureRepo);
    repository.add(captureFeature);
});

module.exports = { captureFeatureFromMessage, createCaptureFeature };

