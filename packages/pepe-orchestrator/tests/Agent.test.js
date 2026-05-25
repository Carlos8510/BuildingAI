'use strict';

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');

describe('Agent (base class)', () => {
  describe('constructor', () => {
    it('sets name property from argument', () => {
      const agent = new Agent('TestAgent');
      assert.equal(agent.name, 'TestAgent');
    });

    it('sets name to empty string when passed empty string', () => {
      const agent = new Agent('');
      assert.equal(agent.name, '');
    });

    it('sets name when passed numeric value', () => {
      const agent = new Agent(42);
      assert.equal(agent.name, 42);
    });
  });

  describe('getStatus()', () => {
    it('returns formatted status string including the agent name', () => {
      const agent = new Agent('MyAgent');
      assert.equal(agent.getStatus(), 'Agent MyAgent is ready.');
    });

    it('includes custom name in status string', () => {
      const agent = new Agent('CustomName');
      const status = agent.getStatus();
      assert.ok(status.includes('CustomName'), 'Status should include the agent name');
    });

    it('returns a string', () => {
      const agent = new Agent('AnyAgent');
      assert.equal(typeof agent.getStatus(), 'string');
    });
  });

  describe('initialize()', () => {
    it('returns a Promise', () => {
      const agent = new Agent('InitAgent');
      const result = agent.initialize();
      assert.ok(result instanceof Promise);
      return result;
    });

    it('resolves without a value (undefined)', async () => {
      const agent = new Agent('InitAgent');
      const result = await agent.initialize();
      assert.equal(result, undefined);
    });
  });

  describe('execute()', () => {
    it('throws Error when called directly on base class', async () => {
      const agent = new Agent('BaseAgent');
      await assert.rejects(
        () => agent.execute({ some: 'data' }),
        (err) => {
          assert.ok(err instanceof Error);
          assert.ok(err.message.includes('Execute method must be implemented by subclasses'));
          return true;
        }
      );
    });

    it('throws Error even with no arguments', async () => {
      const agent = new Agent('BaseAgent');
      await assert.rejects(
        () => agent.execute(),
        Error
      );
    });

    it('throws Error with null argument', async () => {
      const agent = new Agent('BaseAgent');
      await assert.rejects(
        () => agent.execute(null),
        Error
      );
    });
  });

  describe('subclass override', () => {
    class ConcreteAgent extends Agent {
      constructor() {
        super('Concrete');
      }
      async execute(data) {
        return { received: data, from: this.name };
      }
    }

    it('subclass can override execute() without throwing', async () => {
      const agent = new ConcreteAgent();
      const result = await agent.execute({ value: 1 });
      assert.deepEqual(result, { received: { value: 1 }, from: 'Concrete' });
    });

    it('subclass inherits getStatus() from base', () => {
      const agent = new ConcreteAgent();
      assert.equal(agent.getStatus(), 'Agent Concrete is ready.');
    });

    it('subclass inherits initialize() from base', async () => {
      const agent = new ConcreteAgent();
      const result = await agent.initialize();
      assert.equal(result, undefined);
    });
  });
});