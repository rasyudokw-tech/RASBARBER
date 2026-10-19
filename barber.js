/* =========================================================
   RASBARBER V2 — interaksi halaman
   Dipertahankan dari versi lama:
   - scroll reveal (.reveal → .active)
   - efek mengetik #typing-text
   - form kontak yang mengirim lewat WhatsApp
   Ditambah: hamburger, scroll spy, lightbox gallery,
   dan pilihan layanan otomatis dari tombol "Book Now".
   ========================================================= */
(() => {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Scroll reveal (fungsi lama, class .reveal / .active) ---------- */
    $$('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((child, i) => child.style.setProperty('--d', i));
    });

    const reveals = $$('.reveal');
    const reveal = (el) => {
        el.classList.add('active');
        // lepas delay stagger setelah animasi masuk, supaya hover tetap responsif
        setTimeout(() => el.style.removeProperty('--d'), 1200);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target); // animasi cukup sekali
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el) => observer.observe(el));
    } else {
        reveals.forEach(reveal);
    }

    /* ---------- Efek mengetik (fungsi lama, dibuat aman untuk emoji) ---------- */
    const text = "Welcome To RASBARBER✂️ ";
    const typingText = document.getElementById("typing-text");
    const chars = Array.from(text);
    let index = 0;

    function typing() {
        if (index < chars.length) {
            typingText.textContent += chars[index];
            index++;
            setTimeout(typing, 100);
        } else {
            typingText.classList.remove('is-typing');
        }
    }

    if (typingText) {
        if (prefersReduced) {
            typingText.textContent = text.trim();
        } else {
            typingText.textContent = '';
            typingText.classList.add('is-typing');
            typing();
        }
    }

    /* ---------- Navbar: hamburger ---------- */
    const header = $('.site-header');
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');

    const setMenu = (open) => {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) setMenu(false); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });

    /* ---------- Scroll spy: tandai menu aktif ---------- */
    const navLinks = $$('.atas a[href^="#"]:not(.btn)');
    const spyTargets = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);

    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => link.removeAttribute('aria-current'));
                const active = navLinks.find((link) => link.getAttribute('href') === '#' + entry.target.id);
                if (active) active.setAttribute('aria-current', 'true');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyTargets.forEach((section) => spy.observe(section));
    }

    /* ---------- Gallery: lightbox ---------- */
    const items = $$('.gallery-item');
    const lightbox = $('#lightbox');
    const lbImg = $('img', lightbox);
    const lbCaption = $('figcaption', lightbox);
    let current = 0;

    const showPhoto = (i) => {
        current = (i + items.length) % items.length;
        const img = $('img', items[current]);
        lbImg.src = img.getAttribute('src'); // path foto tetap sama dengan yang di HTML
        lbImg.alt = img.alt;
        lbCaption.textContent = img.alt;
    };

    if (typeof lightbox.showModal === 'function') {
        items.forEach((item, i) => {
            $('.gallery-btn', item).addEventListener('click', () => {
                showPhoto(i);
                lightbox.showModal();
            });
        });

        $('.lb-close', lightbox).addEventListener('click', () => lightbox.close());
        $('.lb-prev', lightbox).addEventListener('click', () => showPhoto(current - 1));
        $('.lb-next', lightbox).addEventListener('click', () => showPhoto(current + 1));

        // klik area gelap di luar foto menutup lightbox
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') showPhoto(current - 1);
            if (e.key === 'ArrowRight') showPhoto(current + 1);
        });
    } else {
        // browser lama tanpa <dialog>: buka foto di tab baru
        items.forEach((item) => {
            $('.gallery-btn', item).addEventListener('click', () => {
                window.open($('img', item).getAttribute('src'), '_blank', 'noopener');
            });
        });
    }

    /* ---------- Pricing: tombol "Book Now" mengisi pilihan layanan di form ---------- */
    const serviceSelect = $('#service');
    $$('[data-service]').forEach((btn) => {
        btn.addEventListener('click', () => {
            serviceSelect.value = btn.dataset.service;
        });
    });

    /* ---------- Form kontak → WhatsApp (fungsi lama dipertahankan) ---------- */
    const contactForm = document.getElementById("contact-form");
    const formStatus = $('#form-status');

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value;
        const message = document.getElementById("message").value.trim();

        // PERHATIAN: ini nomor bawaan dari kode lama (kelihatannya nomor contoh).
        // Ganti dengan nomor WhatsApp RASBARBER yang asli, format internasional tanpa tanda +.
        const whatsappNumber = "6281234567890"; // Ganti dengan nomor tujuan

        const text = `Hello RASBARBER!

Name: ${name}
Phone: ${phone}
Service: ${service}
Message: ${message}`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

        window.open(whatsappURL, "_blank");

        formStatus.textContent =
            'WhatsApp should now open in a new tab with your message filled in. The message is only sent once you press send there.';
        formStatus.hidden = false;
    });

    /* ---------- Footer: tahun otomatis ---------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();