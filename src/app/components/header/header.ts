import { Component, OnInit, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Animation } from '../../services/animation';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private readonly animationService = inject(Animation);
  private readonly router = inject(Router);
  isScrolled = false;
  isMobileMenuOpen = false;
  currentRoute = '/';

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit() {
    // Start with scrolled state to ensure header is visible
    this.isScrolled = true;
    
    // Force header to be visible
    document.querySelector('app-header')?.setAttribute('style', 'display: block !important; opacity: 1 !important; visibility: visible !important');
    
    setTimeout(() => {
      // Make header immediately visible with no animation
      const headerElement = this.elementRef.nativeElement;
      headerElement.style.display = 'block';
      headerElement.style.opacity = '1';
      headerElement.style.visibility = 'visible';
      
      // Ensure the navigation works by removing any potential blocking elements
      const navLinks = this.elementRef.nativeElement.querySelectorAll('a');
      navLinks.forEach((link: HTMLElement) => {
        link.style.pointerEvents = 'auto';
        link.style.zIndex = '10001';
        link.style.position = 'relative';
      });
    }, 0);
    
    // Track the current route
    this.currentRoute = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      // Prevent body scrolling and hide main content
      document.body.style.overflow = 'hidden';
      
      // Hide main content and footer to prevent bleeding
      const mainElement = document.querySelector('main') as HTMLElement;
      const footerElement = document.querySelector('app-footer') as HTMLElement;
      
      if (mainElement) {
        mainElement.style.visibility = 'hidden';
      }
      
      if (footerElement) {
        footerElement.style.visibility = 'hidden';
      }
    } else {
      // Restore body scrolling and show main content
      document.body.style.overflow = '';
      
      // Show main content and footer
      const mainElement = document.querySelector('main') as HTMLElement;
      const footerElement = document.querySelector('app-footer') as HTMLElement;
      
      if (mainElement) {
        mainElement.style.visibility = '';
      }
      
      if (footerElement) {
        footerElement.style.visibility = '';
      }
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.currentRoute = path;
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
      
      // Restore main content and footer visibility
      const mainElement = document.querySelector('main') as HTMLElement;
      const footerElement = document.querySelector('app-footer') as HTMLElement;
      
      if (mainElement) {
        mainElement.style.visibility = '';
      }
      
      if (footerElement) {
        footerElement.style.visibility = '';
      }
    }
  }
}
