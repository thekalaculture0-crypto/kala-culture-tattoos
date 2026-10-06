
    (function () {
        // ---- Scroll reveal ----
        var revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('visible'); });
        }

        // ---- Animated count-up stats ----
        var counters = document.querySelectorAll('.stat-count');
        function animateCount(el) {
            var target = parseInt(el.getAttribute('data-target'), 10) || 0;
            var duration = 1400;
            var startTime = null;
            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(step);
        }
        if ('IntersectionObserver' in window) {
            var countIo = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        countIo.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(function (el) { countIo.observe(el); });
        } else {
            counters.forEach(function (el) { el.textContent = el.getAttribute('data-target'); });
        }

        // ---- How It Works: touch-triggered flip (no hover on touch devices) ----
        var isTouch = window.matchMedia('(hover: none)').matches;
        if (isTouch) {
            var steps = document.querySelectorAll('.process-step');
            if ('IntersectionObserver' in window) {
                var stepIo = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('touch-active');
                        } else {
                            entry.target.classList.remove('touch-active');
                        }
                    });
                }, { threshold: 0.6 });
                steps.forEach(function (el) { stepIo.observe(el); });
            }
        }

        // ---- Hero rotating words ----
        (function () {
            var wordEl = document.getElementById('rotatingWord');
            if (!wordEl) return;
            var words = ['Culture', 'Art', 'Soul', 'Essence', 'Vision'];
            var index = 0;
            setInterval(function () {
                wordEl.classList.add('is-changing');
                setTimeout(function () {
                    index = (index + 1) % words.length;
                    wordEl.textContent = words[index];
                    wordEl.classList.remove('is-changing');
                }, 300);
            }, 2400);
        })();

        // ---- Compact Google reviews carousel ----
        (function () {
            var viewport = document.querySelector('.reviews-viewport');
            var track = document.querySelector('.reviews-track');
            if (!viewport || !track) return;
            var cards = Array.prototype.slice.call(track.querySelectorAll('.review-card'));
            if (!cards.length) return;
            var dotsWrap = document.getElementById('reviewDots');
            var prev = document.getElementById('reviewPrev');
            var next = document.getElementById('reviewNext');
            var index = 0;
            var timer;

            cards.forEach(function(card, i) {
                if (i === 0) card.classList.add('is-active');
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'review-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Show review ' + (i + 1));
                dot.addEventListener('click', function(){ goTo(i); });
                dotsWrap.appendChild(dot);
            });

            function goTo(nextIndex) {
                index = (nextIndex + cards.length) % cards.length;
                var gap = parseFloat(getComputedStyle(track).gap) || 0;
                var distance = cards[0].getBoundingClientRect().width + gap;
                track.style.transform = 'translateX(-' + (index * distance) + 'px)';
                cards.forEach(function(card, i){ card.classList.toggle('is-active', i === index); });
                Array.prototype.forEach.call(dotsWrap.children, function(dot, i){ dot.classList.toggle('active', i === index); });
            }
            function restart() {
                clearInterval(timer);
                timer = setInterval(function(){ goTo(index + 1); }, 4800);
            }
            if (prev) prev.addEventListener('click', function(){ goTo(index - 1); restart(); });
            if (next) next.addEventListener('click', function(){ goTo(index + 1); restart(); });
            viewport.addEventListener('mouseenter', function(){ clearInterval(timer); });
            viewport.addEventListener('mouseleave', restart);
            window.addEventListener('resize', function(){ goTo(index); });
            restart();
        })();


        // ---- Category gallery ("folder") system ----
        // Each category lists the folder name(s) it may live in (GitHub Pages is case-sensitive).
        var GALLERY_DATA = {
            'custom-designs': { title: 'Custom Designs',   icon: 'CUSTOM',    folders: ['gallery/custom-designs'],                                                          cover: 'gallery/custom-designs/3.webp', client: null },
            'realism':        { title: 'Realism Tattoos',  icon: 'REALISM',   folders: ['gallery/realism'],                                                                 cover: 'images/clients/client-02.webp', client: 2 },
            'fine-line':      { title: 'Fine Line Work',   icon: 'FINE LINE', folders: ['gallery/fine-line'],                                                               cover: 'gallery/fine-line/1.webp',      client: null },
            'colour-tattoos': { title: 'Colour Tattoos',   icon: 'COLOUR',    folders: ['gallery/colour tattoos', 'gallery/colour-tattoos', 'gallery/colour-Tattoos'],      cover: 'images/clients/client-07.webp', client: 7 },
            'cover-up':       { title: 'Cover-Up Tattoos', icon: 'COVER-UP',  folders: ['gallery/cover-up'],                                                                cover: 'gallery/cover-up/1.webp',       client: null },
            'matching':       { title: 'Matching Tattoos', icon: 'MATCHING',  folders: ['gallery/matching', 'gallery/matching-tattoo'],                                     cover: 'images/clients/client-06.webp', client: 6 }
        };
        var GALLERY_MAX_PROBE = 30;
        var galleryCache = {};

        function clientPhotos(first) {
            var list = [];
            for (var c = 1; c <= 10; c++) list.push(c);
            if (first) { list = [first].concat(list.filter(function (n) { return n !== first; })); }
            return list.map(function (n) { return 'images/clients/client-' + (n < 10 ? '0' : '') + n + '.webp'; });
        }

        // Does this file exist? A tiny HEAD request, so no photo is downloaded just to find out.
        function urlExists(url, cb) {
            if (window.fetch && location.protocol !== 'file:') {
                fetch(url, { method: 'HEAD' }).then(function (r) { cb(r.ok); }, function () { cb(false); });
            } else {
                var im = new Image();
                im.onload = function () { cb(true); };
                im.onerror = function () { cb(false); };
                im.src = url;
            }
        }

        // Checks every URL in parallel and returns only the ones that exist, in the original order.
        function probeImages(urls, done) {
            if (!urls.length) { done([]); return; }
            var results = new Array(urls.length), left = urls.length;
            urls.forEach(function (u, i) {
                urlExists(u, function (ok) {
                    results[i] = ok ? u : null;
                    if (--left === 0) done(results.filter(Boolean));
                });
            });
        }

        // Finds the photos of one category (tries each possible folder name; result is remembered).
        function findGalleryPhotos(slug, done) {
            if (galleryCache[slug]) { done(galleryCache[slug]); return; }
            var data = GALLERY_DATA[slug];
            var folders = ((data && data.folders) || []).slice();
            (function next() {
                if (!folders.length) { galleryCache[slug] = []; done([]); return; }
                var folder = folders.shift(), urls = [];
                for (var i = 1; i <= GALLERY_MAX_PROBE; i++) urls.push(encodeURI(folder) + '/' + i + '.webp');
                probeImages(urls, function (found) {
                    if (found.length) { galleryCache[slug] = found; done(found); } else { next(); }
                });
            })();
        }

        // Specialty cards: load each card's background photo only when the card scrolls into view
        // (and not at all on Save-Data connections), so the first screen stays light on phones.
        (function () {
            var cards = document.querySelectorAll('#services .feature-card');
            if (!cards.length) return;
            var saveData = navigator.connection && navigator.connection.saveData;
            if (saveData) return;
            function paint(card) {
                var slug = card.getAttribute('data-category'), data = GALLERY_DATA[slug];
                if (!data) return;
                findGalleryPhotos(slug, function (found) {
                    var src = found[0] || data.cover;
                    var test = new Image();
                    test.onload = function () { card.style.setProperty('--specialty-bg', 'url("' + src + '")'); };
                    test.src = src;
                });
            }
            if ('IntersectionObserver' in window) {
                var cardIo = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) { cardIo.unobserve(entry.target); paint(entry.target); }
                    });
                }, { rootMargin: '150px 0px' });
                cards.forEach(function (c) { cardIo.observe(c); });
            } else {
                cards.forEach(paint);
            }
        })();

        var galleryToken = 0;
        window.openGallery = function (slug) {
            var data = GALLERY_DATA[slug];
            if (!data) return;
            var token = ++galleryToken;
            document.getElementById('galleryTitle').textContent = data.title;
            document.getElementById('galleryIcon').textContent = data.icon;
            var grid = document.getElementById('galleryGrid');
            grid.innerHTML = '';
            document.getElementById('galleryModal').classList.add('open');
            document.body.style.overflow = 'hidden';

            findGalleryPhotos(slug, function (found) {
                if (token !== galleryToken) return;            // a different gallery was opened meanwhile
                if (!found.length) found = clientPhotos(data.client);
                found.forEach(function (url, idx) {
                    var slot = document.createElement('div');
                    slot.className = 'gallery-photo-slot';
                    var img = document.createElement('img');
                    img.alt = data.title + ' tattoo in Vadodara by The Kala Culture photo ' + (idx + 1);
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.onerror = function () { slot.remove(); };
                    img.src = url;
                    slot.appendChild(img);
                    grid.appendChild(slot);
                });
            });
        };
        window.closeGallery = function () {
            var gm = document.getElementById('galleryModal'); if (!gm) return;
            gm.classList.remove('open');
            document.body.style.overflow = '';
        };
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') window.closeGallery();
        });
        document.querySelectorAll('.feature-card').forEach(function (card) {
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.openGallery(card.getAttribute('data-category'));
                }
            });
        });
    })();
    

(function(){
  var halo = document.getElementById('cursorHalo');
  if (!halo || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var x=0,y=0, raf=0, active=false;
  function render(){
    halo.style.left = x + 'px';
    halo.style.top = y + 'px';
    raf = 0;
  }
  document.addEventListener('mousemove', function(e){
    x=e.clientX; y=e.clientY;
    if(!active){ active=true; halo.classList.add('active'); }
    if(!raf) raf=requestAnimationFrame(render);
  }, {passive:true});
  document.addEventListener('mouseleave', function(){ active=false; halo.classList.remove('active'); });
  document.addEventListener('mousedown', function(){ halo.style.width='42px'; halo.style.height='42px'; });
  document.addEventListener('mouseup', function(){ halo.style.width='34px'; halo.style.height='34px'; });
})();


    (function () {
        var btn = document.getElementById('navToggle'), nav = document.getElementById('siteNav');
        if (!btn || !nav) return;
        function setOpen(o) { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
        btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
        nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
        window.addEventListener('resize', function () { if (window.innerWidth > 768) setOpen(false); });
    })();

// ---- Enquiry form -> opens WhatsApp with the message ready to send ----
(function () {
    var form = document.getElementById('enquiryForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        function val(k) { var el = form.querySelector('[data-f="' + k + '"]'); return el ? el.value.trim() : ''; }
        var name = val('name'), phone = val('phone'), idea = val('idea');
        var msg = 'Hi Kala Culture Tattoos, I am ' + name + '.\n\n' + idea + (phone ? '\n\nMy number: ' + phone : '');
        var url = 'https://wa.me/919157714414?text=' + encodeURIComponent(msg);
        var w = window.open(url, '_blank');
        if (!w) { window.location.href = url; }
    });
})();

// ---- Before You Book: cursor spotlight + gentle 3D tilt (desktop only) ----
(function () {
    var cards = document.querySelectorAll('.bb-card');
    if (!cards.length) return;
    var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    cards.forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left, y = e.clientY - r.top;
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
            card.style.setProperty('--ry', ((x / r.width - 0.5) * 7).toFixed(2) + 'deg');
            card.style.setProperty('--rx', ((0.5 - y / r.height) * 7).toFixed(2) + 'deg');
        });
        card.addEventListener('pointerleave', function () {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
})();
