'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const GdprAgent = require('../src/agents/GdprAgent');
const Agent = require('../src/core/Agent');

describe('GdprAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new GdprAgent();
  });

  describe('constructor', () => {
    test('is an instance of Agent', () => {
      assert.ok(agent instanceof Agent);
    });

    test('has name set to "GDPR"', () => {
      assert.equal(agent.name, 'GDPR');
    });

    test('getStatus() reflects GDPR name', () => {
      assert.equal(agent.getStatus(), 'Agent GDPR is ready.');
    });
  });

  describe('execute() - compliant data (no PII)', () => {
    test('returns compliant: true when data has no pii field', async () => {
      const result = await agent.execute({ userId: 'abc123' });
      assert.equal(result.compliant, true);
    });

    test('returns an empty issues array when compliant', async () => {
      const result = await agent.execute({ metrics: { users: 100 } });
      assert.deepEqual(result.issues, []);
    });

    test('returns compliant: true for empty object', async () => {
      const result = await agent.execute({});
      assert.equal(result.compliant, true);
      assert.deepEqual(result.issues, []);
    });

    test('returns compliant: true when pii field is undefined', async () => {
      const result = await agent.execute({ pii: undefined });
      // undefined is falsy so no PII is detected
      assert.equal(result.compliant, true);
    });

    test('returns compliant: true when pii field is null', async () => {
      const result = await agent.execute({ pii: null });
      // null is falsy so no PII is detected
      assert.equal(result.compliant, true);
    });

    test('returns compliant: true when pii field is 0', async () => {
      const result = await agent.execute({ pii: 0 });
      assert.equal(result.compliant, true);
    });

    test('returns compliant: true when pii field is an empty string', async () => {
      const result = await agent.execute({ pii: '' });
      assert.equal(result.compliant, true);
    });
  });

  describe('execute() - non-compliant data (PII detected)', () => {
    test('returns compliant: false when data.pii is truthy', async () => {
      const result = await agent.execute({ pii: 'John Doe' });
      assert.equal(result.compliant, false);
    });

    test('issues array contains a PII detection message', async () => {
      const result = await agent.execute({ pii: 'John Doe' });
      assert.ok(result.issues.length > 0);
      assert.ok(result.issues[0].includes('Personal Identifiable Information'));
    });

    test('issues array contains the exact PII message', async () => {
      const result = await agent.execute({ pii: 'test@email.com' });
      assert.equal(result.issues[0], 'Personal Identifiable Information (PII) detected');
    });

    test('issues array has exactly one entry when pii is detected', async () => {
      const result = await agent.execute({ pii: 'somevalue' });
      assert.equal(result.issues.length, 1);
    });

    test('detects PII when pii field is a non-empty object', async () => {
      const result = await agent.execute({ pii: { name: 'Jane' } });
      assert.equal(result.compliant, false);
    });

    test('detects PII when pii field is an array with values', async () => {
      const result = await agent.execute({ pii: ['John'] });
      assert.equal(result.compliant, false);
    });

    test('detects PII when pii is numeric and truthy', async () => {
      const result = await agent.execute({ pii: 1 });
      assert.equal(result.compliant, false);
    });
  });

  describe('execute() - null/undefined data handling', () => {
    test('returns compliant: true when data is null (no pii key)', async () => {
      const result = await agent.execute(null);
      assert.equal(result.compliant, true);
      assert.deepEqual(result.issues, []);
    });
  });

  describe('execute() - checkTime field', () => {
    test('returns a checkTime property in ISO 8601 format', async () => {
      const before = new Date();
      const result = await agent.execute({});
      const after = new Date();

      const checkTime = new Date(result.checkTime);
      assert.ok(!isNaN(checkTime.getTime()), 'checkTime should be parseable as a date');
      assert.ok(checkTime >= before);
      assert.ok(checkTime <= after);
    });

    test('checkTime is a string', async () => {
      const result = await agent.execute({});
      assert.equal(typeof result.checkTime, 'string');
    });
  });

  describe('execute() - result structure', () => {
    test('result contains compliant, issues, and checkTime keys', async () => {
      const result = await agent.execute({});
      assert.ok('compliant' in result);
      assert.ok('issues' in result);
      assert.ok('checkTime' in result);
    });

    test('resolves (is async)', async () => {
      const promise = agent.execute({});
      assert.ok(promise instanceof Promise);
      await promise;
    });
  });
});