const { PepeOrchestrator } = require('./src/index');

async function test() {
  console.log('--- Starting Pepe Orchestrator Verification ---');
  const orchestrator = new PepeOrchestrator();

  try {
    await orchestrator.initialize();

    console.log('\nTesting Agent Status:');
    console.log(orchestrator.getStatus().join('\n'));

    console.log('\nRunning Workflow:');
    const results = await orchestrator.runWorkflow({ dateRange: 'today' });

    if (results && results.distribution.status === 'synced') {
      console.log('\n✅ Verification Successful: Workflow completed and data synced.');
    } else {
      console.error('\n❌ Verification Failed: Unexpected results.');
      process.exit(1);
    }

    console.log('\nTesting GDPR compliance failure scenario:');
    const gdprAgent = orchestrator.agents.gdpr;
    const gdprResult = await gdprAgent.execute({ pii: 'John Doe' });
    if (!gdprResult.compliant && gdprResult.issues.length > 0) {
      console.log('✅ GDPR Agent correctly identified PII.');
    } else {
      console.error('❌ GDPR Agent failed to identify PII.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Verification Failed with error:', error);
    process.exit(1);
  }

  console.log('\n--- Verification Finished ---');
}

test();
