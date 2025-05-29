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
    // load semua CSS synchronously
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
    // load semua JS dan tunggu sampai selesai
    await Promise.all([
      this.loadScript('assets/landing/vendor/bootstrap/js/bootstrap.bundle.min.js'),
      this.loadScript('assets/landing/vendor/php-email-form/validate.js'),
      this.loadScript('assets/landing/vendor/aos/aos.js'),
      this.loadScript('assets/landing/vendor/swiper/swiper-bundle.min.js'),
      this.loadScript('assets/landing/vendor/glightbox/js/glightbox.min.js'),
    ]);

    // setelah semua script ter-load, inisialisasi perilaku halaman
    this.initPageBehavior();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) this.scrollListener();
    this.faqListeners.forEach(cleanup => cleanup());
    this.navmenuLinkListeners.forEach(cleanup => cleanup());
    this.dropdownListeners.forEach(cleanup => cleanup());
  }

  /**  
   * loadScript mengembalikan Promise yang resolve saat script onload  
   */
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

  private initPageBehavior() {
    const body = document.body;
    const header = document.querySelector('#header');
    const preloader = document.querySelector('#preloader');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const navmenuLinks = Array.from(document.querySelectorAll('.navmenu a')) as HTMLAnchorElement[];
    const faqItems = Array.from(document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle')) as HTMLElement[];
    const dropdownToggles = Array.from(document.querySelectorAll('.navmenu .toggle-dropdown')) as HTMLElement[];

    // fungsi scroll / sticky
    const toggleScrolled = () => {
      if (!header) return;
      if (window.scrollY > 100) body.classList.add('scrolled');
      else body.classList.remove('scrolled');
    };
    const toggleScrollTop = () => {
      if (!scrollTopBtn) return;
      if (window.scrollY > 100) scrollTopBtn.classList.add('active');
      else scrollTopBtn.classList.remove('active');
    };

    // cleanup preloader
    if (preloader && preloader.parentNode) {
      preloader.parentNode.removeChild(preloader);
    }

    // panggil sekali awal
    toggleScrolled();
    toggleScrollTop();

    // inisialisasi AOS dan Swiper
    if ((window as any).AOS) {
      (window as any).AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
    if ((window as any).Swiper) {
      document.querySelectorAll('.init-swiper').forEach(el => {
        const cfgEl = el.querySelector('.swiper-config');
        if (!cfgEl) return;
        try {
          const config = JSON.parse(cfgEl.textContent!.trim());
          // @ts-ignore
          new (window as any).Swiper(el, config);
        } catch { /* invalid JSON? skip */ }
      });
    }

    // scrollspy listener
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      toggleScrolled();
      toggleScrollTop();
      navmenuScrollspy();
    });

    // mobile nav toggle
    if (mobileNavToggleBtn) {
      this.navmenuLinkListeners.push(
        this.renderer.listen(mobileNavToggleBtn, 'click', () => {
          this.toggleClass(body, 'mobile-nav-active');
          mobileNavToggleBtn.classList.toggle('bi-list');
          mobileNavToggleBtn.classList.toggle('bi-x');
        })
      );
    }

    // auto‑close mobile nav on link click
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

    // dropdown toggle
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

    // scroll-top button click
    if (scrollTopBtn) {
      this.navmenuLinkListeners.push(
        this.renderer.listen(scrollTopBtn, 'click', e => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
      );
    }

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