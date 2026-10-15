/*
 * Portfolio + selected-work behavior.
 *
 * Ported from the agency site's operator shell (yoshimedia.agency) as plain static JS:
 * the home "The Work" section (#swRows), the Portfolio page hero carousel (#photoHero),
 * the grouped shoot rows / expand-all gallery (#pfRows / #pfGrid), the shared lightbox
 * (#swLightbox) and the campaigns filter + story toggles.
 *
 * The agency loads an optional overlay from /api/portfolio-photos (uploads, hidden photos,
 * hero picks). Its public response is currently empty apart from the nine hero picks, so
 * that state is baked into the catalog below and nothing here calls an API.
 */
(function () {
  "use strict";

  const esc = (v) =>
    String(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const ALT_CREDIT = "Yoshua Israel-Dugeon";

  /* `hero` marks the ten photos (incl. the Wedding cover) the portfolio hero cycles through, in order; its value is
     the full-frame derivative used by the carousel. */
  const SW_PROJECTS = [
    { t: "Michigan State", c: "Graduation", img: "./assets/graduation/P1020352-680185ce-656f-44a5-8654-5a3439415c52.png", pos: "50% 36%", hero: "./assets/portfolio-hero/michigan-state.webp" },
    { t: "The Walk", c: "Graduation", img: "./assets/graduation/P1010942-e1b9d89b-07b4-407a-89e6-d7b75331b2fc.jpg", pos: "50% 18%", hero: "./assets/portfolio-hero/the-walk.webp" },
    { t: "Flag Bearer", c: "Graduation", img: "./assets/graduation/P1010990-b22542c0-2204-422d-93eb-e2c88748cba7.png", pos: "38% 16%" },
    { t: "The Gown", c: "Graduation", img: "./assets/graduation/P1020012-7c98dd61-ce41-4b9c-b919-0280b007961e.png", pos: "40% 18%" },
    { t: "With Honors", c: "Graduation", img: "./assets/graduation/P1020058-352b904e-fb0e-4a92-9621-aef8f4ff58e4.png", pos: "50% 22%" },
    { t: "Say Less", c: "Graduation", img: "./assets/graduation/P1020082-4072d4d7-b806-48f7-86ca-d4db76cb8b40.png", pos: "52% 18%" },
    { t: "Spartan Stadium", c: "Graduation", img: "./assets/graduation/P1020104-ec6472c2-b3f8-48f4-b664-31214cb04c64.png", pos: "50% 32%" },
    { t: "Gratitude", c: "Graduation", img: "./assets/graduation/P1020297-bdfa6786-528f-4790-a1a9-0784e9294dd1.png", pos: "38% 22%", hero: "./assets/portfolio-hero/gratitude.webp" },
    { t: "Green & Gold", c: "Graduation", img: "./assets/graduation/P1020362-7d5a342a-4ee7-40e3-8eae-620b316d5c20.png", pos: "62% 18%" },
    { t: "Off the Wall", c: "Portraits", img: "./assets/portraits/IMG_2136.jpeg", pos: "55% 16%", hero: "./assets/portfolio-hero/off-the-wall.webp" },
    { t: "Poolside", c: "Portraits", img: "./assets/portraits/IMG_0090.jpeg", pos: "50% 22%", hero: "./assets/portfolio-hero/poolside.webp" },
    { t: "AKA", c: "Portraits", img: "./assets/portraits/IMG_0662.jpeg", pos: "62% 18%" },
    { t: "Fall Colors", c: "Portraits", img: "./assets/portraits/IMG_1236.jpeg", pos: "50% 32%" },
    { t: "Rewind", c: "Portraits", img: "./assets/portraits/IMG_1422.jpeg", pos: "62% 18%" },
    { t: "Stairwell", c: "Portraits", img: "./assets/portraits/IMG_1457.jpeg", pos: "68% 16%" },
    { t: "Face to Face", c: "Portraits", img: "./assets/portraits/IMG_2158.jpeg", pos: "46% 22%" },
    { t: "Midnight Cowboy", c: "Portraits", img: "./assets/portraits/IMG_3692.jpeg", pos: "50% 28%" },
    { t: "Blue Sky", c: "Portraits", img: "./assets/portraits/P1010034.jpeg", pos: "50% 22%", hero: "./assets/portfolio-hero/blue-sky.webp" },
    { t: "Downtown Austin", c: "Street", img: "./assets/street/IMG_1873.jpeg", pos: "50% 30%", hero: "./assets/portfolio-hero/downtown-austin.webp" },
    { t: "October", c: "Street", img: "./assets/street/P1000708.jpg", pos: "46% 48%", hero: "./assets/portfolio-hero/october.webp" },
    { t: "Violators", c: "Street", img: "./assets/street/P1000821.jpeg", pos: "50% 50%" },
    { t: "Hat Tree", c: "Street", img: "./assets/street/P1010600.jpeg", pos: "50% 48%" },
    { t: "The Rotation", c: "Street", img: "./assets/street/P1010637.jpeg", pos: "55% 45%" },
    { t: "Silver Spoons", c: "Street", img: "./assets/street/P1010652.jpeg", pos: "50% 38%" },
    { t: "Stop & Smell", c: "Street", img: "./assets/street/pets/IMG_9166.jpeg", pos: "62% 20%", hero: "./assets/portfolio-hero/stop-and-smell.webp" },
    { t: "The Prowl", c: "Street", img: "./assets/street/pets/IMG_9170.jpeg", pos: "62% 78%" },
    { t: "Blep", c: "Street", img: "./assets/street/pets/IMG_9171.jpeg", pos: "68% 12%" },
    { t: "Averi's Wedding", c: "Wedding", img: "./assets/wedding/averi-wedding-01.webp", pos: "50% 35%", hero: "./assets/wedding/averi-wedding-01.webp" },
    { t: "With Mom", c: "Wedding", img: "./assets/wedding/averi-wedding-02.webp", pos: "50% 35%" },
    { t: "Bouquet", c: "Wedding", img: "./assets/wedding/averi-wedding-03.webp", pos: "50% 35%" },
    { t: "Bluebird Kiss", c: "Wedding", img: "./assets/wedding/averi-wedding-04.webp", pos: "50% 35%" },
    { t: "By the Creek", c: "Wedding", img: "./assets/wedding/averi-wedding-05.webp", pos: "50% 35%" },
    { t: "With Grandma", c: "Wedding", img: "./assets/wedding/averi-wedding-06.webp", pos: "50% 35%" },
    { t: "Wishing Well", c: "Wedding", img: "./assets/wedding/averi-wedding-07.webp", pos: "50% 35%" },
  ];

  const ALLY_SLIDE = "./assets/campaigns/ally-strategy.png";
  /* Shoot groups: every photo listed under one id is one shoot, shown as a single portfolio row
     and opened in the lightbox as a set. Photos in no group are one-photo shoots. Order is the
     lightbox order. Titles match SW_PROJECTS. Mirrors migration 0030 in By-Yoshi-Media; the
     singles (portraits Poolside, AKA, Fall Colors, Midnight Cowboy, Blue Sky; street Downtown
     Austin, October, Violators) are deliberately left out. */
  const SW_SHOOTS = [
    { id: "grad-03", photos: ["Michigan State", "Gratitude", "Green & Gold"] },
    { id: "grad-02", photos: ["With Honors", "Say Less", "Spartan Stadium"] },
    { id: "grad-01", photos: ["The Walk", "Flag Bearer", "The Gown"] },
    { id: "portrait-2021-02-07", photos: ["Off the Wall", "Face to Face"] },
    { id: "portrait-2020-11-03", photos: ["Rewind", "Stairwell"] },
    { id: "street-2020-10-18", photos: ["Hat Tree", "The Rotation", "Silver Spoons"] },
    { id: "pets", photos: ["Stop & Smell", "The Prowl", "Blep"] },
    { id: "averi-wedding", photos: ["Averi's Wedding", "With Mom", "Bouquet", "Bluebird Kiss", "By the Creek", "With Grandma", "Wishing Well"] },
  ];
  const SHOOT_OF = new Map();
  SW_SHOOTS.forEach((shoot) => shoot.photos.forEach((title) => SHOOT_OF.set(title, shoot.id)));
  SW_PROJECTS.forEach((p) => { if (SHOOT_OF.has(p.t)) p.shoot = SHOOT_OF.get(p.t); });

  const portfolioCatalog = SW_PROJECTS.slice();

  /* Designs: a second top-level category beside Photography. Kept out of SW_PROJECTS and
     SW_SHOOTS so the Photography catalog, hero, counts and shoot sets are untouched. Each
     project is one shoot-style set (`shoot`); `pt` is the project name shown on its row, and
     `fit: "contain"` renders the artwork uncropped. Array order is the lightbox order. */
  const DESIGN_PROJECTS = [
    { t: "Hero Stacked", c: "Logos", img: "./assets/designs/protein-hero-stacked.webp", shoot: "protein-on-the-beat", pt: "Protein on the Beat" },
    { t: "Wordmark", c: "Logos", img: "./assets/designs/protein-wordmark.webp", shoot: "protein-on-the-beat", pt: "Protein on the Beat" },
    { t: "Horizontal Lockup", c: "Logos", img: "./assets/designs/protein-horizontal-lockup.webp", shoot: "protein-on-the-beat", pt: "Protein on the Beat" },
    { t: "Circular Seal", c: "Logos", img: "./assets/designs/protein-circular-seal.webp", shoot: "protein-on-the-beat", pt: "Protein on the Beat" },
    { t: "Streetwear Hit", c: "Logos", img: "./assets/designs/protein-streetwear-hit.webp", shoot: "protein-on-the-beat", pt: "Protein on the Beat" },
    { t: "Super Slab Sale", c: "Designs and Brochures", img: "./assets/designs/azt-super-slab-sale.webp", shoot: "arizona-tile-flyers", pt: "Arizona Tile Flyers" },
    { t: "Annual Tile Showcase", c: "Designs and Brochures", img: "./assets/designs/azt-tile-showcase.webp", shoot: "arizona-tile-flyers", pt: "Arizona Tile Flyers" },
  ].map((d) => ({ ...d, fit: "contain" }));
  const lightboxCatalog = portfolioCatalog.concat(DESIGN_PROJECTS);

  const WORK_LB_BLANK = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  const HOME_WORK_PREVIEW = 6;
  let workLbPrevOverflow = "", workLbReturnFocus = null, workLbWired = false;
  let workLbPlaylist = [], workLbIndex = 0, workLbTouch = null;

  const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isNarrow = () =>
    typeof window.matchMedia === "function" && window.matchMedia("(max-width: 1024px)").matches;
  const scrollBehaviorPref = () => (prefersReducedMotion() || isNarrow() ? "auto" : "smooth");

  /* A "shoot" is every photo sharing a shoot id; photos without one stand alone. */
  function groupCatalogByShoot(items) {
    const sections = [];
    const byShoot = new Map();
    for (const item of items) {
      const id = item.shoot || "";
      if (!id) {
        sections.push({ shoot: "", cover: item, photos: [item] });
        continue;
      }
      const existing = byShoot.get(id);
      if (!existing) {
        const section = { shoot: id, cover: item, photos: [item] };
        byShoot.set(id, section);
        sections.push(section);
        continue;
      }
      existing.photos.push(item);
    }
    return sections;
  }

  function shootCovers(items) {
    return groupCatalogByShoot(items).map((section) => ({ ...section.cover, count: section.photos.length }));
  }

  /* Every photo in the same shoot as `p`, in lightbox order, from the full catalog (not the
     current filter), so any entry point opens the same set. */
  function shootPlaylist(p) {
    if (!p || !p.shoot) return [p];
    const photos = lightboxCatalog.filter((item) => item.shoot === p.shoot);
    return photos.length ? photos : [p];
  }

  function openShootLightbox(p, triggerEl, opts) {
    const playlist = shootPlaylist(p);
    const index = Math.max(0, playlist.findIndex((item) => item.img === p.img));
    openWorkLightbox(playlist[index] || p, triggerEl, { ...(opts || {}), playlist, index });
  }

  function workLightboxOpen() {
    const lb = document.getElementById("swLightbox");
    return !!(lb && !lb.hasAttribute("hidden"));
  }

  function showWorkLightboxPhoto() {
    const p = workLbPlaylist[workLbIndex];
    const lbImg = document.getElementById("swLightboxImg");
    if (!p || !lbImg) return;
    const pad2 = (n) => String(n).padStart(2, "0");
    const lbCat = document.getElementById("swLightboxCat");
    const lbTitle = document.getElementById("swLightboxTitle");
    const lbCount = document.getElementById("swLightboxCount");
    const lbPrev = document.getElementById("swLightboxPrev");
    const lbNext = document.getElementById("swLightboxNext");
    lbImg.src = p.img;
    lbImg.alt = p.t;
    if (lbCat) lbCat.textContent = p.c;
    if (lbTitle) lbTitle.textContent = p.t;
    const multi = workLbPlaylist.length > 1;
    if (lbCount) {
      lbCount.hidden = !multi;
      lbCount.textContent = multi ? `${pad2(workLbIndex + 1)} / ${pad2(workLbPlaylist.length)}` : "";
    }
    if (lbPrev) lbPrev.hidden = !multi;
    if (lbNext) lbNext.hidden = !multi;
    const thumbs = document.getElementById("swLightboxThumbs");
    if (thumbs) {
      thumbs.hidden = !multi;
      [...thumbs.children].forEach((btn, i) => {
        const on = i === workLbIndex;
        btn.classList.toggle("is-active", on);
        if (on) btn.setAttribute("aria-current", "true"); else btn.removeAttribute("aria-current");
      });
    }
  }

  /* One thumbnail per photo in the shoot; the active one is outlined in red. */
  function renderWorkLightboxThumbs() {
    const thumbs = document.getElementById("swLightboxThumbs");
    if (!thumbs) return;
    thumbs.replaceChildren();
    if (workLbPlaylist.length < 2) return;
    const total = workLbPlaylist.length;
    workLbPlaylist.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sw-lightbox-thumb" + (item.fit === "contain" ? " is-contain" : "");
      btn.setAttribute("aria-label", `Show photo ${i + 1} of ${total}: ${item.t}`);
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = "";
      img.decoding = "async";
      btn.append(img);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        workLbIndex = i;
        showWorkLightboxPhoto();
      });
      thumbs.append(btn);
    });
  }

  function stepWorkLightbox(dir) {
    if (workLbPlaylist.length < 2) return;
    workLbIndex = (workLbIndex + dir + workLbPlaylist.length) % workLbPlaylist.length;
    showWorkLightboxPhoto();
  }

  function openWorkLightbox(p, triggerEl, opts) {
    const lb = document.getElementById("swLightbox"), lbImg = document.getElementById("swLightboxImg");
    if (!lb || !lbImg || !p) return;
    const lbClose = document.getElementById("swLightboxClose");
    workLbPlaylist = Array.isArray(opts && opts.playlist) && opts.playlist.length ? opts.playlist.slice() : [p];
    const fromOpts = typeof (opts && opts.index) === "number" ? opts.index : workLbPlaylist.findIndex((item) => item && item.img === p.img);
    workLbIndex = fromOpts >= 0 ? fromOpts : 0;
    workLbReturnFocus = triggerEl && typeof triggerEl.focus === "function" ? triggerEl : null;
    renderWorkLightboxThumbs();
    showWorkLightboxPhoto();
    workLbPrevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("sw-lb-open");
    lb.removeAttribute("hidden");
    if (lbClose) lbClose.focus();
  }

  function closeWorkLightbox() {
    const lb = document.getElementById("swLightbox");
    if (!lb || lb.hasAttribute("hidden")) return;
    const lbImg = document.getElementById("swLightboxImg");
    lb.setAttribute("hidden", "");
    if (lbImg) lbImg.src = WORK_LB_BLANK;
    workLbPlaylist = [];
    workLbIndex = 0;
    const thumbsHost = document.getElementById("swLightboxThumbs");
    if (thumbsHost) { thumbsHost.replaceChildren(); thumbsHost.hidden = true; }
    document.body.style.overflow = workLbPrevOverflow;
    document.documentElement.classList.remove("sw-lb-open");
    workLbPrevOverflow = "";
    const restore = workLbReturnFocus;
    workLbReturnFocus = null;
    if (restore) restore.focus();
  }

  function wireWorkLightbox() {
    if (workLbWired) return;
    workLbWired = true;
    const lb = document.getElementById("swLightbox");
    const lbClose = document.getElementById("swLightboxClose");
    const lbPrev = document.getElementById("swLightboxPrev");
    const lbNext = document.getElementById("swLightboxNext");
    if (lb) {
      lb.addEventListener("click", (e) => { if (e.target === lb) closeWorkLightbox(); });
      lb.addEventListener("touchstart", (e) => {
        workLbTouch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
      }, { passive: true });
      lb.addEventListener("touchend", (e) => {
        if (!workLbTouch || !workLightboxOpen()) return;
        const dx = e.changedTouches[0].clientX - workLbTouch.x;
        const dy = e.changedTouches[0].clientY - workLbTouch.y;
        workLbTouch = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) stepWorkLightbox(dx < 0 ? 1 : -1);
      }, { passive: true });
      lb.addEventListener("touchmove", (e) => {
        if (!workLbTouch || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - workLbTouch.x;
        const dy = e.touches[0].clientY - workLbTouch.y;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
      }, { passive: false });
      lb.addEventListener("touchcancel", () => { workLbTouch = null; });
    }
    if (lbClose) lbClose.addEventListener("click", (e) => { e.stopPropagation(); closeWorkLightbox(); });
    if (lbPrev) lbPrev.addEventListener("click", (e) => { e.stopPropagation(); stepWorkLightbox(-1); });
    if (lbNext) lbNext.addEventListener("click", (e) => { e.stopPropagation(); stepWorkLightbox(1); });
    document.addEventListener("keydown", (e) => {
      if (!workLightboxOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); closeWorkLightbox(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); stepWorkLightbox(-1); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); stepWorkLightbox(1); }
    });
  }

  function workListFor(cat) {
    return cat === "All" ? portfolioCatalog : portfolioCatalog.filter((p) => p.c === cat);
  }

  function designListFor(cat) {
    return cat === "All" ? DESIGN_PROJECTS : DESIGN_PROJECTS.filter((p) => p.c === cat);
  }

  const itemTitle = (p) => p.pt || p.t;
  const fitClass = (p) => (p.fit === "contain" ? " is-contain" : "");

  /* Hover/tile crop focal point. Faces sit in the upper third on most people photos;
     Street defaults to center unless pos is set. */
  function workFocalPos(p) {
    const raw = typeof p.pos === "string" ? p.pos.trim() : "";
    if (/^\d{1,3}(?:\.\d+)?%\s+\d{1,3}(?:\.\d+)?%$/.test(raw)) return raw;
    return p.c === "Graduation" || p.c === "Portraits" ? "50% 28%" : "50% 50%";
  }

  function workRowsHtml(list, opts) {
    const anon = !!(opts && opts.anon);
    const pad2 = (n) => String(n).padStart(2, "0");
    return list.map((p, i) => {
      const num = pad2(i + 1);
      const pos = workFocalPos(p);
      const extra = Number(p.count) > 1 ? ` (${pad2(p.count)} photos)` : "";
      const label = anon ? `${esc(p.c)} photo ${num}${extra} — open photo full screen` : p.fit === "contain" ? `${esc(itemTitle(p))}${extra ? ` (${pad2(p.count)} items)` : ""} — open full screen` : `${esc(p.t)} — open photo full screen`;
      const countMark = Number(p.count) > 1 ? `<span class="sw-row-count">${pad2(p.count)}</span>` : "";
      const titleCell = anon
        ? `<span class="sw-row-title sw-row-title--num">${num}${countMark}</span>`
        : `<span class="sw-row-num">${num}</span><span class="sw-row-title">${esc(itemTitle(p))}${countMark}</span>`;
      return `<div class="sw-row${anon ? " sw-row--anon" : ""}" data-sw-idx="${i}" tabindex="0" role="button" aria-label="${label}">
          <div class="sw-row-photo${fitClass(p)}" aria-hidden="true"><div style="background-image:url('${esc(p.img)}');background-position:${pos}"></div></div>
          <div class="sw-row-grid">
            ${titleCell}
            <span class="sw-row-cat">${esc(p.c)}</span>
            <span class="pf-thumb-m${fitClass(p)}" aria-hidden="true"><img src="${esc(p.img)}" alt="" width="80" height="60" loading="lazy" decoding="async" style="object-position:${pos}" /></span>
          </div>
        </div>`;
    }).join("");
  }

  function workTilesHtml(list, opts) {
    const anon = !!(opts && opts.anon);
    const pad2 = (n) => String(n).padStart(2, "0");
    return list.map((p, i) => {
      const pos = workFocalPos(p);
      const extra = Number(p.count) > 1 ? ` (${pad2(p.count)} photos)` : "";
      const label = anon ? `${esc(p.c)} photo ${pad2(i + 1)}${extra} — open photo full screen` : p.fit === "contain" ? `${esc(itemTitle(p))}${extra ? ` (${pad2(p.count)} items)` : ""} — open full screen` : `${esc(p.t)} — open photo full screen`;
      const cap = anon
        ? `<span class="sw-tile-cap sw-tile-cap--anon"><span class="sw-tile-cat">${esc(p.c)}</span></span>`
        : `<span class="sw-tile-cap"><span class="sw-tile-title">${esc(itemTitle(p))}</span><span class="sw-tile-cat">${esc(p.c)}</span></span>`;
      const countMark = Number(p.count) > 1 ? `<span class="sw-tile-count">${pad2(p.count)}</span>` : "";
      return `<button type="button" class="sw-tile${fitClass(p)}" data-sw-idx="${i}" aria-label="${label}">
          <img src="${esc(p.img)}" alt="" loading="lazy" decoding="async" style="object-position:${pos}" />
          ${countMark}
          ${cap}
        </button>`;
    }).join("");
  }

  /* Row hover-expand needs a real pointer; on touch the row thumbnail stands in. */
  function wireWorkHost(host, getList, opts) {
    const anon = !!(opts && opts.anon);
    const hoverable = typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const closeOthers = (except) => {
      host.querySelectorAll(".sw-row.is-open").forEach((r) => { if (r !== except) r.classList.remove("is-open"); });
    };
    const openAt = (el) => {
      const p = getList()[Number(el.dataset.swIdx)];
      if (p) openShootLightbox(p, el, { anon });
    };
    host.addEventListener("mouseover", (e) => {
      if (!hoverable) return;
      const row = e.target.closest(".sw-row");
      if (!row) return;
      closeOthers(row);
      row.classList.add("is-open");
    });
    host.addEventListener("mouseout", (e) => {
      if (!hoverable) return;
      const row = e.target.closest(".sw-row");
      if (row && !row.contains(e.relatedTarget)) row.classList.remove("is-open");
    });
    host.addEventListener("focusin", (e) => {
      const row = e.target.closest(".sw-row");
      if (!row) return;
      closeOthers(row);
      row.classList.add("is-open");
    });
    host.addEventListener("focusout", (e) => {
      const row = e.target.closest(".sw-row");
      if (row && !row.contains(e.relatedTarget)) row.classList.remove("is-open");
    });
    host.addEventListener("click", (e) => {
      const el = e.target.closest("[data-sw-idx]");
      if (el) openAt(el);
    });
    host.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const row = e.target.closest(".sw-row");
      if (!row) return;
      e.preventDefault();
      openAt(row);
    });
  }

  /* Home page: "The Work" teaser (first six projects) with the Photography / Advertising tabs. */
  function initSelectedWork() {
    const rowsHost = document.getElementById("swRows");
    if (!rowsHost || rowsHost.dataset.wired === "1") return;
    rowsHost.dataset.wired = "1";
    wireWorkLightbox();
    const adPane = document.getElementById("swAd");
    const moreWrap = document.getElementById("swMore");
    const moreCount = document.getElementById("swMoreCount");
    const tabs = [...document.querySelectorAll(".sw-tab")];
    const moreLink = moreWrap ? moreWrap.querySelector("a") : null;
    const preview = () => portfolioCatalog.slice(0, HOME_WORK_PREVIEW);
    const designCovers = () => shootCovers(DESIGN_PROJECTS);
    let tab = "photography";
    const tabList = () => (tab === "designs" ? designCovers() : preview());
    wireWorkHost(rowsHost, tabList);
    function applyTab(next) {
      tab = next;
      const photo = next === "photography";
      const designs = next === "designs";
      tabs.forEach((t) => {
        const on = t.dataset.swTab === next;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      rowsHost.hidden = !(photo || designs);
      if (adPane) adPane.hidden = photo || designs;
      if (moreWrap) moreWrap.hidden = !(photo || designs);
      if (photo || designs) rowsHost.innerHTML = workRowsHtml(tabList());
      if (moreLink) moreLink.setAttribute("href", designs ? "./portfolio.html#designs" : "./portfolio.html");
      if (moreCount) moreCount.textContent = designs ? `${designCovers().length} projects` : `${portfolioCatalog.length} projects`;
    }
    tabs.forEach((t) => t.addEventListener("click", () => applyTab(t.dataset.swTab)));
    const allySlide = document.getElementById("swAllySlide");
    if (allySlide) {
      const openAlly = () => openWorkLightbox({ t: "Ally, Do It Right", c: "MSU ADV 486 · Speculative", img: ALLY_SLIDE });
      allySlide.addEventListener("click", openAlly);
      allySlide.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAlly(); }
      });
    }
    applyTab("photography");
  }

  /* Portfolio page: cycling hero carousel. */
  function initPhotoHero() {
    const root = document.getElementById("photoHero");
    if (!root) return { setCategory() {}, refresh() {} };
    const q = (s) => root.querySelector(s);
    const heroPhotos = () => portfolioCatalog.filter((p) => p.hero).map((p) => ({ ...p, src: p.hero }));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), stage = q(".ph-stage");
    let list = [], category = "All", pos = 0, current = q(".ph-scene"), other = current.nextElementSibling, playing = !reduced.matches, visible = false, busy = false, elapsed = 0, last = 0, frame = 0, px = 0, py = 0, tx = 0, ty = 0, version = 0, wheelAt = 0, clickBlockedUntil = 0, animations = [];
    const cache = new Map();
    function ready(photo) { if (!cache.has(photo.src)) { const img = new Image(); img.src = photo.src; cache.set(photo.src, img.decode().then(() => true).catch(() => { cache.delete(photo.src); return false; })); } return cache.get(photo.src); }
    function load(el, p) { el.querySelector(".ph-soft").src = p.src; const img = el.querySelector(".ph-sharp"); img.src = p.src; img.alt = p.t + " — " + p.c + " photograph by " + ALT_CREDIT; }
    function label() { if (!list.length) return; q(".ph-count").textContent = String(pos + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0"); q(".ph-category").textContent = list[pos].c; root.querySelectorAll(".ph-thumbs button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === pos))); ready(list[(pos + 1) % list.length]); }
    function pauseLabel() { q(".ph-pause").textContent = playing ? "PAUSE Ⅱ" : "PLAY ▷"; q(".ph-pause").setAttribute("aria-label", playing ? "Pause photo motion and automatic advance" : "Play photo motion and automatic advance"); }
    function active() { return list.length > 0 && playing && visible && !document.hidden; }
    function schedule() { cancelAnimationFrame(frame); frame = 0; last = 0; if (active()) frame = requestAnimationFrame(tick); animations.forEach((a) => { if (a.playState === "finished") return; if (!document.hidden) a.play(); else a.pause(); }); }
    async function select(next, dir = 1, manual = true) {
      if (busy || list.length < 2) return; next = (next + list.length) % list.length; if (next === pos) return;
      busy = true; const token = version;
      const loaded = await ready(list[next]); if (token !== version) return;
      if (!loaded) { busy = false; elapsed = 0; q(".ph-status").textContent = "Photograph could not load. Please try again."; return; }
      load(other, list[next]); other.hidden = false; other.style.zIndex = 2; current.style.zIndex = 3;
      other.querySelector(".ph-sharp").style.transform = "none";
      if (!reduced.matches) {
        const duration = 900;
        animations = [other.animate([{ transform: `translateX(${dir * 22}%) translateY(3%) rotate(${dir * 2.5}deg) scale(1.04)`, filter: "blur(8px)", opacity: .35 }, { transform: "none", filter: "blur(0px)", opacity: 1 }], { duration, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }), current.animate([{ transform: "none", filter: "blur(0px)", opacity: 1 }, { offset: .32, transform: `translateX(${-dir * 8}%) translateY(-2%) rotate(${-dir * 1.5}deg) scale(1.015)`, filter: "blur(1px)", opacity: 1 }, { transform: `translateX(${-dir * 118}%) translateY(-14%) rotate(${-dir * 13}deg) scale(.88)`, filter: "blur(7px)", opacity: .15 }], { duration, easing: "cubic-bezier(.55,.02,.75,.42)", fill: "forwards" })];
        schedule(); await Promise.all(animations.map((a) => a.finished.catch(() => {}))); if (token !== version) return;
      }
      current.hidden = true; animations.forEach((a) => a.cancel()); animations = []; [current, other] = [other, current]; pos = next; elapsed = 0; busy = false; label(); if (manual) q(".ph-status").textContent = list[pos].c + ", photograph " + (pos + 1) + " of " + list.length; schedule();
    }
    function setCategory(cat) { version++; category = cat; animations.forEach((a) => a.cancel()); animations = []; busy = false; other.hidden = true; const photos = heroPhotos(); list = cat === "All" ? photos : photos.filter((p) => p.c === cat); pos = 0; elapsed = 0; q(".ph-progress span").style.transform = "scaleX(0)"; q(".ph-thumbs").replaceChildren(); root.hidden = list.length === 0; if (!list.length) { current.hidden = true; schedule(); return; } current.hidden = false; load(current, list[0]); current.querySelector(".ph-sharp").style.transform = "none"; list.forEach((p, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Open " + p.c + " photo " + (i + 1) + " full screen"); const img = document.createElement("img"); img.src = p.src; img.alt = ""; img.loading = "lazy"; b.append(img); b.addEventListener("click", () => openShootLightbox(list[i], b, { anon: true })); q(".ph-thumbs").append(b); }); label(); schedule(); }
    function tick(t) { frame = 0; if (!active()) return; const dt = last ? Math.min(t - last, 60) : 0; last = t; if (!busy) { elapsed += dt; const p = Math.min(elapsed / 8200, 1); if (!reduced.matches) { px += (tx - px) * .035; py += (ty - py) * .035; current.querySelector(".ph-sharp").style.transform = `translate(${px * 10 + p * 3}px,${py * 7 - p * 3}px) scale(${1 + p * .035})`; current.querySelector(".ph-soft").style.transform = `translate(${-px * 6}px,${-py * 4}px) scale(1.1)`; } q(".ph-progress span").style.transform = `scaleX(${p})`; if (p === 1) select(pos + 1, 1, false); } frame = requestAnimationFrame(tick); }
    q(".ph-pause").addEventListener("click", () => { playing = !playing; pauseLabel(); schedule(); }); q(".ph-prev").addEventListener("click", () => select(pos - 1, -1)); q(".ph-next").addEventListener("click", () => select(pos + 1, 1));
    stage.addEventListener("click", (e) => { if (e.target.closest("button,a") || performance.now() < clickBlockedUntil || !list[pos]) return; openShootLightbox(list[pos], stage, { anon: true }); });
    stage.addEventListener("keydown", (e) => { if (e.target !== stage) return; if ((e.key === "Enter" || e.key === " ") && list[pos]) { e.preventDefault(); openShootLightbox(list[pos], stage, { anon: true }); return; } if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const d = e.key === "ArrowRight" ? 1 : -1; select(pos + d, d); } });
    stage.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; const r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; }); stage.addEventListener("pointerleave", () => { tx = ty = 0; });
    stage.addEventListener("wheel", (e) => { const now = performance.now(); if (!e.ctrlKey && Math.abs(e.deltaY) > 15 && now - wheelAt > 1400) { wheelAt = now; const d = e.deltaY > 0 ? 1 : -1; select(pos + d, d); } }, { passive: true });
    let touch = null; stage.addEventListener("touchstart", (e) => { touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }, { passive: true }); stage.addEventListener("touchend", (e) => { if (!touch) return; const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y; touch = null; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { clickBlockedUntil = performance.now() + 500; const d = dx < 0 ? 1 : -1; select(pos + d, d); } }, { passive: true }); stage.addEventListener("touchcancel", () => { touch = null; });
    new IntersectionObserver((es) => { visible = es[0].isIntersecting && es[0].intersectionRatio >= .15; schedule(); }, { threshold: [0, .15] }).observe(stage);
    document.addEventListener("visibilitychange", schedule); reduced.addEventListener("change", () => { playing = !reduced.matches; if (reduced.matches) { current.querySelector(".ph-sharp").style.transform = "none"; animations.forEach((a) => a.finish()); } pauseLabel(); schedule(); });
    setCategory("All"); pauseLabel(); return { setCategory, refresh: () => setCategory(category) };
  }

  /* Portfolio page: category filters, shoot rows, expand-all gallery. */
  function initPortfolioWork() {
    const rowsHost = document.getElementById("pfRows");
    if (!rowsHost || rowsHost.dataset.wired === "1") return;
    rowsHost.dataset.wired = "1";
    wireWorkLightbox();
    const grid = document.getElementById("pfGrid");
    const groupTabs = [...document.querySelectorAll("[data-pf-group]")];
    const filterWraps = [...document.querySelectorAll("[data-pf-filters]")];
    const toggle = document.getElementById("pfViewToggle");
    const toggleLabel = document.getElementById("pfViewToggleLabel");
    const empty = '<p class="sw-empty">No work in this category yet.</p>';
    const hero = initPhotoHero();
    const filterOf = { photography: "All", designs: "All" };
    let group = "photography", expanded = false;
    const list = () => (group === "designs" ? designListFor(filterOf.designs) : workListFor(filterOf.photography));
    const covers = () => shootCovers(list());
    wireWorkHost(rowsHost, covers, { anon: true });
    if (grid) wireWorkHost(grid, covers, { anon: true });
    function render() {
      const items = covers();
      const anon = group === "photography";
      if (expanded) {
        if (grid) grid.innerHTML = items.length ? workTilesHtml(items, { anon }) : empty;
      } else {
        rowsHost.innerHTML = items.length ? workRowsHtml(items, { anon }) : empty;
      }
      rowsHost.hidden = expanded;
      if (grid) grid.hidden = !expanded;
    }
    /* Expanded view trades the tall index for a gallery that fits without scrolling. */
    function setExpanded(next) {
      expanded = next;
      if (toggle) toggle.setAttribute("aria-pressed", expanded ? "true" : "false");
      if (toggleLabel) toggleLabel.textContent = expanded ? "List view" : "Expand all";
      render();
    }
    function syncFilters(g) {
      filterWraps.forEach((wrap) => {
        const on = wrap.dataset.pfFilters === g;
        wrap.hidden = !on;
        wrap.querySelectorAll("[data-pf-filter]").forEach((x) => {
          const sel = on && x.dataset.pfFilter === filterOf[g];
          x.classList.toggle("is-on", sel);
          x.setAttribute("aria-selected", sel ? "true" : "false");
        });
      });
    }
    function setGroup(next, fromUser) {
      group = next;
      groupTabs.forEach((t) => {
        const on = t.dataset.pfGroup === group;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      syncFilters(group);
      hero.setCategory(group === "photography" ? filterOf.photography : "");
      if (fromUser && window.history && history.replaceState) {
        history.replaceState(null, "", group === "designs" ? "#designs" : location.pathname + location.search);
      }
      render();
    }
    groupTabs.forEach((t) => t.addEventListener("click", () => { if (t.dataset.pfGroup !== group) setGroup(t.dataset.pfGroup, true); }));
    filterWraps.forEach((wrap) => wrap.querySelectorAll("[data-pf-filter]").forEach((f) => f.addEventListener("click", () => {
      const g = wrap.dataset.pfFilters;
      filterOf[g] = f.dataset.pfFilter;
      if (g === "photography") hero.setCategory(filterOf.photography);
      syncFilters(g);
      render();
    })));
    if (toggle) toggle.addEventListener("click", () => setExpanded(!expanded));
    setExpanded(false);
    if (location.hash === "#designs") setGroup("designs", false);
  }

  /* Portfolio page: Campaigns / Brand & design filter and the per-card story toggles. */
  function initAdWork() {
    const section = document.getElementById("ad-campaigns-section");
    if (!section) return;
    const adChips = section.querySelectorAll("[data-ad-filter]");
    const adPaneCamp = document.getElementById("adPaneCampaigns");
    const adPaneBrand = document.getElementById("adPaneBrand");
    function applyAdFilter(filter) {
      adChips.forEach((c) => { const on = c.dataset.adFilter === filter; c.classList.toggle("is-on", on); c.setAttribute("aria-selected", on ? "true" : "false"); });
      section.querySelectorAll("[data-ad-overview]").forEach((p) => {
        p.classList.toggle("is-hidden", p.dataset.adOverview !== filter);
      });
      if (adPaneCamp && adPaneBrand) {
        const isBrand = filter === "brand";
        adPaneCamp.classList.toggle("is-hidden", isBrand);
        adPaneBrand.classList.toggle("is-hidden", !isBrand);
        adPaneCamp.setAttribute("aria-hidden", isBrand ? "true" : "false");
        adPaneBrand.setAttribute("aria-hidden", isBrand ? "false" : "true");
      }
    }
    adChips.forEach((c) => c.addEventListener("click", () => {
      applyAdFilter(c.dataset.adFilter);
      const pane = c.dataset.adFilter === "brand" ? adPaneBrand : adPaneCamp;
      const target = pane && pane.querySelector(".pp-ad-work-empty, .pp-grid");
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: scrollBehaviorPref(), block: "nearest" }));
    }));
    applyAdFilter("campaigns");
    section.addEventListener("click", (e) => {
      const storyBtn = e.target.closest(".ad-work-story-btn");
      if (!storyBtn) return;
      e.preventDefault();
      const panelId = storyBtn.getAttribute("aria-controls"), panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      const willOpen = storyBtn.getAttribute("aria-expanded") !== "true";
      storyBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      panel.hidden = !willOpen;
      if (willOpen) panel.scrollIntoView({ behavior: scrollBehaviorPref(), block: "nearest" });
    });
  }

  function init() {
    initSelectedWork();
    initPortfolioWork();
    initAdWork();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
