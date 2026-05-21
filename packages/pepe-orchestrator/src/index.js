const PerformanceAgent = require('./agents/PerformanceAgent');
const ChartsAgent = require('./agents/ChartsAgent');
const MonetizationAgent = require('./agents/MonetizationAgent');
const GdprAgent = require('./agents/GdprAgent');
const DistributorAgent = require('./agents/DistributorAgent');

/**
 * PepeOrchestrator - Coordinates and synchronizes multiple agents.
 */
class PepeOrchestrator {
  constructor() {
    this.agents = {
      performance: new PerformanceAgent(),
      charts: new ChartsAgent(),
      monetization: new MonetizationAgent(),
      gdpr: new GdprAgent(),
      distributor: new DistributorAgent()
    };
  }

  /**
   * Initializes all coordinated agents.
   */
  async initialize() {
    console.log('[Orchestrator] Initializing all agents...');
    for (const agent of Object.values(this.agents)) {
      await agent.initialize();
    }
    console.log('[Orchestrator] All agents initialized.');
  }

  /**
   * Runs a complete workflow through all agents.
   * @param {Object} input - Initial input for the performance agent.
   */
  async runWorkflow(input) {
    console.log('[Orchestrator] Starting workflow...');

    // 1. Get Performance Data
    const performanceData = await this.agents.performance.execute(input);

    // 2. Validate GDPR Compliance
    const gdprStatus = await this.agents.gdpr.execute(performanceData);
    if (!gdprStatus.compliant) {
      console.warn('[Orchestrator] GDPR Compliance check failed!', gdprStatus.issues);
    }

    // 3. Generate Visualizations
    const chartConfig = await this.agents.charts.execute(performanceData);

    // 4. Optimize Monetization
    const optimization = await this.agents.monetization.execute(performanceData);

    // 5. Synchronize and Distribute
    const distribution = await this.agents.distributor.execute({
      data: { performanceData, chartConfig, optimization },
      target: 'Analytics Dashboard'
    });

    console.log('[Orchestrator] Workflow completed successfully.');
    return {
      performanceData,
      gdprStatus,
      chartConfig,
      optimization,
      distribution
    };
  }

  /**
   * Returns the status of all agents.
   */
  getStatus() {
    return Object.values(this.agents).map(agent => agent.getStatus());
  }
}

// Export the orchestrator and the individual agents
module.exports = {
  PepeOrchestrator,
  agents: {
    PerformanceAgent,
    ChartsAgent,
    MonetizationAgent,
    GdprAgent,
    DistributorAgent
  }
};

// Auto-run if executed directly
if (require.main === module) {
  (async () => {
    const orchestrator = new PepeOrchestrator();
    await orchestrator.initialize();
    const results = await orchestrator.runWorkflow({ dateRange: 'last-7-days' });
    console.log('Final Results:', JSON.stringify(results, null, 2));
  })();
}
