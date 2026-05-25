'use strict';

const GdprAgent = require('../src/agents/GdprAgent');
const Agent = require('../src/core/Agent');

describe('GdprAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new GdprAgent();
  });

  describe('constructor', () => {
    it('sets name to "GDPR"', () => {
      expect(agent.name).toBe('GDPR');
    });

    it('is an instance of Agent', () => {
      expect(agent).toBeInstanceOf(Agent);
    });
  });

  describe('getStatus()', () => {
    it('returns "Agent GDPR is ready."', () => {
      expect(agent.getStatus()).toBe('Agent GDPR is ready.');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('returns an object with compliant, issues, and checkTime', async () => {
      const result = await agent.execute({});
      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('checkTime');
    });

    it('is compliant when data has no pii field', async () => {
      const result = await agent.execute({ someField: 'value' });
      expect(result.compliant).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('is compliant when data is an empty object', async () => {
      const result = await agent.execute({});
      expect(result.compliant).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('is not compliant when data has a pii field', async () => {
      const result = await agent.execute({ pii: 'John Doe' });
      expect(result.compliant).toBe(false);
    });

    it('issues array contains a PII-related message when pii is detected', async () => {
      const result = await agent.execute({ pii: 'Jane Smith' });
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0]).toBe('Personal Identifiable Information (PII) detected');
    });

    it('issues array is empty when no pii field is present', async () => {
      const result = await agent.execute({ name: 'safe-data' });
      expect(result.issues).toEqual([]);
    });

    it('checkTime is a valid ISO date string', async () => {
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      expect(result.checkTime >= before).toBe(true);
      expect(result.checkTime <= after).toBe(true);
    });

    it('checkTime can be parsed as a valid Date', async () => {
      const result = await agent.execute({});
      const parsed = new Date(result.checkTime);
      expect(isNaN(parsed.getTime())).toBe(false);
    });

    it('is compliant when data is null', async () => {
      const result = await agent.execute(null);
      expect(result.compliant).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('is compliant when data is undefined', async () => {
      const result = await agent.execute(undefined);
      expect(result.compliant).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it('pii value of falsy empty string does NOT trigger PII detection', async () => {
      // pii key exists but is empty string (falsy) - it still triggers because key exists
      const result = await agent.execute({ pii: '' });
      // '' is falsy, so data.pii evaluates to false, meaning no issue is pushed
      expect(result.compliant).toBe(true);
    });

    it('pii with a truthy value triggers PII detection', async () => {
      const result = await agent.execute({ pii: true });
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
    });

    it('returns a Promise', () => {
      expect(agent.execute({})).toBeInstanceOf(Promise);
    });

    it('issues is an Array', async () => {
      const result = await agent.execute({});
      expect(Array.isArray(result.issues)).toBe(true);
    });
  });
});