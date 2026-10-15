const records = [
  { id: "BM-037-12", title: "Bedrock geology of the Dublin region", category: "Bedrock Maps", county: "Dublin", year: 2007, type: "PDF", size: "18.4 MB", location: "Dublin City, Fingal, South Dublin", description: "Bedrock geology map with explanatory notes covering the Dublin region and adjoining counties.", keywords: "bedrock geology map dublin sheet 16 geological survey" },
  { id: "PL 3045", title: "Mineral exploration in the Navan district", category: "Mineral Exploration Reports — Open File", county: "Meath", year: 1998, type: "PDF", size: "6.8 MB", location: "Navan, County Meath", description: "Open File report describing mineral exploration, regional geology and prospecting results in the Navan area.", keywords: "open file mineral exploration navan meath pl3045 zinc lead" },
  { id: "GT-0898", title: "Geotechnical site investigation: North Wall Quay", category: "Geotechnical Reports", county: "Dublin", year: 2011, type: "PDF", size: "12.1 MB", location: "North Wall Quay, Dublin", description: "Illustrative ground investigation report with borehole logs and geotechnical test results.", keywords: "geotechnical report borehole north wall quay dublin test" },
  { id: "BH-04127", title: "Borehole record: Ballymun water supply", category: "Boreholes & Tests", county: "Dublin", year: 1974, type: "TIFF", size: "42.6 MB", location: "Ballymun, County Dublin", description: "Historic scanned borehole log recording strata, depth and groundwater observations.", keywords: "borehole water groundwater test dublin ballymun" },
  { id: "HM-06-044", title: "Historic six-inch geological map: Killarney", category: "Historic Geological Maps", county: "Kerry", year: 1895, type: "TIFF", size: "68.2 MB", location: "Killarney, County Kerry", description: "Digitised historic six-inch geological map sheet for the Killarney district.", keywords: "historic 6 inch map geological kerry killarney geology" },
  { id: "GSI-PUB-221", title: "Groundwater in the Leinster region", category: "GSI Publications", county: "Wicklow", year: 2003, type: "PDF", size: "4.2 MB", location: "Leinster", description: "GSI publication on regional groundwater resources, aquifers and well records.", keywords: "groundwater publication leinster aquifer well wicklow" },
  { id: "BUL-1978-14", title: "Geology of the Ox Mountains", category: "Bulletins", county: "Sligo", year: 1978, type: "PDF", size: "9.7 MB", location: "Sligo and Mayo", description: "Geological Survey bulletin describing the geology and structure of the Ox Mountains.", keywords: "bulletin geology ox mountains sligo mayo report" },
  { id: "MR-00581", title: "Mine record: Avoca copper mines", category: "Mine Record Reports & Maps", county: "Wicklow", year: 1962, type: "PDF", size: "7.3 MB", location: "Avoca, County Wicklow", description: "Historic mine record with site notes, workings and a location sketch map.", keywords: "mine record report avoca copper wicklow map" },
  { id: "MM-2013-08", title: "Irish Sea seabed sediment map", category: "Marine Maps", county: "Dublin", year: 2013, type: "PDF", size: "15.2 MB", location: "Irish Sea, east coast", description: "Marine map showing interpreted seabed sediment distributions off the east coast of Ireland.", keywords: "marine map seabed sediment irish sea coast" },
  { id: "AG-2010-02", title: "Airborne geophysical survey: Midlands", category: "Airborne Geophysical Maps", county: "Offaly", year: 2010, type: "PDF", size: "22.8 MB", location: "Offaly, Laois and Tipperary", description: "Regional airborne geophysical survey map with magnetic and radiometric interpretations.", keywords: "airborne geophysical map midlands survey magnetic radiometric" },
  { id: "ML-00392", title: "Mineral locality record: Silvermines", category: "Mineral Locality Reports", county: "Tipperary", year: 1986, type: "PDF", size: "3.6 MB", location: "Silvermines, County Tipperary", description: "Mineral locality notes and a sample site plan for the Silvermines district.", keywords: "mineral locality silvermines tipperary report geology" },
  { id: "WR-06219", title: "Groundwater well hydrograph: Rathangan", category: "Groundwater Well Hydrographs", county: "Kildare", year: 1992, type: "PDF", size: "1.8 MB", location: "Rathangan, County Kildare", description: "Illustrative groundwater level record from a monitored well in County Kildare.", keywords: "groundwater well hydrograph rathangan kildare levels" },
  { id: "UR-1042", title: "Unpublished report: Coastal geomorphology of Donegal Bay", category: "Published & Unpublished Reports", county: "Donegal", year: 2001, type: "PDF", size: "5.1 MB", location: "Donegal Bay", description: "Unpublished research report on coastal processes and geomorphology around Donegal Bay.", keywords: "unpublished report coast geomorphology donegal bay" },
  { id: "HM-01-027", title: "Historic one-inch geological map: Galway", category: "Historic Geological Maps", county: "Galway", year: 1937, type: "TIFF", size: "57.9 MB", location: "Galway, County Galway", description: "Scanned historic one-inch geological map sheet showing the Galway district.", keywords: "historic one inch geological map galway sheet" },
  { id: "GT-1205", title: "Geotechnical report: Cork harbour development", category: "Geotechnical Reports", county: "Cork", year: 2015, type: "PDF", size: "10.3 MB", location: "Cork Harbour, County Cork", description: "Sample engineering geology report with ground investigation summaries for Cork Harbour.", keywords: "geotechnical report cork harbour development engineering" },
  { id: "BF-0187", title: "Bedrock field sheet: Slieve Bloom", category: "Bedrock Field Sheets", county: "Laois", year: 1996, type: "TIFF", size: "24.5 MB", location: "Slieve Bloom, Laois and Offaly", description: "Field mapping sheet and notes from a bedrock survey of the Slieve Bloom area.", keywords: "bedrock field sheet slieve bloom laois offaly map" },
];

const categoryNames = [...new Set(records.map((record) => record.category))];
const pageNames = ["home", "search", "browse", "support", "policy", "terms"];
const pageLabels = { home: "Home", search: "Search", browse: "Browse", support: "Support", policy: "Privacy & cookies", terms: "Site usage" };
const pageSize = 5;
let activePage = "home";
let currentResults = [];
let currentPage = 1;
const selectedBrowserItems = new Set();
const expandedFolders = new Set(["root"]);
let currentFolderId = "root";
let browserHistory = ["root"];
let browserHistoryIndex = 0;
let browserView = "grid";
let cart = [];
let toastTimer;

const byId = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const archiveFolders = {
  id: "root",
  name: "GOLDMINE",
  children: [
    { id: "cart", name: "-Cart-", children: [], files: [] },
    { id: "bedrock-fields", name: "Bedrock Field Sheets", children: [{ id: "bedrock-fields-laois", name: "County Laois", files: ["BF-0187"] }] },
    { id: "bedrock-maps", name: "Bedrock maps (1 inch & 6 inch)", children: [
      { id: "maps-one-inch", name: "1 inch maps", children: [{ id: "maps-one-inch-galway", name: "County Galway", files: ["HM-01-027"] }] },
      { id: "maps-six-inch", name: "6 inch maps", children: [{ id: "maps-six-inch-kerry", name: "County Kerry", files: ["HM-06-044"] }] },
      { id: "maps-bedrock-series", name: "Bedrock series", children: [{ id: "maps-bedrock-dublin", name: "Dublin region", files: ["BM-037-12"] }] },
    ] },
    { id: "bedrock-notebooks", name: "Bedrock Notebooks", children: [{ id: "notebooks-dublin", name: "County Dublin", files: ["BH-04127"] }] },
    { id: "geophysical-surveys", name: "Geophysical Surveys", children: [{ id: "airborne-surveys", name: "Airborne surveys", children: [{ id: "airborne-midlands", name: "Midlands", files: ["AG-2010-02"] }] }] },
    { id: "geotechnical-maps", name: "Geotechnical Maps", children: [{ id: "geotechnical-map-cork", name: "County Cork", files: [] }] },
    { id: "geotechnical-reports", name: "Geotechnical Reports", children: [
      { id: "geotechnical-reports-cork", name: "County Cork", files: ["GT-1205"] },
      { id: "geotechnical-reports-dublin", name: "County Dublin", files: ["GT-0898"] },
    ] },
    { id: "groundwater", name: "Groundwater", children: [{ id: "groundwater-wells", name: "Well hydrographs", children: [{ id: "groundwater-kildare", name: "County Kildare", files: ["WR-06219"] }] }] },
    { id: "gsi-publications", name: "GSI Publications", children: [
      { id: "publications-regional", name: "Regional publications", files: ["GSI-PUB-221"] },
      { id: "publications-bulletins", name: "Bulletins", files: ["BUL-1978-14"] },
    ] },
    { id: "marine", name: "Marine", children: [{ id: "marine-irish-sea", name: "Irish Sea", files: ["MM-2013-08"] }] },
    { id: "mine-maps", name: "Mine Maps", children: [{ id: "mine-maps-wicklow", name: "County Wicklow", files: [] }] },
    { id: "mine-records", name: "Mine Records", children: [{ id: "mine-records-wicklow", name: "County Wicklow", files: ["MR-00581"] }] },
    { id: "mineral-localities", name: "Mineral Localities", children: [{ id: "mineral-localities-tipperary", name: "County Tipperary", files: ["ML-00392"] }] },
    { id: "open-files", name: "Open Files", children: [{ id: "open-files-meath", name: "County Meath", files: ["PL 3045"] }] },
    { id: "quaternary", name: "Quaternary", children: [{ id: "quaternary-donegal", name: "County Donegal", files: ["UR-1042"] }] },
  ],
};

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function renderRoute() {
  const requested = window.location.hash.slice(1).split("?")[0];
  activePage = pageNames.includes(requested) ? requested : "home";
  document.querySelectorAll("[data-page]").forEach((section) => {
    const active = section.dataset.page === activePage;
    section.hidden = !active;
    section.classList.toggle("is-current", active);
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === activePage) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = `${pageLabels[activePage]} | GOLDMINE`;
  byId("primary-nav").classList.remove("is-open");
  byId("mobile-nav-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
  if (activePage === "search") runSearch();
  if (activePage === "browse") renderBrowser();
}

function populateFilters() {
  const categorySelect = byId("search-category");
  categoryNames.forEach((category) => categorySelect.add(new Option(category, category)));
  const counties = [...new Set(records.map((record) => record.county))].sort();
  const countySelect = byId("search-county");
  counties.forEach((county) => countySelect.add(new Option(county, county)));
}

function parseSearchQuery(query) {
  return (query.match(/"([^"]+)"|(\S+)/g) || []).map((term) => term.replace(/^"|"$/g, "").toLocaleLowerCase());
}

function runSearch(event) {
  if (event) event.preventDefault();
  const terms = parseSearchQuery(byId("search-query").value.trim());
  const category = byId("search-category").value;
  const county = byId("search-county").value;
  currentResults = records.map((record) => {
    const searchable = `${record.title} ${record.id} ${record.category} ${record.county} ${record.location} ${record.description} ${record.keywords}`.toLocaleLowerCase();
    const matching = terms.every((term) => searchable.includes(term));
    return { record, score: terms.reduce((score, term) => score + (record.title.toLocaleLowerCase().includes(term) ? 3 : record.id.toLocaleLowerCase().includes(term) ? 4 : searchable.includes(term) ? 1 : 0), 0), matching };
  }).filter(({ record, matching }) => matching && (!category || record.category === category) && (!county || record.county === county));
  const sort = byId("search-sort").value;
  currentResults.sort((a, b) => {
    if (sort === "title") return a.record.title.localeCompare(b.record.title);
    if (sort === "year-desc") return b.record.year - a.record.year;
    if (sort === "year-asc") return a.record.year - b.record.year;
    return b.score - a.score || b.record.year - a.record.year;
  });
  currentPage = 1;
  renderSearchResults();
}

function renderSearchResults() {
  const start = (currentPage - 1) * pageSize;
  const pageRecords = currentResults.slice(start, start + pageSize);
  const results = byId("search-results");
  results.replaceChildren();
  byId("results-heading").textContent = byId("search-query").value.trim() ? "Search results" : "All sample records";
  byId("result-count").textContent = currentResults.length ? `Showing ${start + 1}–${Math.min(start + pageSize, currentResults.length)} of ${currentResults.length} sample ${currentResults.length === 1 ? "record" : "records"}` : "0 sample records";
  if (!currentResults.length) {
    const empty = document.createElement("div");
    empty.className = "result-empty";
    empty.innerHTML = "<strong>No records found</strong><p>Try another keyword or clear one of the collection and county filters.</p>";
    results.append(empty);
  } else {
    pageRecords.forEach(({ record }) => results.append(createResultCard(record)));
  }
  renderPagination();
}

function createResultCard(record) {
  const card = document.createElement("article");
  card.className = "result-card";
  const icon = document.createElement("div");
  icon.className = "doc-icon";
  icon.innerHTML = `<span aria-hidden="true">${record.type === "PDF" ? "▧" : "▦"}</span><small>${escapeHtml(record.type)}</small>`;
  const main = document.createElement("div");
  main.className = "result-main";
  const heading = document.createElement("h3");
  const titleButton = document.createElement("button");
  titleButton.type = "button";
  titleButton.textContent = record.title;
  titleButton.addEventListener("click", () => openRecord(record, false));
  heading.append(titleButton);
  const description = document.createElement("p");
  description.textContent = record.description;
  const metadata = document.createElement("div");
  metadata.className = "metadata";
  [record.category, record.location, String(record.year), `Ref. ${record.id}`].forEach((value) => {
    const span = document.createElement("span");
    span.textContent = value;
    metadata.append(span);
  });
  main.append(heading, description, metadata);
  const actions = document.createElement("div");
  actions.className = "result-actions";
  const preview = document.createElement("button");
  preview.type = "button";
  preview.textContent = "Preview";
  preview.addEventListener("click", () => openRecord(record, true));
  const download = document.createElement("button");
  download.type = "button";
  download.textContent = "Download";
  download.addEventListener("click", () => downloadRecord(record));
  actions.append(preview, download);
  card.append(icon, main, actions);
  return card;
}

function renderPagination() {
  const pagination = byId("search-pagination");
  pagination.replaceChildren();
  const pages = Math.ceil(currentResults.length / pageSize);
  if (pages < 2) return;
  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "‹";
  previous.setAttribute("aria-label", "Previous page");
  previous.disabled = currentPage === 1;
  previous.addEventListener("click", () => { currentPage -= 1; renderSearchResults(); });
  pagination.append(previous);
  for (let page = 1; page <= pages; page += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(page);
    if (page === currentPage) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => { currentPage = page; renderSearchResults(); });
    pagination.append(button);
  }
  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "›";
  next.setAttribute("aria-label", "Next page");
  next.disabled = currentPage === pages;
  next.addEventListener("click", () => { currentPage += 1; renderSearchResults(); });
  pagination.append(next);
}

function setSearchQuery(query) {
  byId("search-query").value = query;
  runSearch();
  byId("search-query").focus();
}

function findFolder(folderId, folder = archiveFolders, parents = []) {
  if (folder.id === folderId) return { folder, parents };
  for (const child of folder.children || []) {
    const result = findFolder(folderId, child, [...parents, folder]);
    if (result) return result;
  }
  return null;
}

function folderRecordIds(folder) {
  const ids = [...(folder.files || [])];
  (folder.children || []).forEach((child) => ids.push(...folderRecordIds(child)));
  return ids;
}

function folderItemCount(folder) {
  return folder.id === "cart" ? cart.length : (folder.children || []).length + (folder.files || []).length;
}

function folderPath(folderId) {
  const result = findFolder(folderId);
  return result ? [...result.parents, result.folder] : [archiveFolders];
}

function findContainingFolder(recordId, folder = archiveFolders) {
  if ((folder.files || []).includes(recordId)) return folder;
  for (const child of folder.children || []) {
    const result = findContainingFolder(recordId, child);
    if (result) return result;
  }
  return null;
}

function navigateFolder(folderId, addHistory = true) {
  if (!findFolder(folderId)) return;
  if (folderId !== currentFolderId) selectedBrowserItems.clear();
  currentFolderId = folderId;
  byId("browse-query").value = "";
  if (addHistory) {
    browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    browserHistory.push(folderId);
    browserHistoryIndex = browserHistory.length - 1;
  }
  folderPath(folderId).forEach((folder) => expandedFolders.add(folder.id));
  renderBrowser();
}

function renderFolderTree() {
  const tree = byId("folder-tree");
  tree.replaceChildren();
  const renderNode = (folder, depth) => {
    const item = document.createElement("div");
    item.className = "tree-node";
    item.style.setProperty("--tree-depth", depth);
    const row = document.createElement("div");
    row.className = "tree-row";
    row.classList.toggle("is-current", folder.id === currentFolderId);
    const children = folder.children || [];
    const hasChildren = children.length > 0 || folder.id === "cart";
    if (hasChildren) {
      const disclosure = document.createElement("button");
      disclosure.type = "button";
      disclosure.className = "tree-disclosure";
      disclosure.textContent = expandedFolders.has(folder.id) ? "▾" : "▸";
      disclosure.setAttribute("aria-label", `${expandedFolders.has(folder.id) ? "Collapse" : "Expand"} ${folder.name}`);
      disclosure.setAttribute("aria-expanded", String(expandedFolders.has(folder.id)));
      disclosure.addEventListener("click", () => {
        if (expandedFolders.has(folder.id)) expandedFolders.delete(folder.id);
        else expandedFolders.add(folder.id);
        renderFolderTree();
      });
      row.append(disclosure);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "tree-disclosure-spacer";
      row.append(spacer);
    }
    const select = document.createElement("button");
    select.type = "button";
    select.className = "tree-select";
    if (folder.id === currentFolderId) select.setAttribute("aria-current", "page");
    const icon = document.createElement("span");
    icon.className = folder.id === "cart" ? "tree-cart-icon" : "tree-folder-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = folder.id === "cart" ? "▰" : "▱";
    const name = document.createElement("span");
    name.className = "tree-name";
    name.textContent = folder.id === "cart" ? `-Cart- (${cart.length} files)` : folder.name;
    const count = document.createElement("small");
    count.textContent = String(folderItemCount(folder));
    select.append(icon, name, count);
    select.addEventListener("click", () => navigateFolder(folder.id));
    row.append(select);
    item.append(row);
    if (hasChildren && expandedFolders.has(folder.id)) {
      const childList = document.createElement("div");
      childList.className = "tree-children";
      children.forEach((child) => childList.append(renderNode(child, depth + 1)));
      item.append(childList);
    }
    return item;
  };
  tree.append(renderNode(archiveFolders, 0));
}

function browserEntries() {
  const query = byId("browse-query").value.trim().toLocaleLowerCase();
  if (query) {
    return records
      .filter((record) => `${record.title} ${record.id} ${record.category} ${record.location} ${record.description} ${record.keywords}`.toLocaleLowerCase().includes(query))
      .map((record) => {
        const containingFolder = findContainingFolder(record.id);
        return {
          type: "file",
          record,
          path: containingFolder ? folderPath(containingFolder.id).map((folder) => folder.name).slice(1).join(" / ") : "",
        };
      });
  }
  const current = findFolder(currentFolderId)?.folder || archiveFolders;
  const children = current.id === "cart" ? [] : (current.children || []).map((folder) => ({ type: "folder", folder }));
  const fileIds = current.id === "cart" ? cart.map((record) => record.id) : (current.files || []);
  const files = fileIds.map((id) => records.find((record) => record.id === id)).filter(Boolean).map((record) => ({ type: "file", record }));
  return [...children, ...files];
}

function renderBreadcrumbs() {
  const crumbs = byId("file-breadcrumbs");
  crumbs.replaceChildren();
  const query = byId("browse-query").value.trim();
  if (query) {
    const root = document.createElement("button");
    root.type = "button";
    root.textContent = "GOLDMINE";
    root.addEventListener("click", () => { byId("browse-query").value = ""; renderBrowser(); });
    crumbs.append(root, document.createTextNode(" / Search results"));
    return;
  }
  const path = folderPath(currentFolderId);
  path.forEach((folder, index) => {
    if (index) crumbs.append(document.createTextNode(" / "));
    const crumb = document.createElement("button");
    crumb.type = "button";
    crumb.textContent = folder.id === "cart" ? `-Cart- (${cart.length} files)` : folder.name;
    crumb.disabled = index === path.length - 1;
    crumb.addEventListener("click", () => navigateFolder(folder.id));
    crumbs.append(crumb);
  });
}

function createBrowserItem(entry) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = `browser-item ${entry.type === "folder" ? "browser-folder-item" : "browser-file-item"}`;
  item.setAttribute("role", "gridcell");
  const key = entry.type === "folder" ? `folder:${entry.folder.id}` : entry.record.id;
  const selected = selectedBrowserItems.has(key);
  item.dataset.selectionKey = key;
  item.dataset.entryType = entry.type;
  item.classList.toggle("is-selected", selected);
  item.setAttribute("aria-selected", String(selected));
  const icon = document.createElement("span");
  icon.className = entry.type === "folder" ? "browser-large-folder" : `browser-large-file file-${entry.record.type.toLowerCase()}`;
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = entry.type === "folder" ? "" : entry.record.type === "PDF" ? "PDF" : "TIF";
  const name = document.createElement("span");
  name.className = "browser-item-name";
  name.textContent = entry.type === "folder" ? entry.folder.name : entry.record.title;
  const detail = document.createElement("small");
  detail.className = "browser-item-detail";
  if (entry.type === "folder") {
    const count = folderItemCount(entry.folder);
    detail.textContent = `${count} ${count === 1 ? "file" : "items"}`;
  } else {
    detail.textContent = `${entry.record.id} · ${entry.record.type} · ${entry.record.size}${entry.path ? ` · ${entry.path}` : ""}`;
  }
  item.append(icon, name, detail);
  item.addEventListener("click", () => {
    if (selectedBrowserItems.has(key)) selectedBrowserItems.delete(key);
    else selectedBrowserItems.add(key);
    updateBrowserSelection();
  });
  item.addEventListener("dblclick", () => {
    if (entry.type === "folder") navigateFolder(entry.folder.id);
    else openRecord(entry.record, true);
  });
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (entry.type === "folder") navigateFolder(entry.folder.id);
      else openRecord(entry.record, true);
    }
  });
  return item;
}

function renderBrowser() {
  renderFolderTree();
  renderBreadcrumbs();
  const query = byId("browse-query").value.trim();
  const current = findFolder(currentFolderId)?.folder || archiveFolders;
  const entries = browserEntries();
  const items = byId("browser-items");
  items.classList.toggle("is-grid", browserView === "grid");
  items.classList.toggle("is-list", browserView === "list");
  items.replaceChildren(...entries.map(createBrowserItem));
  const totalFiles = entries.filter((entry) => entry.type === "file").length;
  const totalFolders = entries.filter((entry) => entry.type === "folder").length;
  byId("folder-title").textContent = query ? `Search results for “${query}”` : current.id === "cart" ? `-Cart- (${cart.length} files)` : current.name;
  byId("folder-summary").textContent = query
    ? `${totalFiles} matching sample ${totalFiles === 1 ? "document" : "documents"} across the local archive`
    : `${totalFolders} folders · ${totalFiles} files`;
  byId("file-count").textContent = `${entries.length} ${entries.length === 1 ? "item" : "items"}`;
  byId("browse-empty").hidden = entries.length > 0;
  byId("selection-count").textContent = `${selectedBrowserItems.size} selected`;
  byId("browser-back").disabled = browserHistoryIndex <= 0;
  byId("browser-forward").disabled = browserHistoryIndex >= browserHistory.length - 1;
  byId("browser-up").disabled = currentFolderId === "root";
  byId("browser-cart").disabled = cart.length === 0;
  byId("browser-trash").disabled = selectedBrowserItems.size === 0;
  byId("add-selected").disabled = selectedBrowserItems.size === 0;
  updateCart();
}

function addToCart(items) {
  items.forEach((record) => {
    if (!cart.some((item) => item.id === record.id)) cart.push(record);
  });
  updateCart();
  refreshCartFolder();
  byId("download-cart").hidden = false;
  showToast(items.length ? `${items.length} ${items.length === 1 ? "record" : "records"} added to your download list.` : "Select at least one file first.");
}

function updateCart() {
  byId("cart-count").textContent = String(cart.length);
  byId("cart-empty").hidden = cart.length > 0;
  const list = byId("cart-items");
  list.replaceChildren();
  cart.forEach((record) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = record.title;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${record.title} from download list`);
    remove.addEventListener("click", () => {
      cart = cart.filter((entry) => entry.id !== record.id);
      updateCart();
      refreshCartFolder();
    });
    item.append(label, remove);
    list.append(item);
  });
  if (activePage === "browse") renderFolderTree();
}

function refreshCartFolder() {
  if (activePage === "browse" && currentFolderId === "cart") renderBrowser();
}

function updateBrowserSelection() {
  document.querySelectorAll(".browser-item").forEach((item) => {
    const selected = selectedBrowserItems.has(item.dataset.selectionKey);
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-selected", String(selected));
  });
  byId("selection-count").textContent = `${selectedBrowserItems.size} selected`;
  byId("browser-trash").disabled = selectedBrowserItems.size === 0;
  byId("add-selected").disabled = selectedBrowserItems.size === 0;
}

function selectedRecords() {
  const ids = new Set();
  selectedBrowserItems.forEach((key) => {
    if (key.startsWith("folder:")) {
      const folder = findFolder(key.slice("folder:".length))?.folder;
      if (folder) folderRecordIds(folder).forEach((id) => ids.add(id));
    } else {
      ids.add(key);
    }
  });
  return [...ids].map((id) => records.find((record) => record.id === id)).filter(Boolean);
}

function removeSelectedFromCart() {
  const selectedIds = new Set(selectedRecords().map((record) => record.id));
  const before = cart.length;
  cart = cart.filter((record) => !selectedIds.has(record.id));
  selectedBrowserItems.clear();
  updateCart();
  refreshCartFolder();
  if (before === cart.length) showToast("Select files in the download list to remove them from the cart.");
  else showToast(`${before - cart.length} ${before - cart.length === 1 ? "file" : "files"} removed from the download list.`);
}

function downloadRecord(record) {
  const body = [
    "GOLDMINE — SAMPLE ARCHIVE DOCUMENT",
    "Demonstration file only. This is not an original Geological Survey Ireland record.",
    "",
    `Title: ${record.title}`,
    `Reference: ${record.id}`,
    `Collection: ${record.category}`,
    `Location: ${record.location}`,
    `County: ${record.county}`,
    `Year: ${record.year}`,
    `Format shown in catalogue: ${record.type}`,
    "",
    record.description,
  ].join("\n");
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.id.replace(/[^A-Za-z0-9-]/g, "-")}-demo.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Sample record downloaded as a text file.");
}

function downloadCart() {
  if (!cart.length) {
    showToast("Your download list is empty.");
    return;
  }
  const lines = [["Reference", "Title", "Collection", "County", "Year", "Format", "Size"], ...cart.map((record) => [record.id, record.title, record.category, record.county, record.year, record.type, record.size])];
  const csv = lines.map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "goldmine-demo-download-list.csv";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Download list saved as a CSV catalogue.");
}

function openRecord(record, preview) {
  const dialog = byId("record-dialog");
  byId("dialog-kicker").textContent = preview ? "SAMPLE DOCUMENT PREVIEW" : "ARCHIVE RECORD";
  const content = byId("dialog-content");
  content.replaceChildren();
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.textContent = record.title;
  const description = document.createElement("p");
  description.textContent = `${record.description} This locally generated sample is for demonstration only.`;
  const meta = document.createElement("div");
  meta.className = "dialog-meta";
  [["Reference", record.id], ["Collection", record.category], ["Location", record.location], ["Year", String(record.year)], ["Format", record.type], ["File size", record.size]].forEach(([label, value]) => {
    const item = document.createElement("div");
    const small = document.createElement("small");
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = value;
    item.append(small, strong);
    meta.append(item);
  });
  content.append(title, description, meta);
  if (preview) {
    const sheet = document.createElement("div");
    sheet.className = "preview-sheet";
    const sheetContent = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = `GEOLOGICAL SURVEY IRELAND · ${record.id}`;
    const sheetTitle = document.createElement("strong");
    sheetTitle.textContent = record.title;
    const sub = document.createElement("small");
    sub.textContent = `${record.location} · ${record.year} · DEMONSTRATION COPY`;
    sheetContent.append(label, sheetTitle, sub);
    sheet.append(sheetContent);
    content.append(sheet);
  }
  const note = document.createElement("p");
  note.textContent = preview ? "Preview illustration only — the original document is not available in this demo." : "Sample catalogue entry — original archive file not attached.";
  content.append(note);
  const actions = document.createElement("div");
  actions.className = "dialog-actions";
  const download = document.createElement("button");
  download.className = "button button-primary";
  download.type = "button";
  download.textContent = "Download sample file ↓";
  download.addEventListener("click", () => downloadRecord(record));
  const close = document.createElement("button");
  close.className = "button button-secondary";
  close.type = "button";
  close.textContent = "Close";
  close.addEventListener("click", () => dialog.close());
  actions.append(download, close);
  content.append(actions);
  dialog.showModal();
}

function openLoginDialog() {
  const dialog = byId("record-dialog");
  byId("dialog-kicker").textContent = "DEMO ACCOUNT";
  const content = byId("dialog-content");
  content.replaceChildren();
  const title = document.createElement("h2");
  title.id = "dialog-title";
  title.textContent = "Sign-in is not connected";
  const copy = document.createElement("p");
  copy.textContent = "The live archive may provide account and download services. This static demonstration does not collect credentials or connect to an account service.";
  content.append(title, copy);
  const close = document.createElement("button");
  close.className = "button button-primary";
  close.type = "button";
  close.textContent = "Understood";
  close.addEventListener("click", () => dialog.close());
  content.append(close);
  dialog.showModal();
}

function showCookieSettings() {
  byId("cookie-banner").hidden = false;
}

function saveCookieChoice(choice) {
  try {
    localStorage.setItem("goldmine-cookie-choice", choice);
  } catch {
    showToast("Your browser did not allow saving this preference.");
  }
  byId("cookie-banner").hidden = true;
  showToast("Cookie preferences saved for this browser.");
}

function init() {
  populateFilters();
  byId("search-form").addEventListener("submit", runSearch);
  byId("search-category").addEventListener("change", runSearch);
  byId("search-county").addEventListener("change", runSearch);
  byId("search-sort").addEventListener("change", runSearch);
  byId("search-form").addEventListener("reset", () => window.setTimeout(runSearch, 0));
  document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
    if (activePage !== "search") window.location.hash = "search";
    window.setTimeout(() => setSearchQuery(button.dataset.query), 0);
  }));
  byId("browse-query").addEventListener("input", renderBrowser);
  byId("add-selected").addEventListener("click", () => addToCart(selectedRecords()));
  byId("browser-back").addEventListener("click", () => {
    if (browserHistoryIndex <= 0) return;
    browserHistoryIndex -= 1;
    navigateFolder(browserHistory[browserHistoryIndex], false);
  });
  byId("browser-forward").addEventListener("click", () => {
    if (browserHistoryIndex >= browserHistory.length - 1) return;
    browserHistoryIndex += 1;
    navigateFolder(browserHistory[browserHistoryIndex], false);
  });
  byId("browser-up").addEventListener("click", () => {
    const path = folderPath(currentFolderId);
    if (path.length > 1) navigateFolder(path[path.length - 2].id);
  });
  byId("browser-grid-view").addEventListener("click", () => {
    browserView = "grid";
    byId("browser-grid-view").setAttribute("aria-pressed", "true");
    byId("browser-list-view").setAttribute("aria-pressed", "false");
    renderBrowser();
  });
  byId("browser-list-view").addEventListener("click", () => {
    browserView = "list";
    byId("browser-grid-view").setAttribute("aria-pressed", "false");
    byId("browser-list-view").setAttribute("aria-pressed", "true");
    renderBrowser();
  });
  byId("browser-trash").addEventListener("click", removeSelectedFromCart);
  byId("browser-cart").addEventListener("click", downloadCart);
  byId("cart-toggle").addEventListener("click", () => { byId("download-cart").hidden = !byId("download-cart").hidden; });
  byId("cart-close").addEventListener("click", () => { byId("download-cart").hidden = true; });
  byId("cart-clear").addEventListener("click", () => {
    cart = [];
    updateCart();
    refreshCartFolder();
  });
  byId("cart-download").addEventListener("click", downloadCart);
  byId("folder-collapse").addEventListener("click", () => {
    const tree = byId("folder-tree");
    const collapsed = tree.hidden;
    tree.hidden = !collapsed;
    byId("folder-collapse").textContent = collapsed ? "−" : "+";
    byId("folder-collapse").setAttribute("aria-label", collapsed ? "Collapse folders" : "Expand folders");
  });
  byId("mobile-nav-toggle").addEventListener("click", (event) => {
    const nav = byId("primary-nav");
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !expanded);
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
  });
  byId("language-toggle").addEventListener("click", () => {
    const options = byId("language-options");
    const expanded = byId("language-toggle").getAttribute("aria-expanded") === "true";
    options.hidden = expanded;
    byId("language-toggle").setAttribute("aria-expanded", String(!expanded));
  });
  byId("language-options").addEventListener("click", () => {
    byId("language-options").hidden = true;
    byId("language-toggle").setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));
  byId("support-form").addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Thanks for your message. This demonstration does not send or store support requests.");
    event.currentTarget.reset();
  });
  byId("login-open").addEventListener("click", openLoginDialog);
  byId("dialog-close").addEventListener("click", () => byId("record-dialog").close());
  byId("cookie-settings-open").addEventListener("click", showCookieSettings);
  byId("cookie-settings-footer").addEventListener("click", showCookieSettings);
  byId("cookie-accept").addEventListener("click", () => saveCookieChoice(JSON.stringify({ preferences: byId("cookie-preferences").checked, analytics: false })));
  byId("cookie-customize").addEventListener("click", () => saveCookieChoice(JSON.stringify({ preferences: byId("cookie-preferences").checked, analytics: false })));
  byId("cookie-reject").addEventListener("click", () => saveCookieChoice(JSON.stringify({ preferences: false, analytics: false })));
  try {
    if (!localStorage.getItem("goldmine-cookie-choice")) showCookieSettings();
  } catch {
    showCookieSettings();
  }
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}

init();
