'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');
const GdprAgent = require('../src/agents/GdprAgent');

describe('GdprAgent', () => {
  describe('constructor', () => {
    it('creates an instance of Agent', () => {
      const agent = new GdprAgent();
      assert.ok(agent instanceof Agent);
    });

    it('creates an instance of GdprAgent', () => {
      const agent = new GdprAgent();
      assert.ok(agent instanceof GdprAgent);
    });

    it('sets name to "GDPR"', () => {
      const agent = new GdprAgent();
      assert.equal(agent.name, 'GDPR');
    });
  });

  describe('execute() - compliant cases', () => {
    it('returns compliant: true when data has no pii field', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ metrics: { activeUsers: 100 } });
      assert.equal(result.compliant, true);
    });

    it('returns empty issues array when no pii is present', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ userId: 'anon-123' });
      assert.deepEqual(result.issues, []);
    });

    it('returns compliant: true for empty object', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({});
      assert.equal(result.compliant, true);
      assert.deepEqual(result.issues, []);
    });

    it('returns compliant: true when pii is falsy (zero)', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 0 });
      // 0 is falsy, so pii condition is not triggered
      assert.equal(result.compliant, true);
    });

    it('returns compliant: true when pii is false', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: false });
      assert.equal(result.compliant, true);
    });

    it('returns compliant: true when pii is empty string (falsy)', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: '' });
      assert.equal(result.compliant, true);
    });
  });

  describe('execute() - non-compliant cases', () => {
    it('returns compliant: false when pii field is a non-empty string', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'John Doe' });
      assert.equal(result.compliant, false);
    });

    it('returns one issue when pii is detected', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'some-data' });
      assert.equal(result.issues.length, 1);
    });

    it('includes PII detection message in issues', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 'Jane Smith' });
      assert.ok(
        result.issues[0].includes('Personal Identifiable Information'),
        'Issue message should mention PII'
      );
    });

    it('returns compliant: false when pii is a non-empty object', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: { name: 'John' } });
      assert.equal(result.compliant, false);
    });

    it('returns compliant: false when pii is a non-zero number', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: 1 });
      assert.equal(result.compliant, false);
    });

    it('returns compliant: false when pii is an array', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({ pii: ['email@example.com'] });
      assert.equal(result.compliant, false);
    });
  });

  describe('execute() - checkTime field', () => {
    it('returns checkTime as a valid ISO 8601 string', async () => {
      const agent = new GdprAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      assert.ok(result.checkTime >= before);
      assert.ok(result.checkTime <= after);
    });

    it('result contains compliant, issues, and checkTime fields', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute({});
      assert.ok('compliant' in result);
      assert.ok('issues' in result);
      assert.ok('checkTime' in result);
    });
  });

  describe('execute() - null/undefined data', () => {
    it('handles null data without throwing', async () => {
      const agent = new GdprAgent();
      const result = await agent.execute(null);
      assert.equal(result.compliant, true);
      assert.deepEqual(result.issues, []);
    });

    it('returns a Promise', () => {
      const agent = new GdprAgent();
      const result = agent.execute({});
      assert.ok(result instanceof Promise);
      return result;
    });
  });

  describe('getStatus() (inherited)', () => {
    it('returns expected status string', () => {
      const agent = new GdprAgent();
      assert.equal(agent.getStatus(), 'Agent GDPR is ready.');
    });
  });
});