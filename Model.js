// Pure helpers for the sites uptime-monitor plugin. Kept side-effect free so
// site-list parsing/formatting can be unit tested apart from QML/Process I/O.

var MAX_SITES = 10

function emptySite() {
  return { name: "", url: "" }
}

function emptyStatuses() {
  var out = []
  for (var i = 0; i < MAX_SITES; i++) out.push(null)
  return out
}

function emptyStrings() {
  var out = []
  for (var i = 0; i < MAX_SITES; i++) out.push("")
  return out
}

// Always returns exactly MAX_SITES entries, trimmed. Extra entries are dropped
// and missing ones are padded so callers never have to null-check `sites[i]`.
function normalizeSites(raw) {
  var list = Array.isArray(raw) ? raw : []
  var out = []
  for (var i = 0; i < MAX_SITES; i++) {
    var entry = list[i] || {}
    out.push({
      name: String(entry.name || "").trim(),
      url: String(entry.url || "").trim()
    })
  }
  return out
}

function parseSitesFile(raw) {
  try {
    var parsed = JSON.parse(String(raw || ""))
    return normalizeSites(parsed && parsed.sites)
  } catch (e) {
    return normalizeSites([])
  }
}

function sitesToFileText(sites) {
  return JSON.stringify({ sites: normalizeSites(sites) }, null, 2) + "\n"
}

// A blank URL is the single source of truth for an unused slot.
function isConfigured(site) {
  return !!(site && String(site.url || "").trim() !== "")
}

// Falls back to the URL so an unnamed site still has a useful label.
function displayName(site) {
  if (!site) return ""
  var name = String(site.name || "").trim()
  if (name !== "") return name
  return String(site.url || "").trim()
}

function configuredIndexes(sites) {
  var out = []
  var list = Array.isArray(sites) ? sites : []
  for (var i = 0; i < list.length; i++) {
    if (isConfigured(list[i])) out.push(i)
  }
  return out
}

if (typeof module !== "undefined") {
  module.exports = {
    MAX_SITES: MAX_SITES,
    emptySite: emptySite,
    emptyStatuses: emptyStatuses,
    emptyStrings: emptyStrings,
    normalizeSites: normalizeSites,
    parseSitesFile: parseSitesFile,
    sitesToFileText: sitesToFileText,
    isConfigured: isConfigured,
    displayName: displayName,
    configuredIndexes: configuredIndexes
  }
}
