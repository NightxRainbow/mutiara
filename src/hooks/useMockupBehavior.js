import { useEffect } from 'react';

const ISSUER = 'Pusat Mutu Pascapanen, BPPMHKP';

const ESTABLISHMENTS = [
  { no: 'CR 412-13', name: 'PT Contoh Samudra Satu', city: 'Sidoarjo', province: 'Jawa Timur', scope: 'Frozen shrimp, raw and cooked', raw: 'Farmed', markets: ['EU', 'US', 'Japan'], cert: 'ID-HACCP-2026-00412', from: '2026-08-15', to: '2027-08-14', updated: '2026-11-17' },
  { no: 'CR 187-11', name: 'PT Contoh Tuna Nusantara', city: 'Denpasar', province: 'Bali', scope: 'Tuna loins, fresh and frozen', raw: 'Wild caught', markets: ['US', 'Japan'], cert: 'ID-HACCP-2025-01877', from: '2025-12-10', to: '2026-12-09', updated: '2026-11-17' },
  { no: 'CR 093-08', name: 'PT Contoh Bahari Tiga', city: 'Makassar', province: 'Sulawesi Selatan', scope: 'Frozen squid, cuttlefish and octopus', raw: 'Wild caught', markets: ['EU', 'China'], cert: 'ID-HACCP-2025-00931', from: '2025-10-31', to: '2026-10-30', updated: '2026-10-31' },
  { no: 'CR 255-14', name: 'PT Contoh Rajungan Empat', city: 'Rembang', province: 'Jawa Tengah', scope: 'Pasteurised crab meat', raw: 'Wild caught', markets: ['US'], cert: 'ID-HACCP-2026-00255', from: '2026-03-23', to: '2027-03-22', updated: '2026-11-05', flag: 'Suspended', flagNote: 'Suspended by the issuer on 5 Nov 2026. Not eligible for new health certificates.' },
  { no: 'CR 301-09', name: 'PT Contoh Pelagis Lima', city: 'Bitung', province: 'Sulawesi Utara', scope: 'Frozen small pelagic fish', raw: '', markets: ['China', 'ASEAN'], cert: 'ID-HACCP-2026-00301', from: '2026-05-03', to: '2027-05-02', updated: '2026-11-12' },
  { no: 'CR 366-12', name: 'PT Contoh Patin Enam', city: 'Bandar Lampung', province: 'Lampung', scope: 'Frozen pangasius fillets', raw: 'Farmed', markets: ['ASEAN', 'Japan'], cert: 'ID-HACCP-2026-00366', from: '2026-07-01', to: '2027-06-30', updated: '2026-11-10' },
];

const REQUIREMENTS = {
  EU: {
    name: 'European Union',
    listing: 'Required. The plant must be on the EU list of approved establishments for fishery products.',
    certificate: 'Official health certificate for fishery products, lodged through TRACES NT.',
    additional: ['Catch certificate under the EU rules on illegal fishing, for wild-caught products.', 'A residue monitoring plan accepted by the EU, for farmed products.'],
    source: 'European Commission, DG SANTE',
  },
  US: {
    name: 'United States',
    listing: 'No government list for general entry. The plant registers with the FDA as a food facility.',
    certificate: 'No health certificate for general entry. The importer must verify that the product was processed under seafood HACCP rules (21 CFR Part 123).',
    additional: ['Harvest and landing data for species under the Seafood Import Monitoring Program, which covers shrimp and tuna.', 'Prior notice to the FDA before arrival.'],
    source: 'FDA and NOAA Fisheries',
  },
  JP: {
    name: 'Japan',
    listing: 'No establishment list for most fishery products.',
    certificate: 'Import notification to a quarantine station of the Ministry of Health, Labour and Welfare under the Food Sanitation Act. Some products also need a health certificate.',
    additional: ['Monitoring tests at the border. Repeated violations lead to an inspection order for every consignment.'],
    source: 'Ministry of Health, Labour and Welfare',
  },
  CN: {
    name: 'China',
    listing: 'Required. The plant must be registered with the General Administration of Customs of China.',
    certificate: 'Official health certificate in the model agreed between the two authorities.',
    additional: ['Registration number shown on the packaging.', 'Labelling in Chinese.'],
    source: 'General Administration of Customs of China',
  },
};

const PRODUCTS = {
  shrimp: ['Shrimp, farmed', 'Residues of veterinary drugs, in particular banned antibiotics such as chloramphenicol and nitrofurans.'],
  tuna: ['Tuna', 'Histamine, controlled through time and temperature from catch onward. Heavy metals, mainly mercury.'],
  ceph: ['Squid, cuttlefish, octopus', 'Heavy metals, mainly cadmium.'],
};

const CAPA_ITEMS = [
  { id: 'CAPA-26-0142', finding: 'Histamine above the limit in one tuna lot', cause: 'Ice shortage at landing', owner: 'PT Contoh Tuna Nusantara', due: '2026-06-15', evidence: '2 files' },
  { id: 'CAPA-26-0187', finding: 'Logger in cold room 2 past its calibration date', cause: 'No calibration schedule', owner: 'PT Contoh Samudra Satu', due: '2026-06-30', evidence: '' },
  { id: 'CAPA-26-0231', finding: 'Supplier list has no pond IDs', cause: 'Receiving form lacks the field', owner: 'PT Contoh Patin Enam', due: '2026-12-05', evidence: '1 file' },
  { id: 'CAPA-26-0098', finding: 'Hand-wash station out of service', cause: 'Maintenance backlog', owner: 'PT Contoh Bahari Tiga', due: '2026-05-20', evidence: '3 files', verified: '2026-05-18' },
];

function dateFromIso(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  return dateFromIso(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysUntil(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((dateFromIso(value) - today) / 864e5);
}

function getStatus(record) {
  if (record.flag) return { kind: 'bad', text: record.flag, note: record.flagNote };
  const remaining = daysUntil(record.to);
  if (remaining < 0) {
    return {
      kind: 'bad',
      text: 'Expired',
      note: `Expired ${-remaining} days ago. Not counted as a certificate in force.`,
    };
  }
  if (remaining <= 60) {
    return { kind: 'warn', text: 'Valid, expiring', note: `Expires in ${remaining} days.` };
  }
  return { kind: 'ok', text: 'Valid', note: `In force for ${remaining} more days.` };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[character]));
}

function renderCertificateResult(container, input) {
  const query = input.trim().toUpperCase();
  if (!query) return;

  const record = ESTABLISHMENTS.find((item) => item.cert === query);
  if (!record) {
    container.className = 'slip';
    container.innerHTML = `<div class="verdict">No record found</div><span class="small">No certificate numbered “${escapeHtml(input.trim())}” is in the register. Check the number against the paper certificate. If it matches, <a href="#contact">report it to the authority</a>. This result alone does not show that a certificate is false.</span>`;
    return;
  }

  const status = getStatus(record);
  container.className = `slip ${status.kind}`;
  container.innerHTML = `<div class="verdict">${status.text}</div><span>${status.note}</span>
    <dl class="kv"><dt>Certificate</dt><dd>${record.cert}</dd><dt>Type</dt><dd>HACCP certificate, facility level</dd><dt>Issued to</dt><dd>${record.name}, ${record.no}</dd><dt>Scope</dt><dd>${record.scope}</dd><dt>Validity</dt><dd>${formatDate(record.from)} to ${formatDate(record.to)}</dd><dt>Issuer</dt><dd>${ISSUER}</dd><dt>Record updated</dt><dd>${formatDate(record.updated)}</dd></dl>
    <p class="small" style="margin:10px 0 0"><a href="#contact">Report a suspected false certificate</a></p>`;
}

function renderEstablishments(root) {
  const query = root.querySelector('#fq').value.trim().toLowerCase();
  const market = root.querySelector('#fm').value;
  const selectedStatus = root.querySelector('#fs').value;
  const records = ESTABLISHMENTS.filter((record) => {
    const matchesText = !query
      || [record.no, record.name, record.province, record.city, record.scope]
        .join(' ')
        .toLowerCase()
        .includes(query);
    return matchesText
      && (!market || record.markets.includes(market))
      && (!selectedStatus || getStatus(record).kind === selectedStatus);
  });

  root.querySelector('#ecount').textContent =
    `${records.length} of ${ESTABLISHMENTS.length} establishments shown.`;
  root.querySelector('#erows').innerHTML = records.length
    ? records.map((record) => {
      const status = getStatus(record);
      return `<tr class="pick" data-no="${record.no}" tabindex="0"><td><strong>${record.no}</strong></td><td><a href="#" data-establishment="${record.no}">${record.name}</a></td><td>${record.province}</td><td>${record.scope}</td><td>${record.markets.join(', ')}</td><td>${formatDate(record.to)}</td><td><span class="tag ${status.kind}">${status.text}</span></td></tr>`;
    }).join('')
    : '<tr><td colspan="7">No establishment matches. Clear a filter or search by approval number.</td></tr>';
}

function renderProfile(root, approvalNumber) {
  const record = ESTABLISHMENTS.find((item) => item.no === approvalNumber);
  if (!record) return;
  const status = getStatus(record);
  root.querySelectorAll('#erows tr').forEach((row) => {
    row.classList.toggle('sel', row.dataset.no === approvalNumber);
  });
  root.querySelector('#eprofile').innerHTML = `<div class="profile"><h2>${record.name} <span class="tag ${status.kind}">${status.text}</span></h2><p>${status.note}</p>
    <dl class="kv"><dt>Approval number</dt><dd>${record.no}</dd><dt>Location</dt><dd>${record.city}, ${record.province}</dd><dt>Approved products</dt><dd>${record.scope}</dd><dt>Raw material</dt><dd>${record.raw || '<span class="missing">Data not yet available</span>'}</dd><dt>Listed for</dt><dd>${record.markets.join(', ')}</dd><dt>Certificate</dt><dd>HACCP certificate ${record.cert}</dd><dt>Issuer</dt><dd>${ISSUER}</dd><dt>Validity</dt><dd>${formatDate(record.from)} to ${formatDate(record.to)}</dd><dt>Record updated</dt><dd>${formatDate(record.updated)}</dd><dt>Data source</dt><dd>Issuing unit's certificate system</dd></dl>
    <div class="callout">This listing does not guarantee an individual shipment. Ask for the health certificate of the consignment and check it on this site.</div>
    <p style="margin:0"><a href="#">Report a problem with this listing</a></p></div>`;
  root.querySelector('#eprofile').scrollIntoView({ block: 'nearest' });
}

function renderRequirements(root) {
  const market = REQUIREMENTS[root.querySelector('#rm').value];
  const [productName, hazards] = PRODUCTS[root.querySelector('#rc').value];
  root.querySelector('#rout').innerHTML = `<h2>${productName} to ${market.name}</h2>
    <dl class="kv"><dt>Establishment listing</dt><dd>${market.listing}</dd><dt>Certificate</dt><dd>${market.certificate}</dd><dt>Also required</dt><dd>${market.additional.join('<br>')}</dd><dt>Main hazards tested</dt><dd>${hazards}</dd><dt>Official source</dt><dd><a href="#">${market.source}</a></dd><dt>Checked against source</dt><dd>15 Nov 2026 <span class="sample-flag">Sample date</span></dd></dl>
    <p style="margin:16px 0 0"><a href="#" data-go="est">See establishments listed for this market</a></p>`;
}

function renderCapa(root) {
  root.querySelector('#capa').innerHTML = CAPA_ITEMS.map((item) => {
    const remaining = daysUntil(item.due);
    const status = item.verified
      ? ['ok', `Closed and verified ${formatDate(item.verified)}`]
      : remaining < 0
        ? ['bad', `Overdue by ${-remaining} days`]
        : ['warn', `Open, ${remaining} days left`];
    return `<tr><td><a href="#">${item.id}</a></td><td>${item.finding}</td><td>${item.cause}</td><td>${item.owner}</td><td>${formatDate(item.due)}</td><td>${item.evidence || '<span class="missing">None uploaded</span>'}</td><td><span class="tag ${status[0]}">${status[1]}</span></td></tr>`;
  }).join('');
}

export function useMockupBehavior(contentRef) {
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return undefined;

    const form = root.querySelector('#vform');
    const samples = root.querySelector('#vsamples');
    const rows = root.querySelector('#erows');
    const directoryProfile = root.querySelector('#eprofile');
    const directoryFilters = ['#fq', '#fm', '#fs'].map((selector) => root.querySelector(selector));
    const marketSelect = root.querySelector('#rm');
    const productSelect = root.querySelector('#rc');

    function handleCertificateSubmit(event) {
      event.preventDefault();
      renderCertificateResult(root.querySelector('#vout'), root.querySelector('#vno').value);
    }

    function handleSampleClick(event) {
      const button = event.target.closest('[data-v]');
      if (!button) return;
      root.querySelector('#vno').value = button.dataset.v;
      renderCertificateResult(root.querySelector('#vout'), button.dataset.v);
    }

    function handleFilterChange() {
      renderEstablishments(root);
      directoryProfile.innerHTML = '';
    }

    function handleDirectoryClick(event) {
      const row = event.target.closest('tr[data-no]');
      if (row) renderProfile(root, row.dataset.no);
    }

    function handleDirectoryKeyDown(event) {
      if (event.key !== 'Enter') return;
      const row = event.target.closest('tr[data-no]');
      if (row) renderProfile(root, row.dataset.no);
    }

    function handleRequirementChange() {
      renderRequirements(root);
    }

    samples.innerHTML = ESTABLISHMENTS.slice(0, 4)
      .map((record) => `<button type="button" data-v="${record.cert}">${record.cert}</button>`)
      .join(' ');
    renderEstablishments(root);
    renderRequirements(root);
    renderCapa(root);

    form.addEventListener('submit', handleCertificateSubmit);
    samples.addEventListener('click', handleSampleClick);
    directoryFilters.forEach((element) => {
      element.addEventListener('input', handleFilterChange);
      element.addEventListener('change', handleFilterChange);
    });
    rows.addEventListener('click', handleDirectoryClick);
    rows.addEventListener('keydown', handleDirectoryKeyDown);
    marketSelect.addEventListener('change', handleRequirementChange);
    productSelect.addEventListener('change', handleRequirementChange);
    return () => {
      form.removeEventListener('submit', handleCertificateSubmit);
      samples.removeEventListener('click', handleSampleClick);
      directoryFilters.forEach((element) => {
        element.removeEventListener('input', handleFilterChange);
        element.removeEventListener('change', handleFilterChange);
      });
      rows.removeEventListener('click', handleDirectoryClick);
      rows.removeEventListener('keydown', handleDirectoryKeyDown);
      marketSelect.removeEventListener('change', handleRequirementChange);
      productSelect.removeEventListener('change', handleRequirementChange);
    };
  }, [contentRef]);
}
