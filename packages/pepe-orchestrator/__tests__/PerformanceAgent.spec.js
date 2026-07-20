'use strict';

const PerformanceAgent = require('../src/agents/PerformanceAgent');
const Agent = require('../src/core/Agent');

describe('PerformanceAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new PerformanceAgent();
  });

  describe('constructor', () => {
    it('sets name to "Performance"', () => {
      expect(agent.name).toBe('Performance');
    });

    it('is an instance of Agent', () => {
      expect(agent).toBeInstanceOf(Agent);
    });
  });

  describe('getStatus()', () => {
    it('returns "Agent Performance is ready."', () => {
      expect(agent.getStatus()).toBe('Agent Performance is ready.');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('returns an object with source, metrics, and timestamp', async () => {
      const result = await agent.execute({ dateRange: 'today' });
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('timestamp');
    });

    it('source is "GA4"', async () => {
      const result = await agent.execute({ dateRange: 'today' });
      expect(result.source).toBe('GA4');
    });

    it('metrics contains activeUsers, sessions, and conversions', async () => {
      const result = await agent.execute({});
      expect(result.metrics).toHaveProperty('activeUsers');
      expect(result.metrics).toHaveProperty('sessions');
      expect(result.metrics).toHaveProperty('conversions');
    });

    it('metrics.activeUsers is 1200', async () => {
      const result = await agent.execute({});
      expect(result.metrics.activeUsers).toBe(1200);
    });

    it('metrics.sessions is 1500', async () => {
      const result = await agent.execute({});
      expect(result.metrics.sessions).toBe(1500);
    });

    it('metrics.conversions is 45', async () => {
      const result = await agent.execute({});
      expect(result.metrics.conversions).toBe(45);
    });

    it('timestamp is a valid ISO date string', async () => {
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      expect(result.timestamp >= before).toBe(true);
      expect(result.timestamp <= after).toBe(true);
    });

    it('timestamp can be parsed as a valid Date', async () => {
      const result = await agent.execute({});
      const parsed = new Date(result.timestamp);
      expect(isNaN(parsed.getTime())).toBe(false);
    });

    it('returns the same structure regardless of query input', async () => {
      const result1 = await agent.execute({ dateRange: 'last-7-days' });
      const result2 = await agent.execute({ dateRange: 'today' });
      expect(result1.source).toBe(result2.source);
      expect(result1.metrics).toEqual(result2.metrics);
    });

    it('returns a Promise', () => {
      expect(agent.execute({})).toBeInstanceOf(Promise);
    });
  });
});