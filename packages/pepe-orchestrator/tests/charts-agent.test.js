'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ChartsAgent = require('../src/agents/ChartsAgent');
const Agent = require('../src/core/Agent');

describe('ChartsAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ChartsAgent();
  });

  describe('constructor', () => {
    test('is an instance of Agent', () => {
      assert.ok(agent instanceof Agent);
    });

    test('has name set to "Charts"', () => {
      assert.equal(agent.name, 'Charts');
    });

    test('getStatus() reflects Charts name', () => {
      assert.equal(agent.getStatus(), 'Agent Charts is ready.');
    });
  });

  describe('execute()', () => {
    test('returns an object with type "line-chart"', async () => {
      const result = await agent.execute({ metrics: { users: 100 } });
      assert.equal(result.type, 'line-chart');
    });

    test('returns status "success"', async () => {
      const result = await agent.execute({ metrics: {} });
      assert.equal(result.status, 'success');
    });

    test('config has xAxis set to "timestamp"', async () => {
      const result = await agent.execute({ metrics: { sessions: 1 } });
      assert.equal(result.config.xAxis, 'timestamp');
    });

    test('config has yAxis set to "metrics"', async () => {
      const result = await agent.execute({ metrics: { sessions: 1 } });
      assert.equal(result.config.yAxis, 'metrics');
    });

    test('series contains the keys from data.metrics', async () => {
      const data = { metrics: { activeUsers: 1200, sessions: 1500, conversions: 45 } };
      const result = await agent.execute(data);
      assert.deepEqual(result.config.series.sort(), ['activeUsers', 'conversions', 'sessions']);
    });

    test('series is an empty array when data.metrics is undefined', async () => {
      const result = await agent.execute({});
      assert.deepEqual(result.config.series, []);
    });

    test('series is an empty array when data.metrics is null', async () => {
      const result = await agent.execute({ metrics: null });
      // null is falsy, so series should be []
      assert.deepEqual(result.config.series, []);
    });

    test('series is an empty array when data.metrics has no keys', async () => {
      const result = await agent.execute({ metrics: {} });
      assert.deepEqual(result.config.series, []);
    });

    test('series contains exactly the keys present in metrics', async () => {
      const data = { metrics: { foo: 1, bar: 2 } };
      const result = await agent.execute(data);
      assert.equal(result.config.series.length, 2);
      assert.ok(result.config.series.includes('foo'));
      assert.ok(result.config.series.includes('bar'));
    });

    test('result has a config object', async () => {
      const result = await agent.execute({ metrics: {} });
      assert.ok(result.config !== null && typeof result.config === 'object');
    });

    test('resolves (is async)', async () => {
      const promise = agent.execute({ metrics: { x: 1 } });
      assert.ok(promise instanceof Promise);
      await promise;
    });

    test('handles data without any properties gracefully', async () => {
      const result = await agent.execute({});
      assert.equal(result.type, 'line-chart');
      assert.equal(result.status, 'success');
      assert.deepEqual(result.config.series, []);
    });
  });
});