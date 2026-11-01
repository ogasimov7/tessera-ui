// Tessera → Figma builder, shared by the Community plugin (community.js) and the offline plugin (offline.js).
// buildSystem(DATA) creates a variable collection (Light/Dark), text styles, color swatches and a component sheet
// bound to those variables: Button, Badge, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Progress, Tabs,
// Alert, Avatar, Tooltip, Card, Popover, Dialog, Dropdown Menu, Table, Accordion and Skeleton.
// DATA: { name, fonts:{heading,body,mono}, radius, light:{}, dark:{} }

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

// Mix two hex colors in OKLab, matching CSS color-mix(in oklab, a p, b).
function mixOklab(a, b, p) {
  const toLab = (hex) => {
    const { r, g, b: bl } = hexToRgb(hex);
    const [R, G, B] = [r, g, bl].map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  };
  const [x, y] = [toLab(a), toLab(b)];
  const [L, A, Bv] = x.map((v, i) => v * p + y[i] * (1 - p));
  const l = (L + 0.3963377774 * A + 0.2158037573 * Bv) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * Bv) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * Bv) ** 3;
  const enc = (c) => Math.min(1, Math.max(0, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
  return { r: enc(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), g: enc(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), b: enc(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) };
}

async function loadFont(family, styles) {
  for (const style of styles) {
    try { await figma.loadFontAsync({ family, style }); return { family, style }; } catch (e) {}
  }
  const fallback = styles.includes("Bold") ? "Bold" : styles.includes("Medium") ? "Medium" : "Regular";
  await figma.loadFontAsync({ family: "Inter", style: fallback });
  return { family: "Inter", style: fallback };
}

async function buildSystem(DATA) {
  const radiusPx = Math.round(DATA.radius * 16);
  const R = { sm: Math.max(0, radiusPx - 4), md: Math.max(0, radiusPx - 2), lg: radiusPx, xl: radiusPx + 4, full: 999 };
  // Tessera's small shapes (badges, switches, checkboxes, thumbs) follow the radius instead of being fixed pills.
  const tile = (offset, min) => Math.max(min, radiusPx - offset);

  // 1. Variables
  const collection = figma.variables.createVariableCollection(DATA.name);
  const LIGHT = collection.modes[0].modeId;
  collection.renameMode(LIGHT, "Light");
  const DARK = collection.addMode("Dark");
  const v = {};
  for (const key of Object.keys(DATA.light)) {
    const variable = figma.variables.createVariable("color/" + key, collection, "COLOR");
    variable.setValueForMode(LIGHT, hexToRgb(DATA.light[key]));
    variable.setValueForMode(DARK, hexToRgb(DATA.dark[key] || DATA.light[key]));
    v[key] = variable;
  }
  // Status text is mixed toward the foreground (60%, as in code) so it reads at 4.5:1+ for every status in both modes.
  const STATUSES = ["destructive", "success", "warning", "info"];
  for (const status of STATUSES) {
    if (!DATA.light[status]) continue;
    const variable = figma.variables.createVariable("color/" + status + "-text", collection, "COLOR");
    variable.setValueForMode(LIGHT, mixOklab(DATA.light[status], DATA.light.foreground, 0.6));
    variable.setValueForMode(DARK, mixOklab(DATA.dark[status], DATA.dark.foreground, 0.6));
    v[status + "-text"] = variable;
  }
  for (const [name, px] of [["radius/sm", R.sm], ["radius/md", R.md], ["radius/lg", R.lg], ["radius/xl", R.xl]]) {
    const variable = figma.variables.createVariable(name, collection, "FLOAT");
    variable.setValueForMode(LIGHT, px);
    variable.setValueForMode(DARK, px);
  }

  const paint = (key) => figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v[key]);
  const tint = (key, opacity) => Object.assign({}, paint(key), { opacity });
  const shadow = (y, blur, a) => ({ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a }, offset: { x: 0, y }, radius: blur, spread: 0, visible: true, blendMode: "NORMAL" });

  // 2. Fonts and text styles
  const fBody = await loadFont(DATA.fonts.body, ["Regular"]);
  const fBodyMed = await loadFont(DATA.fonts.body, ["Medium", "SemiBold", "Semi Bold", "Regular"]);
  const fHead = await loadFont(DATA.fonts.heading, ["Bold", "SemiBold", "Semi Bold", "Regular"]);
  await loadFont("Inter", ["Regular"]);

  const textStyles = [
    ["Heading/H1", fHead, 36, -0.02], ["Heading/H2", fHead, 28, -0.015], ["Heading/H3", fHead, 20, -0.01],
    ["Body/Large", fBody, 18, 0], ["Body/Default", fBody, 14, 0], ["Body/Small", fBody, 12, 0], ["Label/Default", fBodyMed, 14, 0],
  ];
  for (const [name, font, size, tracking] of textStyles) {
    const s = figma.createTextStyle();
    s.name = name; s.fontName = font; s.fontSize = size;
    s.letterSpacing = { unit: "PERCENT", value: tracking * 100 };
  }

  // 3. Building blocks
  function text(chars, font, size, colorKey) {
    const t = figma.createText();
    t.fontName = font; t.fontSize = size; t.characters = chars;
    t.fills = [paint(colorKey)];
    return t;
  }
  function auto(node, name, dir, gap, pad) {
    node.name = name; node.layoutMode = dir; node.itemSpacing = gap;
    node.paddingLeft = node.paddingRight = pad[0]; node.paddingTop = node.paddingBottom = pad[1];
    node.primaryAxisSizingMode = "AUTO"; node.counterAxisSizingMode = "AUTO";
    node.fills = [];
    return node;
  }
  const stack = (name, dir, gap, pad) => auto(figma.createFrame(), name, dir, gap, pad);
  const component = (name, dir, gap, pad) => auto(figma.createComponent(), name, dir, gap, pad);
  /** Fix an auto-layout frame's width, letting its height follow the content. */
  function width(node, w) {
    if (node.layoutMode === "HORIZONTAL") node.primaryAxisSizingMode = "FIXED"; else node.counterAxisSizingMode = "FIXED";
    node.resize(w, Math.max(1, node.height));
    return node;
  }
  /** Append children to an auto-layout parent, stretching the given ones to its width. */
  function add(parent, children, fill) {
    for (const c of children) {
      parent.appendChild(c);
      if (fill) { c.layoutSizingHorizontal = "FILL"; if (c.type === "TEXT") c.textAutoResize = "HEIGHT"; }
    }
    return parent;
  }
  function outline(node, key, w) { node.strokes = [paint(key)]; node.strokeWeight = w || 1; return node; }
  function bottomRule(node, key) {
    node.strokes = [paint(key)];
    node.strokeTopWeight = 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0; node.strokeBottomWeight = 1;
    return node;
  }
  /** A 16px line icon from an SVG path drawn on a 16×16 grid. */
  function icon(path, colorKey, size) {
    const box = figma.createFrame();
    box.name = "Icon"; box.fills = []; box.clipsContent = false; box.resize(size || 16, size || 16);
    const vec = figma.createVector();
    vec.vectorPaths = [{ windingRule: "NONE", data: path }];
    vec.fills = []; vec.strokes = [paint(colorKey)]; vec.strokeWeight = 1.5; vec.strokeCap = "ROUND"; vec.strokeJoin = "ROUND";
    box.appendChild(vec);
    const scale = (size || 16) / 16;
    if (scale !== 1) vec.rescale(scale);
    vec.x = ((size || 16) - vec.width) / 2; vec.y = ((size || 16) - vec.height) / 2;
    return box;
  }
  const CHECK = "M 3.5 8.5 L 6.5 11.5 L 12.5 4.5";
  const CHEVRON = "M 4 6 L 8 10 L 12 6";
  const CLOSE = "M 4 4 L 12 12 M 12 4 L 4 12";

  const page = figma.currentPage;
  const sheet = [];
  function variants(name, comps) {
    comps.forEach((c) => page.appendChild(c));
    const set = figma.combineAsVariants(comps, page);
    set.name = name; set.layoutMode = "HORIZONTAL"; set.itemSpacing = 16; set.counterAxisAlignItems = "CENTER";
    set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO";
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
    sheet.push(set);
    return set;
  }
  function single(c) { page.appendChild(c); sheet.push(c); return c; }

  // 4. Color swatches
  const swatches = stack("Colors", "HORIZONTAL", 16, [32, 32]);
  swatches.layoutWrap = "WRAP"; swatches.counterAxisSpacing = 16; swatches.primaryAxisSizingMode = "FIXED"; swatches.resize(1040, 100);
  swatches.fills = [paint("background")];
  for (const key of Object.keys(DATA.light)) {
    const cell = stack(key, "VERTICAL", 8, [0, 0]);
    const r = figma.createRectangle();
    r.resize(112, 64); r.cornerRadius = R.lg; r.fills = [paint(key)];
    outline(r, "border");
    cell.appendChild(r);
    cell.appendChild(text(key, fBody, 11, "muted-foreground"));
    swatches.appendChild(cell);
  }
  page.appendChild(swatches);

  // 5. Components
  // Button
  const BUTTON = {
    Default: ["primary", "primary-foreground"], Secondary: ["secondary", "secondary-foreground"], Outline: ["background", "foreground"],
    Ghost: [null, "foreground"], Destructive: ["destructive", "destructive-foreground"], Link: [null, "primary"],
  };
  const buttons = Object.keys(BUTTON).map((variant) => {
    const c = component("Variant=" + variant, "HORIZONTAL", 8, [16, 9]);
    c.primaryAxisAlignItems = "CENTER"; c.counterAxisAlignItems = "CENTER"; c.cornerRadius = R.md;
    const [bg, fg] = BUTTON[variant];
    c.fills = bg ? [paint(bg)] : [];
    if (variant === "Outline") outline(c, "input");
    if (bg && variant !== "Outline") c.effects = [shadow(1, 2, 0.05)];
    const label = text("Button", fBodyMed, 14, fg);
    if (variant === "Link") label.textDecoration = "UNDERLINE";
    c.appendChild(label);
    return c;
  });
  variants("Button", buttons);
  const btn = (variant, label) => {
    const i = buttons[Object.keys(BUTTON).indexOf(variant)].createInstance();
    i.findOne((n) => n.type === "TEXT").characters = label;
    return i;
  };

  // Badge
  const BADGE = {
    Default: ["primary", "primary-foreground"], Secondary: ["secondary", "secondary-foreground"], Outline: [null, "foreground"],
    Success: ["success", "success-foreground"], Warning: ["warning", "warning-foreground"], Destructive: ["destructive", "destructive-foreground"], Info: ["info", "info-foreground"],
  };
  const badges = Object.keys(BADGE).map((variant) => {
    const c = component("Variant=" + variant, "HORIZONTAL", 0, [8, 2]);
    c.cornerRadius = tile(4, 3);
    const [bg, fg] = BADGE[variant];
    c.fills = bg ? [paint(bg)] : [];
    if (variant === "Outline" || variant === "Secondary") outline(c, "border");
    c.appendChild(text("BADGE", fBodyMed, 11, fg));
    return c;
  });
  variants("Badge", badges);

  // Input, Textarea, Select
  function field(name, placeholder, h) {
    const c = component(name, "HORIZONTAL", 8, [12, 9]);
    c.counterAxisAlignItems = h ? "MIN" : "CENTER"; c.cornerRadius = R.md;
    c.fills = [paint("background"), tint("muted", 0.5)]; outline(c, "input");
    c.appendChild(text(placeholder, fBody, 14, "muted-foreground"));
    width(c, 280);
    if (h) { c.counterAxisSizingMode = "FIXED"; c.resize(280, h); }
    return c;
  }
  const input = single(field("Input", "name@example.com"));
  const textarea = single(field("Textarea", "Type your message here.", 80));
  const select = component("Select", "HORIZONTAL", 8, [12, 9]);
  select.primaryAxisAlignItems = "SPACE_BETWEEN"; select.counterAxisAlignItems = "CENTER"; select.cornerRadius = R.md;
  select.fills = [paint("background"), tint("muted", 0.5)]; outline(select, "input");
  add(select, [text("Select a plan", fBody, 14, "muted-foreground"), icon(CHEVRON, "muted-foreground")]);
  width(select, 200);
  single(select);

  // Checkbox, Radio, Switch
  const checkboxes = ["Checked", "Unchecked"].map((state) => {
    const c = component("State=" + state, "HORIZONTAL", 0, [0, 0]);
    c.primaryAxisAlignItems = "CENTER"; c.counterAxisAlignItems = "CENTER";
    c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "FIXED"; c.resize(16, 16); c.cornerRadius = tile(6, 3);
    if (state === "Checked") { c.fills = [paint("primary")]; c.appendChild(icon(CHECK, "primary-foreground", 14)); }
    else { c.fills = [paint("background"), tint("muted", 0.5)]; outline(c, "input"); }
    return c;
  });
  variants("Checkbox", checkboxes);
  const radios = ["Checked", "Unchecked"].map((state) => {
    const c = component("State=" + state, "HORIZONTAL", 0, [0, 0]);
    c.primaryAxisAlignItems = "CENTER"; c.counterAxisAlignItems = "CENTER";
    c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "FIXED"; c.resize(16, 16); c.cornerRadius = R.full;
    c.fills = state === "Checked" ? [paint("primary")] : [paint("background"), tint("muted", 0.5)]; outline(c, state === "Checked" ? "primary" : "input");
    if (state === "Checked") { const dot = figma.createEllipse(); dot.resize(6, 6); dot.fills = [paint("primary-foreground")]; c.appendChild(dot); }
    return c;
  });
  variants("Radio", radios);
  const switches = ["On", "Off"].map((state) => {
    const c = component("State=" + state, "HORIZONTAL", 0, [2, 2]);
    c.primaryAxisAlignItems = state === "On" ? "MAX" : "MIN"; c.counterAxisAlignItems = "CENTER";
    c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "FIXED"; c.resize(36, 20); c.cornerRadius = tile(2, 4);
    c.fills = [paint(state === "On" ? "primary" : "input")];
    const thumb = figma.createRectangle(); thumb.name = "Thumb"; thumb.resize(16, 16); thumb.cornerRadius = tile(4, 3);
    thumb.fills = [paint("background")]; thumb.effects = [shadow(1, 2, 0.2)];
    c.appendChild(thumb);
    return c;
  });
  variants("Switch", switches);

  // Slider and Progress (absolute layout)
  function track(name, w, h, value, trackPaint) {
    const c = figma.createComponent();
    c.name = name; c.fills = []; c.resize(w, Math.max(h, name === "Slider" ? 16 : h));
    const y = (c.height - h) / 2;
    const t = figma.createRectangle(); t.name = "Track"; t.resize(w, h); t.y = y; t.cornerRadius = R.full; t.fills = [trackPaint];
    const r = figma.createRectangle(); r.name = "Range"; r.resize(w * value, h); r.y = y; r.cornerRadius = R.full; r.fills = [paint("primary")];
    c.appendChild(t); c.appendChild(r);
    if (name === "Slider") {
      const thumb = figma.createRectangle(); thumb.name = "Thumb"; thumb.resize(12, 20); thumb.cornerRadius = tile(6, 3); thumb.x = w * value - 6; thumb.y = -2;
      thumb.fills = [paint("background")]; outline(thumb, "border"); thumb.effects = [shadow(1, 3, 0.2)];
      c.appendChild(thumb);
    }
    return single(c);
  }
  track("Slider", 240, 6, 0.5, paint("input"));
  const progress = track("Progress", 240, 8, 0.66, tint("primary", 0.15));

  // Tabs
  const tabs = component("Tabs", "HORIZONTAL", 20, [0, 0]);
  bottomRule(tabs, "border");
  for (const [label, active] of [["Account", true], ["Password", false], ["Billing", false]]) {
    const t = stack(label, "HORIZONTAL", 0, [2, 8]);
    if (active) { t.strokes = [paint("primary")]; t.strokeTopWeight = 0; t.strokeLeftWeight = 0; t.strokeRightWeight = 0; t.strokeBottomWeight = 2; }
    t.appendChild(text(label, fBodyMed, 14, active ? "foreground" : "muted-foreground"));
    tabs.appendChild(t);
  }
  single(tabs);

  // Alert
  const ALERT_COPY = {
    Default: ["Heads up", "You can add components with the CLI."],
    Info: ["New version available", "Tessera 1.1 adds status colors."],
    Success: ["Payment received", "Your receipt is on its way."],
    Warning: ["Card expires soon", "Update it before the 30th."],
    Destructive: ["Payment failed", "Check your card details and try again."],
  };
  const alerts = Object.keys(ALERT_COPY).map((variant) => {
    const tone = variant === "Default" ? null : variant.toLowerCase();
    const c = component("Variant=" + variant, "HORIZONTAL", 0, [0, 0]);
    c.cornerRadius = R.lg; c.clipsContent = true;
    c.fills = tone ? [paint("card"), tint(tone, 0.05)] : [paint("card")];
    c.strokes = [tone ? tint(tone, 0.25) : paint("border")]; c.strokeWeight = 1;
    const bar = figma.createRectangle(); bar.name = "Accent"; bar.resize(3, 40); bar.fills = [paint(tone || "primary")];
    const body = stack("Body", "VERTICAL", 2, [14, 12]);
    width(c, 360);
    add(c, [bar]); bar.layoutAlign = "STRETCH";
    add(c, [body], true);
    add(body, [
      text(ALERT_COPY[variant][0], fBodyMed, 14, tone ? tone + "-text" : "card-foreground"),
      text(ALERT_COPY[variant][1], fBody, 14, tone ? tone + "-text" : "muted-foreground"),
    ], true);
    return c;
  });
  variants("Alert", alerts).layoutMode = "VERTICAL";

  // Avatar
  const avatar = component("Avatar", "HORIZONTAL", 0, [0, 0]);
  avatar.primaryAxisAlignItems = "CENTER"; avatar.counterAxisAlignItems = "CENTER";
  avatar.primaryAxisSizingMode = "FIXED"; avatar.counterAxisSizingMode = "FIXED"; avatar.resize(32, 32); avatar.cornerRadius = R.lg + 2;
  avatar.fills = [paint("secondary")];
  avatar.appendChild(text("SD", fBodyMed, 12, "secondary-foreground"));
  single(avatar);

  // Tooltip
  const tooltip = component("Tooltip", "HORIZONTAL", 0, [12, 6]);
  tooltip.cornerRadius = tile(4, 4); tooltip.fills = [paint("foreground")]; tooltip.effects = [shadow(6, 16, 0.25)];
  tooltip.appendChild(text("Add to library", fBodyMed, 12, "background"));
  single(tooltip);

  // Card
  const card = component("Card", "VERTICAL", 6, [24, 24]);
  card.cornerRadius = R.xl; card.fills = [paint("card")]; outline(card, "border"); card.effects = [shadow(1, 3, 0.06)];
  width(card, 360);
  add(card, [text("Card title", fHead, 18, "card-foreground"), text("A short description of what this card holds.", fBody, 14, "muted-foreground")], true);
  single(card);

  // Popover
  const popover = component("Popover", "VERTICAL", 12, [16, 16]);
  popover.cornerRadius = R.lg + 2; popover.fills = [paint("popover")]; outline(popover, "border"); popover.effects = [shadow(4, 12, 0.1)];
  width(popover, 288);
  add(popover, [text("Dimensions", fBodyMed, 14, "popover-foreground"), text("Set the dimensions for the layer.", fBody, 14, "muted-foreground"), input.createInstance()], true);
  single(popover);

  // Dialog
  const dialog = component("Dialog", "VERTICAL", 0, [0, 0]);
  dialog.cornerRadius = R.lg + 6; dialog.clipsContent = true; dialog.fills = [paint("background")]; outline(dialog, "border"); dialog.effects = [shadow(24, 64, 0.3)];
  width(dialog, 440);
  const dBody = stack("Body", "VERTICAL", 16, [24, 24]);
  const dHead = stack("Header", "HORIZONTAL", 16, [0, 0]);
  dHead.primaryAxisAlignItems = "SPACE_BETWEEN";
  dHead.appendChild(text("Edit profile", fHead, 18, "foreground"));
  dHead.appendChild(icon(CLOSE, "muted-foreground"));
  const dFoot = stack("Footer", "HORIZONTAL", 8, [24, 16]);
  dFoot.primaryAxisAlignItems = "MAX"; dFoot.fills = [tint("muted", 0.5)];
  dFoot.strokes = [paint("border")]; dFoot.strokeTopWeight = 1; dFoot.strokeBottomWeight = 0; dFoot.strokeLeftWeight = 0; dFoot.strokeRightWeight = 0;
  add(dFoot, [btn("Outline", "Cancel"), btn("Default", "Save changes")]);
  add(dialog, [dBody, dFoot], true);
  add(dBody, [dHead, text("Make changes to your profile here. Click save when you're done.", fBody, 14, "muted-foreground"), input.createInstance()], true);
  single(dialog);

  // Dropdown Menu
  const menu = component("Dropdown Menu", "VERTICAL", 0, [4, 4]);
  menu.cornerRadius = R.lg + 2; menu.fills = [paint("popover")]; outline(menu, "border"); menu.effects = [shadow(4, 12, 0.1)];
  width(menu, 224);
  function menuItem(label, opts) {
    const it = stack(label, "HORIZONTAL", 8, [8, 6]);
    it.primaryAxisAlignItems = "SPACE_BETWEEN"; it.cornerRadius = tile(4, 3);
    if (opts.active) it.fills = [paint("accent")];
    it.appendChild(opts.label ? text(label.toUpperCase(), fBodyMed, 11, "muted-foreground") : text(label, fBody, 14, opts.destructive ? "destructive-text" : opts.active ? "accent-foreground" : "popover-foreground"));
    if (opts.shortcut) it.appendChild(text(opts.shortcut, fBody, 12, "muted-foreground"));
    return it;
  }
  function rule() {
    const r = figma.createRectangle(); r.name = "Separator"; r.resize(200, 1); r.fills = [paint("border")];
    const wrap = stack("Separator", "VERTICAL", 0, [0, 4]); wrap.appendChild(r);
    return wrap;
  }
  const menuRows = [menuItem("My account", { label: true }), rule(), menuItem("Profile", { shortcut: "⇧⌘P", active: true }), menuItem("Billing", { shortcut: "⌘B" }), menuItem("Settings", { shortcut: "⌘S" }), rule(), menuItem("Log out", { destructive: true })];
  add(menu, menuRows, true);
  for (const row of menuRows) if (row.name === "Separator") row.children[0].layoutSizingHorizontal = "FILL";
  single(menu);

  // Table
  const table = component("Table", "VERTICAL", 0, [0, 0]);
  width(table, 480);
  const COLS = [120, 120, 120, 120];
  function tableRow(cells, head) {
    const row = stack(head ? "Header" : "Row", "HORIZONTAL", 0, [0, 0]);
    bottomRule(row, "border");
    if (head) row.fills = [tint("muted", 0.5)];
    cells.forEach((value, i) => {
      const cell = stack("Cell", "HORIZONTAL", 0, [12, head ? 10 : 10]);
      if (i === cells.length - 1) cell.primaryAxisAlignItems = "MAX";
      cell.appendChild(head ? text(value.toUpperCase(), fBodyMed, 11, "muted-foreground") : text(value, fBody, 14, "foreground"));
      width(cell, COLS[i]);
      row.appendChild(cell);
    });
    return row;
  }
  add(table, [tableRow(["Invoice", "Status", "Method", "Amount"], true), tableRow(["INV001", "Paid", "Card", "$250.00"]), tableRow(["INV002", "Pending", "Transfer", "$150.00"]), tableRow(["INV003", "Unpaid", "Card", "$350.00"])], true);
  single(table);

  // Accordion
  const accordion = component("Accordion", "VERTICAL", 0, [0, 0]);
  width(accordion, 400);
  [["Is it accessible?", "Yes. It follows the WAI-ARIA design pattern."], ["Can I restyle it?", null], ["Does it animate?", null]].forEach(([q, a]) => {
    const item = stack("Item", "VERTICAL", 0, [0, 0]);
    bottomRule(item, "border");
    const trigger = stack("Trigger", "HORIZONTAL", 16, [0, 16]);
    trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
    const box = stack("Toggle", "HORIZONTAL", 0, [2, 2]);
    box.cornerRadius = tile(6, 3);
    if (a) box.fills = [paint("primary")]; else outline(box, "border");
    box.appendChild(icon(a ? "M 5 5 L 11 11 M 11 5 L 5 11" : "M 8 4 L 8 12 M 4 8 L 12 8", a ? "primary-foreground" : "muted-foreground", 16));
    add(trigger, [text(q, fBodyMed, 14, "foreground"), box]);
    add(item, [trigger], true);
    if (a) { const body = stack("Content", "VERTICAL", 0, [0, 0]); body.paddingBottom = 16; body.paddingTop = 0; add(item, [body], true); add(body, [text(a, fBody, 14, "muted-foreground")], true); }
    add(accordion, [item], true);
  });
  single(accordion);

  // Skeleton
  const skeleton = component("Skeleton", "HORIZONTAL", 16, [0, 0]);
  skeleton.counterAxisAlignItems = "CENTER";
  const circle = figma.createRectangle(); circle.resize(48, 48); circle.cornerRadius = R.lg + 2; circle.fills = [paint("muted")];
  const lines = stack("Lines", "VERTICAL", 8, [0, 0]);
  for (const w of [220, 160]) { const l = figma.createRectangle(); l.resize(w, 16); l.cornerRadius = R.md; l.fills = [paint("muted")]; lines.appendChild(l); }
  add(skeleton, [circle, lines]);
  single(skeleton);

  // 6. Light + Dark preview boards built from instances
  function board(label, modeId) {
    const b = stack(DATA.name + " — " + label, "VERTICAL", 20, [40, 40]);
    b.fills = [paint("background")];
    b.setExplicitVariableModeForCollection(collection, modeId);
    b.appendChild(text(DATA.name + " · " + label, fHead, 28, "foreground"));
    const row = stack("Buttons", "HORIZONTAL", 12, [0, 0]);
    for (const comp of buttons.slice(0, 5)) row.appendChild(comp.createInstance());
    const brow = stack("Badges", "HORIZONTAL", 8, [0, 0]);
    for (const comp of badges) brow.appendChild(comp.createInstance());
    const controls = stack("Controls", "HORIZONTAL", 16, [0, 0]);
    controls.counterAxisAlignItems = "CENTER";
    add(controls, [checkboxes[0].createInstance(), radios[0].createInstance(), switches[0].createInstance(), switches[1].createInstance(), select.createInstance()]);
    add(b, [row, brow, tabs.createInstance(), input.createInstance(), controls, progress.createInstance(), alerts[2].createInstance(), alerts[4].createInstance(), card.createInstance()]);
    page.appendChild(b);
    return b;
  }
  const boards = [board("Light", LIGHT), board("Dark", DARK)];

  // 7. Layout: swatches, then the component sheet in rows, then the two boards side by side
  const GAP = 64, MAX_W = 1600;
  swatches.x = 0; swatches.y = 0;
  let x = 0, y = swatches.height + 120, rowH = 0;
  for (const n of sheet) {
    if (x > 0 && x + n.width > MAX_W) { x = 0; y += rowH + GAP; rowH = 0; }
    n.x = x; n.y = y; x += n.width + GAP; rowH = Math.max(rowH, n.height);
  }
  y += rowH + 120;
  boards[0].x = 0; boards[0].y = y;
  boards[1].x = boards[0].width + 80; boards[1].y = y;

  const all = [swatches, ...sheet, ...boards];
  figma.viewport.scrollAndZoomIntoView(all);
  return "“" + DATA.name + "” created: variables, text styles, " + sheet.length + " components and preview boards.";
}
