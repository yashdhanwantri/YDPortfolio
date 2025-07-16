import { Component, OnInit, ElementRef, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Animation } from '../../services/animation';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements OnInit, AfterViewInit {
  private readonly animationService = inject(Animation);
  
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
  @ViewChild('heroContainer') heroContainer!: ElementRef;
  @ViewChild('ctaButton') ctaButton!: ElementRef;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // Any initialization logic
  }

  ngAfterViewInit() {
    // Enhanced Apple-like animation sequence
    setTimeout(() => {
      // Create a timeline for coordinated animations
      const timeline = gsap.timeline();
      
      // Text reveal with enhanced Apple-like staggering and motion
      this.animationService.textReveal(this.heroTitle, 0.3);
      
      // Add subtle fade-in for the subtitle with slight delay
      timeline.fromTo(
        this.heroSubtitle.nativeElement,
        { 
          opacity: 0,
          y: 20
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.8 // Give the title time to reveal first
        }
      );
      
      // Fade in buttons with slight bounce
      const buttons = this.elementRef.nativeElement.querySelectorAll('.hero-actions .btn');
      timeline.fromTo(
        buttons,
        { 
          opacity: 0,
          y: 30,
          scale: 0.9
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          delay: 0.2
        },
        '-=0.3' // Slight overlap with previous animation
      );
      
      // Apply magnetic effect to CTA button
      this.animationService.magneticButton(this.ctaButton);
      
      // Apply enhanced parallax effect
      this.animationService.heroParallax(this.heroContainer);
      
      // Add subtle floating animation to graphic elements
      const graphicElements = this.elementRef.nativeElement.querySelectorAll('[data-parallax]');
      graphicElements.forEach((el: Element) => {
        gsap.to(el, {
          y: '+=10',
          x: '+=5',
          rotation: '+=2',
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
      
      // Add code typing effect
      this.animateCodeTyping();
    }, 100);
  }
  
  // Creates a typing effect for the code window
  private animateCodeTyping(): void {
    const codeContent = this.elementRef.nativeElement.querySelector('.code-content pre');
    
    // Instead of trying to parse and retype the HTML with Angular's template syntax,
    // let's create the code display directly in JavaScript where we can control the content better
    
    // First hide all text
    codeContent.innerHTML = '';
    
    // Define the code as a simple string without HTML entities or Angular template syntax
    const codeString = [
      'class <span class="highlight">Developer</span> {',
      '  constructor() {',
      '    this.name = <span class="string">"Yash Dhanwantri"</span>;',
      '    this.role = <span class="string">"Technical Consultant"</span>;',
      '    this.company = <span class="string">"Microsoft"</span>;',
      '    this.experience = <span class="number">8</span>;',
      '    this.skills = [',
      '      <span class="string">"Full Stack Development"</span>,',
      '      <span class="string">"Distributed Systems"</span>,',
      '      <span class="string">"Microservices"</span>,',
      '      <span class="string">"Cloud Architecture"</span>',
      '    ];',
      '  }',
      '',
      '  <span class="method">solveProblems</span>(<span class="param">complexity</span>) {',
      '    return <span class="string">"Elegant Solution"</span>;',
      '  }',
      '}'
    ];
    
    // Join lines with line breaks
    const fullCode = codeString.join('\n');
    
    // Set the content immediately since we're bypassing Angular's template syntax
    setTimeout(() => {
      codeContent.innerHTML = fullCode;
    }, 1000);
  }

  scrollToContact() {
    console.log('Navigating to contact page');
    // Navigate to the contact page directly
    this.router.navigate(['/contact']);
  }

}
