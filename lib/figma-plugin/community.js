// Community plugin: asks for the code from the buyer's download, fetches the system from the site and builds it.
// The API placeholder below is filled in with the site URL by scripts/build-figma-plugin.mjs.
const API = __TESSERA_API__;

figma.showUI(__html__, { width: 340, height: 260, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (!msg || msg.type !== "import") return;
  const say = (type, message) => figma.ui.postMessage({ type, message });
  let data;
  try {
    const res = await fetch(API + "/api/figma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: String(msg.code || "") }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return say("error", body.error || "The code couldn't be checked (" + res.status + ").");
    data = body;
  } catch (e) {
    return say("error", "Couldn't reach the server. Check your connection and try again.");
  }
  try {
    say("status", "Building “" + data.name + "”… this takes a few seconds.");
    figma.closePlugin(await buildSystem(data));
  } catch (e) {
    say("error", "Import failed: " + (e && e.message ? e.message : e));
  }
};
