/**
 * Template Name: Bootslander
 * Template URL: https://bootstrapmade.com/bootslander-free-bootstrap-landing-page-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  // Ensure the script runs after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function () {

    /**
     * Apply .scrolled class to the body as the page is scrolled down
     */
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (selectHeader && !selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      if (selectBody) {
        window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
      }
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) {
      function mobileNavToogle() {
        const body = document.querySelector('body');
        if (body) {
          body.classList.toggle('mobile-nav-active');
        }
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    } else {
      console.warn('Mobile nav toggle button not found!');
    }

    

    /**
     * Hide mobile nav on same-page/hash links
     */
    const navmenuLinks = document.querySelectorAll('#navmenu a');
    if (navmenuLinks.length > 0) {
      navmenuLinks.forEach(navmenu => {
        navmenu.addEventListener('click', () => {
          if (document.querySelector('.mobile-nav-active')) {
            mobileNavToogle();
          }
        });
      });
    } else {
      console.warn('Navmenu links not found!');
    }

    /**
     * Toggle mobile nav dropdowns
     */
    const toggleDropdowns = document.querySelectorAll('.navmenu .toggle-dropdown');
    if (toggleDropdowns.length > 0) {
      toggleDropdowns.forEach(navmenu => {
        navmenu.addEventListener('click', function (e) {
          e.preventDefault();
          this.parentNode.classList.toggle('active');
          this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
          e.stopImmediatePropagation();
        });
      });
    } else {
      console.warn('Toggle dropdowns not found!');
    }

    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    } else {
      console.warn('Preloader not found!');
    }

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      function toggleScrollTop() {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
    } else {
      console.warn('Scroll top button not found!');
    }

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      } else {
        console.warn('AOS library not found!');
      }
    }
    window.addEventListener('load', aosInit);

    /**
     * Initiate glightbox
     */
    if (typeof GLightbox !== 'undefined') {
      const glightbox = GLightbox({
        selector: '.glightbox'
      });
    } else {
      console.warn('GLightbox library not found!');
    }

    /**
     * Initiate Pure Counter
     */
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    } else {
      console.warn('PureCounter library not found!');
    }

    /**
     * Init swiper sliders
     */
    function initSwiper() {
      if (typeof Swiper !== 'undefined') {
        document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
          let config = JSON.parse(
            swiperElement.querySelector(".swiper-config").innerHTML.trim()
          );

          if (swiperElement.classList.contains("swiper-tab")) {
            initSwiperWithCustomPagination(swiperElement, config);
          } else {
            new Swiper(swiperElement, config);
          }
        });
      } else {
        console.warn('Swiper library not found!');
      }
    }
    window.addEventListener("load", initSwiper);

    /**
     * Frequently Asked Questions Toggle
     */
    const faqItems = document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle');
    if (faqItems.length > 0) {
      faqItems.forEach((faqItem) => {
        faqItem.addEventListener('click', () => {
          faqItem.parentNode.classList.toggle('faq-active');
        });
      });
    } else {
      console.warn('FAQ items not found!');
    }

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener('load', function (e) {
      if (window.location.hash) {
        const section = document.querySelector(window.location.hash);
        if (section) {
          setTimeout(() => {
            let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });

    /**
     * Navmenu Scrollspy
     */
    const navmenulinks = document.querySelectorAll('.navmenu a');
    if (navmenulinks.length > 0) {
      function navmenuScrollspy() {
        navmenulinks.forEach(navmenulink => {
          if (!navmenulink.hash) return;
          const section = document.querySelector(navmenulink.hash);
          if (!section) return;
          let position = window.scrollY + 200;
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
            navmenulink.classList.add('active');
          } else {
            navmenulink.classList.remove('active');
          }
        });
      }
      window.addEventListener('load', navmenuScrollspy);
      document.addEventListener('scroll', navmenuScrollspy);
    } else {
      console.warn('Navmenu links not found!');
    }

  }); // End of DOMContentLoaded
})();