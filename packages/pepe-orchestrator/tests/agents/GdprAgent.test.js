'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const GdprAgent = require('../../src/agents/GdprAgent');
const Agent = require('../../src/core/Agent');

describe('GdprAgent', () => {
  describe('constructor', () => {
    it('sets the name to "GDPR"', () => {
      const agent = new GdprAgent();
      assert.equal(agent.name, 'GDPR');
    });

    it('is an instance of Agent', () => {
      const agent = new GdprAgent();
      assert.ok(agent instanceof Agent);
    });
  });

  describe('execute()', () => {
    it('returns compliant:true when data has no pii field', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ someField: 'value' });
      assert.equal(result.compliant, true);
    });

    it('returns empty issues array when data has no pii field', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ someField: 'value' });
      assert.deepEqual(result.issues, []);
    });

    it('returns compliant:false when data contains a pii field', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'John Doe' });
      assert.equal(result.compliant, false);
    });

    it('returns issues array with PII message when data.pii is set', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'John Doe' });
      assert.ok(result.issues.length > 0);
      assert.ok(result.issues.includes('Personal Identifiable Information (PII) detected'));
    });

    it('returns checkTime as a valid ISO 8601 date string', async () => {
      const agent = new GdprAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      assert.ok(result.checkTime >= before, 'checkTime should be after test start');
      assert.ok(result.checkTime <= after, 'checkTime should be before test end');
    });

    it('returns compliant:true when data is null', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute(null);
      assert.equal(result.compliant, true);
      assert.deepEqual(result.issues, []);
    });

    it('returns compliant:true when data is an empty object', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({});
      assert.equal(result.compliant, true);
    });

    it('returns exactly one issue when pii is present (not duplicated)', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'sensitive' });
      assert.equal(result.issues.length, 1);
    });

    it('returns an object with compliant, issues, and checkTime keys', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({});
      assert.ok('compliant' in result);
      assert.ok('issues' in result);
      assert.ok('checkTime' in result);
    });

    it('treats a truthy pii value (number) as PII detected', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 12345 });
      assert.equal(result.compliant, false);
    });

    it('treats pii:false as no PII detected (falsy)', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: false });
      assert.equal(result.compliant, true);
    });

    it('overrides execute from Agent base class (does not throw)', async () => {
      const agent = new GdprAgent();
      await assert.doesNotReject(() => agent.execute({}));
    });
  });
});