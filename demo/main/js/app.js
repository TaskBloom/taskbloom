const sampleJobs = [
  {
    title: 'Launch social growth for new AI tool',
    budget: '$2,500 fixed',
    duration: '14 days',
    category: 'Social Growth',
    summary: 'Grow a new X account and produce daily engagement loops.',
    scope: 'Client provides brand voice and offers. Operators produce posts, engage target audience, and report daily metrics.',
    milestones: ['M1: Setup + content map ($500)', 'M2: 7-day growth sprint ($1,000)', 'M3: final report + handoff ($1,000)']
  },
  {
    title: 'Run paid ads + creative testing for SaaS',
    budget: '$4,000 fixed',
    duration: '21 days',
    category: 'Ads Management',
    summary: 'Build ad sets, test creatives, and optimize CAC directionally.',
    scope: 'Bot routes creative and ad ops specialists. Team delivers weekly optimization report and clear next actions.',
    milestones: ['M1: campaign architecture ($1,000)', 'M2: creative test cycle ($1,500)', 'M3: optimization + report ($1,500)']
  },
  {
    title: 'Sales ops lead qualification sprint',
    budget: '$1,800 fixed',
    duration: '10 days',
    category: 'Sales Ops',
    summary: 'Qualify inbound leads and enrich CRM records for outbound readiness.',
    scope: 'Humans validate lead quality and enrichment. Bots monitor SLA and quality checks before final delivery.',
    milestones: ['M1: schema + workflow setup ($400)', 'M2: qualification run ($900)', 'M3: QA pass + export ($500)']
  }
];

const jobsEl = document.getElementById('jobs');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');

function openDrawer(job) {
  document.getElementById('dTitle').textContent = job.title;
  document.getElementById('dSummary').textContent = `${job.budget} • ${job.duration} • ${job.category}`;
  document.getElementById('dScope').textContent = job.scope;
  document.getElementById('dTags').innerHTML = `<span class='tag'>${job.category}</span><span class='tag'>Fixed price</span><span class='tag'>Milestone escrow</span>`;
  document.getElementById('dMilestones').innerHTML = job.milestones.map(m => `<li>${m}</li>`).join('');
  drawer.classList.add('open');
  overlay.classList.add('open');
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
}

sampleJobs.forEach(job => {
  const el = document.createElement('article');
  el.className = 'job';
  el.innerHTML = `<h3>${job.title}</h3><p class='muted' style='margin:.25rem 0 .45rem'>${job.summary}</p><div class='job-meta'><span>${job.budget}</span><span>${job.duration}</span><span>${job.category}</span><span>Click for full brief</span></div>`;
  el.addEventListener('click', () => openDrawer(job));
  jobsEl.appendChild(el);
});

document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

document.getElementById('simulatePost').addEventListener('click', () => {
  const t = document.getElementById('pTitle').value.trim() || 'Untitled job';
  const d = document.getElementById('pDesc').value.trim() || 'No description provided.';
  const b = Number(document.getElementById('pBudget').value || 0);
  const days = Number(document.getElementById('pDays').value || 0);
  const cat = document.getElementById('pCategory').value;
  const first = b ? Math.round(b * 0.4) : 'TBD';

  document.getElementById('draftOut').textContent = [
    `Title: ${t}`,
    `Category: ${cat}`,
    `Budget: ${b || 'TBD'} USD (fixed)`,
    `Timeline: ${days || 'TBD'} days`,
    '',
    'Draft accepted by bot intake layer.',
    `First milestone deposit required: ${first} USD equivalent into escrow.`,
    '',
    `Objective summary: ${d}`,
    '',
    'Next step: bot matching engine routes to suitable human operators.'
  ].join('\n');
});
