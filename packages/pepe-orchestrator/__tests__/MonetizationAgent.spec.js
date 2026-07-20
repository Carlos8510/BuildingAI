'use strict';

const MonetizationAgent = require('../src/agents/MonetizationAgent');
const Agent = require('../src/core/Agent');

describe('MonetizationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new MonetizationAgent();
  });

  describe('constructor', () => {
    it('sets name to "Monetization"', () => {
      expect(agent.name).toBe('Monetization');
    });

    it('is an instance of Agent', () => {
      expect(agent).toBeInstanceOf(Agent);
    });
  });

  describe('getStatus()', () => {
    it('returns "Agent Monetization is ready."', () => {
      expect(agent.getStatus()).toBe('Agent Monetization is ready.');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('returns an object with recommendations and estimatedImpact', async () => {
      const result = await agent.execute({});
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('estimatedImpact');
    });

    it('estimatedImpact is "+12%"', async () => {
      const result = await agent.execute({});
      expect(result.estimatedImpact).toBe('+12%');
    });

    it('recommendations is an array', async () => {
      const result = await agent.execute({});
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('recommendations contains exactly 2 items', async () => {
      const result = await agent.execute({});
      expect(result.recommendations).toHaveLength(2);
    });

    it('first recommendation is for "Direct Sales" with action "Increase budget"', async () => {
      const result = await agent.execute({});
      expect(result.recommendations[0]).toMatchObject({
        channel: 'Direct Sales',
        action: 'Increase budget',
        weight: 0.6
      });
    });

    it('second recommendation is for "Ad Networks" with action "Decrease budget"', async () => {
      const result = await agent.execute({});
      expect(result.recommendations[1]).toMatchObject({
        channel: 'Ad Networks',
        action: 'Decrease budget',
        weight: 0.4
      });
    });

    it('recommendation weights sum to 1.0', async () => {
      const result = await agent.execute({});
      const totalWeight = result.recommendations.reduce((sum, r) => sum + r.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0);
    });

    it('returns the same result regardless of input context', async () => {
      const result1 = await agent.execute({});
      const result2 = await agent.execute({ someKey: 'someValue' });
      expect(result1).toEqual(result2);
    });

    it('returns a Promise', () => {
      expect(agent.execute({})).toBeInstanceOf(Promise);
    });
  });
});