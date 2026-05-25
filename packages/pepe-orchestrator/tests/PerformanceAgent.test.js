'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');
const PerformanceAgent = require('../src/agents/PerformanceAgent');

describe('PerformanceAgent', () => {
  describe('constructor', () => {
    it('creates an instance of Agent', () => {
      const agent = new PerformanceAgent();
      assert.ok(agent instanceof Agent);
    });

    it('creates an instance of PerformanceAgent', () => {
      const agent = new PerformanceAgent();
      assert.ok(agent instanceof PerformanceAgent);
    });

    it('sets name to "Performance"', () => {
      const agent = new PerformanceAgent();
      assert.equal(agent.name, 'Performance');
    });
  });

  describe('execute()', () => {
    it('returns a Promise', () => {
      const agent = new PerformanceAgent();
      const result = agent.execute({ dateRange: 'today' });
      assert.ok(result instanceof Promise);
      return result;
    });

    it('returns source "GA4"', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({ dateRange: 'today' });
      assert.equal(result.source, 'GA4');
    });

    it('returns metrics object with activeUsers', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok('activeUsers' in result.metrics);
    });

    it('returns metrics object with sessions', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok('sessions' in result.metrics);
    });

    it('returns metrics object with conversions', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok('conversions' in result.metrics);
    });

    it('returns activeUsers as 1200', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({ dateRange: 'last-7-days' });
      assert.equal(result.metrics.activeUsers, 1200);
    });

    it('returns sessions as 1500', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({ dateRange: 'last-7-days' });
      assert.equal(result.metrics.sessions, 1500);
    });

    it('returns conversions as 45', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({ dateRange: 'last-7-days' });
      assert.equal(result.metrics.conversions, 45);
    });

    it('returns timestamp as valid ISO 8601 date string', async () => {
      const agent = new PerformanceAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      assert.ok(result.timestamp >= before);
      assert.ok(result.timestamp <= after);
    });

    it('result contains source, metrics, and timestamp fields', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.ok('source' in result);
      assert.ok('metrics' in result);
      assert.ok('timestamp' in result);
    });

    it('returns same metrics regardless of query input', async () => {
      const agent = new PerformanceAgent();
      const result1 = await agent.execute({ dateRange: 'today' });
      const result2 = await agent.execute({ dateRange: 'last-30-days' });
      assert.deepEqual(result1.metrics, result2.metrics);
      assert.equal(result1.source, result2.source);
    });

    it('works with empty query object', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute({});
      assert.equal(result.source, 'GA4');
    });

    it('works with null query without throwing', async () => {
      const agent = new PerformanceAgent();
      const result = await agent.execute(null);
      assert.equal(result.source, 'GA4');
    });
  });

  describe('getStatus() (inherited)', () => {
    it('returns expected status string', () => {
      const agent = new PerformanceAgent();
      assert.equal(agent.getStatus(), 'Agent Performance is ready.');
    });
  });
});
