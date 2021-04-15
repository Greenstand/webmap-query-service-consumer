const { CaptureFeature, createCaptureFeature } = require('./capture-feature.js');
const { Repository }  = require('./Repository.js');
const { CaptureFeatureRepository } = require('../infra/database/pg-repositories.js');
const sinon = require('sinon')
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const {expect} = chai

describe('CaptureFeature factory function', function() {
    it('should return a immutable CaptureFeature object', function() {
        const captureFeature = CaptureFeature({ name: 'anewinstanceid'});
        captureFeature.id = "shouldhavenoeffect";
        expect(captureFeature.name).to.equal('anewinstanceid');
    });
});

describe('Creating CaptureFeature', async function() {
    const captureRepository = new CaptureFeatureRepository()
    const stub = sinon.stub(captureRepository, "add");
    const captureFeature = CaptureFeature({ name:'arun'});
    const saveCaptureFeature = createCaptureFeature(captureRepository);  
       
    it('should add the object to the repository', async function() {
        await saveCaptureFeature(captureFeature);
        expect(stub).calledWith(captureFeature);
        stub.restore();
    });

});
