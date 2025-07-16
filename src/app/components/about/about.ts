import { Component, OnInit, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animation } from '../../services/animation';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit, AfterViewInit {
  private readonly animationService = inject(Animation);

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit() {
    // Initialization logic
  }

  ngAfterViewInit() {
    // Apply animations after view is initialized
    this.animationService.fadeInOnScroll(this.elementRef);
    
    // Apply animations to text elements
    const aboutTextContainer = this.elementRef.nativeElement.querySelector('.about-text');
    const paragraphs = aboutTextContainer.querySelectorAll('p, ul');
    
    // Create staggered animation for text elements
    Array.from(paragraphs).forEach((element, index) => {
      this.animationService.fadeInOnScroll(
        new ElementRef(element as HTMLElement), 
        0.2 + (index * 0.1),
        0.7
      );
    });
    
    // Add subtle floating animation to the image shapes
    const imageShape1 = this.elementRef.nativeElement.querySelector('.image-shape-1');
    const imageShape2 = this.elementRef.nativeElement.querySelector('.image-shape-2');
    
    if (imageShape1 && imageShape2) {
      this.applyFloatingAnimation(imageShape1, 1);
      this.applyFloatingAnimation(imageShape2, -1);
    }
  }
  
  private applyFloatingAnimation(element: Element, direction: number) {
    // Use setTimeout to ensure the animation runs after Angular change detection
    setTimeout(() => {
      const container = this.elementRef.nativeElement.querySelector('.image-container');
      container.addEventListener('mouseenter', () => {
        element.classList.add('floating-active');
      });
      
      container.addEventListener('mouseleave', () => {
        element.classList.remove('floating-active');
      });
    }, 100);
  }

}
