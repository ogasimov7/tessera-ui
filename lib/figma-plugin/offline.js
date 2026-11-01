// Offline plugin: the buyer's system is embedded at download time, so it runs without network access.
const DATA = __TESSERA_DATA__;

buildSystem(DATA)
  .then((summary) => figma.closePlugin(summary))
  .catch((e) => figma.closePlugin("Import failed: " + (e && e.message ? e.message : e)));
