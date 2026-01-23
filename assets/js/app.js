


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
                769: { slidesPerView: 1, spaceBetween: 10 }
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
            loop: false,
            spaceBetween: 5,
            speed: 700,
            breakpoints: {
                769: { slidesPerView: 1, spaceBetween: 10 }
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

        // чистим и создаём video
        content.innerHTML = '';

        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;   // важно для мобилок
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

        // стопаем и удаляем
        const video = content.querySelector('video');
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
        }
        content.innerHTML = '';
    }

    // открыть по data-video
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-video]');
        if (!btn) return;

        e.preventDefault();
        openPopup(btn.getAttribute('data-video'));
    });

    // закрыть по крестику
    closeBtn?.addEventListener('click', closePopup);

    // закрыть по клику на фон
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });

    // закрыть по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) {
            closePopup();
        }
    });
})();
