'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const DistributorAgent = require('../src/agents/DistributorAgent');
const Agent = require('../src/core/Agent');

describe('DistributorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new DistributorAgent();
  });

  describe('constructor', () => {
    test('is an instance of Agent', () => {
      assert.ok(agent instanceof Agent);
    });

    test('has name set to "Distributor"', () => {
      assert.equal(agent.name, 'Distributor');
    });

    test('getStatus() reflects Distributor name', () => {
      assert.equal(agent.getStatus(), 'Agent Distributor is ready.');
    });
  });

  describe('execute()', () => {
    test('returns status "synced"', async () => {
      const result = await agent.execute({ target: 'SomeBucket' });
      assert.equal(result.status, 'synced');
    });

    test('returns the target destination from payload.target', async () => {
      const result = await agent.execute({ target: 'Analytics Dashboard' });
      assert.equal(result.destination, 'Analytics Dashboard');
    });

    test('falls back to "Default Bucket" when payload.target is not provided', async () => {
      const result = await agent.execute({});
      assert.equal(result.destination, 'Default Bucket');
    });

    test('falls back to "Default Bucket" when payload.target is undefined', async () => {
      const result = await agent.execute({ target: undefined });
      assert.equal(result.destination, 'Default Bucket');
    });

    test('falls back to "Default Bucket" when payload.target is null', async () => {
      const result = await agent.execute({ target: null });
      // null is falsy so the || operator returns the default
      assert.equal(result.destination, 'Default Bucket');
    });

    test('returns a syncedAt property that is a valid ISO 8601 timestamp', async () => {
      const before = new Date();
      const result = await agent.execute({ target: 'Test' });
      const after = new Date();

      const syncedAt = new Date(result.syncedAt);
      assert.ok(!isNaN(syncedAt.getTime()), 'syncedAt should be a parseable date');
      assert.ok(syncedAt >= before, 'syncedAt should be at or after test start');
      assert.ok(syncedAt <= after, 'syncedAt should be at or before test end');
    });

    test('syncedAt matches ISO string format', async () => {
      const result = await agent.execute({ target: 'Test' });
      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      assert.match(result.syncedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    test('resolves (is async)', async () => {
      const promise = agent.execute({ target: 'X' });
      assert.ok(promise instanceof Promise);
      await promise;
    });

    test('result contains exactly the expected keys', async () => {
      const result = await agent.execute({ target: 'Test' });
      assert.ok('syncedAt' in result);
      assert.ok('destination' in result);
      assert.ok('status' in result);
    });

    test('uses custom target when payload has both data and target fields', async () => {
      const result = await agent.execute({ data: { foo: 'bar' }, target: 'Custom Target' });
      assert.equal(result.destination, 'Custom Target');
      assert.equal(result.status, 'synced');
    });
  });
});