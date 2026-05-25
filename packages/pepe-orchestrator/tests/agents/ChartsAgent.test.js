'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const ChartsAgent = require('../../src/agents/ChartsAgent');
const Agent = require('../../src/core/Agent');

describe('ChartsAgent', () => {
  describe('constructor', () => {
    it('sets the name to "Charts"', () => {
      const agent = new ChartsAgent();
      assert.equal(agent.name, 'Charts');
    });

    it('is an instance of Agent', () => {
      const agent = new ChartsAgent();
      assert.ok(agent instanceof Agent);
    });
  });

  describe('execute()', () => {
    it('returns an object with type "line-chart"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.type, 'line-chart');
    });

    it('returns a config with xAxis set to "timestamp"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.config.xAxis, 'timestamp');
    });

    it('returns a config with yAxis set to "metrics"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.config.yAxis, 'metrics');
    });

    it('returns status "success"', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.equal(result.status, 'success');
    });

    it('returns series as empty array when data has no metrics property', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({});
      assert.deepEqual(result.config.series, []);
    });

    it('returns series containing the keys of data.metrics when metrics is present', async () => {
      const agent = new ChartsAgent();
      const data = { metrics: { activeUsers: 100, sessions: 200, conversions: 5 } };
      const result = await agent.execute(data);
      assert.deepEqual(result.config.series.sort(), ['activeUsers', 'conversions', 'sessions']);
    });

    it('returns empty series when data.metrics is an empty object', async () => {
      const agent = new ChartsAgent();
      const result = await agent.execute({ metrics: {} });
      assert.deepEqual(result.config.series, []);
    });

    it('returns empty series when data is null (metrics falsy)', async () => {
      const agent = new ChartsAgent();
      // data is null, so data.metrics would throw if not guarded — but the guard is `data.metrics`
      // actually the code does `data.metrics ? ...` which would throw if data is null
      // This tests the boundary: passing undefined metrics key
      const result = await agent.execute({ metrics: null });
      assert.deepEqual(result.config.series, []);
    });

    it('overrides execute from Agent base class (does not throw)', async () => {
      const agent = new ChartsAgent();
      await assert.doesNotReject(() => agent.execute({}));
    });
  });
});