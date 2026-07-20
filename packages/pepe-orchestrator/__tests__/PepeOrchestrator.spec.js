'use strict';

const { PepeOrchestrator, agents } = require('../src/index');
const PerformanceAgent = require('../src/agents/PerformanceAgent');
const ChartsAgent = require('../src/agents/ChartsAgent');
const MonetizationAgent = require('../src/agents/MonetizationAgent');
const GdprAgent = require('../src/agents/GdprAgent');
const DistributorAgent = require('../src/agents/DistributorAgent');

describe('PepeOrchestrator', () => {
  let orchestrator;

  beforeEach(() => {
    orchestrator = new PepeOrchestrator();
  });

  describe('constructor', () => {
    it('creates all five agents', () => {
      expect(orchestrator.agents).toHaveProperty('performance');
      expect(orchestrator.agents).toHaveProperty('charts');
      expect(orchestrator.agents).toHaveProperty('monetization');
      expect(orchestrator.agents).toHaveProperty('gdpr');
      expect(orchestrator.agents).toHaveProperty('distributor');
    });

    it('performance agent is an instance of PerformanceAgent', () => {
      expect(orchestrator.agents.performance).toBeInstanceOf(PerformanceAgent);
    });

    it('charts agent is an instance of ChartsAgent', () => {
      expect(orchestrator.agents.charts).toBeInstanceOf(ChartsAgent);
    });

    it('monetization agent is an instance of MonetizationAgent', () => {
      expect(orchestrator.agents.monetization).toBeInstanceOf(MonetizationAgent);
    });

    it('gdpr agent is an instance of GdprAgent', () => {
      expect(orchestrator.agents.gdpr).toBeInstanceOf(GdprAgent);
    });

    it('distributor agent is an instance of DistributorAgent', () => {
      expect(orchestrator.agents.distributor).toBeInstanceOf(DistributorAgent);
    });
  });

  describe('initialize()', () => {
    it('resolves without error', async () => {
      await expect(orchestrator.initialize()).resolves.toBeUndefined();
    });

    it('calls initialize on all agents', async () => {
      const spies = Object.values(orchestrator.agents).map(agent =>
        jest.spyOn(agent, 'initialize')
      );
      await orchestrator.initialize();
      spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
    });
  });

  describe('getStatus()', () => {
    it('returns an array', () => {
      expect(Array.isArray(orchestrator.getStatus())).toBe(true);
    });

    it('returns exactly 5 status strings (one per agent)', () => {
      expect(orchestrator.getStatus()).toHaveLength(5);
    });

    it('each status entry is a string', () => {
      orchestrator.getStatus().forEach(s => expect(typeof s).toBe('string'));
    });

    it('includes status for all agent names', () => {
      const statuses = orchestrator.getStatus();
      expect(statuses).toContain('Agent Performance is ready.');
      expect(statuses).toContain('Agent Charts is ready.');
      expect(statuses).toContain('Agent Monetization is ready.');
      expect(statuses).toContain('Agent GDPR is ready.');
      expect(statuses).toContain('Agent Distributor is ready.');
    });
  });

  describe('runWorkflow()', () => {
    it('returns an object with all five result keys', async () => {
      const result = await orchestrator.runWorkflow({ dateRange: 'today' });
      expect(result).toHaveProperty('performanceData');
      expect(result).toHaveProperty('gdprStatus');
      expect(result).toHaveProperty('chartConfig');
      expect(result).toHaveProperty('optimization');
      expect(result).toHaveProperty('distribution');
    });

    it('performanceData.source is "GA4"', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.performanceData.source).toBe('GA4');
    });

    it('gdprStatus.compliant is true when performance data has no pii', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.gdprStatus.compliant).toBe(true);
    });

    it('chartConfig.type is "line-chart"', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.chartConfig.type).toBe('line-chart');
    });

    it('chartConfig.config.series contains GA4 metric keys', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.chartConfig.config.series).toEqual(
        expect.arrayContaining(['activeUsers', 'sessions', 'conversions'])
      );
    });

    it('optimization.estimatedImpact is "+12%"', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.optimization.estimatedImpact).toBe('+12%');
    });

    it('distribution.status is "synced"', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.distribution.status).toBe('synced');
    });

    it('distribution.destination is "Analytics Dashboard"', async () => {
      const result = await orchestrator.runWorkflow({});
      expect(result.distribution.destination).toBe('Analytics Dashboard');
    });

    it('calls agents in sequence: performance -> gdpr -> charts -> monetization -> distributor', async () => {
      const callOrder = [];
      jest.spyOn(orchestrator.agents.performance, 'execute').mockImplementation(async () => {
        callOrder.push('performance');
        return { source: 'GA4', metrics: {}, timestamp: new Date().toISOString() };
      });
      jest.spyOn(orchestrator.agents.gdpr, 'execute').mockImplementation(async () => {
        callOrder.push('gdpr');
        return { compliant: true, issues: [], checkTime: new Date().toISOString() };
      });
      jest.spyOn(orchestrator.agents.charts, 'execute').mockImplementation(async () => {
        callOrder.push('charts');
        return { type: 'line-chart', config: { xAxis: 'timestamp', yAxis: 'metrics', series: [] }, status: 'success' };
      });
      jest.spyOn(orchestrator.agents.monetization, 'execute').mockImplementation(async () => {
        callOrder.push('monetization');
        return { recommendations: [], estimatedImpact: '+12%' };
      });
      jest.spyOn(orchestrator.agents.distributor, 'execute').mockImplementation(async () => {
        callOrder.push('distributor');
        return { syncedAt: new Date().toISOString(), destination: 'Analytics Dashboard', status: 'synced' };
      });

      await orchestrator.runWorkflow({});
      expect(callOrder).toEqual(['performance', 'gdpr', 'charts', 'monetization', 'distributor']);
    });

    it('passes performanceData to the gdpr agent', async () => {
      const gdprSpy = jest.spyOn(orchestrator.agents.gdpr, 'execute');
      const result = await orchestrator.runWorkflow({});
      expect(gdprSpy).toHaveBeenCalledWith(result.performanceData);
    });

    it('passes performanceData to the charts agent', async () => {
      const chartsSpy = jest.spyOn(orchestrator.agents.charts, 'execute');
      const result = await orchestrator.runWorkflow({});
      expect(chartsSpy).toHaveBeenCalledWith(result.performanceData);
    });

    it('passes performanceData to the monetization agent', async () => {
      const monetizationSpy = jest.spyOn(orchestrator.agents.monetization, 'execute');
      const result = await orchestrator.runWorkflow({});
      expect(monetizationSpy).toHaveBeenCalledWith(result.performanceData);
    });

    it('passes target "Analytics Dashboard" to the distributor agent', async () => {
      const distributorSpy = jest.spyOn(orchestrator.agents.distributor, 'execute');
      await orchestrator.runWorkflow({});
      const callArg = distributorSpy.mock.calls[0][0];
      expect(callArg.target).toBe('Analytics Dashboard');
    });

    it('returns a Promise', () => {
      expect(orchestrator.runWorkflow({})).toBeInstanceOf(Promise);
    });
  });
});

describe('Module exports', () => {
  it('exports PepeOrchestrator class', () => {
    expect(PepeOrchestrator).toBeDefined();
    expect(typeof PepeOrchestrator).toBe('function');
  });

  it('exports agents object', () => {
    expect(agents).toBeDefined();
    expect(typeof agents).toBe('object');
  });

  it('agents object contains all five agent classes', () => {
    expect(agents).toHaveProperty('PerformanceAgent');
    expect(agents).toHaveProperty('ChartsAgent');
    expect(agents).toHaveProperty('MonetizationAgent');
    expect(agents).toHaveProperty('GdprAgent');
    expect(agents).toHaveProperty('DistributorAgent');
  });

  it('agents.PerformanceAgent is the PerformanceAgent class', () => {
    expect(agents.PerformanceAgent).toBe(PerformanceAgent);
  });

  it('agents.ChartsAgent is the ChartsAgent class', () => {
    expect(agents.ChartsAgent).toBe(ChartsAgent);
  });

  it('agents.MonetizationAgent is the MonetizationAgent class', () => {
    expect(agents.MonetizationAgent).toBe(MonetizationAgent);
  });

  it('agents.GdprAgent is the GdprAgent class', () => {
    expect(agents.GdprAgent).toBe(GdprAgent);
  });

  it('agents.DistributorAgent is the DistributorAgent class', () => {
    expect(agents.DistributorAgent).toBe(DistributorAgent);
  });
});