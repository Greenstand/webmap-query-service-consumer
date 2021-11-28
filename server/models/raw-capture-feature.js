const { Repository } = require('./Repository');

const rawCaptureFeatureFromMessage = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  attributes,
  device_identifier = '',
  created_at,
}) => {
  return Object.freeze({
    id,
    lat,
    lon,
    field_user_id,
    field_username,
    attributes,
    device_identifier,
    created_at,
  });
};

const createRawCaptureFeature =
  (rawCaptureFeatureRepo) => async (rawCaptureFeature) => {
    const repository = new Repository(rawCaptureFeatureRepo);
    await repository.add(rawCaptureFeature);

    // update region
    await rawCaptureFeatureRepo.assignRegion(rawCaptureFeature);

    // update cluster
    await rawCaptureFeatureRepo.updateCluster(rawCaptureFeature);
});

module.exports = { rawCaptureFeatureFromMessage, createRawCaptureFeature };
