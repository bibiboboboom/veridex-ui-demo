/* Veridex fictional product demo. All companies, contracts, results, dates and metrics are illustrative. */

const state = {
  currentPage: 'overview',
  reviewStage: 'workspace',
  selectedFinding: 'delivery',
  findingFilter: 'all',
  acceptedFindings: [],
  dismissedFindings: [],
  counselRequested: false,
  screeningVerified: false,
  monitoringActive: false,
  draftSaved: false,
  draftLanguage: 'bilingual',
  contractFilter: 'all'
};

const reviewFindings = [
  {
    id: 'delivery',
    risk: 'high',
    category: 'Delivery & acceptance',
    section: 'Section 5.2',
    title: 'Delivery responsibility becomes unclear after the border handoff',
    summary: 'The contract does not say who bears delay costs between customs release and final delivery.',
    original: 'Delivery will occur following customs clearance at a time and location mutually agreed by the parties.',
    suggestion: 'Supplier will deliver the goods to Buyer’s San Antonio facility no later than ten business days after customs release. Supplier remains responsible for documented carrier coordination until signed delivery receipt.',
    signal: 'Strong signal',
    jurisdiction: 'Texas / Mexico cross-border',
    source: 'Internal supply-agreement playbook — illustrative, not legal authority',
    effectiveDate: 'Demo only',
    lastVerified: 'Pending source verification',
    humanReview: 'Required'
  },
  {
    id: 'payment',
    risk: 'medium',
    category: 'Payment operations',
    section: 'Section 7.1',
    title: 'Currency and bank-fee allocation are not defined',
    summary: 'Finance may not know the invoice currency or who absorbs intermediary bank charges.',
    original: 'Buyer will pay each undisputed invoice within thirty days after receipt.',
    suggestion: 'Invoices will be issued and paid in U.S. dollars. Each party will bear fees charged by its own bank, and Supplier will identify any intermediary-bank fees before invoicing.',
    signal: 'Moderate signal',
    jurisdiction: 'Commercial terms selected by the parties',
    source: 'Finance operations checklist — illustrative internal policy',
    effectiveDate: 'Demo only',
    lastVerified: 'Pending business-owner review',
    humanReview: 'Finance review required'
  },
  {
    id: 'renewal',
    risk: 'high',
    category: 'Renewal & exit',
    section: 'Section 12.3',
    title: 'Automatic renewal has no advance reminder or owner',
    summary: 'The agreement renews unless notice is sent, but the notice window is not operationalized.',
    original: 'The Agreement renews automatically for successive one-year terms unless either party provides timely notice.',
    suggestion: 'The Agreement renews for one additional year unless either party provides written non-renewal notice at least sixty days before the current term ends. Buyer will record the notice date in its contract calendar.',
    signal: 'Strong signal',
    jurisdiction: 'Contract-selected terms',
    source: 'Contract lifecycle playbook — illustrative internal policy',
    effectiveDate: 'Demo only',
    lastVerified: 'Pending source verification',
    humanReview: 'Required'
  },
  {
    id: 'certificate',
    risk: 'medium',
    category: 'Insurance evidence',
    section: 'Section 9.4',
    title: 'Evidence of coverage is not tied to shipment timing',
    summary: 'Operations has no clear trigger for collecting the supplier’s current certificate.',
    original: 'Supplier will maintain commercially reasonable insurance throughout the Term.',
    suggestion: 'Supplier will provide evidence of the agreed insurance coverage before the first shipment and again upon renewal of the relevant policy. Buyer may pause new shipment releases while evidence is outstanding.',
    signal: 'Moderate signal',
    jurisdiction: 'Business requirement; jurisdiction to be verified',
    source: 'Supplier onboarding checklist — illustrative internal policy',
    effectiveDate: 'Demo only',
    lastVerified: 'Pending business-owner review',
    humanReview: 'Operations review required'
  }
];

const pageDefinitions = {
  overview: { group: 'Workspace', title: 'Overview', render: renderOverview },
  draft: { group: 'Contract work', title: 'Draft & Translate', render: renderDraft },
  review: { group: 'Contract work', title: 'Review & Redline', render: renderReview },
  contracts: { group: 'Contract work', title: 'Contract Hub', render: renderContracts },
  screening: { group: 'Compliance', title: 'Counterparty Screening', render: renderScreening },
  sources: { group: 'Compliance', title: 'Sources & Policies', render: renderSources },
  obligations: { group: 'Lifecycle', title: 'Obligations & Renewals', render: renderObligations },
  counsel: { group: 'Expert support', title: 'Counsel Review', render: renderCounsel }
};

const icons = {
  document: '<path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5L14.5 3Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  review: '<path d="M4 4h12v16H4zM8 8h4M8 12h4"/><path d="m15 16 2 2 4-5"/>',
  shield: '<path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M10.3 4.4 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  pen: '<path d="m4 20 4.2-1 10.9-10.9a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20Z"/><path d="m14.5 6.5 3 3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  folder: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H9l2 2h6.5A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-12Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 15v4h16v-4"/>',
  sparkle: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10 20h4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 19h16"/>'
};

function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.document}</svg>`;
}

function pageHeader(eyebrow, title, subtitle, actions = '') {
  return `
    <div class="page-header">
      <div>
        <div class="page-eyebrow">${eyebrow}</div>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </div>`;
}

function renderOverview() {
  const counselLabel = state.counselRequested ? 'Counsel request sent' : 'Counsel review available';
  return `
    <section class="page">
      ${pageHeader('Action center', 'Good morning, Sofia', 'Move contracts forward without needing to translate legal language into operational tasks yourself.')}

      <div class="hero-card">
        <div>
          <div class="hero-kicker"><span></span> Featured demo workflow</div>
          <h2>Review a Texas–Mexico supplier agreement from intake to ongoing monitoring.</h2>
          <p>Follow a fictional procurement team as Veridex organizes bilingual drafting, third-party review, redlines, counterparty screening, counsel escalation and post-signature obligations.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="continue-review">${icon('review')} Continue illustrated review</button>
            <button class="btn secondary-dark" data-action="new-review">${icon('upload')} Start from intake</button>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-top"><strong>TX–MX Supply Agreement</strong><span class="tag dark">Fictional scenario</span></div>
          <div class="scenario-parties">
            <div class="party-row"><div class="party-avatar">LS</div><div class="party-copy"><strong>Lone Star Fixtures LLC</strong><span>Our company · Texas buyer · Fictional</span></div></div>
            <div class="party-row"><div class="party-avatar mx">MI</div><div class="party-copy"><strong>Monterrey Industrial Supply S.A.</strong><span>Counterparty · Mexico supplier · Fictional</span></div></div>
          </div>
          <div class="workflow-mini">
            <div class="workflow-step done">Intake</div>
            <div class="workflow-step done">Screen</div>
            <div class="workflow-step current">Review</div>
            <div class="workflow-step ${state.counselRequested ? 'done' : ''}">Counsel</div>
            <div class="workflow-step ${state.monitoringActive ? 'done' : ''}">Monitor</div>
          </div>
        </div>
      </div>

      <div class="stat-grid">
        ${statCard('document', '4', 'Active contracts', 'Illustrative count', '')}
        ${statCard('alert', '3', 'Items need attention', 'Illustrative count', 'amber')}
        ${statCard('shield', state.screeningVerified ? 'Verified' : '1 review', 'Screening status', 'Simulated result', 'green')}
        ${statCard('clock', '2 upcoming', 'Obligations this month', 'Illustrative dates', 'purple')}
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><div><div class="card-title">Priority work</div><div class="card-description">Fictional tasks ordered by operational urgency</div></div><button class="btn small ghost" data-navigate="contracts">View contract hub ${icon('arrow')}</button></div>
          <div class="priority-list">
            ${priorityRow('review', 'Supply agreement review', '4 AI-assisted findings · Human review required', 'Review now', 'review', 'Today', 'amber')}
            ${priorityRow('users', counselLabel, 'Delivery responsibility question · External review', state.counselRequested ? 'Track' : 'Prepare', 'counsel', 'Next', 'purple')}
            ${priorityRow('shield', 'Verify counterparty similarity', 'One simulated name similarity requires identity confirmation', state.screeningVerified ? 'Verified' : 'Review', 'screening', 'Today', 'green')}
            ${priorityRow('calendar', 'Insurance evidence reminder', 'Extracted from fictional signed contract · Section 9.4', 'Open', 'obligations', 'Jul 22', 'blue')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div><div class="card-title">Quick start</div><div class="card-description">Common tasks for a procurement admin</div></div></div>
          <div class="quick-actions">
            ${quickAction('pen', 'Draft a bilingual agreement', 'Start with business questions', 'draft', 'purple')}
            ${quickAction('upload', 'Review a third-party contract', 'Upload and choose review scope', 'review', '')}
            ${quickAction('search', 'Screen a counterparty', 'Inspect a simulated match', 'screening', 'green')}
            ${quickAction('clock', 'Track signed obligations', 'Payments, deliveries and renewals', 'obligations', 'amber')}
          </div>
        </div>
      </div>
    </section>`;
}

function statCard(iconName, value, label, footnote, color) {
  return `<div class="stat-card"><div class="mini-icon ${color}">${icon(iconName)}</div><div class="stat-copy"><strong>${value}</strong><span>${label}</span><small>${footnote}</small></div></div>`;
}

function priorityRow(iconName, title, subtitle, action, page, due, color) {
  return `<div class="priority-row"><div class="mini-icon ${color}">${icon(iconName)}</div><div class="row-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="due-copy"><strong>${due}</strong><span>Illustrative</span></div><button class="btn small" data-navigate="${page}">${action}</button></div>`;
}

function quickAction(iconName, title, subtitle, page, color) {
  return `<a class="quick-action" href="#${page}" data-navigate="${page}"><div class="mini-icon ${color}">${icon(iconName)}</div><div><strong>${title}</strong><span>${subtitle}</span></div></a>`;
}

function renderReview() {
  const actions = `
    <div class="stage-switch" aria-label="Review view">
      <button class="stage-button ${state.reviewStage === 'intake' ? 'active' : ''}" data-action="show-intake">Intake</button>
      <button class="stage-button ${state.reviewStage === 'workspace' ? 'active' : ''}" data-action="show-workspace">Review workspace</button>
    </div>
    ${state.reviewStage === 'workspace' ? `<button class="btn" data-action="demo-export">${icon('download')} Export demo report</button><button class="btn primary" data-action="request-counsel">${icon('external')} Request counsel</button>` : ''}`;
  return `
    <section class="page">
      ${pageHeader('Third-party contract review', state.reviewStage === 'intake' ? 'Set up an illustrated review' : 'Review findings in plain language', state.reviewStage === 'intake' ? 'Configure the business context before AI-assisted analysis begins.' : 'Compare the fictional agreement with AI-drafted redlines and source metadata. Human review is required.', actions)}
      ${state.reviewStage === 'intake' ? renderReviewIntake() : renderReviewWorkspace()}
    </section>`;
}

function renderReviewIntake() {
  return `
    <div class="intake-grid">
      <div class="card">
        <div class="card-header"><div><div class="card-title">1 · Contract document</div><div class="card-description">Static upload simulation for the investor demo</div></div><span class="tag blue">Fictional file</span></div>
        <div class="card-body">
          <div class="upload-zone" data-action="demo-upload">
            <div><div class="mini-icon">${icon('upload')}</div><strong>Drop a PDF or DOCX here</strong><span>In this static demo, the sample file below is already staged.</span></div>
          </div>
          <div class="file-row"><div class="mini-icon">${icon('document')}</div><div class="file-copy"><strong>TX_MX_Supply_Agreement_EN-ES.docx</strong><span>Fictional demo document · English + Spanish · Simulated extraction complete</span></div><span class="tag green">Ready</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><div class="card-title">2 · Business context</div><div class="card-description">Use operational language instead of Party A / Party B</div></div></div>
        <div class="card-body">
          <div class="form-grid">
            <label class="form-group"><span class="form-label">Our business role</span><select class="select-field"><option>Buyer / importer</option><option>Seller</option><option>Service customer</option></select></label>
            <label class="form-group"><span class="form-label">Counterparty role</span><select class="select-field"><option>Supplier / exporter</option><option>Service provider</option></select></label>
            <label class="form-group"><span class="form-label">Business locations</span><select class="select-field"><option>Texas, United States + Mexico</option></select></label>
            <label class="form-group"><span class="form-label">Languages</span><select class="select-field"><option>English + Spanish</option><option>English</option><option>Spanish</option></select></label>
            <div class="form-group full"><span class="form-label">Review focus</span><div class="check-grid">
              <label class="check-card"><input type="checkbox" checked> Delivery &amp; acceptance</label>
              <label class="check-card"><input type="checkbox" checked> Payment operations</label>
              <label class="check-card"><input type="checkbox" checked> Renewal &amp; termination</label>
              <label class="check-card"><input type="checkbox" checked> Cross-border indicators</label>
            </div></div>
            <label class="form-group full"><span class="form-label">Notes for the review</span><textarea class="textarea-field">Focus on delivery handoff, invoice currency, renewal reminders and documents we need before the first shipment.</textarea></label>
          </div>
          <div class="intake-actions"><button class="btn" data-action="demo-save">Save demo draft</button><button class="btn primary" data-action="run-review">${icon('sparkle')} Run illustrated AI review</button></div>
        </div>
      </div>
    </div>`;
}

function renderReviewWorkspace() {
  const visibleFindings = state.findingFilter === 'all' ? reviewFindings : reviewFindings.filter(item => item.risk === state.findingFilter);
  return `
    <div class="review-summary-grid">
      ${reviewSummaryCard('Overall signal', 'Needs attention', 'Qualitative demo result')}
      ${reviewSummaryCard('Findings', '4', '2 high · 2 medium')}
      ${reviewSummaryCard('Redlines accepted', String(state.acceptedFindings.length), 'User-controlled decision')}
      ${reviewSummaryCard('Human review', state.counselRequested ? 'Requested' : 'Required', 'AI is not final legal advice')}
    </div>
    <div class="review-layout">
      <div class="card review-panel">
        <div class="panel-toolbar"><div class="tabs"><button class="tab-button ${state.findingFilter === 'all' ? 'active' : ''}" data-action="filter-findings" data-filter="all">All 4</button><button class="tab-button ${state.findingFilter === 'high' ? 'active' : ''}" data-action="filter-findings" data-filter="high">High 2</button><button class="tab-button ${state.findingFilter === 'medium' ? 'active' : ''}" data-action="filter-findings" data-filter="medium">Medium 2</button></div><span class="illustrative">Illustrative analysis</span></div>
        <div class="panel-scroll" id="findings-panel">${visibleFindings.map(renderFindingCard).join('')}</div>
      </div>
      <div class="card review-panel">
        <div class="panel-toolbar"><div class="document-toolbar-copy"><strong>TX_MX_Supply_Agreement_EN-ES.docx</strong><span>Original fictional agreement · Click a highlighted clause</span></div><div class="tabs"><span class="tag red">High</span><span class="tag amber">Medium</span></div></div>
        <div class="panel-scroll" id="contract-panel">${renderContractDocument()}</div>
      </div>
    </div>`;
}

function reviewSummaryCard(label, value, note) {
  return `<div class="card review-summary-card"><div class="summary-label">${label}</div><div class="summary-main"><strong>${value}</strong></div><div class="illustrative">${note}</div></div>`;
}

function renderFindingCard(finding) {
  const accepted = state.acceptedFindings.includes(finding.id);
  const dismissed = state.dismissedFindings.includes(finding.id);
  const selected = state.selectedFinding === finding.id;
  const status = accepted ? '<span class="tag green">Accepted for draft</span>' : dismissed ? '<span class="tag">Dismissed</span>' : '';
  return `
    <article class="finding-card ${selected ? 'active' : ''} ${accepted ? 'accepted' : ''} ${dismissed ? 'dismissed' : ''}" data-finding-id="${finding.id}" tabindex="0">
      <div class="finding-head">
        <div class="risk-marker ${finding.risk === 'medium' ? 'medium' : ''}">${finding.risk === 'high' ? 'H' : 'M'}</div>
        <div class="finding-copy">
          <div class="finding-meta"><span class="tag ${finding.risk === 'high' ? 'red' : 'amber'}">${finding.risk}</span><span class="tag">${finding.category}</span><span class="illustrative">${finding.section}</span>${status}</div>
          <h3>${finding.title}</h3><p>${finding.summary}</p>
        </div>
      </div>
      <div class="finding-detail">
        <div class="detail-block"><span class="detail-label">Original text · fictional</span><div class="clause-box">“${finding.original}”</div></div>
        <div class="detail-block"><span class="detail-label">Suggested redline · AI draft</span><div class="clause-box suggestion">“${finding.suggestion}”</div></div>
        <div class="source-meta">
          ${metaCell('Jurisdiction', finding.jurisdiction)}${metaCell('Source', finding.source)}${metaCell('Effective Date', finding.effectiveDate)}${metaCell('Last Verified', finding.lastVerified)}${metaCell('Human Review Status', finding.humanReview)}${metaCell('AI signal', finding.signal)}
        </div>
        <div class="finding-actions">
          <button class="btn small ${accepted ? 'teal' : ''}" data-action="accept-finding" data-id="${finding.id}">${icon('check')} ${accepted ? 'Accepted' : 'Accept redline'}</button>
          <button class="btn small" data-action="dismiss-finding" data-id="${finding.id}">${dismissed ? 'Restore' : 'Dismiss'}</button>
          <button class="btn small" data-action="send-finding-counsel" data-id="${finding.id}">${icon('external')} Send to counsel</button>
        </div>
      </div>
    </article>`;
}

function metaCell(label, value) {
  return `<div class="meta-cell"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderContractDocument() {
  return `
    <article class="document-page">
      <h2>SUPPLY AND DELIVERY AGREEMENT</h2><span class="doc-subtitle">Fictional bilingual demo excerpt · Not legal advice</span>
      <p>This fictional Supply and Delivery Agreement is entered into between Lone Star Fixtures LLC (“Buyer”) and Monterrey Industrial Supply S.A. (“Supplier”) solely for demonstrating the Veridex interface.</p>
      <h3>3. PRODUCTS AND ORDERS</h3><p>Supplier will manufacture and provide the products described in each purchase order accepted by the parties. Purchase orders will identify quantities, specifications and requested shipment dates.</p>
      <h3>5. DELIVERY AND ACCEPTANCE</h3><div class="flagged-clause high ${state.selectedFinding === 'delivery' ? 'active' : ''}" data-clause-id="delivery"><p><strong>5.2</strong> Delivery will occur following customs clearance at a time and location mutually agreed by the parties.</p></div><p>Buyer may inspect delivered products and notify Supplier of visible nonconformities within the period stated in the applicable purchase order.</p>
      <h3>7. INVOICING AND PAYMENT</h3><div class="flagged-clause ${state.selectedFinding === 'payment' ? 'active' : ''}" data-clause-id="payment"><p><strong>7.1</strong> Buyer will pay each undisputed invoice within thirty days after receipt.</p></div><p>Supplier will provide reasonable supporting documentation for disputed invoice items.</p>
      <h3>9. INSURANCE AND DOCUMENTATION</h3><div class="flagged-clause ${state.selectedFinding === 'certificate' ? 'active' : ''}" data-clause-id="certificate"><p><strong>9.4</strong> Supplier will maintain commercially reasonable insurance throughout the Term.</p></div>
      <h3>12. TERM AND RENEWAL</h3><div class="flagged-clause high ${state.selectedFinding === 'renewal' ? 'active' : ''}" data-clause-id="renewal"><p><strong>12.3</strong> The Agreement renews automatically for successive one-year terms unless either party provides timely notice.</p></div>
      <h3>15. HUMAN REVIEW</h3><p>This demo excerpt is fictional. Any real contract language, jurisdiction selection or compliance conclusion must be reviewed against verified sources and, where appropriate, by licensed counsel.</p>
    </article>`;
}

function renderDraft() {
  const actions = `<button class="btn" data-action="demo-export">${icon('download')} Export demo DOCX</button><button class="btn primary" data-action="save-draft">${icon('check')} Save to Contract Hub</button>`;
  return `
    <section class="page">
      ${pageHeader('AI-assisted authoring', 'Draft and translate from business terms', 'Create an English, Spanish or bilingual starting draft. Every clause remains subject to human review.', actions)}
      <div class="draft-layout">
        <aside class="card draft-controls">
          <div class="wizard-progress">
            <div class="wizard-step done"><div class="step-dot">✓</div><div><strong>Business basics</strong><span>Parties and purpose</span></div></div>
            <div class="wizard-step done"><div class="step-dot">✓</div><div><strong>Commercial terms</strong><span>Delivery and payment</span></div></div>
            <div class="wizard-step active"><div class="step-dot">3</div><div><strong>Draft &amp; translate</strong><span>AI-assisted text</span></div></div>
            <div class="wizard-step"><div class="step-dot">4</div><div><strong>Human review</strong><span>Required before use</span></div></div>
          </div>
          <div class="draft-form">
            <span class="form-label">Output language</span>
            <div class="language-toggle">
              <button class="language-option ${state.draftLanguage === 'english' ? 'active' : ''}" data-action="set-language" data-language="english">English</button>
              <button class="language-option ${state.draftLanguage === 'spanish' ? 'active' : ''}" data-action="set-language" data-language="spanish">Español</button>
              <button class="language-option ${state.draftLanguage === 'bilingual' ? 'active' : ''}" data-action="set-language" data-language="bilingual">Bilingual</button>
            </div>
            <div class="form-grid">
              <label class="form-group full"><span class="form-label">Agreement type</span><select class="select-field"><option>Supplier agreement</option><option>Services agreement</option><option>Mutual NDA</option></select></label>
              <label class="form-group full"><span class="form-label">Our company</span><input class="field" value="Lone Star Fixtures LLC (Fictional)"></label>
              <label class="form-group full"><span class="form-label">Counterparty</span><input class="field" value="Monterrey Industrial Supply S.A. (Fictional)"></label>
              <label class="form-group full"><span class="form-label">Business objective</span><textarea class="textarea-field">Purchase fixture components with clear delivery, acceptance, payment and renewal operations.</textarea></label>
            </div>
            <div class="boundary-note">${icon('shield')} <span>AI-generated text is a starting draft, not final legal advice. Verified sources and qualified human review are required.</span></div>
          </div>
        </aside>
        <div class="card editor-shell">
          <div class="editor-toolbar"><button class="toolbar-button" data-action="demo-only"><b>B</b></button><button class="toolbar-button" data-action="demo-only"><i>I</i></button><button class="toolbar-button" data-action="demo-only">H1</button><div class="toolbar-separator"></div><span class="illustrative">Fictional draft · Unsaved changes</span><div class="topbar-spacer"></div><span class="tag purple">AI draft</span><span class="tag amber">Human review required</span></div>
          <div class="editor-scroll">${renderDraftDocuments()}</div>
          <div class="ai-compose-bar">${icon('sparkle')}<input class="field" id="draft-prompt" placeholder="Ask AI to clarify delivery timing or simplify a section…"><button class="btn primary" data-action="demo-generate">Generate</button></div>
        </div>
      </div>
    </section>`;
}

function renderDraftDocuments() {
  const english = `
    <article class="language-document"><div class="language-heading"><span>English draft</span><span>AI-assisted · Fictional</span></div><h2>SUPPLIER AGREEMENT</h2><h3>1. Purpose</h3><p>This fictional agreement describes the business terms under which Monterrey Industrial Supply S.A. (“Supplier”) will provide fixture components to Lone Star Fixtures LLC (“Buyer”).</p><h3>2. Orders and Specifications</h3><p>Each accepted purchase order will identify the products, quantities, specifications, price and requested delivery date.</p><h3>3. Delivery</h3><p>Supplier will coordinate delivery to Buyer’s San Antonio facility and provide the shipment documents identified by the parties. Delivery timing and responsibility after customs release will be stated in each purchase order.</p><h3>4. Payment</h3><p>Invoices will be issued in the currency selected by the parties and will reference the applicable purchase order. Buyer will notify Supplier of disputed items before the payment date.</p><h3>5. Review Status</h3><p>This text is an AI-assisted demo draft. It has not been verified as applicable law or approved by licensed counsel.</p></article>`;
  const spanish = `
    <article class="language-document"><div class="language-heading"><span>Borrador en español</span><span>Asistido por IA · Ficticio</span></div><h2>ACUERDO CON PROVEEDOR</h2><h3>1. Objeto</h3><p>Este acuerdo ficticio describe los términos comerciales bajo los cuales Monterrey Industrial Supply S.A. (“Proveedor”) suministrará componentes a Lone Star Fixtures LLC (“Comprador”).</p><h3>2. Pedidos y especificaciones</h3><p>Cada orden de compra aceptada identificará los productos, cantidades, especificaciones, precio y fecha de entrega solicitada.</p><h3>3. Entrega</h3><p>El Proveedor coordinará la entrega en las instalaciones del Comprador en San Antonio y proporcionará los documentos de envío acordados. Cada orden indicará el plazo y la responsabilidad después del despacho aduanero.</p><h3>4. Pago</h3><p>Las facturas se emitirán en la moneda seleccionada por las partes y harán referencia a la orden aplicable. El Comprador notificará los conceptos controvertidos antes de la fecha de pago.</p><h3>5. Estado de revisión</h3><p>Este texto es un borrador de demostración asistido por IA. No ha sido verificado como legislación aplicable ni aprobado por un abogado autorizado.</p></article>`;
  if (state.draftLanguage === 'english') return `<div class="bilingual-editor" style="grid-template-columns:1fr">${english}</div>`;
  if (state.draftLanguage === 'spanish') return `<div class="bilingual-editor" style="grid-template-columns:1fr">${spanish}</div>`;
  return `<div class="bilingual-editor">${english}${spanish}</div>`;
}

function renderContracts() {
  const records = [
    { name: 'TX–MX Supply Agreement', party: 'Monterrey Industrial Supply S.A. · Fictional', type: 'Supply', status: state.contractActive ? 'Active' : 'Under review', statusColor: state.contractActive ? 'green' : 'amber', owner: 'Sofia Martinez', next: state.contractActive ? 'Payment reminder · Jul 22' : 'Resolve 2 high findings' },
    { name: 'Equipment Maintenance Agreement', party: 'Alamo Service Works LLC · Fictional', type: 'Services', status: 'Active', statusColor: 'green', owner: 'Owen Lee', next: 'Certificate check · Aug 05' },
    { name: 'Mutual NDA — Project Mesa', party: 'Rio Norte Labs Inc. · Fictional', type: 'NDA', status: 'Ready for review', statusColor: 'blue', owner: 'Sofia Martinez', next: 'Internal review · Jul 18' },
    { name: state.draftSaved ? 'Bilingual Supplier Agreement Draft' : 'Fleet Services Order', party: state.draftSaved ? 'Saved from Draft & Translate · Fictional' : 'Hill Country Fleet Co. · Fictional', type: state.draftSaved ? 'Draft' : 'Order', status: state.draftSaved ? 'Draft' : 'Active', statusColor: state.draftSaved ? 'purple' : 'green', owner: 'Sofia Martinez', next: state.draftSaved ? 'Human review required' : 'Renewal decision · Dec 15' }
  ];
  const filtered = state.contractFilter === 'all' ? records : records.filter(record => record.status.toLowerCase().includes(state.contractFilter));
  const actions = `<button class="btn" data-navigate="draft">${icon('pen')} New draft</button><button class="btn primary" data-action="new-review">${icon('upload')} Review contract</button>`;
  return `
    <section class="page">
      ${pageHeader('Contract workspace', 'Contract Hub', 'A single operational view of fictional drafts, reviews, active contracts and next actions.', actions)}
      <div class="stat-grid">
        ${statCard('folder', '4', 'Contracts shown', 'Illustrative portfolio', '')}${statCard('review', '1', 'Under review', 'Illustrative count', 'amber')}${statCard('clock', '2', 'Upcoming obligations', 'Illustrative dates', 'purple')}${statCard('shield', '1', 'Screening review', 'Simulated result', 'green')}
      </div>
      <div class="card table-card" style="margin-top:14px">
        <div class="table-toolbar"><div class="tabs"><button class="tab-button ${state.contractFilter === 'all' ? 'active' : ''}" data-action="filter-contracts" data-filter="all">All</button><button class="tab-button ${state.contractFilter === 'draft' ? 'active' : ''}" data-action="filter-contracts" data-filter="draft">Drafts</button><button class="tab-button ${state.contractFilter === 'review' ? 'active' : ''}" data-action="filter-contracts" data-filter="review">Review</button><button class="tab-button ${state.contractFilter === 'active' ? 'active' : ''}" data-action="filter-contracts" data-filter="active">Active</button></div><span class="illustrative">All records are fictional / illustrative</span></div>
        <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Contract</th><th>Type</th><th>Status</th><th>Owner</th><th>Next action</th><th></th></tr></thead><tbody>${filtered.map(record => `<tr><td><div class="table-contract"><div class="mini-icon">${icon('document')}</div><div><strong>${record.name}</strong><span>${record.party}</span></div></div></td><td>${record.type}</td><td><span class="tag ${record.statusColor}">${record.status}</span></td><td>${record.owner}</td><td>${record.next}</td><td><button class="btn small" data-navigate="${record.name.startsWith('TX') ? 'review' : 'obligations'}">Open</button></td></tr>`).join('')}</tbody></table></div>
      </div>
    </section>`;
}

function renderScreening() {
  const statusTitle = state.screeningVerified ? 'Identity reviewed — simulated similarity resolved' : 'One simulated name similarity needs human verification';
  const statusText = state.screeningVerified ? 'The demo reviewer confirmed the counterparty identifiers do not match the simulated similar record.' : 'This is not a confirmed sanctions match. Compare legal name, location and identifiers before deciding what to do.';
  const actions = `<button class="btn" data-action="demo-export">${icon('download')} Export demo record</button>`;
  return `
    <section class="page">
      ${pageHeader('Counterparty risk', 'Screen a business before contracting', 'Display simulated sanctions and watchlist screening without presenting the result as a legal conclusion.', actions)}
      <div class="screening-grid">
        <div>
          <div class="card search-hero"><div class="card-title">Counterparty search</div><div class="card-description">Identifiers improve the quality of match review</div><div class="screening-search"><input class="field" value="Monterrey Industrial Supply S.A."><select class="select-field"><option>Mexico</option><option>United States</option></select><button class="btn primary" data-action="demo-screen">${icon('search')} Screen</button></div></div>
          <div class="card screening-result">
            <div class="result-banner"><div class="status-icon">${icon(state.screeningVerified ? 'check' : 'alert')}</div><div><h3>${statusTitle}</h3><p>${statusText}</p><div style="margin-top:7px"><span class="tag amber">Fictional result</span> <span class="tag ${state.screeningVerified ? 'green' : 'red'}">${state.screeningVerified ? 'Human reviewed' : 'Human review required'}</span></div></div></div>
            <div class="identity-grid">${identityCell('Legal name', 'Monterrey Industrial Supply S.A.')}${identityCell('Business location', 'Nuevo León, Mexico')}${identityCell('Identifier', 'Demo ID MX-0148')}${identityCell('Exact simulated matches', 'None')}${identityCell('Similar names', '1 · Review required')}${identityCell('Screened at', 'Jul 14, 2026 · Illustrative')}</div>
            <div class="source-list">
              <div class="source-row"><div class="source-icon">${icon('shield')}</div><div><strong>Configured sanctions dataset connector</strong><span>Source identity pending production configuration and verification</span></div><span class="tag amber">Demo placeholder</span></div>
              <div class="source-row"><div class="source-icon">${icon('book')}</div><div><strong>Internal restricted-party policy</strong><span>Illustrative company policy · Not a government source</span></div><span class="tag purple">Internal</span></div>
              <div class="source-row"><div class="source-icon">${icon('search')}</div><div><strong>Counterparty identity data</strong><span>Fictional name, location and demo identifier</span></div><span class="tag blue">Illustrative</span></div>
            </div>
            <div style="padding:0 15px 15px;display:flex;justify-content:flex-end;gap:8px"><button class="btn" data-action="request-counsel">Ask counsel about match</button><button class="btn primary" data-action="verify-screening" ${state.screeningVerified ? 'disabled' : ''}>${icon('check')} ${state.screeningVerified ? 'Identity verified in demo' : 'Mark identity reviewed'}</button></div>
          </div>
        </div>
        <aside class="card explain-card"><h3>How to read this result</h3><p>Screening organizes information for a trained reviewer. It does not guarantee that a business is risk-free.</p><div class="explain-steps"><div class="explain-step"><b>1</b><div><strong>Compare identifiers</strong><span>Check the full legal name, address and available identifiers.</span></div></div><div class="explain-step"><b>2</b><div><strong>Review the source</strong><span>Confirm jurisdiction, source, effective date and last verification.</span></div></div><div class="explain-step"><b>3</b><div><strong>Escalate uncertainty</strong><span>Send possible matches to a qualified human reviewer or licensed counsel.</span></div></div></div><div class="source-meta" style="margin-top:16px">${metaCell('Jurisdiction', 'Cross-border · To be verified')}${metaCell('Source', 'Production connector pending')}${metaCell('Effective Date', 'Not represented in demo')}${metaCell('Last Verified', 'Pending')}${metaCell('Human Review Status', state.screeningVerified ? 'Reviewed in demo' : 'Required')}${metaCell('Result type', 'Fictional / illustrative')}</div></aside>
      </div>
    </section>`;
}

function identityCell(label, value) {
  return `<div class="identity-cell"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderObligations() {
  const actions = state.monitoringActive ? `<button class="btn teal" disabled>${icon('check')} Monitoring active</button>` : `<button class="btn primary" data-action="activate-monitoring">${icon('clock')} Activate illustrated monitoring</button>`;
  const obligations = [
    { day: '22', month: 'Jul', title: 'Confirm first-invoice approval', detail: 'Source: Fictional agreement · Section 7.1', owner: 'FM', ownerName: 'Finance', status: 'Due soon', color: 'amber' },
    { day: '05', month: 'Aug', title: 'Collect current insurance evidence', detail: 'Source: Fictional agreement · Section 9.4', owner: 'OP', ownerName: 'Operations', status: 'Upcoming', color: 'blue' },
    { day: '18', month: 'Aug', title: 'Record first shipment acceptance', detail: 'Source: Fictional agreement · Section 5.2', owner: 'SM', ownerName: 'Sofia', status: 'Upcoming', color: 'blue' },
    { day: '15', month: 'Dec', title: 'Decide whether to send non-renewal notice', detail: 'Source: Fictional agreement · Section 12.3', owner: 'SM', ownerName: 'Sofia', status: 'Planned', color: 'purple' }
  ];
  return `
    <section class="page">
      ${pageHeader('Post-signature operations', 'Obligations & Renewals', 'Turn fictional contract clauses into owned payment, delivery, renewal and certificate tasks.', actions)}
      <div class="stat-grid">${statCard('clock', '4', 'Tracked obligations', 'Illustrative count', '')}${statCard('alert', '1', 'Due soon', 'Illustrative date', 'amber')}${statCard('calendar', '1', 'Renewal decision', 'Illustrative date', 'purple')}${statCard('users', '3', 'Business owners', 'Illustrative team', 'green')}</div>
      <div class="obligation-layout" style="margin-top:14px">
        <div class="card"><div class="card-header"><div><div class="card-title">Upcoming obligations</div><div class="card-description">Dates and owners extracted from a fictional signed agreement</div></div><span class="tag ${state.monitoringActive ? 'green' : 'amber'}">${state.monitoringActive ? 'Monitoring active' : 'Not activated'}</span></div><div class="obligation-list">${obligations.map(item => `<div class="obligation-row"><div class="obligation-date"><strong>${item.day}</strong><span>${item.month}</span></div><div class="row-copy"><strong>${item.title}</strong><span>${item.detail}</span></div><div class="owner-chip"><div class="avatar">${item.owner}</div>${item.ownerName}</div><span class="tag ${item.color}">${item.status}</span></div>`).join('')}</div></div>
        <aside class="card"><div class="card-header"><div><div class="card-title">Lifecycle timeline</div><div class="card-description">Illustrative progress</div></div></div><div class="timeline"><div class="timeline-item"><div class="timeline-dot">✓</div><div class="timeline-copy"><strong>Agreement uploaded</strong><span>Executed version · Fictional</span></div></div><div class="timeline-item"><div class="timeline-dot">✓</div><div class="timeline-copy"><strong>Obligations extracted</strong><span>Four tasks proposed for review</span></div></div><div class="timeline-item"><div class="timeline-dot">3</div><div class="timeline-copy"><strong>Owners assigned</strong><span>Procurement, finance and operations</span></div></div><div class="timeline-item"><div class="timeline-dot">4</div><div class="timeline-copy"><strong>${state.monitoringActive ? 'Monitoring activated' : 'Activate monitoring'}</strong><span>${state.monitoringActive ? 'Illustrative alerts are enabled' : 'Requires user confirmation'}</span></div></div></div></aside>
      </div>
    </section>`;
}

function renderCounsel() {
  const statusClass = state.counselRequested ? 'sent' : '';
  const actions = state.counselRequested ? `<button class="btn" data-action="demo-only">Add context</button><button class="btn teal" data-action="mark-signed">${icon('arrow')} Continue to signed contract</button>` : `<button class="btn primary" data-action="send-counsel-request">${icon('external')} Send illustrated request</button>`;
  return `
    <section class="page">
      ${pageHeader('Human escalation', 'Counsel Review', 'Package selected questions for licensed legal counsel without presenting AI output as a final legal opinion.', actions)}
      <div class="counsel-grid">
        <div class="card request-summary">
          <div class="request-status ${statusClass}"><div class="status-icon">${icon(state.counselRequested ? 'check' : 'users')}</div><div><h3>${state.counselRequested ? 'Illustrated counsel request sent' : 'Review package ready to send'}</h3><p>${state.counselRequested ? 'Status: Awaiting external response. No legal opinion is represented in this demo.' : 'One cross-border delivery question and its contract context are prepared for review.'}</p><div style="margin-top:7px"><span class="tag ${state.counselRequested ? 'green' : 'purple'}">${state.counselRequested ? 'Awaiting response' : 'Draft request'}</span> <span class="tag">Fictional workflow</span></div></div></div>
          <div class="request-bundle">
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Question for counsel</strong><span>Review whether the proposed delivery-responsibility wording fits the parties’ intended cross-border transaction.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Relevant contract excerpt</strong><span>Section 5.2 plus the AI-drafted redline and business context.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Business objective</strong><span>Assign a clear owner for shipment coordination through signed receipt in San Antonio.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Source status</strong><span>Legal sources are pending verification; no current citation is presented as authoritative.</span></div></div>
          </div>
          <div class="boundary-note">${icon('shield')} <span>Veridex organizes context and AI-assisted information. Only qualified licensed counsel can provide legal advice for the actual matter.</span></div>
        </div>
        <aside class="card"><div class="card-header"><div><div class="card-title">Request details</div><div class="card-description">Fictional external-counsel handoff</div></div></div><div class="card-body"><div class="form-grid"><label class="form-group full"><span class="form-label">Review destination</span><select class="select-field"><option>External Counsel Workspace (Fictional)</option></select></label><label class="form-group"><span class="form-label">Priority</span><select class="select-field"><option>Standard</option><option>Urgent</option></select></label><label class="form-group"><span class="form-label">Requested by</span><input class="field" value="Sofia Martinez"></label><label class="form-group full"><span class="form-label">Message</span><textarea class="textarea-field">Please review the proposed delivery responsibility language and identify any legal issues that require changes before negotiation.</textarea></label></div><div class="source-meta">${metaCell('Jurisdiction', 'Texas / Mexico cross-border')}${metaCell('Source', 'Contract + internal playbook')}${metaCell('Effective Date', 'Demo only')}${metaCell('Last Verified', 'Pending counsel review')}${metaCell('Human Review Status', state.counselRequested ? 'Requested' : 'Not yet requested')}${metaCell('Data status', 'Fictional / illustrative')}</div></div></aside>
      </div>
    </section>`;
}

function renderSources() {
  const sourceCards = [
    { icon: 'book', title: 'Texas commercial agreement source set', description: 'Placeholder for verified primary sources selected with licensed counsel before production use.', jurisdiction: 'Texas, United States', source: 'Production source not yet configured', effective: 'Not represented in demo', verified: 'Pending', review: 'Human verification required', color: '' },
    { icon: 'external', title: 'U.S.–Mexico cross-border source set', description: 'Placeholder for verified sources relevant to the actual transaction and party roles.', jurisdiction: 'Cross-border · Scope to be confirmed', source: 'Production source not yet configured', effective: 'Not represented in demo', verified: 'Pending', review: 'Counsel review required', color: 'purple' },
    { icon: 'shield', title: 'Sanctions and watchlist source connector', description: 'Placeholder for authoritative screening sources, update schedules and match-review procedures.', jurisdiction: 'Depends on configured source', source: 'Connector pending production setup', effective: 'Not represented in demo', verified: 'Pending', review: 'Compliance review required', color: 'green' }
  ];
  return `
    <section class="page">
      ${pageHeader('Admin controls', 'Sources & Policies', 'Separate verified legal sources from internal business preferences. Placeholder records below must not be relied on as law.', `<button class="btn primary" data-action="demo-only">${icon('book')} Add verified source</button>`)}
      <div class="boundary-note" style="margin:0 0 14px">${icon('alert')} <span><strong>Demo guardrail:</strong> no legal source in this prototype is represented as verified or authoritative. Production content requires jurisdiction-specific validation and documented human review.</span></div>
      <div class="source-catalog">${sourceCards.map(item => renderSourceCard(item)).join('')}</div>
      <div class="card" style="margin-top:14px"><div class="card-header"><div><div class="card-title">Internal review playbook</div><div class="card-description">Business preferences, not statements of law</div></div><span class="tag purple">Admin managed</span></div><div class="card-body"><div class="policy-list"><div class="policy-row"><div class="mini-icon">${icon('check')}</div><div><strong>Purchase approval routing</strong><span>Route agreements above the company’s internal approval threshold to finance.</span></div><span class="tag blue">Internal policy</span></div><div class="policy-row"><div class="mini-icon amber">${icon('clock')}</div><div><strong>Renewal reminder preference</strong><span>Create an owner and reminder before any negotiated non-renewal window.</span></div><span class="tag blue">Internal policy</span></div><div class="policy-row"><div class="mini-icon green">${icon('shield')}</div><div><strong>Supplier evidence checklist</strong><span>Collect agreed documentation before the first shipment is released.</span></div><span class="tag blue">Internal policy</span></div></div></div></div>
    </section>`;
}

function renderSourceCard(item) {
  return `<article class="card source-card"><div class="source-card-top"><div class="source-icon ${item.color}">${icon(item.icon)}</div><div><h3>${item.title}</h3><p>${item.description}</p></div></div><div class="source-fields">${sourceField('Jurisdiction', item.jurisdiction)}${sourceField('Source', item.source)}${sourceField('Effective Date', item.effective)}${sourceField('Last Verified', item.verified)}${sourceField('Human Review Status', item.review)}</div></article>`;
}

function sourceField(label, value) {
  return `<div class="source-field"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderNotifications() {
  return `<div class="notification-head"><strong>Alerts</strong><span>Fictional demo data</span></div><div class="notification-item"><div class="alert-icon">${icon('alert')}</div><div class="notification-copy"><strong>Invoice approval due soon</strong><span>TX–MX Supply Agreement · Illustrative obligation</span><time>Jul 22, 2026 · Demo date</time></div></div><div class="notification-item"><div class="alert-icon blue">${icon('users')}</div><div class="notification-copy"><strong>${state.counselRequested ? 'Counsel request awaiting response' : 'Counsel review available'}</strong><span>Delivery-responsibility question · Fictional workflow</span><time>${state.counselRequested ? 'Request sent in demo' : 'Not yet requested'}</time></div></div>`;
}

function renderPage(pageId) {
  const safePage = pageDefinitions[pageId] ? pageId : 'overview';
  state.currentPage = safePage;
  const definition = pageDefinitions[safePage];
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === safePage));
  document.getElementById('breadcrumb').innerHTML = `<span>${definition.group}</span><b>/</b><strong>${definition.title}</strong>`;
  const container = document.getElementById('page-content');
  container.innerHTML = definition.render();
  container.scrollTop = 0;
  document.title = `${definition.title} — Veridex`;
  closeMobileMenu();
}

function navigateTo(pageId) {
  const safePage = pageDefinitions[pageId] ? pageId : 'overview';
  if (window.location.hash !== `#${safePage}`) history.pushState(null, '', `#${safePage}`);
  renderPage(safePage);
}

function showToast(title, message, tone = '') {
  const region = document.getElementById('toast-region');
  const toast = document.createElement('div');
  toast.className = `toast ${tone}`;
  toast.innerHTML = `<div>${tone === 'warning' ? '!' : '✓'}</div><div><strong>${title}</strong><span>${message}</span></div>`;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

function updateFindingSelection(id) {
  state.selectedFinding = id;
  document.querySelectorAll('.finding-card').forEach(card => card.classList.toggle('active', card.dataset.findingId === id));
  document.querySelectorAll('.flagged-clause').forEach(clause => clause.classList.toggle('active', clause.dataset.clauseId === id));
  const clause = document.querySelector(`.flagged-clause[data-clause-id="${id}"]`);
  if (clause) clause.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleInArray(array, id) {
  const index = array.indexOf(id);
  if (index >= 0) array.splice(index, 1);
  else array.push(id);
}

function handleAction(action, element) {
  switch (action) {
    case 'new-review': state.reviewStage = 'intake'; navigateTo('review'); break;
    case 'continue-review': state.reviewStage = 'workspace'; navigateTo('review'); break;
    case 'show-intake': state.reviewStage = 'intake'; renderPage('review'); break;
    case 'show-workspace': state.reviewStage = 'workspace'; renderPage('review'); break;
    case 'run-review': state.reviewStage = 'workspace'; renderPage('review'); showToast('Illustrated review complete', 'Four fictional findings are ready for human review.', 'success'); break;
    case 'filter-findings': state.findingFilter = element.dataset.filter; renderPage('review'); break;
    case 'accept-finding':
      toggleInArray(state.acceptedFindings, element.dataset.id);
      state.dismissedFindings = state.dismissedFindings.filter(id => id !== element.dataset.id);
      renderPage('review');
      showToast('Redline decision saved', 'The AI draft remains subject to human review.', 'success');
      break;
    case 'dismiss-finding':
      toggleInArray(state.dismissedFindings, element.dataset.id);
      state.acceptedFindings = state.acceptedFindings.filter(id => id !== element.dataset.id);
      renderPage('review');
      break;
    case 'send-finding-counsel': state.selectedFinding = element.dataset.id; navigateTo('counsel'); break;
    case 'request-counsel': navigateTo('counsel'); break;
    case 'send-counsel-request': state.counselRequested = true; renderPage('counsel'); showToast('Counsel request sent in demo', 'This simulated request is now awaiting a human response.', 'success'); break;
    case 'verify-screening': state.screeningVerified = true; renderPage('screening'); showToast('Identity review recorded', 'The simulated similarity was resolved by a human reviewer.', 'success'); break;
    case 'activate-monitoring': state.monitoringActive = true; state.contractActive = true; renderPage('obligations'); showToast('Illustrated monitoring activated', 'Four fictional obligations now have owners and reminders.', 'success'); break;
    case 'save-draft': state.draftSaved = true; navigateTo('contracts'); showToast('Draft saved to Contract Hub', 'The bilingual AI draft is marked for human review.', 'success'); break;
    case 'mark-signed': state.contractActive = true; navigateTo('obligations'); showToast('Fictional signed version recorded', 'Review the extracted obligations before activating reminders.', 'success'); break;
    case 'set-language': state.draftLanguage = element.dataset.language; renderPage('draft'); break;
    case 'filter-contracts': state.contractFilter = element.dataset.filter; renderPage('contracts'); break;
    case 'demo-screen': showToast('Simulated screening refreshed', 'One fictional name similarity requires human verification.', 'warning'); break;
    case 'demo-generate': showToast('AI draft updated in demo', 'Suggested wording remains subject to human and legal review.', 'success'); break;
    case 'demo-export': showToast('Demo export prepared', 'This static prototype simulates the export action.'); break;
    case 'demo-upload': showToast('Static upload simulation', 'The fictional bilingual sample file is already staged.'); break;
    case 'demo-save': showToast('Demo intake saved', 'No external data was stored.'); break;
    default: showToast('Interactive demo', 'This control is a visual placeholder in the static prototype.');
  }
}

function openMobileMenu() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('open');
}

function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('notification-panel').innerHTML = renderNotifications();
  const initialPage = window.location.hash.slice(1) || 'overview';
  renderPage(initialPage);

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-navigate], .nav-link[data-page]');
    if (nav) {
      event.preventDefault();
      navigateTo(nav.dataset.navigate || nav.dataset.page);
      return;
    }

    const actionElement = event.target.closest('[data-action]');
    if (actionElement) {
      event.preventDefault();
      event.stopPropagation();
      handleAction(actionElement.dataset.action, actionElement);
      return;
    }

    const findingCard = event.target.closest('.finding-card');
    if (findingCard) {
      updateFindingSelection(findingCard.dataset.findingId);
      return;
    }

    const flaggedClause = event.target.closest('.flagged-clause');
    if (flaggedClause) {
      const id = flaggedClause.dataset.clauseId;
      updateFindingSelection(id);
      const finding = document.querySelector(`.finding-card[data-finding-id="${id}"]`);
      if (finding) finding.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.getElementById('global-search').focus();
    }
    if (event.key === 'Enter' && event.target.classList.contains('finding-card')) updateFindingSelection(event.target.dataset.findingId);
    if (event.key === 'Escape') {
      closeMobileMenu();
      document.getElementById('notification-panel').classList.remove('open');
    }
  });

  document.getElementById('global-search').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      navigateTo('contracts');
      showToast('Demo search', 'Showing the fictional contract portfolio.');
    }
  });

  document.getElementById('notification-button').addEventListener('click', event => {
    event.stopPropagation();
    const panel = document.getElementById('notification-panel');
    const isOpen = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', String(!isOpen));
    event.currentTarget.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.notification-wrap')) document.getElementById('notification-panel').classList.remove('open');
  });

  document.getElementById('mobile-menu').addEventListener('click', openMobileMenu);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileMenu);
  window.addEventListener('hashchange', () => renderPage(window.location.hash.slice(1) || 'overview'));
});
