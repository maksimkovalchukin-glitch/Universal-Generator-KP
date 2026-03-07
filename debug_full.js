const wf = JSON.parse(require('fs').readFileSync('n8n/workflow_kp.json','utf8'));

// Знайти UZE вузол що формує template_vars
const uzeNodes = wf.nodes.filter(n => n.name.startsWith('UZE'));
uzeNodes.forEach(n => {
  if (n.type === 'n8n-nodes-base.code') {
    console.log('=== ' + n.name + ' ===');
    console.log(n.parameters.jsCode);
    console.log();
  }
});
