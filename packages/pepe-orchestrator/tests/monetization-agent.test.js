'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const MonetizationAgent = require('../src/agents/MonetizationAgent');
const Agent = require('../src/core/Agent');

describe('MonetizationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new MonetizationAgent();
  });

  describe('constructor', () => {
    test('is an instance of Agent', () => {
      assert.ok(agent instanceof Agent);
    });

    test('has name set to "Monetization"', () => {
      assert.equal(agent.name, 'Monetization');
    });

    test('getStatus() reflects Monetization name', () => {
      assert.equal(agent.getStatus(), 'Agent Monetization is ready.');
    });
  });

  describe('execute()', () => {
    test('resolves (is async)', async () => {
      const promise = agent.execute({});
      assert.ok(promise instanceof Promise);
      await promise;
    });

    test('returns an object with a recommendations array', async () => {
      const result = await agent.execute({ context: 'test' });
      assert.ok(Array.isArray(result.recommendations));
    });

    test('recommendations array has exactly 2 entries', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations.length, 2);
    });

    test('first recommendation is for "Direct Sales"', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].channel, 'Direct Sales');
    });

    test('first recommendation action is "Increase budget"', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].action, 'Increase budget');
    });

    test('first recommendation weight is 0.6', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[0].weight, 0.6);
    });

    test('second recommendation is for "Ad Networks"', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].channel, 'Ad Networks');
    });

    test('second recommendation action is "Decrease budget"', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].action, 'Decrease budget');
    });

    test('second recommendation weight is 0.4', async () => {
      const result = await agent.execute({});
      assert.equal(result.recommendations[1].weight, 0.4);
    });

    test('recommendation weights sum to 1.0', async () => {
      const result = await agent.execute({});
      const total = result.recommendations.reduce((sum, r) => sum + r.weight, 0);
      assert.ok(Math.abs(total - 1.0) < 1e-10, `Expected weights to sum to 1.0, got ${total}`);
    });

    test('returns estimatedImpact field', async () => {
      const result = await agent.execute({});
      assert.ok('estimatedImpact' in result);
    });

    test('estimatedImpact is "+12%"', async () => {
      const result = await agent.execute({});
      assert.equal(result.estimatedImpact, '+12%');
    });

    test('each recommendation has channel, action, and weight properties', async () => {
      const result = await agent.execute({});
      for (const rec of result.recommendations) {
        assert.ok('channel' in rec, 'recommendation should have a channel');
        assert.ok('action' in rec, 'recommendation should have an action');
        assert.ok('weight' in rec, 'recommendation should have a weight');
      }
    });

    test('result is identical regardless of the context passed', async () => {
      const result1 = await agent.execute({ foo: 'bar' });
      const result2 = await agent.execute({});
      const result3 = await agent.execute(null);
      assert.equal(result1.estimatedImpact, result2.estimatedImpact);
      assert.equal(result2.estimatedImpact, result3.estimatedImpact);
      assert.equal(result1.recommendations.length, result2.recommendations.length);
    });
  });
});