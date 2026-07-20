/**
 * Base Agent class for the Pepe Orchestrator.
 * Defines the standard interface for all agents.
 */
class Agent {
  /**
   * @param {string} name - The name of the agent.
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Initializes the agent.
   * @returns {Promise<void>}
   */
  async initialize() {
    console.log(`[${this.name}] Initializing...`);
  }

  /**
   * Executes the agent's main task.
   * @param {any} data - Input data for the task.
   * @returns {Promise<any>}
   */
  async execute(data) {
    throw new Error('Execute method must be implemented by subclasses');
  }

  /**
   * Status of the agent.
   * @returns {string}
   */
  getStatus() {
    return `Agent ${this.name} is ready.`;
  }
}

module.exports = Agent;
