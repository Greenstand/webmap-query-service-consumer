const {
  captureFeatureFromMessage,
  createCaptureFeature,
} = require('./capture-feature.js');
const { Repository } = require('./Repository.js');
const {
  CaptureFeatureRepository,
} = require('../infra/database/pg-repositories.js');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = chai;

describe('captureFeatureFromMessage function', function () {
  it('should return a immutable CaptureFeature object', function () {
    const captureFeature = captureFeatureFromMessage({
      id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
      lat: 11.43,
      lon: 30.56,
      field_user_id: 12315,
      field_username: 'joeplanter',
      attributes: [],
      species_name: 'neem',
      created_at: Date(),
      age: 12,
      morphology: 'medium sized',
    });
    captureFeature.additional_attr = 'shouldhavenoeffect';
    expect(captureFeature.additional_attr).to.equal(undefined);
  });
});

describe('invoking captureFeatureFromMessage with variable parameters', function () {
  it('should add them as key-value pairs in parameter named attributes', function () {
    const captureFeature = captureFeatureFromMessage({
      id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
      lat: 11.43,
      lon: 30.56,
      field_user_id: 12315,
      field_username: 'joeplanter',
      attributes: [],
      species_name: 'neem',
      created_at: Date(),
      age: 12,
      morphology: 'medium sized',
    });
    let additionalArgs = 0;
    captureFeature.attributes.entries.forEach((attribute) => {
      if (attribute.age && attribute['age'] === 12) {
        additionalArgs++;
      }
      if (attribute.morphology && attribute['morphology'] === 'medium sized') {
        additionalArgs++;
      }
    });
    expect(additionalArgs).to.equal(2);
  });
});

describe('Creating CaptureFeature', function () {
  const captureRepository = new CaptureFeatureRepository();
  const stub = sinon.stub(captureRepository, 'add');
  const captureFeature = captureFeatureFromMessage({
    id: 'd13f0b9e-d067-48b4-a5da-46d5655c54dd',
    lat: 11.43,
    lon: 30.56,
    field_user_id: 12315,
    field_username: 'joeplanter',
    attributes: [],
    species_name: 'neem',
    created_at: Date(),
    age: 12,
    morphology: 'medium sized',
  });
  const saveCaptureFeature = createCaptureFeature(captureRepository);

  it('should add the object to the repository', async function () {
    await saveCaptureFeature(captureFeature);
    expect(stub).calledWith(captureFeature);
    stub.restore();
  });
});
