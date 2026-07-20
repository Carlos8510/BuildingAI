'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Agent = require('../src/core/Agent');
const DistributorAgent = require('../src/agents/DistributorAgent');

describe('DistributorAgent', () => {
  describe('constructor', () => {
    it('creates an instance of Agent', () => {
      const agent = new DistributorAgent();
      assert.ok(agent instanceof Agent);
    });

    it('creates an instance of DistributorAgent', () => {
      const agent = new DistributorAgent();
      assert.ok(agent instanceof DistributorAgent);
    });

    it('sets name to "Distributor"', () => {
      const agent = new DistributorAgent();
      assert.equal(agent.name, 'Distributor');
    });
  });

  describe('execute()', () => {
    it('returns status "synced"', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: 'S3 Bucket' });
      assert.equal(result.status, 'synced');
    });

    it('uses payload.target as destination when provided', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: 'Analytics Dashboard' });
      assert.equal(result.destination, 'Analytics Dashboard');
    });

    it('falls back to "Default Bucket" when target is not provided', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({});
      assert.equal(result.destination, 'Default Bucket');
    });

    it('falls back to "Default Bucket" when target is undefined', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: undefined });
      assert.equal(result.destination, 'Default Bucket');
    });

    it('falls back to "Default Bucket" when target is null', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: null });
      assert.equal(result.destination, 'Default Bucket');
    });

    it('returns syncedAt as a valid ISO 8601 date string', async () => {
      const agent = new DistributorAgent();
      const before = new Date().toISOString();
      const result = await agent.execute({ target: 'bucket' });
      const after = new Date().toISOString();
      assert.ok(result.syncedAt >= before, 'syncedAt should be >= start of test');
      assert.ok(result.syncedAt <= after, 'syncedAt should be <= end of test');
    });

    it('returns a Promise', () => {
      const agent = new DistributorAgent();
      const result = agent.execute({ target: 'test' });
      assert.ok(result instanceof Promise);
      return result;
    });

    it('result contains syncedAt, destination, and status fields', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: 'X' });
      assert.ok('syncedAt' in result);
      assert.ok('destination' in result);
      assert.ok('status' in result);
    });

    it('uses empty string target when provided as empty string (falsy fallback)', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({ target: '' });
      // Empty string is falsy, so falls back to "Default Bucket"
      assert.equal(result.destination, 'Default Bucket');
    });

    it('works with additional payload properties without error', async () => {
      const agent = new DistributorAgent();
      const result = await agent.execute({
        target: 'Pipeline',
        data: { foo: 'bar' },
        extra: 42
      });
      assert.equal(result.destination, 'Pipeline');
      assert.equal(result.status, 'synced');
    });
  });

  describe('getStatus() (inherited)', () => {
    it('returns expected status string', () => {
      const agent = new DistributorAgent();
      assert.equal(agent.getStatus(), 'Agent Distributor is ready.');
    });
  });
});