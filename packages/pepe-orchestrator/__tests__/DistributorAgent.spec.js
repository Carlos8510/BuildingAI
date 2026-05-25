'use strict';

const DistributorAgent = require('../src/agents/DistributorAgent');
const Agent = require('../src/core/Agent');

describe('DistributorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new DistributorAgent();
  });

  describe('constructor', () => {
    it('sets name to "Distributor"', () => {
      expect(agent.name).toBe('Distributor');
    });

    it('is an instance of Agent', () => {
      expect(agent).toBeInstanceOf(Agent);
    });
  });

  describe('getStatus()', () => {
    it('returns "Agent Distributor is ready."', () => {
      expect(agent.getStatus()).toBe('Agent Distributor is ready.');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('returns an object with syncedAt, destination, and status', async () => {
      const result = await agent.execute({ target: 'MyBucket' });
      expect(result).toHaveProperty('syncedAt');
      expect(result).toHaveProperty('destination');
      expect(result).toHaveProperty('status');
    });

    it('status is "synced"', async () => {
      const result = await agent.execute({});
      expect(result.status).toBe('synced');
    });

    it('destination uses payload.target when provided', async () => {
      const result = await agent.execute({ target: 'Analytics Dashboard' });
      expect(result.destination).toBe('Analytics Dashboard');
    });

    it('destination defaults to "Default Bucket" when target is not provided', async () => {
      const result = await agent.execute({});
      expect(result.destination).toBe('Default Bucket');
    });

    it('destination defaults to "Default Bucket" when target is undefined', async () => {
      const result = await agent.execute({ target: undefined });
      expect(result.destination).toBe('Default Bucket');
    });

    it('syncedAt is a valid ISO date string', async () => {
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      expect(result.syncedAt >= before).toBe(true);
      expect(result.syncedAt <= after).toBe(true);
    });

    it('syncedAt can be parsed as a valid Date', async () => {
      const result = await agent.execute({});
      const parsed = new Date(result.syncedAt);
      expect(isNaN(parsed.getTime())).toBe(false);
    });

    it('returns a Promise', () => {
      expect(agent.execute({})).toBeInstanceOf(Promise);
    });

    it('destination uses an empty string target as falsy, defaulting to "Default Bucket"', async () => {
      const result = await agent.execute({ target: '' });
      expect(result.destination).toBe('Default Bucket');
    });
  });
});