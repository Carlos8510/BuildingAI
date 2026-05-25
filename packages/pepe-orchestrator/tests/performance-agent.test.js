'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const PerformanceAgent = require('../src/agents/PerformanceAgent');
const Agent = require('../src/core/Agent');

describe('PerformanceAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new PerformanceAgent();
  });

  describe('constructor', () => {
    test('is an instance of Agent', () => {
      assert.ok(agent instanceof Agent);
    });

    test('has name set to "Performance"', () => {
      assert.equal(agent.name, 'Performance');
    });

    test('getStatus() reflects Performance name', () => {
      assert.equal(agent.getStatus(), 'Agent Performance is ready.');
    });
  });

  describe('execute()', () => {
    test('resolves (is async)', async () => {
      const promise = agent.execute({ dateRange: 'last-7-days' });
      assert.ok(promise instanceof Promise);
      await promise;
    });

    test('returns source set to "GA4"', async () => {
      const result = await agent.execute({ dateRange: 'today' });
      assert.equal(result.source, 'GA4');
    });

    test('returns a metrics object', async () => {
      const result = await agent.execute({});
      assert.ok(result.metrics !== null && typeof result.metrics === 'object');
    });

    test('metrics contains activeUsers = 1200', async () => {
      const result = await agent.execute({});
      assert.equal(result.metrics.activeUsers, 1200);
    });

    test('metrics contains sessions = 1500', async () => {
      const result = await agent.execute({});
      assert.equal(result.metrics.sessions, 1500);
    });

    test('metrics contains conversions = 45', async () => {
      const result = await agent.execute({});
      assert.equal(result.metrics.conversions, 45);
    });

    test('returns a timestamp property', async () => {
      const result = await agent.execute({});
      assert.ok('timestamp' in result);
    });

    test('timestamp is a valid ISO 8601 date string', async () => {
      const before = new Date();
      const result = await agent.execute({});
      const after = new Date();

      const ts = new Date(result.timestamp);
      assert.ok(!isNaN(ts.getTime()), 'timestamp should be parseable as a date');
      assert.ok(ts >= before);
      assert.ok(ts <= after);
    });

    test('result contains source, metrics, and timestamp keys', async () => {
      const result = await agent.execute({});
      assert.ok('source' in result);
      assert.ok('metrics' in result);
      assert.ok('timestamp' in result);
    });

    test('result is the same regardless of the query argument', async () => {
      const result1 = await agent.execute({ dateRange: 'today' });
      const result2 = await agent.execute({ dateRange: 'last-30-days' });
      assert.equal(result1.source, result2.source);
      assert.deepEqual(result1.metrics, result2.metrics);
    });

    test('metrics has exactly the expected keys', async () => {
      const result = await agent.execute({});
      const keys = Object.keys(result.metrics).sort();
      assert.deepEqual(keys, ['activeUsers', 'conversions', 'sessions']);
    });

    test('handles null query without throwing', async () => {
      await assert.doesNotReject(() => agent.execute(null));
    });
  });
});
