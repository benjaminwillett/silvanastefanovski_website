(function () {
  var site = window.SITE || { works: [] };
  var works = site.works || [];
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var visible = [];   // works with images currently shown, for lightbox navigation
  var current = 0;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function details(w) {
    return [w.medium, w.size, w.year].filter(Boolean).join(" · ") + (w.sold ? " · Sold" : "");
  }

  function render(series) {
    grid.textContent = "";
    visible = [];
    works.forEach(function (w, i) {
      if (series && w.series !== series) return;
      var fig = el("figure", "work reveal in");
      var frame = el("div", "frame");
      if (w.image) {
        var btn = el("button");
        btn.setAttribute("aria-label", "Enlarge " + (w.title || "artwork"));
        var img = el("img");
        img.src = w.image;
        img.alt = (w.title || "Painting") + " by Silvana Stefanovski";
        img.loading = "lazy";
        frame.appendChild(img);
        btn.appendChild(frame);
        var idx = visible.push(w) - 1;
        btn.addEventListener("click", function () { open(idx); });
        fig.appendChild(btn);
      } else {
        frame.appendChild(el("div", "placeholder p" + (i % 6), "Image to come"));
        fig.appendChild(frame);
      }
      var cap = el("figcaption");
      if (w.title) cap.appendChild(el("strong", "", w.title));
      cap.appendChild(document.createTextNode(details(w) || w.series || ""));
      fig.appendChild(cap);
      grid.appendChild(fig);
    });
  }

  function buildFilters() {
    var series = works.map(function (w) { return w.series; })
      .filter(function (s, i, a) { return s && a.indexOf(s) === i; });
    if (series.length < 2) return;
    ["All"].concat(series).forEach(function (s, i) {
      var b = el("button", "", s);
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        filters.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        render(s === "All" ? null : s);
      });
      filters.appendChild(b);
    });
  }

  function show(i) {
    current = (i + visible.length) % visible.length;
    var w = visible[current];
    lbImg.src = w.image;
    lbImg.alt = (w.title || "Painting") + " by Silvana Stefanovski";
    lbCap.textContent = "";
    if (w.title) lbCap.appendChild(el("em", "", w.title));
    lbCap.appendChild(document.createTextNode(details(w)));
  }
  function open(i) { show(i); lightbox.showModal(); }

  lightbox.querySelector(".lb-close").addEventListener("click", function () { lightbox.close(); });
  lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Contact
  var links = document.getElementById("contact-links");
  if (site.email) {
    var a = el("a", "btn dark", "Email the studio");
    a.href = "mailto:" + site.email;
    links.appendChild(a);
  }
  if (site.instagram) {
    var ig = el("a", "btn dark", "Instagram");
    ig.href = "https://www.instagram.com/" + site.instagram + "/";
    ig.rel = "noopener";
    links.appendChild(ig);
  }
  if (!links.children.length) links.appendChild(el("p", "note", "Contact details coming soon."));

  if (!works.some(function (w) { return w.image; })) document.getElementById("works-note").hidden = false;
  buildFilters();
  render(null);

  // Header, mobile nav, year, reveal
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("scrolled", open || window.scrollY > 40);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  var targets = document.querySelectorAll(".section-head, .prose, .themes article, .place-inner, .contact");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }
})();
