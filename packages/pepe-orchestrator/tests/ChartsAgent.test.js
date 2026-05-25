'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');
const ChartsAgent = require('../src/agents/ChartsAgent');

describe('ChartsAgent', () => {
  describe('constructor', () => {
    it('creates an instance of Agent', () => {
      const agent = new ChartsAgent();
      assert.ok(agent instanceof Agent);
    });

    it('creates an instance of ChartsAgent', () => {
      const agent = new ChartsAgent();
      assert.ok(agent instanceof ChartsAgent);
    });

    it('sets name to "Charts"', () => {
      const agent = new ChartsAgent();
      assert.equal(agent.name, 'Charts');
    });
  });

  describe('execute()', () => {
    it('returns an object with type "line-chart"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({ metrics: { activeUsers: 100 } });
      assert.equal(result.type, 'line-chart');
    });

    it('returns status "success"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.status, 'success');
    });

    it('returns config with xAxis "timestamp" and yAxis "metrics"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.config.xAxis, 'timestamp');
      assert.equal(result.config.yAxis, 'metrics');
    });

    it('returns series with metric keys when metrics are provided', async () => {
      const agent = new ChartsAgent();
      const data = { metrics: { activeUsers: 1200, sessions: 1500, conversions: 45 } };
      const result = await agent.execute(data);
      assert.deepEqual(result.config.series.sort(), ['activeUsers', 'conversions', 'sessions']);
    });

    it('returns empty series array when no metrics field is present', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.deepEqual(result.config.series, []);
    });

    it('returns empty series when metrics is null', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({ metrics: null });
      assert.deepEqual(result.config.series, []);
    });

    it('returns empty series when metrics is undefined', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({ metrics: undefined });
      assert.deepEqual(result.config.series, []);
    });

    it('returns series with single key for single metric', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({ metrics: { onlyMetric: 99 } });
      assert.deepEqual(result.config.series, ['onlyMetric']);
    });

    it('returns a Promise', () => {
      const agent = new ChartsAgent();
      const result = agent.execute({});
      assert.ok(result instanceof Promise);
      return result;
    });

    it('result has a config property', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.ok('config' in result);
    });

    it('series reflects all keys when multiple metrics given', async () => {
      const agent = new ChartsAgent();
      const data = { metrics: { a: 1, b: 2, c: 3, d: 4 } };
      const result = await agent.execute(data);
      assert.equal(result.config.series.length, 4);
      assert.deepEqual(result.config.series.sort(), ['a', 'b', 'c', 'd']);
    });
  });

  describe('getStatus() (inherited)', () => {
    it('returns expected status string', () => {
      const agent = new ChartsAgent();
      assert.equal(agent.getStatus(), 'Agent Charts is ready.');
    });
  });
});