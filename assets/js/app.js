


(() => {
    document.querySelectorAll('[data-select]').forEach((select) => {
        const trigger = select.querySelector('.select__trigger');
        const dropdown = select.querySelector('.select__dropdown');
        const radios = select.querySelectorAll('.radio-input');

        const PX_PER_SEC = 250;
        const MIN_MS = 550;
        const MAX_MS = 1800;

        const calcDuration = (h) => {
            const ms = (h / PX_PER_SEC) * 1000;
            return Math.max(MIN_MS, Math.min(MAX_MS, ms));
        };

        const setVars = () => {
            const h = dropdown.scrollHeight;
            const dur = calcDuration(h);
            select.style.setProperty('--dd-h', `${h}px`);
            select.style.setProperty('--dd-dur', `${dur}ms`);
        };

        const open = () => {
            setVars();
            select.classList.add('is-open');
        };

        const close = () => {
            setVars();
            select.classList.remove('is-open');
        };

        const toggle = () => (select.classList.contains('is-open') ? close() : open());

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggle();
        });

        document.addEventListener('click', (e) => {
            if (!select.contains(e.target)) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                const label = select.querySelector(`label[for="${radio.id}"]`);
                if (label) trigger.textContent = label.textContent.trim();
                trigger.classList.add('active');
                close();
            });
        });

        const checked = select.querySelector('.radio-input:checked');
        if (checked) {
            const label = select.querySelector(`label[for="${checked.id}"]`);
            if (label) trigger.textContent = label.textContent.trim();
            trigger.classList.add('active');
        }

        window.addEventListener('resize', () => {
            if (select.classList.contains('is-open')) setVars();
        });
    });
})();
(() => {
    const btn = document.querySelector(".header__menu-btn");
    const popup = document.querySelector(".menu-popup");
    const closeBtn = document.querySelector(".menu-popup__close");

    if (!btn || !popup) return;

    const setState = (open) => {
        popup.classList.toggle("active", open);
        btn.classList.toggle("active", open);
        document.body.classList.toggle("no-scroll", open);
    };

    btn.addEventListener("click", () => {
        setState(!popup.classList.contains("active"));
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => setState(false));
    }
})();
const tochkaSection = document.querySelector('.club-gallery-tochka');
if (tochkaSection) {
    const tochkaSwiperEl = tochkaSection.querySelector('.club-gallery-tochka__swiper');
    if (tochkaSwiperEl) {
        const tochkaNextBtns = tochkaSection.querySelectorAll('.club-gallery-tochka__slider-next');
        const tochkaPrevBtns = tochkaSection.querySelectorAll('.club-gallery-tochka__slider-prev');

        new Swiper(tochkaSwiperEl, {
            slidesPerView: 'auto',
            loop: false,
            spaceBetween: 5,
            speed: 700,
            breakpoints: {
                769: { spaceBetween: 10 }
            },
            navigation: {
                nextEl: Array.from(tochkaNextBtns),
                prevEl: Array.from(tochkaPrevBtns),
            },
        });
    }
}

const gallery = document.querySelector('.club-gallery-maxim');
if (gallery) {
    const swiperEl = gallery.querySelector('.club-gallery-maxim__swiper');
    if (swiperEl) {
        const nextBtns = gallery.querySelectorAll('.club-gallery-maxim__slider-next');
        const prevBtns = gallery.querySelectorAll('.club-gallery-maxim__slider-prev');

        new Swiper(swiperEl, {
            slidesPerView: 'auto',
            loop: true,
            spaceBetween: 5,
            speed: 900,
            breakpoints: {
                769: { spaceBetween: 10 }
            },
            navigation: {
                nextEl: Array.from(nextBtns),
                prevEl: Array.from(prevBtns),
            },
        });
    }
}

(() => {
    const popup = document.querySelector('.video-popup');
    if (!popup) return;

    const content = popup.querySelector('.video-popup__content');
    const closeBtn = popup.querySelector('.video-popup__close');

    function openPopup(src) {
        if (!src) return;

        content.innerHTML = '';

        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = 'metadata';

        content.appendChild(video);

        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        popup.classList.remove('is-open');
        popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        const video = content.querySelector('video');
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
        }
        content.innerHTML = '';
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-video]');
        if (!btn) return;

        e.preventDefault();
        openPopup(btn.getAttribute('data-video'));
    });

    closeBtn?.addEventListener('click', closePopup);

    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) {
            closePopup();
        }
    });
})();


(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const BASE_DURATION = 35;

    function setupRow(row) {
        const base = row.querySelector('.marquee__row__items:not([aria-hidden="true"])')
            || row.querySelector('.marquee__row__items');
        if (!base) return null;

        let track = row.querySelector('.marquee__track');
        if (!track) {
            track = document.createElement('div');
            track.className = 'marquee__track';
            const allItemsGroups = Array.from(row.querySelectorAll('.marquee__row__items'));
            allItemsGroups.forEach(g => track.appendChild(g));
            row.appendChild(track);
        }

        const groups = Array.from(track.querySelectorAll('.marquee__row__items'));
        const template = groups[0];
        groups.slice(1).forEach(g => g.remove());

        template.removeAttribute('aria-hidden');

        const state = {
            row,
            track,
            template,
            groupWidth: 0,
            offset: 0,
            pxPerSec: 60,
        };

        function measureAndFill() {
            Array.from(track.children).slice(1).forEach(n => n.remove());

            state.groupWidth = Math.ceil(template.getBoundingClientRect().width);
            const wrapWidth = Math.ceil(row.getBoundingClientRect().width);

            if (!state.groupWidth) return;

            const needCopies = Math.max(2, Math.ceil((wrapWidth * 2) / state.groupWidth) + 1);

            for (let i = 1; i < needCopies; i++) {
                const clone = template.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            }

            state.pxPerSec = state.groupWidth / BASE_DURATION;

            state.offset = state.offset % state.groupWidth;
            track.style.transform = `translate3d(${state.offset}px,0,0)`;
        }

        measureAndFill();

        const ro = new ResizeObserver(() => measureAndFill());
        ro.observe(row);

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => measureAndFill()).catch(() => { });
        }

        state.measureAndFill = measureAndFill;
        return state;
    }

    function setupMarquee(wrap) {
        const rows = wrap.querySelectorAll('.marquee__row');
        if (!rows.length) return;

        const states = Array.from(rows).map(setupRow).filter(Boolean);
        if (!states.length) return;

        let last = performance.now();

        function tick(now) {
            const dt = (now - last) / 1000;
            last = now;

            const s0 = states[0];
            if (s0.groupWidth > 0) {
                const dx = s0.pxPerSec * dt;

                states.forEach(s => {
                    s.offset -= dx;

                    if (s.offset <= -s.groupWidth) s.offset += s.groupWidth;

                    s.track.style.transform = `translate3d(${s.offset}px,0,0)`;
                });
            }

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    document.querySelectorAll('.marquee__wrap').forEach(setupMarquee);
})();