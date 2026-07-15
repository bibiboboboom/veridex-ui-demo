/* Veridex sample workspace. All companies, contracts, results, dates and metrics are illustrative. */

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
  contractFilter: 'all',
  sidebarCollapsed: localStorage.getItem('veridex-sidebar-collapsed') === 'true',
  tourStep: 0
};

const reviewFindings = [
  {
    id: 'delivery',
    risk: 'high',
    category: 'Delivery & acceptance',
    section: 'Section 5.2',
    title: 'Delivery ownership is not clear',
    summary: 'The agreement does not assign responsibility for delays between dispatch and final acceptance.',
    original: 'Delivery will occur at a time and location mutually agreed by the parties.',
    suggestion: 'Provider will deliver the agreed items to Customer’s designated location by the delivery date in each order and will coordinate the carrier until signed receipt.',
    signal: 'Strong signal',
    jurisdiction: 'Transaction-specific · Confirm before use',
    source: 'Company delivery playbook · Internal policy',
    effectiveDate: 'See source record',
    lastVerified: 'Review scheduled',
    humanReview: 'Required'
  },
  {
    id: 'payment',
    risk: 'medium',
    category: 'Payment operations',
    section: 'Section 7.1',
    title: 'Currency and bank-fee allocation are not defined',
    summary: 'Finance may not know the invoice currency or who absorbs intermediary bank charges.',
    original: 'Customer will pay each undisputed invoice within thirty days after receipt.',
    suggestion: 'Invoices will use the currency selected in the order. Each party will bear fees charged by its own bank, and Provider will identify any intermediary fees before invoicing.',
    signal: 'Moderate signal',
    jurisdiction: 'Commercial terms selected by the parties',
    source: 'Finance operations checklist · Internal policy',
    effectiveDate: 'See source record',
    lastVerified: 'Reviewed by finance owner',
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
    source: 'Contract lifecycle playbook · Internal policy',
    effectiveDate: 'See source record',
    lastVerified: 'Review scheduled',
    humanReview: 'Required'
  },
  {
    id: 'certificate',
    risk: 'medium',
    category: 'Insurance evidence',
    section: 'Section 9.4',
    title: 'Evidence of coverage is not tied to shipment timing',
    summary: 'Operations has no clear trigger for collecting the provider’s current certificate.',
    original: 'Provider will maintain commercially reasonable insurance throughout the Term.',
    suggestion: 'Provider will supply evidence of the agreed coverage before work begins and again when the relevant policy renews. Customer may pause new work while evidence is outstanding.',
    signal: 'Moderate signal',
    jurisdiction: 'Business requirement; jurisdiction to be verified',
    source: 'Provider onboarding checklist · Internal policy',
    effectiveDate: 'See source record',
    lastVerified: 'Reviewed by operations owner',
    humanReview: 'Operations review required'
  }
];

const pageDefinitions = {
  overview: { group: 'Workspace', title: 'Home', render: renderOverview },
  draft: { group: 'Contracts', title: 'Create agreement', render: renderDraft },
  review: { group: 'Contracts', title: 'Review & redline', render: renderReview },
  contracts: { group: 'Contracts', title: 'All contracts', render: renderContracts },
  screening: { group: 'Risk & compliance', title: 'Counterparties', render: renderScreening },
  sources: { group: 'Risk & compliance', title: 'Policy library', render: renderSources },
  obligations: { group: 'Operations', title: 'Obligations', render: renderObligations },
  counsel: { group: 'Operations', title: 'Legal review', render: renderCounsel }
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
      ${pageHeader('Today', 'Good morning, Sofia', 'Keep agreements moving from first draft to renewal.')}

      <div class="hero-card">
        <div class="hero-copy">
          <div class="hero-kicker"><span></span> Contract work, connected</div>
          <h2>Move every agreement forward—without losing the details.</h2>
          <p>Draft, review, approve and track obligations in one workspace built for growing businesses.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="new-review">${icon('upload')} Start a review</button>
            <button class="btn" data-navigate="draft">${icon('pen')} Create agreement</button>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-top"><strong>Agreement workflow</strong><span class="status-live"><i></i> In progress</span></div>
          <button class="workflow-row" data-navigate="draft"><span class="workflow-number done">✓</span><span><strong>Create</strong><small>English, Spanish or bilingual</small></span>${icon('arrow')}</button>
          <button class="workflow-row" data-action="continue-review"><span class="workflow-number current">2</span><span><strong>Review</strong><small>Findings and suggested redlines</small></span>${icon('arrow')}</button>
          <button class="workflow-row" data-navigate="screening"><span class="workflow-number">3</span><span><strong>Check</strong><small>Counterparty and source review</small></span>${icon('arrow')}</button>
          <button class="workflow-row" data-navigate="obligations"><span class="workflow-number">4</span><span><strong>Track</strong><small>Payments, renewals and deliverables</small></span>${icon('arrow')}</button>
        </div>
      </div>

      <div class="stat-grid">
        ${statCard('document', '12', 'Active contracts', 'Across the workspace', '')}
        ${statCard('alert', '3', 'Need attention', 'Prioritized for today', 'amber')}
        ${statCard('shield', state.screeningVerified ? 'Reviewed' : '1 open', 'Counterparty check', 'Human decision required', 'green')}
        ${statCard('clock', '2', 'Due this month', 'Payments and renewals', 'purple')}
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><div><div class="card-title">Priority work</div><div class="card-description">What needs a decision next</div></div><button class="btn small ghost" data-navigate="contracts">View all ${icon('arrow')}</button></div>
          <div class="priority-list">
            ${priorityRow('review', 'Services agreement review', '4 findings · Human review required', 'Review', 'review', 'Today', 'amber')}
            ${priorityRow('users', counselLabel, 'One clause prepared for external review', state.counselRequested ? 'Track' : 'Prepare', 'counsel', 'Next', 'purple')}
            ${priorityRow('shield', 'Confirm counterparty identity', 'One similar name needs a reviewer', state.screeningVerified ? 'Done' : 'Review', 'screening', 'Today', 'green')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div><div class="card-title">Quick start</div><div class="card-description">Choose the job you need to do</div></div></div>
          <div class="quick-actions">
            ${quickAction('pen', 'Create an agreement', 'From business terms', 'draft', 'purple')}
            ${quickAction('upload', 'Review a contract', 'Upload PDF or DOCX', 'review', '')}
            ${quickAction('search', 'Check a counterparty', 'Review potential matches', 'screening', 'green')}
            ${quickAction('clock', 'Track obligations', 'Owners and reminders', 'obligations', 'amber')}
          </div>
        </div>
      </div>
    </section>`;
}

function statCard(iconName, value, label, footnote, color) {
  return `<div class="stat-card"><div class="mini-icon ${color}">${icon(iconName)}</div><div class="stat-copy"><strong>${value}</strong><span>${label}</span><small>${footnote}</small></div></div>`;
}

function priorityRow(iconName, title, subtitle, action, page, due, color) {
  return `<div class="priority-row"><div class="mini-icon ${color}">${icon(iconName)}</div><div class="row-copy"><strong>${title}</strong><span>${subtitle}</span></div><div class="due-copy"><strong>${due}</strong></div><button class="btn small" data-navigate="${page}">${action}</button></div>`;
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
    ${state.reviewStage === 'workspace' ? `<button class="btn" data-action="demo-export">${icon('download')} Export report</button><button class="btn primary" data-action="request-counsel">${icon('external')} Request legal review</button>` : ''}`;
  return `
    <section class="page">
      ${pageHeader('Contract review', state.reviewStage === 'intake' ? 'Start a new review' : 'Review findings in plain language', state.reviewStage === 'intake' ? 'Add the agreement and tell Veridex what matters to your business.' : 'Compare the original language with suggested redlines. You stay in control of every change.', actions)}
      ${state.reviewStage === 'intake' ? renderReviewIntake() : renderReviewWorkspace()}
    </section>`;
}

function renderReviewIntake() {
  return `
    <div class="intake-grid">
      <div class="card">
        <div class="card-header"><div><div class="card-title">1 · Contract document</div><div class="card-description">PDF or DOCX · Up to 25 MB</div></div><span class="tag blue">Ready</span></div>
        <div class="card-body">
          <div class="upload-zone" data-action="demo-upload">
            <div><div class="mini-icon">${icon('upload')}</div><strong>Drop a PDF or DOCX here</strong><span>or choose a file from your computer</span></div>
          </div>
          <div class="file-row"><div class="mini-icon">${icon('document')}</div><div class="file-copy"><strong>Professional_Services_Agreement.docx</strong><span>English · 18 pages · Text extracted</span></div><span class="tag green">Ready</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><div class="card-title">2 · Business context</div><div class="card-description">Use operational language instead of Party A / Party B</div></div></div>
        <div class="card-body">
          <div class="form-grid">
            <label class="form-group"><span class="form-label">Our role</span><select class="select-field"><option>Service customer</option><option>Service provider</option><option>Buyer</option><option>Seller</option></select></label>
            <label class="form-group"><span class="form-label">Counterparty role</span><select class="select-field"><option>Service provider</option><option>Customer</option><option>Supplier</option></select></label>
            <label class="form-group"><span class="form-label">Jurisdictions</span><select class="select-field"><option>Texas, United States</option><option>Multiple jurisdictions</option></select></label>
            <label class="form-group"><span class="form-label">Document language</span><select class="select-field"><option>English</option><option>English + Spanish</option><option>Spanish</option></select></label>
            <div class="form-group full"><span class="form-label">Review focus</span><div class="check-grid">
              <label class="check-card"><input type="checkbox" checked> Delivery &amp; acceptance</label>
              <label class="check-card"><input type="checkbox" checked> Payment operations</label>
              <label class="check-card"><input type="checkbox" checked> Renewal &amp; termination</label>
              <label class="check-card"><input type="checkbox" checked> Governing terms</label>
            </div></div>
            <label class="form-group full"><span class="form-label">Notes for the review</span><textarea class="textarea-field">Focus on service acceptance, invoice timing, renewal reminders and insurance evidence.</textarea></label>
          </div>
          <div class="intake-actions"><button class="btn" data-action="demo-save">Save for later</button><button class="btn primary" data-action="run-review">${icon('sparkle')} Run AI-assisted review</button></div>
        </div>
      </div>
    </div>`;
}

function renderReviewWorkspace() {
  const visibleFindings = state.findingFilter === 'all' ? reviewFindings : reviewFindings.filter(item => item.risk === state.findingFilter);
  return `
    <div class="review-summary-grid">
      ${reviewSummaryCard('Overall signal', 'Needs attention', 'Prioritize before signing')}
      ${reviewSummaryCard('Findings', '4', '2 high · 2 medium')}
      ${reviewSummaryCard('Redlines accepted', String(state.acceptedFindings.length), 'User-controlled decision')}
      ${reviewSummaryCard('Human review', state.counselRequested ? 'Requested' : 'Required', 'AI is not final legal advice')}
    </div>
    <div class="review-layout">
      <div class="card review-panel">
        <div class="panel-toolbar"><div class="tabs"><button class="tab-button ${state.findingFilter === 'all' ? 'active' : ''}" data-action="filter-findings" data-filter="all">All 4</button><button class="tab-button ${state.findingFilter === 'high' ? 'active' : ''}" data-action="filter-findings" data-filter="high">High 2</button><button class="tab-button ${state.findingFilter === 'medium' ? 'active' : ''}" data-action="filter-findings" data-filter="medium">Medium 2</button></div><span class="analysis-status">AI-assisted first pass</span></div>
        <div class="panel-scroll" id="findings-panel">${visibleFindings.map(renderFindingCard).join('')}</div>
      </div>
      <div class="card review-panel">
        <div class="panel-toolbar"><div class="document-toolbar-copy"><strong>Professional_Services_Agreement.docx</strong><span>Click a highlighted clause to compare findings</span></div><div class="tabs"><span class="tag red">High</span><span class="tag amber">Medium</span></div></div>
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
        <div class="detail-block"><span class="detail-label">Original text</span><div class="clause-box">“${finding.original}”</div></div>
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
      <div class="document-kicker">Sample agreement · PSA-2026-014</div>
      <h2>PROFESSIONAL SERVICES AGREEMENT</h2>
      <span class="doc-subtitle">AI-assisted review · Human decision required</span>
      <div class="contract-document-meta">
        <div><span>Customer</span><strong>Northstar Studio LLC</strong></div>
        <div><span>Provider</span><strong>Cedar Works Inc.</strong></div>
        <div><span>Effective date</span><strong>July 15, 2026 · Illustrative</strong></div>
        <div><span>Review status</span><strong>Business and legal review required</strong></div>
      </div>
      <p class="contract-introduction">This fictional Professional Services Agreement (the “Agreement”) records the operating terms under which Cedar Works Inc. (“Provider”) will perform professional services for Northstar Studio LLC (“Customer”). It is presented solely as sample workspace content.</p>

      <h3>1. PARTIES AND EFFECTIVE DATE</h3>
      <p><strong>1.1</strong> The parties to this Agreement are Customer and Provider as identified above. The Agreement begins on the stated Effective Date after authorized representatives of both parties approve it.</p>
      <p><strong>1.2</strong> Each party will designate a business contact who may coordinate day-to-day work but may not amend this Agreement unless separately authorized.</p>

      <h3>2. AGREEMENT STRUCTURE</h3>
      <p><strong>2.1</strong> Services will be requested through written statements of work or service orders accepted by both parties (each, an “Order”).</p>
      <p><strong>2.2</strong> Each Order will identify the project objective, scope, deliverables, timetable, fees, assumptions, dependencies and acceptance criteria. An Order does not change this Agreement unless it expressly identifies the provision being changed.</p>

      <h3>3. SERVICES AND ORDERS</h3>
      <p><strong>3.1</strong> Provider will perform the services described in each accepted Order using personnel with appropriate experience for the assigned work.</p>
      <p><strong>3.2</strong> Provider will maintain a current project plan and will notify Customer when a known issue is reasonably expected to affect an agreed milestone, fee or dependency.</p>

      <h3>4. PROJECT GOVERNANCE AND CHANGES</h3>
      <p><strong>4.1</strong> The designated business contacts will review progress, decisions and open dependencies at the cadence stated in the applicable Order.</p>
      <p><strong>4.2</strong> A proposed change to scope, timing, staffing or fees will be documented in a change request showing the expected operational impact. Neither party is required to proceed with the change until it is accepted in writing.</p>

      <h3>5. DELIVERY AND ACCEPTANCE</h3>
      <p><strong>5.1</strong> Provider will prepare each deliverable in the format and by the target date stated in the applicable Order and will identify any Customer action required for delivery.</p>
      <div class="flagged-clause high ${state.selectedFinding === 'delivery' ? 'active' : ''}" data-clause-id="delivery"><p><strong>5.2</strong> Delivery will occur at a time and location mutually agreed by the parties.</p></div>
      <p><strong>5.3</strong> Customer will review a delivered item against the acceptance criteria in the applicable Order and will describe any material nonconformity during the stated review period. Provider will address an agreed nonconformity and resubmit the item for review.</p>

      <h3>6. CUSTOMER RESPONSIBILITIES</h3>
      <p><strong>6.1</strong> Customer will provide timely access to the information, systems, personnel and decisions identified as dependencies in an Order.</p>
      <p><strong>6.2</strong> If a Customer dependency is delayed, the business contacts will document the effect on the project plan and determine whether a change request is needed.</p>

      <h3>7. FEES, INVOICING AND PAYMENT</h3>
      <div class="flagged-clause ${state.selectedFinding === 'payment' ? 'active' : ''}" data-clause-id="payment"><p><strong>7.1</strong> Customer will pay each undisputed invoice within thirty days after receipt.</p></div>
      <p><strong>7.2</strong> Each invoice will reference the applicable Order, billing period, completed milestone or approved expense and will include reasonable supporting detail.</p>
      <p><strong>7.3</strong> Customer will notify Provider of a disputed item with enough detail for the parties to investigate it. Undisputed portions remain payable under the applicable Order.</p>

      <h3>8. CONFIDENTIAL INFORMATION AND DATA HANDLING</h3>
      <p><strong>8.1</strong> Each party will use the other party’s non-public business information only to perform or receive the services and will limit access to personnel who need it for that purpose.</p>
      <p><strong>8.2</strong> The applicable Order will identify any project-specific security, retention, access or return requirements. Any compliance representation requires verification before the Order is approved.</p>

      <h3>9. INSURANCE, RECORDS AND EVIDENCE</h3>
      <p><strong>9.1</strong> Provider will maintain project records reasonably sufficient to support invoices, milestone completion and agreed operational reviews.</p>
      <p><strong>9.2</strong> Each party will retain approvals and change records in its designated contract workspace.</p>
      <p><strong>9.3</strong> Any required coverage types, limits, evidence format and renewal dates will be listed in the applicable Order or an approved schedule.</p>
      <div class="flagged-clause ${state.selectedFinding === 'certificate' ? 'active' : ''}" data-clause-id="certificate"><p><strong>9.4</strong> Provider will maintain commercially reasonable insurance throughout the Term.</p></div>

      <h3>10. WORK PRODUCT AND CUSTOMER MATERIALS</h3>
      <p><strong>10.1</strong> Each party retains ownership of materials it owned or developed independently of the services. Customer grants Provider access to Customer materials only as needed to perform an Order.</p>
      <p><strong>10.2</strong> Ownership and permitted use of project deliverables, Provider tools and third-party materials will be stated in the applicable Order and confirmed during human review.</p>

      <h3>11. SERVICE QUALITY AND CORRECTION</h3>
      <p><strong>11.1</strong> Provider will perform the services in a professional manner consistent with the specifications and acceptance criteria in the applicable Order.</p>
      <p><strong>11.2</strong> If Provider confirms that work does not materially meet those criteria, Provider will use the correction process and timetable agreed by the business contacts.</p>

      <h3>12. TERM, TERMINATION AND RENEWAL</h3>
      <p><strong>12.1</strong> This Agreement begins on the Effective Date and continues until it expires or is terminated under an approved provision. Completion of one Order does not automatically terminate another active Order.</p>
      <p><strong>12.2</strong> Upon termination, the parties will coordinate outstanding deliverables, approved fees, return of materials and transition actions documented in the applicable Order.</p>
      <div class="flagged-clause high ${state.selectedFinding === 'renewal' ? 'active' : ''}" data-clause-id="renewal"><p><strong>12.3</strong> The Agreement renews automatically for successive one-year terms unless either party provides timely notice.</p></div>

      <h3>13. ISSUE ESCALATION AND BUSINESS CONTINUITY</h3>
      <p><strong>13.1</strong> Project issues will first be referred to the designated business contacts. Unresolved material issues will be escalated to an authorized executive identified by each party.</p>
      <p><strong>13.2</strong> A legal conclusion, disputed liability allocation or requested exception to approved policy will be routed to qualified human review before a final decision is recorded.</p>

      <h3>14. NOTICES, ASSIGNMENT AND ORDER OF PRECEDENCE</h3>
      <p><strong>14.1</strong> Formal notices will be sent to the contacts and addresses recorded in the signed version of this Agreement. Operational messages alone do not amend the Agreement.</p>
      <p><strong>14.2</strong> Neither party may transfer an Order or this Agreement except through the approval process stated in the signed version.</p>
      <p><strong>14.3</strong> If documents conflict, a signed amendment controls, followed by the applicable Order and then this Agreement, unless the signed documents expressly state otherwise.</p>

      <h3>15. REVIEW STATUS AND EXECUTION</h3>
      <p><strong>15.1</strong> The highlighted findings and suggested redlines are AI-assisted information, not final legal advice. They must be reviewed against the actual transaction, verified sources and the parties’ approval requirements.</p>
      <p><strong>15.2</strong> This sample is not an executed agreement. Final party details, authority, exhibits, jurisdiction-specific provisions and signature blocks require qualified human review before use.</p>
    </article>`;
}

function renderDraft() {
  const actions = `<button class="btn" data-action="demo-export">${icon('download')} Export DOCX</button><button class="btn primary" data-action="save-draft">${icon('check')} Save agreement</button>`;
  return `
    <section class="page">
      ${pageHeader('AI-assisted authoring', 'Create an agreement from business terms', 'Choose a contract type, enter the deal basics and generate an English, Spanish or bilingual starting draft.', actions)}
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
              <label class="form-group full"><span class="form-label">Agreement type</span><select class="select-field"><option>Professional services agreement</option><option>Purchase agreement</option><option>Mutual NDA</option><option>Consulting agreement</option><option>Equipment lease</option><option>Distribution agreement</option></select></label>
              <label class="form-group full"><span class="form-label">Our company</span><input class="field" value="Northstar Studio LLC"></label>
              <label class="form-group full"><span class="form-label">Counterparty</span><input class="field" value="Cedar Works Inc."></label>
              <label class="form-group full"><span class="form-label">Business objective</span><textarea class="textarea-field">Engage a service provider with clear scope, acceptance, payment and renewal responsibilities.</textarea></label>
            </div>
            <div class="boundary-note">${icon('shield')} <span>AI-generated text is a starting draft, not final legal advice. Verified sources and qualified human review are required.</span></div>
          </div>
        </aside>
        <div class="card editor-shell">
          <div class="editor-toolbar"><button class="toolbar-button" data-action="demo-only"><b>B</b></button><button class="toolbar-button" data-action="demo-only"><i>I</i></button><button class="toolbar-button" data-action="demo-only">H1</button><div class="toolbar-separator"></div><span class="editor-status">Draft · Unsaved changes</span><div class="topbar-spacer"></div><span class="tag purple">AI-assisted</span><span class="tag amber">Human review required</span></div>
          <div class="editor-scroll">${renderDraftDocuments()}</div>
          <div class="ai-compose-bar">${icon('sparkle')}<input class="field" id="draft-prompt" placeholder="Ask AI to clarify delivery timing or simplify a section…"><button class="btn primary" data-action="demo-generate">Generate</button></div>
        </div>
      </div>
    </section>`;
}

function renderDraftDocuments() {
  const english = `
    <article class="language-document"><div class="language-heading"><span>English draft</span><span>AI-assisted</span></div><h2>PROFESSIONAL SERVICES AGREEMENT</h2><h3>1. Purpose</h3><p>This agreement describes the business terms under which Cedar Works Inc. (“Provider”) will perform professional services for Northstar Studio LLC (“Customer”).</p><h3>2. Scope and milestones</h3><p>Each accepted statement of work will identify the services, deliverables, milestones, fees and target completion dates.</p><h3>3. Delivery and acceptance</h3><p>Provider will deliver work through the channel selected by the parties. Each statement of work will define the review period and acceptance criteria.</p><h3>4. Payment</h3><p>Invoices will use the currency selected by the parties and reference the applicable statement of work. Customer will identify disputed items before the payment date.</p><h3>5. Review status</h3><p>This AI-assisted starting draft requires review against verified sources, the actual transaction and the parties’ approval process.</p></article>`;
  const spanish = `
    <article class="language-document"><div class="language-heading"><span>Borrador en español</span><span>Asistido por IA</span></div><h2>ACUERDO DE SERVICIOS PROFESIONALES</h2><h3>1. Objeto</h3><p>Este acuerdo describe los términos comerciales bajo los cuales Cedar Works Inc. (“Proveedor”) prestará servicios profesionales a Northstar Studio LLC (“Cliente”).</p><h3>2. Alcance e hitos</h3><p>Cada declaración de trabajo aceptada identificará los servicios, entregables, hitos, honorarios y fechas previstas.</p><h3>3. Entrega y aceptación</h3><p>El Proveedor entregará el trabajo por el canal seleccionado por las partes. Cada declaración definirá el plazo de revisión y los criterios de aceptación.</p><h3>4. Pago</h3><p>Las facturas se emitirán en la moneda seleccionada por las partes y harán referencia a la declaración aplicable. El Cliente notificará los conceptos controvertidos antes de la fecha de pago.</p><h3>5. Estado de revisión</h3><p>Este borrador inicial asistido por IA requiere revisión con fuentes verificadas, los hechos de la operación y el proceso de aprobación de las partes.</p></article>`;
  if (state.draftLanguage === 'english') return `<div class="bilingual-editor" style="grid-template-columns:1fr">${english}</div>`;
  if (state.draftLanguage === 'spanish') return `<div class="bilingual-editor" style="grid-template-columns:1fr">${spanish}</div>`;
  return `<div class="bilingual-editor">${english}${spanish}</div>`;
}

function renderContracts() {
  const records = [
    { name: 'Professional Services Agreement', party: 'Cedar Works Inc.', type: 'Services', status: state.contractActive ? 'Active' : 'Under review', statusColor: state.contractActive ? 'green' : 'amber', owner: 'Sofia Martinez', next: state.contractActive ? 'Invoice reminder · Jul 22' : 'Resolve 2 high findings' },
    { name: 'Equipment Lease — Riverbend', party: 'Riverbend Equipment Co.', type: 'Lease', status: 'Active', statusColor: 'green', owner: 'Owen Lee', next: 'Certificate check · Aug 05' },
    { name: 'Mutual NDA — Project Atlas', party: 'Atlas Research Inc.', type: 'NDA', status: 'Ready for review', statusColor: 'blue', owner: 'Sofia Martinez', next: 'Internal review · Jul 18' },
    { name: state.draftSaved ? 'Bilingual Services Agreement' : 'Distribution Agreement — Solara', party: state.draftSaved ? 'Saved from Create agreement' : 'Solara Distribution LLC', type: state.draftSaved ? 'Draft' : 'Distribution', status: state.draftSaved ? 'Draft' : 'Active', statusColor: state.draftSaved ? 'purple' : 'green', owner: 'Sofia Martinez', next: state.draftSaved ? 'Human review required' : 'Renewal decision · Dec 15' }
  ];
  const filtered = state.contractFilter === 'all' ? records : records.filter(record => record.status.toLowerCase().includes(state.contractFilter));
  const actions = `<button class="btn" data-navigate="draft">${icon('pen')} New draft</button><button class="btn primary" data-action="new-review">${icon('upload')} Review contract</button>`;
  return `
    <section class="page">
      ${pageHeader('Contract workspace', 'All contracts', 'Drafts, reviews, active agreements and next actions in one place.', actions)}
      <div class="stat-grid">
        ${statCard('folder', '12', 'Active contracts', 'Current workspace', '')}${statCard('review', '3', 'Under review', 'Needs a decision', 'amber')}${statCard('clock', '2', 'Due this month', 'Payments and renewals', 'purple')}${statCard('shield', '1', 'Counterparty review', 'Human decision required', 'green')}
      </div>
      <div class="card table-card" style="margin-top:14px">
        <div class="table-toolbar"><div class="tabs"><button class="tab-button ${state.contractFilter === 'all' ? 'active' : ''}" data-action="filter-contracts" data-filter="all">All</button><button class="tab-button ${state.contractFilter === 'draft' ? 'active' : ''}" data-action="filter-contracts" data-filter="draft">Drafts</button><button class="tab-button ${state.contractFilter === 'review' ? 'active' : ''}" data-action="filter-contracts" data-filter="review">Review</button><button class="tab-button ${state.contractFilter === 'active' ? 'active' : ''}" data-action="filter-contracts" data-filter="active">Active</button></div><button class="btn small ghost">Filter</button></div>
        <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Contract</th><th>Type</th><th>Status</th><th>Owner</th><th>Next action</th><th></th></tr></thead><tbody>${filtered.map(record => `<tr><td><div class="table-contract"><div class="mini-icon">${icon('document')}</div><div><strong>${record.name}</strong><span>${record.party}</span></div></div></td><td>${record.type}</td><td><span class="tag ${record.statusColor}">${record.status}</span></td><td>${record.owner}</td><td>${record.next}</td><td><button class="btn small" data-navigate="${record.name.startsWith('TX') ? 'review' : 'obligations'}">Open</button></td></tr>`).join('')}</tbody></table></div>
      </div>
    </section>`;
}

function renderScreening() {
  const statusTitle = state.screeningVerified ? 'Identity reviewed — similar name resolved' : 'One similar name needs human review';
  const statusText = state.screeningVerified ? 'The reviewer confirmed that the counterparty identifiers do not match the similar record.' : 'This is not a confirmed sanctions match. Compare the legal name, location and identifiers before deciding what to do.';
  const actions = `<button class="btn" data-action="demo-export">${icon('download')} Export record</button>`;
  return `
    <section class="page">
      ${pageHeader('Counterparty risk', 'Check a business before contracting', 'Organize screening results for a trained reviewer without presenting them as a legal conclusion.', actions)}
      <div class="screening-grid">
        <div>
          <div class="card search-hero"><div class="card-title">Counterparty search</div><div class="card-description">Use the full legal name and business location</div><div class="screening-search"><input class="field" value="Cedar Works Inc."><select class="select-field"><option>United States</option><option>Mexico</option><option>Other</option></select><button class="btn primary" data-action="demo-screen">${icon('search')} Run check</button></div></div>
          <div class="card screening-result">
            <div class="result-banner"><div class="status-icon">${icon(state.screeningVerified ? 'check' : 'alert')}</div><div><h3>${statusTitle}</h3><p>${statusText}</p><div style="margin-top:7px"><span class="tag amber">Review in progress</span> <span class="tag ${state.screeningVerified ? 'green' : 'red'}">${state.screeningVerified ? 'Human reviewed' : 'Human review required'}</span></div></div></div>
            <div class="identity-grid">${identityCell('Legal name', 'Cedar Works Inc.')}${identityCell('Business location', 'United States')}${identityCell('Workspace ID', 'CW-0148')}${identityCell('Exact matches', 'None found')}${identityCell('Similar names', '1 · Review required')}${identityCell('Checked at', 'Jul 15, 2026 · 09:42')}</div>
            <div class="source-list">
              <div class="source-row"><div class="source-icon">${icon('shield')}</div><div><strong>Restricted-party screening register</strong><span>Source registry and update status available for review</span></div><span class="tag green">Connected</span></div>
              <div class="source-row"><div class="source-icon">${icon('book')}</div><div><strong>Internal counterparty policy</strong><span>Company review and escalation requirements</span></div><span class="tag purple">Internal</span></div>
              <div class="source-row"><div class="source-icon">${icon('search')}</div><div><strong>Counterparty identity data</strong><span>Legal name, location and workspace identifier</span></div><span class="tag blue">Provided</span></div>
            </div>
            <div style="padding:0 18px 18px;display:flex;justify-content:flex-end;gap:8px"><button class="btn" data-action="request-counsel">Request legal review</button><button class="btn primary" data-action="verify-screening" ${state.screeningVerified ? 'disabled' : ''}>${icon('check')} ${state.screeningVerified ? 'Identity reviewed' : 'Mark as reviewed'}</button></div>
          </div>
        </div>
        <aside class="card explain-card"><h3>Review checklist</h3><p>A screening result is an input to human review, not a guarantee that a business is risk-free.</p><div class="explain-steps"><div class="explain-step"><b>1</b><div><strong>Compare identifiers</strong><span>Check the full legal name, address and available identifiers.</span></div></div><div class="explain-step"><b>2</b><div><strong>Review the source</strong><span>Confirm jurisdiction, source, effective date and last verification.</span></div></div><div class="explain-step"><b>3</b><div><strong>Escalate uncertainty</strong><span>Send possible matches to a trained reviewer or licensed counsel.</span></div></div></div><div class="source-meta" style="margin-top:18px">${metaCell('Jurisdiction', 'United States · Confirm scope')}${metaCell('Source', 'Configured source registry')}${metaCell('Effective Date', 'See source record')}${metaCell('Last Verified', 'Jul 15, 2026')}${metaCell('Human Review Status', state.screeningVerified ? 'Reviewed' : 'Required')}</div></aside>
      </div>
    </section>`;
}

function identityCell(label, value) {
  return `<div class="identity-cell"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderObligations() {
  const actions = state.monitoringActive ? `<button class="btn teal" disabled>${icon('check')} Monitoring active</button>` : `<button class="btn primary" data-action="activate-monitoring">${icon('clock')} Activate monitoring</button>`;
  const obligations = [
    { day: '22', month: 'Jul', title: 'Confirm first-invoice approval', detail: 'Professional Services Agreement · Section 7.1', owner: 'FM', ownerName: 'Finance', status: 'Due soon', color: 'amber' },
    { day: '05', month: 'Aug', title: 'Collect current insurance evidence', detail: 'Professional Services Agreement · Section 9.4', owner: 'OP', ownerName: 'Operations', status: 'Upcoming', color: 'blue' },
    { day: '18', month: 'Aug', title: 'Record first deliverable acceptance', detail: 'Professional Services Agreement · Section 5.2', owner: 'SM', ownerName: 'Sofia', status: 'Upcoming', color: 'blue' },
    { day: '15', month: 'Dec', title: 'Decide whether to send non-renewal notice', detail: 'Professional Services Agreement · Section 12.3', owner: 'SM', ownerName: 'Sofia', status: 'Planned', color: 'purple' }
  ];
  return `
    <section class="page">
      ${pageHeader('Post-signature operations', 'Obligations', 'Assign owners and reminders for payments, deliverables, renewals, evidence and other signed commitments.', actions)}
      <div class="stat-grid">${statCard('clock', '4', 'Tracked obligations', 'Across active agreements', '')}${statCard('alert', '1', 'Due soon', 'Needs attention', 'amber')}${statCard('calendar', '1', 'Renewal decision', 'Scheduled this quarter', 'purple')}${statCard('users', '3', 'Business owners', 'Finance and operations', 'green')}</div>
      <div class="obligation-layout" style="margin-top:14px">
        <div class="card"><div class="card-header"><div><div class="card-title">Upcoming obligations</div><div class="card-description">Dates, sources and accountable owners</div></div><span class="tag ${state.monitoringActive ? 'green' : 'amber'}">${state.monitoringActive ? 'Monitoring active' : 'Ready to activate'}</span></div><div class="obligation-list">${obligations.map(item => `<div class="obligation-row"><div class="obligation-date"><strong>${item.day}</strong><span>${item.month}</span></div><div class="row-copy"><strong>${item.title}</strong><span>${item.detail}</span></div><div class="owner-chip"><div class="avatar">${item.owner}</div>${item.ownerName}</div><span class="tag ${item.color}">${item.status}</span></div>`).join('')}</div></div>
        <aside class="card"><div class="card-header"><div><div class="card-title">Lifecycle</div><div class="card-description">From signed terms to owned work</div></div></div><div class="timeline"><div class="timeline-item"><div class="timeline-dot">✓</div><div class="timeline-copy"><strong>Agreement uploaded</strong><span>Executed version recorded</span></div></div><div class="timeline-item"><div class="timeline-dot">✓</div><div class="timeline-copy"><strong>Obligations extracted</strong><span>Four tasks proposed for review</span></div></div><div class="timeline-item"><div class="timeline-dot">3</div><div class="timeline-copy"><strong>Owners assigned</strong><span>Procurement, finance and operations</span></div></div><div class="timeline-item"><div class="timeline-dot">4</div><div class="timeline-copy"><strong>${state.monitoringActive ? 'Monitoring activated' : 'Activate monitoring'}</strong><span>${state.monitoringActive ? 'Alerts and reminders are enabled' : 'Requires user confirmation'}</span></div></div></div></aside>
      </div>
    </section>`;
}

function renderCounsel() {
  const statusClass = state.counselRequested ? 'sent' : '';
  const actions = state.counselRequested ? `<button class="btn" data-action="demo-only">Add context</button><button class="btn teal" data-action="mark-signed">${icon('arrow')} Continue to signed contract</button>` : `<button class="btn primary" data-action="send-counsel-request">${icon('external')} Send request</button>`;
  return `
    <section class="page">
      ${pageHeader('Human escalation', 'Legal review', 'Package the contract excerpt, business context and open question for licensed legal counsel.', actions)}
      <div class="counsel-grid">
        <div class="card request-summary">
          <div class="request-status ${statusClass}"><div class="status-icon">${icon(state.counselRequested ? 'check' : 'users')}</div><div><h3>${state.counselRequested ? 'Counsel request sent' : 'Review package ready to send'}</h3><p>${state.counselRequested ? 'Status: awaiting an external response. Veridex does not present AI output as a legal opinion.' : 'One delivery-ownership question and its contract context are prepared for review.'}</p><div style="margin-top:7px"><span class="tag ${state.counselRequested ? 'green' : 'purple'}">${state.counselRequested ? 'Awaiting response' : 'Draft request'}</span></div></div></div>
          <div class="request-bundle">
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Question for counsel</strong><span>Review whether the proposed delivery-ownership wording fits the parties’ intended service arrangement.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Relevant contract excerpt</strong><span>Section 5.2 plus the AI-drafted redline and business context.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Business objective</strong><span>Assign a clear owner through delivery and signed acceptance.</span></div></div>
            <div class="bundle-row"><div class="bundle-check">✓</div><div><strong>Source status</strong><span>Legal sources are pending verification; no current citation is presented as authoritative.</span></div></div>
          </div>
          <div class="boundary-note">${icon('shield')} <span>Veridex organizes context and AI-assisted information. Only qualified licensed counsel can provide legal advice for the actual matter.</span></div>
        </div>
        <aside class="card"><div class="card-header"><div><div class="card-title">Request details</div><div class="card-description">External-counsel handoff</div></div></div><div class="card-body"><div class="form-grid"><label class="form-group full"><span class="form-label">Review destination</span><select class="select-field"><option>External Counsel Workspace</option></select></label><label class="form-group"><span class="form-label">Priority</span><select class="select-field"><option>Standard</option><option>Urgent</option></select></label><label class="form-group"><span class="form-label">Requested by</span><input class="field" value="Sofia Martinez"></label><label class="form-group full"><span class="form-label">Message</span><textarea class="textarea-field">Please review the proposed delivery ownership language and identify any legal issues that require changes before negotiation.</textarea></label></div><div class="source-meta">${metaCell('Jurisdiction', 'Texas, United States · Confirm scope')}${metaCell('Source', 'Contract + internal playbook')}${metaCell('Effective Date', 'See source record')}${metaCell('Last Verified', 'Pending counsel review')}${metaCell('Human Review Status', state.counselRequested ? 'Requested' : 'Not yet requested')}</div></div></aside>
      </div>
    </section>`;
}

function renderSources() {
  const sourceCards = [
    { icon: 'book', title: 'Commercial agreement sources', description: 'Counsel-managed materials used for contract review workflows.', jurisdiction: 'Texas, United States', source: 'Legal source register', effective: 'See source record', verified: 'Jul 10, 2026', review: 'Scheduled for counsel review', color: '' },
    { icon: 'external', title: 'Cross-border transaction sources', description: 'Materials selected for the transaction, party roles and chosen jurisdictions.', jurisdiction: 'Transaction-specific', source: 'Legal source register', effective: 'See source record', verified: 'Review scheduled', review: 'Counsel review required', color: 'purple' },
    { icon: 'shield', title: 'Restricted-party screening sources', description: 'Configured source registry, refresh schedule and match-review procedure.', jurisdiction: 'Depends on configured source', source: 'Screening source registry', effective: 'See source record', verified: 'Jul 15, 2026', review: 'Compliance owner review required', color: 'green' }
  ];
  return `
    <section class="page">
      ${pageHeader('Admin controls', 'Policy library', 'Keep legal sources separate from internal business preferences, with clear verification ownership.', `<button class="btn primary" data-action="demo-only">${icon('book')} Add source</button>`)}
      <div class="boundary-note" style="margin:0 0 16px">${icon('alert')} <span><strong>Verification control:</strong> source records require jurisdiction-specific validation and documented human review before teams rely on them.</span></div>
      <div class="source-catalog">${sourceCards.map(item => renderSourceCard(item)).join('')}</div>
      <div class="card" style="margin-top:14px"><div class="card-header"><div><div class="card-title">Internal review playbook</div><div class="card-description">Business preferences, not statements of law</div></div><span class="tag purple">Admin managed</span></div><div class="card-body"><div class="policy-list"><div class="policy-row"><div class="mini-icon">${icon('check')}</div><div><strong>Purchase approval routing</strong><span>Route agreements above the company’s internal approval threshold to finance.</span></div><span class="tag blue">Internal policy</span></div><div class="policy-row"><div class="mini-icon amber">${icon('clock')}</div><div><strong>Renewal reminder preference</strong><span>Create an owner and reminder before any negotiated non-renewal window.</span></div><span class="tag blue">Internal policy</span></div><div class="policy-row"><div class="mini-icon green">${icon('shield')}</div><div><strong>Evidence collection checklist</strong><span>Collect agreed documentation before work or delivery begins.</span></div><span class="tag blue">Internal policy</span></div></div></div></div>
    </section>`;
}

function renderSourceCard(item) {
  return `<article class="card source-card"><div class="source-card-top"><div class="source-icon ${item.color}">${icon(item.icon)}</div><div><h3>${item.title}</h3><p>${item.description}</p></div></div><div class="source-fields">${sourceField('Jurisdiction', item.jurisdiction)}${sourceField('Source', item.source)}${sourceField('Effective Date', item.effective)}${sourceField('Last Verified', item.verified)}${sourceField('Human Review Status', item.review)}</div></article>`;
}

function sourceField(label, value) {
  return `<div class="source-field"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderNotifications() {
  return `<div class="notification-head"><strong>Alerts</strong><span>2 open</span></div><div class="notification-item"><div class="alert-icon">${icon('alert')}</div><div class="notification-copy"><strong>Invoice approval due soon</strong><span>Professional Services Agreement</span><time>Jul 22, 2026</time></div></div><div class="notification-item"><div class="alert-icon blue">${icon('users')}</div><div class="notification-copy"><strong>${state.counselRequested ? 'Counsel request awaiting response' : 'Counsel review available'}</strong><span>Delivery-ownership question</span><time>${state.counselRequested ? 'Request sent' : 'Not yet requested'}</time></div></div>`;
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
    case 'start-tour': openTour(0); break;
    case 'tour-next': moveTour(1); break;
    case 'tour-back': moveTour(-1); break;
    case 'tour-close': closeTour(true); break;
    case 'new-review': state.reviewStage = 'intake'; navigateTo('review'); break;
    case 'continue-review': state.reviewStage = 'workspace'; navigateTo('review'); break;
    case 'show-intake': state.reviewStage = 'intake'; renderPage('review'); break;
    case 'show-workspace': state.reviewStage = 'workspace'; renderPage('review'); break;
    case 'run-review': state.reviewStage = 'workspace'; renderPage('review'); showToast('Review complete', 'Four findings are ready for human review.', 'success'); break;
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
    case 'send-counsel-request': state.counselRequested = true; renderPage('counsel'); showToast('Counsel request sent', 'The request is now awaiting a human response.', 'success'); break;
    case 'verify-screening': state.screeningVerified = true; renderPage('screening'); showToast('Identity review recorded', 'The similar name was resolved by a human reviewer.', 'success'); break;
    case 'activate-monitoring': state.monitoringActive = true; state.contractActive = true; renderPage('obligations'); showToast('Monitoring activated', 'Four obligations now have owners and reminders.', 'success'); break;
    case 'save-draft': state.draftSaved = true; navigateTo('contracts'); showToast('Draft saved to Contract Hub', 'The bilingual AI draft is marked for human review.', 'success'); break;
    case 'mark-signed': state.contractActive = true; navigateTo('obligations'); showToast('Signed version recorded', 'Review the extracted obligations before activating reminders.', 'success'); break;
    case 'set-language': state.draftLanguage = element.dataset.language; renderPage('draft'); break;
    case 'filter-contracts': state.contractFilter = element.dataset.filter; renderPage('contracts'); break;
    case 'demo-screen': showToast('Screening refreshed', 'One similar name requires human verification.', 'warning'); break;
    case 'demo-generate': showToast('Draft updated', 'Suggested wording remains subject to human and legal review.', 'success'); break;
    case 'demo-export': showToast('Export prepared', 'The file is ready for review.'); break;
    case 'demo-upload': showToast('File selected', 'Professional_Services_Agreement.docx is ready.'); break;
    case 'demo-save': showToast('Review intake saved', 'You can return to it from All contracts.'); break;
    default: showToast('Saved', 'Your workspace has been updated.');
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

const tourSteps = [
  {
    title: 'Welcome to Veridex',
    text: 'Veridex organizes contract work around the jobs your team needs to complete. Here is a quick tour of the workspace.',
    icon: 'sparkle'
  },
  {
    title: 'Create an agreement',
    text: 'Start from business terms, choose from several agreement types, and create English, Spanish or bilingual drafts for human review.',
    icon: 'pen',
    target: 'create'
  },
  {
    title: 'Review and redline',
    text: 'Upload a third-party contract, focus the review, compare plain-language findings and decide which redlines to use.',
    icon: 'review',
    target: 'review'
  },
  {
    title: 'Check risk and sources',
    text: 'Review counterparty matches and keep jurisdiction, source, effective date, verification and human-review status visible.',
    icon: 'shield',
    target: 'screen'
  },
  {
    title: 'Track what happens next',
    text: 'Turn signed terms into owned payment, delivery, renewal and evidence tasks—and send uncertain issues to licensed counsel.',
    icon: 'clock',
    target: 'track'
  }
];

function applySidebarState() {
  const shell = document.querySelector('.app-shell');
  const button = document.getElementById('sidebar-collapse');
  shell.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
  button.setAttribute('aria-expanded', String(!state.sidebarCollapsed));
  button.setAttribute('aria-label', state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation');
  button.title = state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation';
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  localStorage.setItem('veridex-sidebar-collapsed', String(state.sidebarCollapsed));
  applySidebarState();
}

function revealTourTarget(target) {
  const scrollContainer = target.closest('.nav-list');
  if (!scrollContainer) return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const visibleTop = containerRect.top + 14;
  const visibleBottom = containerRect.bottom - 14;

  if (targetRect.top < visibleTop || targetRect.bottom > visibleBottom) {
    const targetCenter = targetRect.top + (targetRect.height / 2);
    const containerCenter = containerRect.top + (containerRect.height / 2);
    scrollContainer.scrollTop += targetCenter - containerCenter;
  }
}

function renderTour() {
  const overlay = document.getElementById('tour-overlay');
  const step = tourSteps[state.tourStep];
  document.querySelectorAll('.tour-highlight').forEach(item => item.classList.remove('tour-highlight'));
  let spotlight = '';
  let target = null;
  if (step.target) {
    target = document.querySelector(`[data-tour-target="${step.target}"]`);
    if (target) {
      revealTourTarget(target);
      target.classList.add('tour-highlight');
      const rect = target.getBoundingClientRect();
      const padding = 6;
      spotlight = `<div class="tour-spotlight" aria-hidden="true" style="left:${rect.left - padding}px;top:${rect.top - padding}px;width:${rect.width + (padding * 2)}px;height:${rect.height + (padding * 2)}px"></div>`;
    }
  }
  overlay.classList.toggle('has-target', Boolean(target));
  overlay.innerHTML = `
    ${spotlight}
    <section class="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div class="tour-progress">${tourSteps.map((_, index) => `<span class="${index <= state.tourStep ? 'active' : ''}"></span>`).join('')}</div>
      <div class="tour-icon">${icon(step.icon)}</div>
      <h2 id="tour-title">${step.title}</h2>
      <p>${step.text}</p>
      <div class="tour-actions">
        <button class="tour-skip" data-action="tour-close">Skip tour</button>
        <div>${state.tourStep > 0 ? '<button class="btn" data-action="tour-back">Back</button>' : ''}<button class="btn primary" data-action="tour-next">${state.tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</button></div>
      </div>
    </section>`;
}

function openTour(step = 0) {
  state.tourStep = step;
  const overlay = document.getElementById('tour-overlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  renderTour();
}

function closeTour(completed = false) {
  const overlay = document.getElementById('tour-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '';
  document.querySelectorAll('.tour-highlight').forEach(item => item.classList.remove('tour-highlight'));
  if (completed) localStorage.setItem('veridex-tour-complete', 'true');
}

function moveTour(direction) {
  if (direction > 0 && state.tourStep === tourSteps.length - 1) {
    closeTour(true);
    return;
  }
  state.tourStep = Math.max(0, Math.min(tourSteps.length - 1, state.tourStep + direction));
  renderTour();
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('sidebar') === 'collapsed') state.sidebarCollapsed = true;
  applySidebarState();
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
      closeTour(false);
      document.getElementById('notification-panel').classList.remove('open');
    }
  });

  document.getElementById('global-search').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      navigateTo('contracts');
      showToast('Search complete', 'Showing matching contracts and tasks.');
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
  document.getElementById('sidebar-collapse').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileMenu);
  window.addEventListener('hashchange', () => renderPage(window.location.hash.slice(1) || 'overview'));

  const requestedTourStep = Number.parseInt(params.get('tourStep'), 10);
  if (Number.isInteger(requestedTourStep) && requestedTourStep >= 0 && requestedTourStep < tourSteps.length) {
    window.setTimeout(() => openTour(requestedTourStep), 250);
  } else if (!localStorage.getItem('veridex-tour-complete') && params.get('tour') !== 'off') {
    window.setTimeout(() => openTour(0), 450);
  }
});
