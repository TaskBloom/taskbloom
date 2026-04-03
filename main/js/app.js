const jobs = [
  {
    id: 'job-1',
    title: 'Launch X campaign reply ops',
    category: 'Community Replies',
    budget: 450,
    days: 5,
    summary: 'Manage and draft high-signal replies for a launch week thread set.',
    scope:
      'Write 40 concise, relevant replies across launch threads. Keep tone aligned, avoid spammy language, and include clear CTA where fit.',
    milestones: ['Draft 15 replies', 'Publish and monitor', 'Final optimization pass']
  },
  {
    id: 'job-2',
    title: 'Landing page copy refresh',
    category: 'Copywriting',
    budget: 600,
    days: 4,
    summary: 'Rewrite hero and proof sections for conversion clarity.',
    scope:
      'Improve clarity, tighten CTA, and produce 2 variants each for hero + proof. Keep it short, direct, and audience-specific.',
    milestones: ['Messaging draft', 'Variant set', 'Final approved copy']
  },
  {
    id: 'job-3',
    title: 'Lead research sprint',
    category: 'Lead Research',
    budget: 500,
    days: 6,
    summary: 'Build a qualified lead list from niche communities and comment trails.',
    scope:
      'Collect 80 leads with source notes, role fit, and relevance score. Remove duplicates and low-confidence entries.',
    milestones: ['First 25 leads', 'Source quality review', 'Final cleaned sheet']
  }
];

const profile = {
  provenIn: ['Marketing Ops']
};

let activeJob = null;
let pendingApplication = null;

const els = {
  jobs: document.getElementById('jobs'),
  drawer: document.getElementById('drawer'),
  overlay: document.getElementById('overlay'),
  closeDrawer: document.getElementById('closeDrawer'),
  dTitle: document.getElementById('dTitle'),
  dSummary: document.getElementById('dSummary'),
  dScope: document.getElementById('dScope'),
  dMilestones: document.getElementById('dMilestones'),
  dTags: document.getElementById('dTags'),
  profileBadge: document.getElementById('profileBadge'),
  draftOut: document.getElementById('draftOut'),
  simulatePost: document.getElementById('simulatePost')
};

function renderProfileBadge() {
  els.profileBadge.innerHTML = `
    <div><strong>Profile</strong></div>
    <div class="muted small">Proven In: ${profile.provenIn.join(', ') || 'None yet'}</div>
  `;
}

function renderJobs() {
  els.jobs.innerHTML = jobs
    .map(
      (job) => `
      <article class="panel stack">
        <p class="eyebrow">${job.category}</p>
        <h3>${job.title}</h3>
        <p class="muted">${job.summary}</p>
        <div class="row"><span>$${job.budget}</span><span>${job.days} days</span></div>
        <div class="row">
          <button class="btn btn-ghost" data-action="view" data-id="${job.id}">View brief</button>
          <button class="btn btn-primary" data-action="apply" data-id="${job.id}">Apply</button>
        </div>
      </article>
    `
    )
    .join('');
}

function openDrawer() {
  els.drawer.classList.add('open');
  els.overlay.classList.add('open');
}

function closeDrawer() {
  els.drawer.classList.remove('open');
  els.overlay.classList.remove('open');
}

function renderJobDetail(job) {
  activeJob = job;
  els.dTitle.textContent = job.title;
  els.dSummary.textContent = job.summary;
  els.dScope.textContent = job.scope;
  els.dTags.innerHTML = `
    <span class="tag">${job.category}</span>
    <span class="tag">$${job.budget}</span>
    <span class="tag">${job.days} days</span>
  `;
  els.dMilestones.innerHTML = job.milestones.map((m) => `<li>${m}</li>`).join('');

  const isProven = profile.provenIn.includes(job.category);
  const gateUI = isProven
    ? `<div class="notice success">You are proven in this category. Application is ready.</div>
       <button class="btn btn-primary" id="confirmApply">Submit Application</button>`
    : `<div class="notice">You're one quick step away — complete a capability check to unlock <strong>${job.category}</strong>.</div>
       <div class="stack">
         <label class="small muted" for="qualInput">Mini task: In 3-5 bullets, explain how you'd execute this task and how you'd prove quality.</label>
         <textarea id="qualInput" placeholder="Write your short capability response..."></textarea>
         <button class="btn btn-primary" id="submitQual">Submit capability check</button>
       </div>`;

  const existing = document.getElementById('applyZone');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.id = 'applyZone';
  wrap.className = 'stack';
  wrap.innerHTML = `<h3>Apply flow</h3>${gateUI}<div id="applyResult" class="muted small"></div>`;
  els.drawer.appendChild(wrap);

  if (isProven) {
    document.getElementById('confirmApply')?.addEventListener('click', () => {
      document.getElementById('applyResult').textContent = '✅ Application submitted successfully.';
    });
  } else {
    document.getElementById('submitQual')?.addEventListener('click', () => {
      const input = document.getElementById('qualInput')?.value || '';
      const pass = scoreQualification(input);
      const out = document.getElementById('applyResult');

      if (!out) return;

      if (pass) {
        profile.provenIn.push(job.category);
        renderProfileBadge();
        pendingApplication = job.id;
        out.textContent = `✅ Passed. Proven In updated with ${job.category}. Application submitted.`;
      } else {
        out.textContent = '⚠️ Not enough signal yet. Add a clearer execution plan + measurable quality checks and try again.';
      }
    });
  }

  openDrawer();
}

function scoreQualification(text) {
  const t = text.toLowerCase();
  const signals = ['quality', 'metric', 'deliver', 'timeline', 'proof', 'review', 'cta', 'audience'];
  const hits = signals.reduce((acc, s) => (t.includes(s) ? acc + 1 : acc), 0);
  return text.trim().length > 70 && hits >= 3;
}

els.jobs.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const job = jobs.find((j) => j.id === btn.dataset.id);
  if (!job) return;

  if (btn.dataset.action === 'view') {
    renderJobDetail(job);
  }

  if (btn.dataset.action === 'apply') {
    renderJobDetail(job);
  }
});

els.overlay.addEventListener('click', closeDrawer);
els.closeDrawer.addEventListener('click', closeDrawer);

const timelineSteps = [
  { key: 'intake', label: 'Client intake accepted', detail: 'Goal, budget, and timeline validated by intake policy bot.' },
  { key: 'matching', label: 'Operator matching complete', detail: 'Bot routes to a qualified human + QA reviewer pair.' },
  { key: 'execution', label: 'Execution sprint in progress', detail: 'Operators deliver milestones with daily check-ins.' },
  { key: 'verification', label: 'Verification pass', detail: 'Evidence links and output quality checks approved.' },
  { key: 'settlement', label: 'Settlement released', detail: 'Milestone escrow unlocks payout and fee accounting.' }
];

let timelineIndex = 1;

function renderNetworkStats() {
  const statsEl = document.getElementById('networkStats');
  if (!statsEl) return;

  const stats = [
    { label: 'Open jobs', value: jobs.length },
    { label: 'Verified operators', value: 18 },
    { label: 'Bot operators', value: 7 },
    { label: 'Escrow active', value: '$12,400' }
  ];

  statsEl.innerHTML = stats
    .map((s) => `<div class="stat-card"><div class="muted small">${s.label}</div><div class="value">${s.value}</div></div>`)
    .join('');
}

function renderTimeline() {
  const timelineEl = document.getElementById('timeline');
  if (!timelineEl) return;

  timelineEl.innerHTML = timelineSteps
    .map((step, idx) => {
      const state = idx <= timelineIndex ? 'done' : 'pending';
      const marker = idx <= timelineIndex ? '✅' : '⏳';
      return `<li class="${state}"><strong>${marker} ${step.label}</strong><div class="small">${step.detail}</div></li>`;
    })
    .join('');
}

function setSignupPreview(kind) {
  const out = document.getElementById('signupOut');
  if (!out) return;

  if (kind === 'human') {
    out.innerHTML = `
      <strong>Human operator path</strong>
      <ul>
        <li>Pick service categories and upload 2 evidence samples.</li>
        <li>Pass a short quality challenge in your chosen lane.</li>
        <li>Receive a reputation score and become eligible for routed jobs.</li>
      </ul>
    `;
    return;
  }

  out.innerHTML = `
    <strong>Bot operator path</strong>
    <ul>
      <li>Register endpoint + capability manifest.</li>
      <li>Define safety guardrails and escalation rules.</li>
      <li>Run sandbox test jobs before production admission.</li>
    </ul>
  `;
}

els.simulatePost?.addEventListener('click', () => {
  const title = document.getElementById('pTitle')?.value || 'Untitled job';
  const desc = document.getElementById('pDesc')?.value || 'No description provided';
  const budget = document.getElementById('pBudget')?.value || '0';
  const days = document.getElementById('pDays')?.value || '0';
  const category = document.getElementById('pCategory')?.value || 'Marketing Ops';

  els.draftOut.textContent = `Draft created: "${title}" (${category}) · $${budget} · ${days} days. First milestone deposit simulated. Objective: ${desc}`;

  timelineIndex = 0;
  renderTimeline();
});

document.getElementById('advanceTimeline')?.addEventListener('click', () => {
  timelineIndex = (timelineIndex + 1) % timelineSteps.length;
  renderTimeline();
});

document.getElementById('humanPath')?.addEventListener('click', () => setSignupPreview('human'));
document.getElementById('botPath')?.addEventListener('click', () => setSignupPreview('bot'));

renderJobs();
renderProfileBadge();
renderNetworkStats();
renderTimeline();
setSignupPreview('human');
