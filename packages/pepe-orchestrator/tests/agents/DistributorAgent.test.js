'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const DistributorAgent = require('../../src/agents/DistributorAgent');
const Agent = require('../../src/core/Agent');

describe('DistributorAgent', () => {
  describe('constructor', () => {
    it('sets the name to "Distributor"', () => {
      const agent = new DistributorAgent();
      assert.equal(agent.name, 'Distributor');
    });

    it('is an instance of Agent', () => {
      const agent = new DistributorAgent();
      assert.ok(agent instanceof Agent);
    });
  });

  describe('execute()', () => {
    it('returns status "synced"', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({});
      assert.equal(result.status, 'synced');
    });

    it('returns syncedAt as a valid ISO 8601 date string', async () => {
      const agent = new DistributorAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({});
      const after = new Date().toISOString();
      assert.ok(result.syncedAt >= before, 'syncedAt should be after test start');
      assert.ok(result.syncedAt <= after, 'syncedAt should be before test end');
    });

    it('uses payload.target as the destination when provided', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: 'Analytics Dashboard' });
      assert.equal(result.destination, 'Analytics Dashboard');
    });

    it('defaults destination to "Default Bucket" when payload.target is not provided', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({});
      assert.equal(result.destination, 'Default Bucket');
    });

    it('defaults destination to "Default Bucket" when payload.target is undefined', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: undefined });
      assert.equal(result.destination, 'Default Bucket');
    });

    it('uses an empty string target when explicitly passed', async () => {
      const agent = new DistributorAgent();
      // Empty string is falsy, so fallback to 'Default Bucket'
      const result = await agent.execute({ target: '' });
      assert.equal(result.destination, 'Default Bucket');
    });

    it('returns an object with syncedAt, destination, and status keys', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: 'SomeBucket' });
      assert.ok('syncedAt' in result);
      assert.ok('destination' in result);
      assert.ok('status' in result);
    });

    it('overrides execute from Agent base class (does not throw)', async () => {
      const agent = new DistributorAgent();
      await assert.doesNotReject(() => agent.execute({}));
    });
  });
});