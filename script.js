/* The Kala Culture Tattoos — interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  var GALLERY = [];
  function addRange(cat, label, folder, from, to) {
    for (var i = from; i <= to; i++) {
      GALLERY.push({ cat: cat, label: label, src: "gallery/" + folder + "/" + i + ".webp" });
    }
  }
  addRange("custom", "Custom Design", "custom-designs", 3, 9);
  addRange("fineline", "Fine Line", "fine-line", 1, 9);
  addRange("coverup", "Cover-up", "cover-up", 1, 7);
  addRange("Realism", "realism", , 1, 9);
addRange("Matching", "matching", , 1, 5);
  addRange("colour-tattoos", "Colour-tattoos", "colour-Tattoos", 1, 9);
  var STORIES = [
    { n: "01", img: "images/clients/client-01.webp", cat: "SLEEVE / CUSTOM", title: "Story In Ink", text: "A custom sleeve tattoo designed around the client's vision and arm flow." },
    { n: "02", img: "images/clients/client-02.webp", cat: "PORTRAIT / REALISM", title: "Made Personal", text: "Realistic detail capturing depth, contrast and true emotional significance." },
    { n: "03", img: "images/clients/client-03.webp", cat: "FINE LINE", title: "Ink With Meaning", text: "Ultra-crisp, fine needle linework created for a timeless minimal look." },
    { n: "04", img: "images/clients/client-04.webp", cat: "SPIRITUAL ART", title: "Made With Meaning", text: "Sacred geometry and spiritual motifs balanced with precision and care." },
    { n: "05", img: "images/clients/client-05.webp", cat: "COVER-UP TRANSFORMATION", title: "A New Chapter", text: "An unwanted old piece seamlessly redesigned into fresh, proud ink." },
    { n: "06", img: "images/clients/client-06.webp", cat: "CUSTOM SCRIPT", title: "Close To Heart", text: "Elegant typography tailored to the client's forearm contour." },
    { n: "07", img: "images/clients/client-07.webp", cat: "COLOUR TATTOO", title: "Personal Expression", text: "Rich, saturated tones and smooth gradients that heal vibrantly." },
    { n: "08", img: "images/clients/client-08.webp", cat: "MINIMAL ART", title: "Small, Meaningful", text: "Subtle, understated beauty executed with single-needle accuracy." },
    { n: "09", img: "images/clients/client-09.webp", cat: "ORIGINAL CONCEPT", title: "Made For You", text: "A bespoke artistic composition designed exclusively for the wearer." },
    { n: "10", img: "images/clients/client-10.webp", cat: "STATEMENT PIECE", title: "Wear Your Story", text: "Dynamic composition reflecting personal identity and cultural depth." }
  ];

  var CAT_LABEL = { custom: "Custom Designs", fineline: "Fine Line", coverup: "Cover-ups" , realism:  "Realism" , matching: "Matching-Tattoos" , colour: "Colour Tattoos" };

  /* ---------- Gallery render + filter ---------- */
  var grid = document.getElementById("galleryGrid");
  var visibleItems = [];

  function renderGallery(filter) {
    grid.innerHTML = "";
    visibleItems = [];
    GALLERY.forEach(function (g) {
      if (filter !== "all" && g.cat !== filter) return;
      var btn = document.createElement("button");
      btn.className = "g-item";
      btn.setAttribute("data-cat", g.cat);
      btn.setAttribute("aria-label", g.label + " tattoo photo — view larger");
      var img = document.createElement("img");
      img.src = g.src;
      img.alt = g.label + " tattoo work at The Kala Culture Tattoos Vadodara";
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", function () { openLightbox(visibleItems.indexOf(g)); });
      grid.appendChild(btn);
      visibleItems.push(g);
    });
    // CTA card for styles with photos on Instagram
    var cta = document.createElement("a");
    cta.className = "g-cta";
    cta.href = "https://instagram.com/thekalaaculturetattoos";
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.innerHTML = "<b>Realism · Sleeve · Matching</b><span>More styles live on our Instagram — fresh work posted weekly.</span><span style='color:var(--gold)'>Follow @thekalaaculturetattoos →</span>";
    grid.appendChild(cta);
  }

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      renderGallery(tab.getAttribute("data-filter"));
    });
  });

  // Specialty cards jump to gallery with filter applied
  document.querySelectorAll(".spec-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var map = { custom: "custom", fineline: "fineline", coverup: "coverup", realism: "all", colour: "all", matching: "all" };
      var f = map[card.getAttribute("data-goto")] || "all";
      document.querySelectorAll(".tab").forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-filter") === f);
      });
      renderGallery(f);
      document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    });
  });

  renderGallery("all");

  /* ---------- Client stories ---------- */
  var row = document.getElementById("storiesRow");
  STORIES.forEach(function (s) {
    var card = document.createElement("article");
    card.className = "story-card";
    card.innerHTML =
      '<img src="' + s.img + '" alt="Client tattoo ' + s.n + ' — ' + s.title + ' at The Kala Culture Tattoos Vadodara" loading="lazy">' +
      '<div class="body"><span class="num">' + s.n + '</span>' +
      '<div class="cat">' + s.cat + '</div><h3>' + s.title + "</h3><p>" + s.text + "</p></div>";
    row.appendChild(card);
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox"),
      lbImg = document.getElementById("lbImg"),
      lbIndex = 0;

  function openLightbox(i) {
    if (!visibleItems.length) return;
    lbIndex = (i + visibleItems.length) % visibleItems.length;
    lbImg.src = visibleItems[lbIndex].src;
    lbImg.alt = visibleItems[lbIndex].label + " tattoo work — enlarged view";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function step(d) { openLightbox(lbIndex + d); }

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q"),
        a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Animated counters ---------- */
  var counted = false;
  function animateCounts() {
    if (counted) return;
    counted = true;
    document.querySelectorAll(".count").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10),
          start = null,
          dur = 1400;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1),
            eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  var statsIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { animateCounts(); statsIO.disconnect(); } });
  }, { threshold: 0.3 });
  var statsBar = document.querySelector(".stats-bar");
  if (statsBar) statsIO.observe(statsBar);

  /* ---------- Header + mobile nav ---------- */
  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  var burger = document.getElementById("burger"),
      navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", function () { navLinks.classList.toggle("open"); });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { navLinks.classList.remove("open"); });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
