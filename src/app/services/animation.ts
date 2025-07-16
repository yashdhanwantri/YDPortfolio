import { Injectable, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Injectable({
  providedIn: 'root'
})
export class Animation {
  constructor() {
    // Initialize ScrollTrigger with defaults
    ScrollTrigger.defaults({
      markers: false,
      scrub: true,
      start: 'top bottom',
      end: 'bottom top'
    });
  }

  /**
   * Creates Apple-style text reveal animation with staggered characters
   */
  textReveal(element: ElementRef, delay: number = 0): void {
    const text = element.nativeElement.innerText;
    const chars = text.split('');
    
    // Clear the text content
    element.nativeElement.innerHTML = '';
    
    // Create spans for each character
    chars.forEach((char: string) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char; // Preserve spaces
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      element.nativeElement.appendChild(span);
    });
    
    // Animate the spans
    gsap.to(element.nativeElement.children, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.03,
      delay,
      ease: 'power2.inOut'
    });
  }

  /**
   * Creates a smooth parallax effect
   */
  parallaxEffect(element: ElementRef, speed: number = 0.5): void {
    ScrollTrigger.create({
      trigger: element.nativeElement,
      animation: gsap.fromTo(
        element.nativeElement, 
        { y: 0 }, 
        { y: `-${speed * 100}px`, ease: 'none' }
      ),
      scrub: true,
      start: 'top bottom',
      end: 'bottom top'
    });
  }

  /**
   * Creates a fade-in animation with scroll
   */
  fadeInOnScroll(element: ElementRef, delay: number = 0, duration: number = 0.8): void {
    // First make sure the element is visible immediately
    gsap.set(element.nativeElement, { opacity: 1, y: 0 });
    
    // Then apply the animation if scrolling is needed
    if (window.scrollY > 20) { // Only apply scroll animation if not at top
      gsap.fromTo(
        element.nativeElement,
        { opacity: 0.5, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element.nativeElement,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  /**
   * Creates staggered animations for lists
   */
  staggerItems(elements: ElementRef[], staggerDelay: number = 0.1): void {
    gsap.fromTo(
      elements.map(el => el.nativeElement),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: staggerDelay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elements[0].nativeElement.parentElement,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  /**
   * Creates the Apple-style hero section parallax
   */
  heroParallax(container: ElementRef): void {
    const elements = container.nativeElement.querySelectorAll('[data-parallax]');
    
    elements.forEach((el: Element) => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.1');
      
      // Make sure all parallax elements don't interfere with user interaction
      (el as HTMLElement).style.pointerEvents = 'none';
      
      gsap.to(el, {
        y: `-${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: container.nativeElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  /**
   * Creates a smooth scroll to element
   */
  scrollToElement(targetId: string): void {
    const target = document.getElementById(targetId);
    if (target) {
      gsap.to(window, { 
        duration: 1.2, 
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power3.inOut'
      });
    } else {
      console.error(`Element with ID "${targetId}" not found.`);
    }
  }

  /**
   * Creates an Apple-style magnetic button effect
   */
  magneticButton(button: ElementRef): void {
    const btn = button.nativeElement;
    const strength = 40;
    
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const boundingRect = btn.getBoundingClientRect();
      const x = e.clientX - boundingRect.left - boundingRect.width / 2;
      const y = e.clientY - boundingRect.top - boundingRect.height / 2;
      
      gsap.to(btn, {
        x: x * strength / 100,
        y: y * strength / 100,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  }

  /**
   * Observe scroll position
   */
  getScrollObservable(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.scrollY)
    );
  }
}
