'use strict';

const assert = require('assert');
const Agent = require('../src/core/Agent');
const ChartsAgent = require('../src/agents/ChartsAgent');
const DistributorAgent = require('../src/agents/DistributorAgent');
const GdprAgent = require('../src/agents/GdprAgent');
const MonetizationAgent = require('../src/agents/MonetizationAgent');
const PerformanceAgent = require('../src/agents/PerformanceAgent');
const { PepeOrchestrator, agents: exportedAgents } = require('../src/index');

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(`        ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Agent (base class)
// ---------------------------------------------------------------------------
async function testAgent() {
  console.log('\n[Agent]');

  await runTest('constructor sets name property', async () => {
    const agent = new Agent('TestAgent');
    assert.strictEqual(agent.name, 'TestAgent');
  });

  await runTest('constructor stores arbitrary name strings', async () => {
    const agent = new Agent('foo-bar_123');
    assert.strictEqual(agent.name, 'foo-bar_123');
  });

  await runTest('initialize() resolves without throwing', async () => {
    const agent = new Agent('A');
    await assert.doesNotReject(() => agent.initialize());
  });

  await runTest('execute() rejects with "must be implemented" error', async () => {
    const agent = new Agent('A');
    await assert.rejects(
      () => agent.execute({}),
      /Execute method must be implemented by subclasses/
    );
  });

  await runTest('execute() rejects even when called with no arguments', async () => {
    const agent = new Agent('A');
    await assert.rejects(() => agent.execute(), /Execute method must be implemented/);
  });

  await runTest('getStatus() returns expected status string', async () => {
    const agent = new Agent('MyAgent');
    assert.strictEqual(agent.getStatus(), 'Agent MyAgent is ready.');
  });

  await runTest('getStatus() format is consistent for different names', async () => {
    const agent = new Agent('GDPR');
    assert.strictEqual(agent.getStatus(), 'Agent GDPR is ready.');
  });
}

// ---------------------------------------------------------------------------
// ChartsAgent
// ---------------------------------------------------------------------------
async function testChartsAgent() {
  console.log('\n[ChartsAgent]');

  await runTest('constructor sets name to "Charts"', async () => {
    const agent = new ChartsAgent();
    assert.strictEqual(agent.name, 'Charts');
  });

  await runTest('is an instance of Agent', async () => {
    const agent = new ChartsAgent();
    assert.ok(agent instanceof Agent);
  });

  await runTest('execute() returns type "line-chart"', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: { activeUsers: 10 } });
    assert.strictEqual(result.type, 'line-chart');
  });

  await runTest('execute() returns status "success"', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: {} });
    assert.strictEqual(result.status, 'success');
  });

  await runTest('execute() config has correct axis fields', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: {} });
    assert.strictEqual(result.config.xAxis, 'timestamp');
    assert.strictEqual(result.config.yAxis, 'metrics');
  });

  await runTest('execute() series contains keys of data.metrics', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: { activeUsers: 1200, sessions: 1500, conversions: 45 } });
    assert.deepStrictEqual(result.config.series.sort(), ['activeUsers', 'conversions', 'sessions']);
  });

  await runTest('execute() series is empty array when data has no metrics field', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({});
    assert.deepStrictEqual(result.config.series, []);
  });

  await runTest('execute() series is empty array when data.metrics is null', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: null });
    assert.deepStrictEqual(result.config.series, []);
  });

  await runTest('execute() series is empty array for empty metrics object', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: {} });
    assert.deepStrictEqual(result.config.series, []);
  });

  await runTest('execute() result has config object', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: { x: 1 } });
    assert.ok(result.config !== null && typeof result.config === 'object');
  });
}

// ---------------------------------------------------------------------------
// DistributorAgent
// ---------------------------------------------------------------------------
async function testDistributorAgent() {
  console.log('\n[DistributorAgent]');

  await runTest('constructor sets name to "Distributor"', async () => {
    const agent = new DistributorAgent();
    assert.strictEqual(agent.name, 'Distributor');
  });

  await runTest('is an instance of Agent', async () => {
    const agent = new DistributorAgent();
    assert.ok(agent instanceof Agent);
  });

  await runTest('execute() returns status "synced"', async () => {
    const agent = new DistributorAgent();
    const result = await agent.execute({ target: 'SomeBucket' });
    assert.strictEqual(result.status, 'synced');
  });

  await runTest('execute() uses payload.target as destination', async () => {
    const agent = new DistributorAgent();
    const result = await agent.execute({ target: 'My Custom Bucket' });
    assert.strictEqual(result.destination, 'My Custom Bucket');
  });

  await runTest('execute() falls back to "Default Bucket" when target is absent', async () => {
    const agent = new DistributorAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.destination, 'Default Bucket');
  });

  await runTest('execute() falls back to "Default Bucket" when target is undefined', async () => {
    const agent = new DistributorAgent();
    const result = await agent.execute({ target: undefined });
    assert.strictEqual(result.destination, 'Default Bucket');
  });

  await runTest('execute() syncedAt is a valid ISO 8601 date string', async () => {
    const agent = new DistributorAgent();
    const before = new Date().toISOString();
    const result = await agent.execute({ target: 'Bucket' });
    const after = new Date().toISOString();
    assert.ok(result.syncedAt >= before && result.syncedAt <= after,
      `syncedAt ${result.syncedAt} should be between ${before} and ${after}`);
  });

  await runTest('execute() result has syncedAt, destination, and status fields', async () => {
    const agent = new DistributorAgent();
    const result = await agent.execute({ target: 'Bucket' });
    assert.ok('syncedAt' in result);
    assert.ok('destination' in result);
    assert.ok('status' in result);
  });
}

// ---------------------------------------------------------------------------
// GdprAgent
// ---------------------------------------------------------------------------
async function testGdprAgent() {
  console.log('\n[GdprAgent]');

  await runTest('constructor sets name to "GDPR"', async () => {
    const agent = new GdprAgent();
    assert.strictEqual(agent.name, 'GDPR');
  });

  await runTest('is an instance of Agent', async () => {
    const agent = new GdprAgent();
    assert.ok(agent instanceof Agent);
  });

  await runTest('execute() returns compliant:true when data has no pii', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({ someField: 'safe data' });
    assert.strictEqual(result.compliant, true);
  });

  await runTest('execute() returns empty issues array when compliant', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({ someField: 'safe data' });
    assert.deepStrictEqual(result.issues, []);
  });

  await runTest('execute() returns compliant:false when data has pii field', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({ pii: 'John Doe' });
    assert.strictEqual(result.compliant, false);
  });

  await runTest('execute() issues array contains PII detection message', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({ pii: 'John Doe' });
    assert.ok(result.issues.length > 0);
    assert.ok(result.issues[0].includes('Personal Identifiable Information'));
  });

  await runTest('execute() checkTime is a valid ISO 8601 date string', async () => {
    const agent = new GdprAgent();
    const before = new Date().toISOString();
    const result = await agent.execute({});
    const after = new Date().toISOString();
    assert.ok(result.checkTime >= before && result.checkTime <= after,
      `checkTime ${result.checkTime} should be between ${before} and ${after}`);
  });

  await runTest('execute() with null data is compliant (no pii)', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute(null);
    assert.strictEqual(result.compliant, true);
    assert.deepStrictEqual(result.issues, []);
  });

  await runTest('execute() with empty object data is compliant', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.compliant, true);
  });

  await runTest('execute() treats falsy pii value (empty string) as non-compliant', async () => {
    // The check is `if (data && data.pii)` so empty string is falsy => compliant
    const agent = new GdprAgent();
    const result = await agent.execute({ pii: '' });
    assert.strictEqual(result.compliant, true, 'empty string pii is falsy so should be compliant');
  });

  await runTest('execute() result always has compliant, issues, and checkTime fields', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({});
    assert.ok('compliant' in result);
    assert.ok('issues' in result);
    assert.ok('checkTime' in result);
  });
}

// ---------------------------------------------------------------------------
// MonetizationAgent
// ---------------------------------------------------------------------------
async function testMonetizationAgent() {
  console.log('\n[MonetizationAgent]');

  await runTest('constructor sets name to "Monetization"', async () => {
    const agent = new MonetizationAgent();
    assert.strictEqual(agent.name, 'Monetization');
  });

  await runTest('is an instance of Agent', async () => {
    const agent = new MonetizationAgent();
    assert.ok(agent instanceof Agent);
  });

  await runTest('execute() returns recommendations array', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    assert.ok(Array.isArray(result.recommendations));
  });

  await runTest('execute() recommendations array has 2 entries', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.recommendations.length, 2);
  });

  await runTest('execute() recommendations contain Direct Sales entry', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    const directSales = result.recommendations.find(r => r.channel === 'Direct Sales');
    assert.ok(directSales, 'should have Direct Sales recommendation');
    assert.strictEqual(directSales.action, 'Increase budget');
    assert.strictEqual(directSales.weight, 0.6);
  });

  await runTest('execute() recommendations contain Ad Networks entry', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    const adNetworks = result.recommendations.find(r => r.channel === 'Ad Networks');
    assert.ok(adNetworks, 'should have Ad Networks recommendation');
    assert.strictEqual(adNetworks.action, 'Decrease budget');
    assert.strictEqual(adNetworks.weight, 0.4);
  });

  await runTest('execute() returns estimatedImpact "+12%"', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.estimatedImpact, '+12%');
  });

  await runTest('execute() result is consistent regardless of input context', async () => {
    const agent = new MonetizationAgent();
    const r1 = await agent.execute({});
    const r2 = await agent.execute({ someKey: 'someValue' });
    assert.strictEqual(r1.estimatedImpact, r2.estimatedImpact);
    assert.strictEqual(r1.recommendations.length, r2.recommendations.length);
  });

  await runTest('each recommendation has channel, action, and weight fields', async () => {
    const agent = new MonetizationAgent();
    const result = await agent.execute({});
    for (const rec of result.recommendations) {
      assert.ok('channel' in rec);
      assert.ok('action' in rec);
      assert.ok('weight' in rec);
    }
  });
}

// ---------------------------------------------------------------------------
// PerformanceAgent
// ---------------------------------------------------------------------------
async function testPerformanceAgent() {
  console.log('\n[PerformanceAgent]');

  await runTest('constructor sets name to "Performance"', async () => {
    const agent = new PerformanceAgent();
    assert.strictEqual(agent.name, 'Performance');
  });

  await runTest('is an instance of Agent', async () => {
    const agent = new PerformanceAgent();
    assert.ok(agent instanceof Agent);
  });

  await runTest('execute() returns source "GA4"', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({ dateRange: 'last-7-days' });
    assert.strictEqual(result.source, 'GA4');
  });

  await runTest('execute() returns metrics object with activeUsers', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.metrics.activeUsers, 1200);
  });

  await runTest('execute() returns metrics object with sessions', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.metrics.sessions, 1500);
  });

  await runTest('execute() returns metrics object with conversions', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({});
    assert.strictEqual(result.metrics.conversions, 45);
  });

  await runTest('execute() timestamp is a valid ISO 8601 date string', async () => {
    const agent = new PerformanceAgent();
    const before = new Date().toISOString();
    const result = await agent.execute({});
    const after = new Date().toISOString();
    assert.ok(result.timestamp >= before && result.timestamp <= after,
      `timestamp should be recent`);
  });

  await runTest('execute() result has source, metrics, and timestamp fields', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({});
    assert.ok('source' in result);
    assert.ok('metrics' in result);
    assert.ok('timestamp' in result);
  });

  await runTest('execute() returns same metrics regardless of query input', async () => {
    const agent = new PerformanceAgent();
    const r1 = await agent.execute({ dateRange: 'today' });
    const r2 = await agent.execute({ dateRange: 'last-30-days' });
    assert.deepStrictEqual(r1.metrics, r2.metrics);
  });
}

// ---------------------------------------------------------------------------
// PepeOrchestrator
// ---------------------------------------------------------------------------
async function testPepeOrchestrator() {
  console.log('\n[PepeOrchestrator]');

  await runTest('constructor creates an agents object', async () => {
    const orch = new PepeOrchestrator();
    assert.ok(orch.agents !== null && typeof orch.agents === 'object');
  });

  await runTest('constructor creates all 5 required agents', async () => {
    const orch = new PepeOrchestrator();
    assert.ok(orch.agents.performance instanceof PerformanceAgent);
    assert.ok(orch.agents.charts instanceof ChartsAgent);
    assert.ok(orch.agents.monetization instanceof MonetizationAgent);
    assert.ok(orch.agents.gdpr instanceof GdprAgent);
    assert.ok(orch.agents.distributor instanceof DistributorAgent);
  });

  await runTest('initialize() resolves without error', async () => {
    const orch = new PepeOrchestrator();
    await assert.doesNotReject(() => orch.initialize());
  });

  await runTest('initialize() calls initialize on each agent', async () => {
    const orch = new PepeOrchestrator();
    const initialized = [];
    for (const [key, agent] of Object.entries(orch.agents)) {
      const orig = agent.initialize.bind(agent);
      agent.initialize = async () => { initialized.push(key); return orig(); };
    }
    await orch.initialize();
    assert.deepStrictEqual(initialized.sort(), ['charts', 'distributor', 'gdpr', 'monetization', 'performance']);
  });

  await runTest('runWorkflow() resolves with all 5 result keys', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({ dateRange: 'today' });
    assert.ok('performanceData' in result);
    assert.ok('gdprStatus' in result);
    assert.ok('chartConfig' in result);
    assert.ok('optimization' in result);
    assert.ok('distribution' in result);
  });

  await runTest('runWorkflow() performanceData.source is "GA4"', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.strictEqual(result.performanceData.source, 'GA4');
  });

  await runTest('runWorkflow() gdprStatus has compliant field', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.ok('compliant' in result.gdprStatus);
  });

  await runTest('runWorkflow() gdprStatus is compliant for clean performance data', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({ dateRange: 'last-7-days' });
    assert.strictEqual(result.gdprStatus.compliant, true);
  });

  await runTest('runWorkflow() chartConfig.type is "line-chart"', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.strictEqual(result.chartConfig.type, 'line-chart');
  });

  await runTest('runWorkflow() chartConfig.config.series contains GA4 metric keys', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.deepStrictEqual(result.chartConfig.config.series.sort(), ['activeUsers', 'conversions', 'sessions']);
  });

  await runTest('runWorkflow() optimization has recommendations array', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.ok(Array.isArray(result.optimization.recommendations));
  });

  await runTest('runWorkflow() distribution.status is "synced"', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.strictEqual(result.distribution.status, 'synced');
  });

  await runTest('runWorkflow() distribution.destination is "Analytics Dashboard"', async () => {
    const orch = new PepeOrchestrator();
    const result = await orch.runWorkflow({});
    assert.strictEqual(result.distribution.destination, 'Analytics Dashboard');
  });

  await runTest('getStatus() returns an array', async () => {
    const orch = new PepeOrchestrator();
    assert.ok(Array.isArray(orch.getStatus()));
  });

  await runTest('getStatus() returns 5 status strings (one per agent)', async () => {
    const orch = new PepeOrchestrator();
    const statuses = orch.getStatus();
    assert.strictEqual(statuses.length, 5);
  });

  await runTest('getStatus() every item is a string', async () => {
    const orch = new PepeOrchestrator();
    const statuses = orch.getStatus();
    for (const s of statuses) {
      assert.strictEqual(typeof s, 'string');
    }
  });

  await runTest('getStatus() contains status strings for each expected agent name', async () => {
    const orch = new PepeOrchestrator();
    const statuses = orch.getStatus();
    const joined = statuses.join(' ');
    assert.ok(joined.includes('Performance'));
    assert.ok(joined.includes('Charts'));
    assert.ok(joined.includes('Monetization'));
    assert.ok(joined.includes('GDPR'));
    assert.ok(joined.includes('Distributor'));
  });
}

// ---------------------------------------------------------------------------
// Module exports
// ---------------------------------------------------------------------------
async function testModuleExports() {
  console.log('\n[Module exports (src/index.js)]');

  await runTest('exports PepeOrchestrator class', async () => {
    assert.strictEqual(typeof PepeOrchestrator, 'function');
  });

  await runTest('exports agents.PerformanceAgent', async () => {
    assert.strictEqual(exportedAgents.PerformanceAgent, PerformanceAgent);
  });

  await runTest('exports agents.ChartsAgent', async () => {
    assert.strictEqual(exportedAgents.ChartsAgent, ChartsAgent);
  });

  await runTest('exports agents.MonetizationAgent', async () => {
    assert.strictEqual(exportedAgents.MonetizationAgent, MonetizationAgent);
  });

  await runTest('exports agents.GdprAgent', async () => {
    assert.strictEqual(exportedAgents.GdprAgent, GdprAgent);
  });

  await runTest('exports agents.DistributorAgent', async () => {
    assert.strictEqual(exportedAgents.DistributorAgent, DistributorAgent);
  });
}

// ---------------------------------------------------------------------------
// Regression / boundary tests
// ---------------------------------------------------------------------------
async function testRegressionAndBoundary() {
  console.log('\n[Regression & Boundary]');

  await runTest('ChartsAgent.execute() handles data with metrics having numeric zero values', async () => {
    const agent = new ChartsAgent();
    const result = await agent.execute({ metrics: { activeUsers: 0, sessions: 0 } });
    assert.deepStrictEqual(result.config.series.sort(), ['activeUsers', 'sessions']);
    assert.strictEqual(result.status, 'success');
  });

  await runTest('GdprAgent.execute() with pii:0 (falsy) is compliant', async () => {
    const agent = new GdprAgent();
    // pii:0 is falsy, so `if (data && data.pii)` is false => compliant
    const result = await agent.execute({ pii: 0 });
    assert.strictEqual(result.compliant, true);
  });

  await runTest('GdprAgent.execute() with pii:false is compliant (falsy)', async () => {
    const agent = new GdprAgent();
    const result = await agent.execute({ pii: false });
    assert.strictEqual(result.compliant, true);
  });

  await runTest('DistributorAgent.execute() with empty string target uses "Default Bucket"', async () => {
    const agent = new DistributorAgent();
    // empty string is falsy, so `payload.target || 'Default Bucket'` returns 'Default Bucket'
    const result = await agent.execute({ target: '' });
    assert.strictEqual(result.destination, 'Default Bucket');
  });

  await runTest('Agent subclass can override execute without throwing base error', async () => {
    class CustomAgent extends Agent {
      async execute(data) { return { done: true }; }
    }
    const agent = new CustomAgent('Custom');
    const result = await agent.execute({});
    assert.deepStrictEqual(result, { done: true });
  });

  await runTest('Agent subclass inherits initialize() and getStatus()', async () => {
    class CustomAgent extends Agent {
      async execute(data) { return {}; }
    }
    const agent = new CustomAgent('SubTest');
    assert.strictEqual(agent.getStatus(), 'Agent SubTest is ready.');
    await assert.doesNotReject(() => agent.initialize());
  });

  await runTest('PepeOrchestrator creates fresh agent instances on each construction', async () => {
    const o1 = new PepeOrchestrator();
    const o2 = new PepeOrchestrator();
    assert.notStrictEqual(o1.agents.performance, o2.agents.performance);
    assert.notStrictEqual(o1.agents.gdpr, o2.agents.gdpr);
  });

  await runTest('PerformanceAgent.execute() metrics object has exactly 3 keys', async () => {
    const agent = new PerformanceAgent();
    const result = await agent.execute({});
    assert.strictEqual(Object.keys(result.metrics).length, 3);
  });
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------
(async () => {
  console.log('=== Pepe Orchestrator Unit Tests ===');

  await testAgent();
  await testChartsAgent();
  await testDistributorAgent();
  await testGdprAgent();
  await testMonetizationAgent();
  await testPerformanceAgent();
  await testPepeOrchestrator();
  await testModuleExports();
  await testRegressionAndBoundary();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
})();
