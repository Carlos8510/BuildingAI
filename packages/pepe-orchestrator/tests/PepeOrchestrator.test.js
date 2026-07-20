'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { PepeOrchestrator, agents } = require('../src/index');
const PerformanceAgent = require('../src/agents/PerformanceAgent');
const ChartsAgent = require('../src/agents/ChartsAgent');
const MonetizationAgent = require('../src/agents/MonetizationAgent');
const GdprAgent = require('../src/agents/GdprAgent');
const DistributorAgent = require('../src/agents/DistributorAgent');

describe('module exports (src/index.js)', () => {
  it('exports PepeOrchestrator constructor', () => {
    assert.ok(typeof PepeOrchestrator === 'function');
  });

  it('exports agents namespace object', () => {
    assert.ok(typeof agents === 'object');
    assert.ok(agents !== null);
  });

  it('agents namespace contains PerformanceAgent', () => {
    assert.ok(typeof agents.PerformanceAgent === 'function');
  });

  it('agents namespace contains ChartsAgent', () => {
    assert.ok(typeof agents.ChartsAgent === 'function');
  });

  it('agents namespace contains MonetizationAgent', () => {
    assert.ok(typeof agents.MonetizationAgent === 'function');
  });

  it('agents namespace contains GdprAgent', () => {
    assert.ok(typeof agents.GdprAgent === 'function');
  });

  it('agents namespace contains DistributorAgent', () => {
    assert.ok(typeof agents.DistributorAgent === 'function');
  });
});

describe('PepeOrchestrator', () => {
  describe('constructor', () => {
    it('creates an instance of PepeOrchestrator', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch instanceof PepeOrchestrator);
    });

    it('exposes an agents property', () => {
      const orch = new PepeOrchestrator();
      assert.ok(typeof orch.agents === 'object');
      assert.ok(orch.agents !== null);
    });

    it('creates a PerformanceAgent instance at agents.performance', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch.agents.performance instanceof PerformanceAgent);
    });

    it('creates a ChartsAgent instance at agents.charts', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch.agents.charts instanceof ChartsAgent);
    });

    it('creates a MonetizationAgent instance at agents.monetization', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch.agents.monetization instanceof MonetizationAgent);
    });

    it('creates a GdprAgent instance at agents.gdpr', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch.agents.gdpr instanceof GdprAgent);
    });

    it('creates a DistributorAgent instance at agents.distributor', () => {
      const orch = new PepeOrchestrator();
      assert.ok(orch.agents.distributor instanceof DistributorAgent);
    });

    it('creates exactly 5 agents', () => {
      const orch = new PepeOrchestrator();
      assert.equal(Object.keys(orch.agents).length, 5);
    });
  });

  describe('initialize()', () => {
    it('returns a Promise', () => {
      const orch = new PepeOrchestrator();
      const result = orch.initialize();
      assert.ok(result instanceof Promise);
      return result;
    });

    it('resolves without error', async () => {
      const orch = new PepeOrchestrator();
      await assert.doesNotReject(() => orch.initialize());
    });

    it('resolves to undefined', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.initialize();
      assert.equal(result, undefined);
    });

    it('can be called multiple times without error', async () => {
      const orch = new PepeOrchestrator();
      await orch.initialize();
      await assert.doesNotReject(() => orch.initialize());
    });
  });

  describe('getStatus()', () => {
    it('returns an array', () => {
      const orch = new PepeOrchestrator();
      assert.ok(Array.isArray(orch.getStatus()));
    });

    it('returns 5 status strings (one per agent)', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.equal(statuses.length, 5);
    });

    it('all status entries are strings', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      for (const s of statuses) {
        assert.equal(typeof s, 'string');
      }
    });

    it('includes status for Performance agent', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.ok(statuses.some(s => s.includes('Performance')));
    });

    it('includes status for Charts agent', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.ok(statuses.some(s => s.includes('Charts')));
    });

    it('includes status for Monetization agent', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.ok(statuses.some(s => s.includes('Monetization')));
    });

    it('includes status for GDPR agent', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.ok(statuses.some(s => s.includes('GDPR')));
    });

    it('includes status for Distributor agent', () => {
      const orch = new PepeOrchestrator();
      const statuses = orch.getStatus();
      assert.ok(statuses.some(s => s.includes('Distributor')));
    });
  });

  describe('runWorkflow()', () => {
    it('returns a Promise', () => {
      const orch = new PepeOrchestrator();
      const result = orch.runWorkflow({ dateRange: 'today' });
      assert.ok(result instanceof Promise);
      return result;
    });

    it('resolves without error', async () => {
      const orch = new PepeOrchestrator();
      await assert.doesNotReject(() => orch.runWorkflow({ dateRange: 'today' }));
    });

    it('result contains performanceData', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok('performanceData' in result);
    });

    it('result contains gdprStatus', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok('gdprStatus' in result);
    });

    it('result contains chartConfig', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok('chartConfig' in result);
    });

    it('result contains optimization', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok('optimization' in result);
    });

    it('result contains distribution', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok('distribution' in result);
    });

    it('distribution.status is "synced"', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({ dateRange: 'today' });
      assert.equal(result.distribution.status, 'synced');
    });

    it('distribution.destination is "Analytics Dashboard"', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({ dateRange: 'today' });
      assert.equal(result.distribution.destination, 'Analytics Dashboard');
    });

    it('performanceData.source is "GA4"', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({ dateRange: 'today' });
      assert.equal(result.performanceData.source, 'GA4');
    });

    it('gdprStatus is compliant for clean GA4 data (no pii)', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({ dateRange: 'today' });
      // GA4 mocked data has no pii field, so must be compliant
      assert.equal(result.gdprStatus.compliant, true);
    });

    it('chartConfig.type is "line-chart"', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.equal(result.chartConfig.type, 'line-chart');
    });

    it('optimization has recommendations array', async () => {
      const orch = new PepeOrchestrator();
      const result = await orch.runWorkflow({});
      assert.ok(Array.isArray(result.optimization.recommendations));
    });

    it('full workflow is repeatable (second call succeeds)', async () => {
      const orch = new PepeOrchestrator();
      await orch.runWorkflow({ dateRange: 'today' });
      await assert.doesNotReject(() => orch.runWorkflow({ dateRange: 'yesterday' }));
    });

    it('workflow runs without prior initialize() call', async () => {
      const orch = new PepeOrchestrator();
      await assert.doesNotReject(() => orch.runWorkflow({}));
    });
  });
});