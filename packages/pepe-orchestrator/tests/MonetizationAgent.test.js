'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');
const MonetizationAgent = require('../src/agents/MonetizationAgent');

describe('MonetizationAgent', () => {
  describe('constructor', () => {
    it('creates an instance of Agent', () => {
      const agent = new MonetizationAgent();
      assert.ok(agent instanceof Agent);
    });

    it('creates an instance of MonetizationAgent', () => {
      const agent = new MonetizationAgent();
      assert.ok(agent instanceof MonetizationAgent);
    });

    it('sets name to "Monetization"', () => {
      const agent = new MonetizationAgent();
      assert.equal(agent.name, 'Monetization');
    });
  });

  describe('execute()', () => {
    it('returns a Promise', () => {
      const agent = new MonetizationAgent();
      const result = agent.execute({});
      assert.ok(result instanceof Promise);
      return result;
    });

    it('returns an object with recommendations array', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.ok(Array.isArray(result.recommendations));
    });

    it('returns exactly two recommendations', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({ someContext: 'value' });
      assert.equal(result.recommendations.length, 2);
    });

    it('first recommendation is for "Direct Sales"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].channel, 'Direct Sales');
    });

    it('second recommendation is for "Ad Networks"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].channel, 'Ad Networks');
    });

    it('Direct Sales has weight 0.6', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].weight, 0.6);
    });

    it('Ad Networks has weight 0.4', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].weight, 0.4);
    });

    it('recommendation weights sum to 1.0', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      const total = result.recommendations.reduce((sum, r) => sum + r.weight, 0);
      assert.ok(Math.abs(total - 1.0) < 1e-10, 'Weights should sum to 1.0');
    });

    it('each recommendation has channel, action, and weight fields', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      for (const rec of result.recommendations) {
        assert.ok('channel' in rec);
        assert.ok('action' in rec);
        assert.ok('weight' in rec);
      }
    });

    it('returns estimatedImpact "+12%"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.estimatedImpact, '+12%');
    });

    it('result contains recommendations and estimatedImpact fields', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.ok('recommendations' in result);
      assert.ok('estimatedImpact' in result);
    });

    it('is consistent across multiple calls (deterministic output)', async () => {
      const agent = new MonetizationAgent();
      const result1 = await agent.execute({ ctx: 'a' });
      const result2 = await agent.execute({ ctx: 'b' });
      assert.deepEqual(result1, result2);
    });
  });

  describe('getStatus() (inherited)', () => {
    it('returns expected status string', () => {
      const agent = new MonetizationAgent();
      assert.equal(agent.getStatus(), 'Agent Monetization is ready.');
    });
  });
});