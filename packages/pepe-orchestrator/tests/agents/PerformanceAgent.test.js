'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const PerformanceAgent = require('../../src/agents/PerformanceAgent');
const Agent = require('../../src/core/Agent');

describe('PerformanceAgent', () => {
  describe('constructor', () => {
    it('sets the name to "Performance"', () => {
      const agent = new PerformanceAgent();
      assert.equal(agent.name, 'Performance');
    });

    it('is an instance of Agent', () => {
      const agent = new PerformanceAgent();
      assert.ok(agent instanceof Agent);
    });
  });

  describe('execute()', () => {
    it('returns source "GA4"', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({ dateRange: 'today' });
      assert.equal(result.source, 'GA4');
    });

    it('returns a metrics object', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok(result.metrics !== null && typeof result.metrics === 'object');
    });

    it('returns metrics.activeUsers as 1200', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.equal(result.metrics.activeUsers, 1200);
    });

    it('returns metrics.sessions as 1500', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.equal(result.metrics.sessions, 1500);
    });

    it('returns metrics.conversions as 45', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.equal(result.metrics.conversions, 45);
    });

    it('returns timestamp as a valid ISO 8601 date string', async () => {
      const agent = new PerformanceAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      assert.ok(result.timestamp >= before, 'timestamp should be after test start');
      assert.ok(result.timestamp <= after, 'timestamp should be before test end');
    });

    it('returns an object with source, metrics, and timestamp keys', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok('source' in result);
      assert.ok('metrics' in result);
      assert.ok('timestamp' in result);
    });

    it('returns consistent metrics regardless of query input', async () => {
      const agent = new PerformanceAgent();
      const result1 = await agent.execute({ dateRange: 'last-7-days' });
      const result2 = await agent.execute({ dateRange: 'today' });
      assert.deepEqual(result1.metrics, result2.metrics);
    });

    it('overrides execute from Agent base class (does not throw)', async () => {
      const agent = new PerformanceAgent();
      await assert.doesNotReject(() => agent.execute({}));
    });
  });
});