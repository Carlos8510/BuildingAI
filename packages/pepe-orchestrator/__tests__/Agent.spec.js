'use strict';

const Agent = require('../src/core/Agent');

describe('Agent (base class)', () => {
  describe('constructor', () => {
    it('sets the name property', () => {
      const agent = new Agent('TestAgent');
      expect(agent.name).toBe('TestAgent');
    });

    it('accepts any string as name', () => {
      const agent = new Agent('My Custom Agent');
      expect(agent.name).toBe('My Custom Agent');
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      const agent = new Agent('TestAgent');
      await expect(agent.initialize()).resolves.toBeUndefined();
    });

    it('can be called multiple times without error', async () => {
      const agent = new Agent('TestAgent');
      await expect(agent.initialize()).resolves.toBeUndefined();
      await expect(agent.initialize()).resolves.toBeUndefined();
    });
  });

  describe('execute()', () => {
    it('throws an error indicating subclasses must implement it', async () => {
      const agent = new Agent('TestAgent');
      await expect(agent.execute({})).rejects.toThrow(
        'Execute method must be implemented by subclasses'
      );
    });

    it('throws an Error instance', async () => {
      const agent = new Agent('TestAgent');
      await expect(agent.execute({})).rejects.toBeInstanceOf(Error);
    });

    it('throws when called with no arguments', async () => {
      const agent = new Agent('TestAgent');
      await expect(agent.execute()).rejects.toThrow(
        'Execute method must be implemented by subclasses'
      );
    });
  });

  describe('getStatus()', () => {
    it('returns the expected status string', () => {
      const agent = new Agent('TestAgent');
      expect(agent.getStatus()).toBe('Agent TestAgent is ready.');
    });

    it('includes the agent name in the status', () => {
      const agent = new Agent('SpecialAgent');
      expect(agent.getStatus()).toContain('SpecialAgent');
    });

    it('returns a string', () => {
      const agent = new Agent('TestAgent');
      expect(typeof agent.getStatus()).toBe('string');
    });
  });
});