'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../../src/core/Agent');

describe('Agent (base class)', () => {
  describe('constructor', () => {
    it('sets the name property from the argument', () => {
      const agent = new Agent('TestAgent');
      assert.equal(agent.name, 'TestAgent');
    });

    it('sets the name to an empty string when passed an empty string', () => {
      const agent = new Agent('');
      assert.equal(agent.name, '');
    });

    it('sets the name when passed a non-string value', () => {
      const agent = new Agent(42);
      assert.equal(agent.name, 42);
    });
  });

  describe('initialize()', () => {
    it('resolves without throwing', async () => {
      const agent = new Agent('InitAgent');
      await assert.doesNotReject(() => agent.initialize());
    });

    it('returns undefined (no meaningful return value)', async () => {
      const agent = new Agent('InitAgent');
      const result = await agent.initialize();
      assert.equal(result, undefined);
    });
  });

  describe('execute()', () => {
    it('throws an error indicating subclasses must implement it', async () => {
      const agent = new Agent('ExecAgent');
      await assert.rejects(
        () => agent.execute({}),
        { message: 'Execute method must be implemented by subclasses' }
      );
    });

    it('throws even when called with no arguments', async () => {
      const agent = new Agent('ExecAgent');
      await assert.rejects(
        () => agent.execute(),
        Error
      );
    });
  });

  describe('getStatus()', () => {
    it('returns a string containing the agent name', () => {
      const agent = new Agent('MyAgent');
      assert.equal(agent.getStatus(), 'Agent MyAgent is ready.');
    });

    it('reflects name changes if name is mutated', () => {
      const agent = new Agent('OriginalName');
      agent.name = 'UpdatedName';
      assert.equal(agent.getStatus(), 'Agent UpdatedName is ready.');
    });
  });
});