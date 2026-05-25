'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MonetizationAgent = require('../../src/agents/MonetizationAgent');
const Agent = require('../../src/core/Agent');

describe('MonetizationAgent', () => {
  describe('constructor', () => {
    it('sets the name to "Monetization"', () => {
      const agent = new MonetizationAgent();
      assert.equal(agent.name, 'Monetization');
    });

    it('is an instance of Agent', () => {
      const agent = new MonetizationAgent();
      assert.ok(agent instanceof Agent);
    });
  });

  describe('execute()', () => {
    it('returns an object with a recommendations array', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.ok(Array.isArray(result.recommendations));
    });

    it('returns exactly 2 recommendations', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations.length, 2);
    });

    it('first recommendation has channel "Direct Sales"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].channel, 'Direct Sales');
    });

    it('first recommendation has action "Increase budget"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].action, 'Increase budget');
    });

    it('first recommendation has weight 0.6', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].weight, 0.6);
    });

    it('second recommendation has channel "Ad Networks"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].channel, 'Ad Networks');
    });

    it('second recommendation has action "Decrease budget"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].action, 'Decrease budget');
    });

    it('second recommendation has weight 0.4', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].weight, 0.4);
    });

    it('returns estimatedImpact of "+12%"', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      assert.equal(result.estimatedImpact, '+12%');
    });

    it('returns consistent results regardless of input context', async () => {
      const agent = new MonetizationAgent();
      const result1 = await agent.execute({ budget: 'high' });
      const result2 = await agent.execute({});
      assert.equal(result1.estimatedImpact, result2.estimatedImpact);
      assert.equal(result1.recommendations.length, result2.recommendations.length);
    });

    it('each recommendation has channel, action, and weight keys', async () => {
      const agent = new MonetizationAgent();
      const result = await agent.execute({});
      for (const rec of result.recommendations) {
        assert.ok('channel' in rec);
        assert.ok('action' in rec);
        assert.ok('weight' in rec);
      }
    });

    it('overrides execute from Agent base class (does not throw)', async () => {
      const agent = new MonetizationAgent();
      await assert.doesNotReject(() => agent.execute({}));
    });
  });
});