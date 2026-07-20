'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { PepeOrchestrator, agents } = require('../src/index');
const PerformanceAgent = require('../src/agents/PerformanceAgent');
const ChartsAgent = require('../src/agents/ChartsAgent');
const MonetizationAgent = require('../src/agents/MonetizationAgent');
const GdprAgent = require('../src/agents/GdprAgent');
const DistributorAgent = require('../src/agents/DistributorAgent');

describe('module exports (src/index.js)', () => {
  it('exports PepeOrchestrator class', () => {
    assert.equal(typeof PepeOrchestrator, 'function');
  });

  it('exports agents object', () => {
    assert.ok(agents !== null && typeof agents === 'object');
  });

  it('exports agents.PerformanceAgent', () => {
    assert.equal(agents.PerformanceAgent, PerformanceAgent);
  });

  it('exports agents.ChartsAgent', () => {
    assert.equal(agents.ChartsAgent, ChartsAgent);
  });

  it('exports agents.MonetizationAgent', () => {
    assert.equal(agents.MonetizationAgent, MonetizationAgent);
  });

  it('exports agents.GdprAgent', () => {
    assert.equal(agents.GdprAgent, GdprAgent);
  });

  it('exports agents.DistributorAgent', () => {
    assert.equal(agents.DistributorAgent, DistributorAgent);
  });
});

describe('PepeOrchestrator', () => {
  describe('constructor', () => {
    it('creates an instance successfully', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator instanceof PepeOrchestrator);
    });

    it('creates a performance agent', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator.agents.performance instanceof PerformanceAgent);
    });

    it('creates a charts agent', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator.agents.charts instanceof ChartsAgent);
    });

    it('creates a monetization agent', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator.agents.monetization instanceof MonetizationAgent);
    });

    it('creates a gdpr agent', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator.agents.gdpr instanceof GdprAgent);
    });

    it('creates a distributor agent', () => {
      const orchestrator = new PepeOrchestrator();
      assert.ok(orchestrator.agents.distributor instanceof DistributorAgent);
    });

    it('has exactly 5 agents', () => {
      const orchestrator = new PepeOrchestrator();
      assert.equal(Object.keys(orchestrator.agents).length, 5);
    });
  });

  describe('initialize()', () => {
    it('resolves without throwing', async () => {
      const orchestrator = new PepeOrchestrator();
      await assert.doesNotReject(() => orchestrator.initialize());
    });

    it('returns undefined', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.initialize();
      assert.equal(result, undefined);
    });
  });

  describe('getStatus()', () => {
    it('returns an array', () => {
      const orchestrator = new PepeOrchestrator();
      const status = orchestrator.getStatus();
      assert.ok(Array.isArray(status));
    });

    it('returns an array with 5 entries (one per agent)', () => {
      const orchestrator = new PepeOrchestrator();
      const status = orchestrator.getStatus();
      assert.equal(status.length, 5);
    });

    it('each status entry is a non-empty string', () => {
      const orchestrator = new PepeOrchestrator();
      const status = orchestrator.getStatus();
      for (const entry of status) {
        assert.equal(typeof entry, 'string');
        assert.ok(entry.length > 0);
      }
    });

    it('status entries contain agent names', () => {
      const orchestrator = new PepeOrchestrator();
      const status = orchestrator.getStatus();
      const joined = status.join(' ');
      assert.ok(joined.includes('Performance'));
      assert.ok(joined.includes('Charts'));
      assert.ok(joined.includes('Monetization'));
      assert.ok(joined.includes('GDPR'));
      assert.ok(joined.includes('Distributor'));
    });
  });

  describe('runWorkflow()', () => {
    it('resolves without throwing', async () => {
      const orchestrator = new PepeOrchestrator();
      await assert.doesNotReject(() => orchestrator.runWorkflow({ dateRange: 'today' }));
    });

    it('returns an object with performanceData key', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.ok('performanceData' in result);
    });

    it('returns an object with gdprStatus key', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.ok('gdprStatus' in result);
    });

    it('returns an object with chartConfig key', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.ok('chartConfig' in result);
    });

    it('returns an object with optimization key', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.ok('optimization' in result);
    });

    it('returns an object with distribution key', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.ok('distribution' in result);
    });

    it('distribution.status is "synced"', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.distribution.status, 'synced');
    });

    it('distribution.destination is "Analytics Dashboard"', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.distribution.destination, 'Analytics Dashboard');
    });

    it('performanceData.source is "GA4"', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.performanceData.source, 'GA4');
    });

    it('gdprStatus.compliant is true for standard GA4 output (no pii field)', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.gdprStatus.compliant, true);
    });

    it('chartConfig.type is "line-chart"', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.chartConfig.type, 'line-chart');
    });

    it('optimization.estimatedImpact is "+12%"', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.optimization.estimatedImpact, '+12%');
    });

    it('chart series contains the keys from performanceData.metrics', async () => {
      const orchestrator = new PepeOrchestrator();
      const result = await orchestrator.runWorkflow({});
      const expectedSeries = Object.keys(result.performanceData.metrics).sort();
      assert.deepEqual(result.chartConfig.config.series.sort(), expectedSeries);
    });

    it('workflow can run multiple times independently', async () => {
      const orchestrator = new PepeOrchestrator();
      const result1 = await orchestrator.runWorkflow({ dateRange: 'today' });
      const result2 = await orchestrator.runWorkflow({ dateRange: 'last-7-days' });
      assert.equal(result1.distribution.status, 'synced');
      assert.equal(result2.distribution.status, 'synced');
    });

    it('each orchestrator instance runs workflow independently', async () => {
      const orch1 = new PepeOrchestrator();
      const orch2 = new PepeOrchestrator();
      const result1 = await orch1.runWorkflow({});
      const result2 = await orch2.runWorkflow({});
      assert.equal(result1.distribution.status, result2.distribution.status);
    });
  });
});
