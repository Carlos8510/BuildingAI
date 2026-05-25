'use strict';

const ChartsAgent = require('../src/agents/ChartsAgent');
const Agent = require('../src/core/Agent');

describe('ChartsAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ChartsAgent();
  });

  describe('constructor', () => {
    it('sets name to "Charts"', () => {
      expect(agent.name).toBe('Charts');
    });

    it('is an instance of Agent', () => {
      expect(agent).toBeInstanceOf(Agent);
    });
  });

  describe('getStatus()', () => {
    it('returns "Agent Charts is ready."', () => {
      expect(agent.getStatus()).toBe('Agent Charts is ready.');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('returns an object with type, config, and status', async () => {
      const result = await agent.execute({});
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('config');
      expect(result).toHaveProperty('status');
    });

    it('returns type "line-chart"', async () => {
      const result = await agent.execute({});
      expect(result.type).toBe('line-chart');
    });

    it('returns status "success"', async () => {
      const result = await agent.execute({});
      expect(result.status).toBe('success');
    });

    it('config has xAxis set to "timestamp"', async () => {
      const result = await agent.execute({});
      expect(result.config.xAxis).toBe('timestamp');
    });

    it('config has yAxis set to "metrics"', async () => {
      const result = await agent.execute({});
      expect(result.config.yAxis).toBe('metrics');
    });

    it('series is populated with keys of data.metrics when metrics are provided', async () => {
      const data = { metrics: { activeUsers: 1200, sessions: 1500, conversions: 45 } };
      const result = await agent.execute(data);
      expect(result.config.series).toEqual(['activeUsers', 'sessions', 'conversions']);
    });

    it('series is an empty array when data.metrics is absent', async () => {
      const result = await agent.execute({});
      expect(result.config.series).toEqual([]);
    });

    it('series is an empty array when data.metrics is undefined explicitly', async () => {
      const result = await agent.execute({ metrics: undefined });
      expect(result.config.series).toEqual([]);
    });

    it('series reflects a single metric key', async () => {
      const result = await agent.execute({ metrics: { revenue: 999 } });
      expect(result.config.series).toEqual(['revenue']);
    });

    it('returns a Promise', () => {
      expect(agent.execute({})).toBeInstanceOf(Promise);
    });
  });
});