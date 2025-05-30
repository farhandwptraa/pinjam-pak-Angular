import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private scrollListener?: () => void;
  private faqListeners: (() => void)[] = [];
  private navmenuLinkListeners: (() => void)[] = [];
  private dropdownListeners: (() => void)[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Load CSS
    [
      'assets/landing/vendor/bootstrap/css/bootstrap.min.css',
      'assets/landing/vendor/bootstrap-icons/bootstrap-icons.css',
      'assets/landing/vendor/aos/aos.css',
      'assets/landing/vendor/glightbox/css/glightbox.min.css',
      'assets/landing/vendor/swiper/swiper-bundle.min.css',
      'assets/landing/css/main.css',
    ].forEach(href => this.loadStyle(href));
  }

  async ngAfterViewInit(): Promise<void> {
    // Load JS
    await Promise.all([
      this.loadScript('assets/landing/vendor/bootstrap/js/bootstrap.bundle.min.js'),
      this.loadScript('assets/landing/vendor/php-email-form/validate.js'),
      this.loadScript('assets/landing/vendor/aos/aos.js'),
      this.loadScript('assets/landing/vendor/swiper/swiper-bundle.min.js'),
      this.loadScript('assets/landing/vendor/glightbox/js/glightbox.min.js'),
    ]);

    // Inisialisasi seluruh perilaku halaman
    this.initPageBehavior();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) this.scrollListener();
    this.faqListeners.forEach(fn => fn());
    this.navmenuLinkListeners.forEach(fn => fn());
    this.dropdownListeners.forEach(fn => fn());
  }

  private loadScript(src: string): Promise<void> {
    return new Promise(resolve => {
      const script = this.renderer.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error(`Failed to load script ${src}`);
        resolve();
      };
      this.renderer.appendChild(document.body, script);
    });
  }

  private loadStyle(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }

  private toggleClass(el: HTMLElement, className: string) {
    if (el.classList.contains(className)) {
      this.renderer.removeClass(el, className);
    } else {
      this.renderer.addClass(el, className);
    }
  }

  private galleryConfig = { 
    loop: true,
    speed: 600,
    autoplay: { delay: 5000 },
    slidesPerView: 'auto',
    centeredSlides: true,
    pagination: { el: null as HTMLElement | null, clickable: true },
    breakpoints: {
      320:{ slidesPerView:1, spaceBetween:0 },
      768:{ slidesPerView:3, spaceBetween:30 },
      992:{ slidesPerView:5, spaceBetween:30 },
      1200:{ slidesPerView:7, spaceBetween:30 }
    }
  };

  private testimonialConfig = {
    loop: true,
    speed: 600,
    autoplay: { delay: 5000 },
    slidesPerView: 'auto',
    pagination: { el: null as HTMLElement | null, clickable: true }
  };

  private initPageBehavior() {
    const body = document.body;
    const header = document.querySelector('#header');
    const preloader = document.querySelector('#preloader');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const navmenuLinks = Array.from(document.querySelectorAll('.navmenu a')) as HTMLAnchorElement[];
    const faqItems = Array.from(document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle')) as HTMLElement[];
    const dropdownToggles = Array.from(document.querySelectorAll('.navmenu .toggle-dropdown')) as HTMLElement[];

    // Hapus preloader
    if (preloader?.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }

    // Sticky header & scroll-top
    const toggleScrolled = () => {
      if (!header) return;
      window.scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
    };
    const toggleScrollTop = () => {
      if (!scrollTopBtn) return;
      window.scrollY > 100 ? scrollTopBtn.classList.add('active') : scrollTopBtn.classList.remove('active');
    };
    toggleScrolled();
    toggleScrollTop();

    // Inisialisasi AOS
    if ((window as any).AOS) {
      (window as any).AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }

    // **Inisialisasi GLightbox supaya gallery lightbox berjalan**
    if ((window as any).GLightbox) {
      (window as any).GLightbox({
        selector: '.glightbox'
      });
    }

    // Inisialisasi Swiper dengan konfigurasi untuk gallery dan testimonial
    if ((window as any).Swiper) {
      // Gallery swiper
      const galleryEl = document.querySelector('.gallery .init-swiper') as HTMLElement | null;
      if (galleryEl) {
        const pg = galleryEl.querySelector('.swiper-pagination') as HTMLElement;
        this.galleryConfig.pagination.el = pg;
        // @ts-ignore
        new (window as any).Swiper(galleryEl, this.galleryConfig).update();
      }
      // Testimonials swiper
      const testiEl = document.querySelector('#testimonials .init-swiper') as HTMLElement | null;
      if (testiEl) {
        const pg = testiEl.querySelector('.swiper-pagination') as HTMLElement;
        this.testimonialConfig.pagination.el = pg;
        // @ts-ignore
        new (window as any).Swiper(testiEl, this.testimonialConfig).update();
      }
    }

    // Scrollspy listener
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      toggleScrolled();
      toggleScrollTop();
      navmenuScrollspy();
    });

    // Mobile nav toggle button
    if (mobileNavToggleBtn) {
      this.navmenuLinkListeners.push(
        this.renderer.listen(mobileNavToggleBtn, 'click', () => {
          this.toggleClass(body, 'mobile-nav-active');
          mobileNavToggleBtn.classList.toggle('bi-list');
          mobileNavToggleBtn.classList.toggle('bi-x');
        })
      );
    }

    // Auto-close mobile nav saat klik link
    navmenuLinks.forEach(link => {
      this.navmenuLinkListeners.push(
        this.renderer.listen(link, 'click', () => {
          if (body.classList.contains('mobile-nav-active') && mobileNavToggleBtn) {
            this.toggleClass(body, 'mobile-nav-active');
            mobileNavToggleBtn.classList.toggle('bi-list');
            mobileNavToggleBtn.classList.toggle('bi-x');
          }
        })
      );
    });

    // Dropdown toggle di navmenu
    dropdownToggles.forEach(toggle => {
      this.dropdownListeners.push(
        this.renderer.listen(toggle, 'click', e => {
          e.preventDefault();
          const parent = toggle.parentElement!;
          this.toggleClass(parent, 'active');
          const dd = parent.nextElementSibling as HTMLElement;
          if (dd) this.toggleClass(dd, 'dropdown-active');
        })
      );
    });

    // FAQ toggle
    faqItems.forEach(item => {
      this.faqListeners.push(
        this.renderer.listen(item, 'click', () => {
          const parent = item.parentElement!;
          this.toggleClass(parent, 'faq-active');
        })
      );
    });

    // Scroll-top button click behavior
    if (scrollTopBtn) {
      this.navmenuLinkListeners.push(
        this.renderer.listen(scrollTopBtn, 'click', e => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
      );
    }

    // Scrollspy helper untuk highlight menu saat scroll
    function navmenuScrollspy() {
      navmenuLinks.forEach(a => {
        if (!a.hash) return;
        const sec = document.querySelector(a.hash) as HTMLElement | null;
        if (!sec) return;
        const pos = window.scrollY + 200;
        if (pos >= sec.offsetTop && pos <= sec.offsetTop + sec.clientHeight) {
          document.querySelectorAll('.navmenu a.active').forEach(x => x.classList.remove('active'));
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    }
  }
}