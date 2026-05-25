'use strict';

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { PepeOrchestrator, agents } = require('../src/index');
const {
  PerformanceAgent,
  ChartsAgent,
  MonetizationAgent,
  GdprAgent,
  DistributorAgent
} = agents;

describe('src/index.js exports', () => {
  test('exports PepeOrchestrator class', () => {
    assert.equal(typeof PepeOrchestrator, 'function');
  });

  test('exports agents.PerformanceAgent', () => {
    assert.equal(typeof PerformanceAgent, 'function');
  });

  test('exports agents.ChartsAgent', () => {
    assert.equal(typeof ChartsAgent, 'function');
  });

  test('exports agents.MonetizationAgent', () => {
    assert.equal(typeof MonetizationAgent, 'function');
  });

  test('exports agents.GdprAgent', () => {
    assert.equal(typeof GdprAgent, 'function');
  });

  test('exports agents.DistributorAgent', () => {
    assert.equal(typeof DistributorAgent, 'function');
  });
});

describe('PepeOrchestrator', () => {
  let orchestrator;

  beforeEach(() => {
    orchestrator = new PepeOrchestrator();
  });

  describe('constructor', () => {
    test('creates a this.agents object with all five agents', () => {
      assert.ok(orchestrator.agents !== null && typeof orchestrator.agents === 'object');
      assert.ok('performance' in orchestrator.agents);
      assert.ok('charts' in orchestrator.agents);
      assert.ok('monetization' in orchestrator.agents);
      assert.ok('gdpr' in orchestrator.agents);
      assert.ok('distributor' in orchestrator.agents);
    });

    test('performance agent is a PerformanceAgent instance', () => {
      assert.ok(orchestrator.agents.performance instanceof PerformanceAgent);
    });

    test('charts agent is a ChartsAgent instance', () => {
      assert.ok(orchestrator.agents.charts instanceof ChartsAgent);
    });

    test('monetization agent is a MonetizationAgent instance', () => {
      assert.ok(orchestrator.agents.monetization instanceof MonetizationAgent);
    });

    test('gdpr agent is a GdprAgent instance', () => {
      assert.ok(orchestrator.agents.gdpr instanceof GdprAgent);
    });

    test('distributor agent is a DistributorAgent instance', () => {
      assert.ok(orchestrator.agents.distributor instanceof DistributorAgent);
    });
  });

  describe('initialize()', () => {
    test('resolves without error', async () => {
      await assert.doesNotReject(() => orchestrator.initialize());
    });

    test('returns undefined', async () => {
      const result = await orchestrator.initialize();
      assert.equal(result, undefined);
    });
  });

  describe('getStatus()', () => {
    test('returns an array', () => {
      const status = orchestrator.getStatus();
      assert.ok(Array.isArray(status));
    });

    test('returns 5 status strings (one per agent)', () => {
      const status = orchestrator.getStatus();
      assert.equal(status.length, 5);
    });

    test('all status entries are strings', () => {
      const status = orchestrator.getStatus();
      for (const s of status) {
        assert.equal(typeof s, 'string');
      }
    });

    test('status array includes status for the Performance agent', () => {
      const status = orchestrator.getStatus();
      assert.ok(status.some(s => s.includes('Performance')));
    });

    test('status array includes status for the Charts agent', () => {
      const status = orchestrator.getStatus();
      assert.ok(status.some(s => s.includes('Charts')));
    });

    test('status array includes status for the Monetization agent', () => {
      const status = orchestrator.getStatus();
      assert.ok(status.some(s => s.includes('Monetization')));
    });

    test('status array includes status for the GDPR agent', () => {
      const status = orchestrator.getStatus();
      assert.ok(status.some(s => s.includes('GDPR')));
    });

    test('status array includes status for the Distributor agent', () => {
      const status = orchestrator.getStatus();
      assert.ok(status.some(s => s.includes('Distributor')));
    });
  });

  describe('runWorkflow()', () => {
    test('resolves without error', async () => {
      await assert.doesNotReject(() => orchestrator.runWorkflow({ dateRange: 'today' }));
    });

    test('returns an object with performanceData', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.ok('performanceData' in result);
    });

    test('returns an object with gdprStatus', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.ok('gdprStatus' in result);
    });

    test('returns an object with chartConfig', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.ok('chartConfig' in result);
    });

    test('returns an object with optimization', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.ok('optimization' in result);
    });

    test('returns an object with distribution', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.ok('distribution' in result);
    });

    test('distribution.status is "synced"', async () => {
      const result = await orchestrator.runWorkflow({ dateRange: 'last-7-days' });
      assert.equal(result.distribution.status, 'synced');
    });

    test('distribution.destination is "Analytics Dashboard"', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.distribution.destination, 'Analytics Dashboard');
    });

    test('performanceData.source is "GA4"', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.performanceData.source, 'GA4');
    });

    test('gdprStatus for clean GA4 metrics data is compliant', async () => {
      const result = await orchestrator.runWorkflow({});
      // GA4 mock data has no pii field, so should be compliant
      assert.equal(result.gdprStatus.compliant, true);
    });

    test('chartConfig.type is "line-chart"', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.chartConfig.type, 'line-chart');
    });

    test('chartConfig.config.series reflects GA4 metrics keys', async () => {
      const result = await orchestrator.runWorkflow({});
      const expectedKeys = ['activeUsers', 'sessions', 'conversions'].sort();
      assert.deepEqual(result.chartConfig.config.series.sort(), expectedKeys);
    });

    test('optimization.estimatedImpact is "+12%"', async () => {
      const result = await orchestrator.runWorkflow({});
      assert.equal(result.optimization.estimatedImpact, '+12%');
    });

    test('workflow returns all 5 top-level keys', async () => {
      const result = await orchestrator.runWorkflow({});
      const keys = Object.keys(result).sort();
      assert.deepEqual(keys, ['chartConfig', 'distribution', 'gdprStatus', 'optimization', 'performanceData']);
    });

    test('can be called after initialize() without error', async () => {
      await orchestrator.initialize();
      await assert.doesNotReject(() => orchestrator.runWorkflow({ dateRange: 'today' }));
    });
  });
});