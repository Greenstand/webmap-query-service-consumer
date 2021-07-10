const { rawCaptureFeatureFromMessage, createRawCaptureFeature } = require('./raw-capture-feature.js');
const { RawCaptureFeatureRepository } = require('../infra/database/pg-repositories.js'); 

const sinon = require('sinon')
const chai = require("chai");
const assertArrays = require('chai-arrays');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
chai.use(assertArrays);
const {expect} = chai

describe('rawCaptureFeatureFromMessage function', function() {
    const rawCaptureFeature = rawCaptureFeatureFromMessage({
        id: 'bc53bc67-894b-4cec-8adf-d77bd00f6c67',
        lat: 23.12,
        lon: 64.23,
        field_user_id: 432523,
        field_username: 'planter',
        attributes: [],
        created_at: new Date().toISOString()
    });

    it('should return a immutable object', function() {
        rawCaptureFeature.new_attribute = 10;
        expect(rawCaptureFeature.new_attribute).to.equal(undefined);
    });

    it('should contain the required parameters', function() {
        expect(Object.keys(rawCaptureFeature)).to.equalTo(
            ['id', 'lat', 'lon', 'field_user_id', 'field_username', 'attributes', 'device_identifier', 'created_at']);
    });
});

describe('calling createRawCaptureFeature function', function(){
    const rawCaptureFeature = rawCaptureFeatureFromMessage({
        id: 'bc53bc67-894b-4cec-8adf-d77bd00f6c67',
        lat: 23.12,
        lon: 64.23,
        field_user_id: 432523,
        field_username: 'planter',
        attributes: [],
        identifier: "34fwaasdgsasfd",
        created_at: new Date().toISOString()
    });

    it('should add the raw capture feature to the repository', async function() {

        const rawCaptureFeatureRepository = new RawCaptureFeatureRepository();
        const stub = sinon.stub(rawCaptureFeatureRepository, "add");
        const stub2 = sinon.stub(rawCaptureFeatureRepository, "assignRegion");
        const stub3 = sinon.stub(rawCaptureFeatureRepository, "updateCluster");
        const executeCreateRawCaptureFeature = createRawCaptureFeature(rawCaptureFeatureRepository);
        await executeCreateRawCaptureFeature(rawCaptureFeature);
        expect(stub).calledWith(rawCaptureFeature);
        stub.restore();
    });
});
