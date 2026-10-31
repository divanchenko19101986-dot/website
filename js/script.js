document.addEventListener('DOMContentLoaded', () => {
    const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwtqwLjpSfEVHn3si4fNs78K8gsjwb-1ZoiB9tuVvuBG6CjCWCJzvvh3K9Zm8gSx_g/exec';
    const prefix = document.body.dataset.prefix || '';

    document.querySelectorAll('.year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    if (!document.querySelector('.call-fab')) {
        const callFab = document.createElement('a');
        callFab.href = 'tel:+79683255505';
        callFab.className = 'call-fab';
        callFab.setAttribute('aria-label', 'Позвонить мастеру');
        callFab.innerHTML = `
            <span class="call-fab__label">Позвонить</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        document.body.appendChild(callFab);
    }

    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('open');
            burger.classList.toggle('active');
        });

        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                burger.classList.remove('active');
            });
        });
    }

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const delay = Math.min(i * 60, 300);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox__close" type="button" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="lightbox__arrow lightbox__arrow--prev" type="button" aria-label="Предыдущее фото">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <img class="lightbox__img" src="" alt="">
        <button class="lightbox__arrow lightbox__arrow--next" type="button" aria-label="Следующее фото">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox__img');
    let lightboxImages = [];
    let lightboxIndex = 0;

    function collectImages() {
        return Array.from(document.querySelectorAll('.portfolio-card__img'));
    }

    function showLightboxImage() {
        const img = lightboxImages[lightboxIndex];
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    function openLightbox(index) {
        lightboxImages = collectImages();
        lightboxIndex = index;
        showLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        if (!lightboxImages.length) return;
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        showLightboxImage();
    }

    function prevImage() {
        if (!lightboxImages.length) return;
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        showLightboxImage();
    }

    document.addEventListener('click', (e) => {
        const img = e.target.closest('.portfolio-card__img');
        if (img) {
            const all = collectImages();
            const idx = all.indexOf(img);
            if (idx >= 0) openLightbox(idx);
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox__close')) {
            closeLightbox();
        } else if (e.target.closest('.lightbox__arrow--prev')) {
            prevImage();
        } else if (e.target.closest('.lightbox__arrow--next')) {
            nextImage();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowRight') nextImage();
        else if (e.key === 'ArrowLeft') prevImage();
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (!e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = Date.now() - touchStartTime;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && dt < 600) {
            if (dx < 0) nextImage();
            else prevImage();
        }
    });

    document.querySelectorAll('[data-slider]').forEach(initSlider);

    function initSlider(slider) {
        const track = slider.querySelector('[data-slider-track]');
        const prevBtn = slider.querySelector('.slider-arrow--prev');
        const nextBtn = slider.querySelector('.slider-arrow--next');
        if (!track) return;

        const getCards = () => Array.from(track.querySelectorAll('.portfolio-card'));

        function scrollToCard(card) {
            const trackRect = track.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const delta = cardRect.left - trackRect.left;
            track.scrollTo({ left: track.scrollLeft + delta, behavior: 'smooth' });
        }

        function findCurrent(cards) {
            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            let closest = 0;
            let minDist = Infinity;
            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const center = rect.left + rect.width / 2;
                const dist = Math.abs(center - trackCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });
            return closest;
        }

        function updateActive() {
            const cards = getCards();
            if (!cards.length) {
                if (prevBtn) prevBtn.disabled = true;
                if (nextBtn) nextBtn.disabled = true;
                return;
            }
            const idx = findCurrent(cards);
            if (prevBtn) prevBtn.disabled = idx <= 0;
            if (nextBtn) nextBtn.disabled = idx >= cards.length - 1;
        }

        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActive, 60);
        }, { passive: true });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const cards = getCards();
                const idx = findCurrent(cards);
                if (idx > 0) scrollToCard(cards[idx - 1]);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cards = getCards();
                const idx = findCurrent(cards);
                if (idx < cards.length - 1) scrollToCard(cards[idx + 1]);
            });
        }

        updateActive();
    }

    const parallaxBanner = document.querySelector('.parallax-banner');
    const parallaxBg = parallaxBanner ? parallaxBanner.querySelector('.parallax-banner__bg') : null;

    if (parallaxBanner && parallaxBg) {
        let ticking = false;
        let lastY = null;

        const updateParallax = () => {
            const rect = parallaxBanner.getBoundingClientRect();
            const vh = window.innerHeight;

            if (rect.bottom < -100 || rect.top > vh + 100) {
                ticking = false;
                return;
            }

            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const range = isMobile ? 80 : 200;
            const progress = (vh - rect.top) / (vh + rect.height);
            const y = Math.round((progress - 0.5) * range);

            if (y !== lastY) {
                parallaxBg.style.transform = `translate3d(0, ${y}px, 0)`;
                lastY = y;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', updateParallax, { passive: true });
        updateParallax();
    }

    const fullGallery = document.querySelector('[data-full-gallery]');
    if (fullGallery) {
        const galleryData = [
            { src: 'img/portfolio-1.webp', alt: 'Лестница на металлокаркасе с дубовыми ступенями в стиле лофт, Клин' },
            { src: 'img/portfolio-2.webp', alt: 'Лестница лофт с ограждением из металла, Солнечногорск' },
            { src: 'img/portfolio-3.webp', alt: 'Маршевая лестница на металлокаркасе с ступенями из дуба' },
            { src: 'img/portfolio-4.webp', alt: 'Ограждение в стиле лофт для лестницы, Московская область' },
            { src: 'img/portfolio-5.webp', alt: 'Каркас лестницы под обшивку деревом, производство' },
            { src: 'img/portfolio-6.webp', alt: 'Лестница из дуба с металлическими перилами в стиле лофт' },
            { src: 'img/portfolio-7.webp', alt: 'Лестница на металлокаркасе, дуб, Клин' },
            { src: 'img/portfolio-8.webp', alt: 'Лестница на металлокаркасе с дубовыми ступенями, Солнечногорск' },
            { src: 'img/portfolio-9.webp', alt: 'Перила лофт для лестницы, Московская область' },
            { src: 'img/portfolio-10.webp', alt: 'Металлический каркас лестницы, производство Клин' },
            { src: 'img/portfolio-11.webp', alt: 'Дубовая лестница с ограждением лофт' },
            { src: 'img/portfolio-12.webp', alt: 'Лестница на металлокаркасе в стиле лофт' },
            { src: 'img/portfolio-13.webp', alt: 'Лестница на металлокаркасе, ступени дуб' },
            { src: 'img/portfolio-14.webp', alt: 'Ограждение лофт из металла, Клин' },
            { src: 'img/portfolio-15.webp', alt: 'Каркас винтовой лестницы, производство' },
            { src: 'img/portfolio-16.webp', alt: 'Лестница дуб с лофт ограждением, Солнечногорск' },
            { src: 'img/portfolio-17.webp', alt: 'Лестница на металлокаркасе, дуб, лофт' },
            { src: 'img/portfolio-18.webp', alt: 'Маршевая лестница на металлокаркасе, дуб' },
            { src: 'img/portfolio-19.webp', alt: 'Ограждение в стиле лофт, Московская область' },
            { src: 'img/portfolio-20.webp', alt: 'Металлокаркас лестницы под дерево, Клин' },
            { src: 'img/portfolio-21.webp', alt: 'Лестница на металлокаркасе, ясень, Клин' },
            { src: 'img/portfolio-22.webp', alt: 'Лестница лофт с дубовыми ступенями, Солнечногорск' },
            { src: 'img/portfolio-23.webp', alt: 'Ограждение лофт, комбинированное, Московская область' },
            { src: 'img/portfolio-24.webp', alt: 'Лестница на металлокаркасе, лиственница' }
        ];

        galleryData.forEach(item => {
            const card = document.createElement('article');
            card.className = 'portfolio-card';
            card.innerHTML = `<img src="${prefix}${item.src}" alt="${item.alt}" class="portfolio-card__img" loading="lazy">`;
            fullGallery.appendChild(card);
        });
    }

    function getPageName() {
        const path = location.pathname.replace(/\/+$/, '');
        if (path === '' || path === '/index.html') return 'Главная';
        if (path.endsWith('/works') || path.endsWith('/works/index.html')) return 'Все работы';
        if (path.endsWith('/privacy') || path.endsWith('/privacy/index.html')) return 'Политика конфиденциальности';
        return path || 'Главная';
    }

    function showModal(title, text, type = 'success') {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const icon = type === 'success' ? '✓' : '!';
        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <button class="modal__close" type="button" aria-label="Закрыть">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <div class="modal__icon modal__icon--${type}">${icon}</div>
                <h3 class="modal__title">${title}</h3>
                <p class="modal__text">${text}</p>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        let closed = false;
        const close = () => {
            if (closed) return;
            closed = true;
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };

        const autoClose = setTimeout(close, 6000);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.closest('.modal__close')) {
                clearTimeout(autoClose);
                close();
            }
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                clearTimeout(autoClose);
                close();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    const contactForm = document.getElementById('order');
    const msgCount = document.getElementById('msgCount');

    if (contactForm) {
        const phoneInput = contactForm.querySelector('input[name="phone"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const honeypotInput = contactForm.querySelector('input[name="website"]');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        let formLoadTime = Date.now();

        const formatPhone = (value) => {
            let digits = value.replace(/\D/g, '');
            if (!digits) return '';
            if (digits.startsWith('8')) digits = '7' + digits.slice(1);
            if (!digits.startsWith('7')) digits = '7' + digits;
            if (digits.length > 11) digits = digits.slice(0, 11);

            let result = '+7';
            if (digits.length > 1) result += ' (' + digits.slice(1, 4);
            if (digits.length >= 5) result += ') ' + digits.slice(4, 7);
            if (digits.length >= 8) result += '-' + digits.slice(7, 9);
            if (digits.length >= 10) result += '-' + digits.slice(9, 11);
            return result;
        };

        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = formatPhone(e.target.value);
            });
        }

        if (messageInput && msgCount) {
            const updateCount = () => {
                msgCount.textContent = messageInput.value.length;
            };
            messageInput.addEventListener('input', updateCount);
            updateCount();
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (honeypotInput && honeypotInput.value.trim() !== '') {
                showModal('Успешно!', 'Спасибо! Заявка отправлена.', 'success');
                contactForm.reset();
                if (msgCount) msgCount.textContent = '0';
                return;
            }

            const elapsed = Date.now() - formLoadTime;
            if (elapsed < 2000) {
                showModal('Ошибка', 'Пожалуйста, заполните форму внимательнее и попробуйте снова.', 'error');
                return;
            }

            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const phone = contactForm.querySelector('input[name="phone"]').value.trim();
            const message = messageInput ? messageInput.value.trim() : '';
            const digits = phone.replace(/\D/g, '');

            if (!name) {
                showModal('Ошибка', 'Пожалуйста, укажите ваше имя.', 'error');
                return;
            }

            if (digits.length !== 11) {
                showModal('Ошибка', 'Пожалуйста, введите корректный номер телефона.', 'error');
                return;
            }

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            try {
                const response = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        message: message,
                        page: getPageName(),
                        source: 'website'
                    })
                });

                const result = await response.json();

                if (result && result.success) {
                    showModal('Успешно!', 'Спасибо! Заявка отправлена. Я свяжусь с вами в ближайшее время.', 'success');
                    contactForm.reset();
                    if (msgCount) msgCount.textContent = '0';
                    formLoadTime = Date.now();
                } else {
                    throw new Error((result && result.error) || 'Ошибка сервера');
                }
            } catch (error) {
                console.error('Форма отправки:', error);
                showModal('Ошибка отправки', 'Не удалось отправить заявку. Пожалуйста, позвоните по телефону 8 968 325-55-05.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});