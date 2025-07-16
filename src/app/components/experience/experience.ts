import { Component, OnInit, ElementRef, ViewChildren, QueryList, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animation } from '../../services/animation';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience implements OnInit, AfterViewInit {
  private readonly animationService = inject(Animation);
  
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;
  
  constructor(private readonly elementRef: ElementRef) {}
  
  ngOnInit() {
    // Any initialization logic
  }
    ngAfterViewInit() {
    // Make content immediately visible without animations
    this.elementRef.nativeElement.style.opacity = '1';
    
    // Make all timeline items immediately visible
    if (this.timelineItems?.length) {
      this.timelineItems.forEach((item) => {
        item.nativeElement.style.opacity = '1';
        item.nativeElement.style.transform = 'none';
      });
    }
  }
}
