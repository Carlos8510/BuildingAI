'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');

describe('Agent (base class)', () => {
  describe('constructor', () => {
    test('sets the name property from the argument', () => {
      const agent = new Agent('TestAgent');
      assert.equal(agent.name, 'TestAgent');
    });

    test('preserves the exact name string including special characters', () => {
      const agent = new Agent('Agent-123_XYZ');
      assert.equal(agent.name, 'Agent-123_XYZ');
    });

    test('accepts an empty string as name', () => {
      const agent = new Agent('');
      assert.equal(agent.name, '');
    });
  });

  describe('initialize()', () => {
    test('resolves without error', async () => {
      const agent = new Agent('Init');
      await assert.doesNotReject(() => agent.initialize());
    });

    test('returns undefined (no meaningful return value)', async () => {
      const agent = new Agent('Init');
      const result = await agent.initialize();
      assert.equal(result, undefined);
    });
  });

  describe('execute()', () => {
    test('throws an error requiring subclass implementation', async () => {
      const agent = new Agent('Base');
      await assert.rejects(
        () => agent.execute({}),
        { message: 'Execute method must be implemented by subclasses' }
      );
    });

    test('throws an Error instance (not just any rejection)', async () => {
      const agent = new Agent('Base');
      await assert.rejects(
        () => agent.execute(null),
        (err) => {
          assert.ok(err instanceof Error);
          return true;
        }
      );
    });

    test('throws regardless of the data argument passed', async () => {
      const agent = new Agent('Base');
      for (const input of [undefined, null, 0, 'string', [], {}]) {
        await assert.rejects(() => agent.execute(input), Error);
      }
    });
  });

  describe('getStatus()', () => {
    test('returns a string containing the agent name', () => {
      const agent = new Agent('MyAgent');
      const status = agent.getStatus();
      assert.ok(typeof status === 'string');
      assert.ok(status.includes('MyAgent'));
    });

    test('returns the exact expected status message', () => {
      const agent = new Agent('MyAgent');
      assert.equal(agent.getStatus(), 'Agent MyAgent is ready.');
    });

    test('status message reflects the name set at construction', () => {
      const agent = new Agent('SpecialName');
      assert.equal(agent.getStatus(), 'Agent SpecialName is ready.');
    });
  });

  describe('subclass contract', () => {
    test('subclass can override execute() without error', async () => {
      class ConcreteAgent extends Agent {
        async execute(data) {
          return { processed: true, input: data };
        }
      }

      const agent = new ConcreteAgent('Concrete');
      const result = await agent.execute({ value: 42 });
      assert.deepEqual(result, { processed: true, input: { value: 42 } });
    });

    test('subclass inherits initialize() from Agent', async () => {
      class ConcreteAgent extends Agent {
        async execute() {}
      }

      const agent = new ConcreteAgent('Sub');
      await assert.doesNotReject(() => agent.initialize());
    });

    test('subclass inherits getStatus() from Agent', () => {
      class ConcreteAgent extends Agent {
        async execute() {}
      }

      const agent = new ConcreteAgent('SubStatus');
      assert.equal(agent.getStatus(), 'Agent SubStatus is ready.');
    });
  });
});