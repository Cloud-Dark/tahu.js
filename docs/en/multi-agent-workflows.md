# Multi-Agent Workflows

Define and execute complex workflows where different agents collaborate on tasks, with dependencies between them.

```javascript
tahu.createAgent('DataGatherer', { systemPrompt: 'Gathers raw data.' });
tahu.createAgent('ReportGenerator', {
  systemPrompt: 'Generates reports from data.',
});

const workflow = tahu.createWorkflow([
  { agent: 'DataGatherer', task: 'collect_market_data' },
  {
    agent: 'ReportGenerator',
    task: 'create_summary_report',
    depends: ['collect_market_data'],
  },
]);

const workflowResults = await workflow.execute(
  'Market trends for renewable energy.'
);
console.log('Final Workflow Results:', workflowResults);
```