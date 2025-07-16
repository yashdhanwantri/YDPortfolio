import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animation } from '../../services/animation';
import gsap from 'gsap';

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  title: string;
  type: 'bar' | 'tag';
  skills: any[]; // Use any to allow both Skill[] and string[]
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills implements OnInit, AfterViewInit {
  private readonly animationService = inject(Animation);
  
  @ViewChildren('skillBar') skillBars!: QueryList<ElementRef>;
  @ViewChildren('skillTag') skillTags!: QueryList<ElementRef>;
  @ViewChildren('skillCategory') skillCategoryElements!: QueryList<ElementRef>;
  
  // Skills data model
  skillCategories: SkillCategory[] = [
    {
      title: 'Backend Development',
      type: 'bar',
      skills: [
        { name: 'C#', proficiency: 95 },
        { name: '.NET Core', proficiency: 92 },
        { name: 'ASP.NET Core Web API', proficiency: 90 },
        { name: 'Identity Server', proficiency: 85 },
        { name: 'Hangfire', proficiency: 82 }
      ]
    },
    {
      title: 'Frontend Development',
      type: 'bar',
      skills: [
        { name: 'Angular', proficiency: 88 },
        { name: 'TypeScript', proficiency: 90 },
        { name: 'JavaScript', proficiency: 85 }
      ]
    },
    {
      title: 'Databases',
      type: 'bar',
      skills: [
        { name: 'SQL Server', proficiency: 92 },
        { name: 'PostgreSQL', proficiency: 85 },
        { name: 'MongoDB', proficiency: 80 }
      ]
    },
    {
      title: 'Cloud & DevOps',
      type: 'bar',
      skills: [
        { name: 'Azure', proficiency: 90 },
        { name: 'Docker', proficiency: 85 },
        { name: 'Kubernetes', proficiency: 80 },
        { name: 'Azure DevOps', proficiency: 88 }
      ]
    },
    {
      title: 'Testing',
      type: 'tag',
      skills: [
        'NUnit',
        'xUnit',
        'MOQ',
        'Integration Testing',
        'Unit Testing'
      ]
    },
    {
      title: 'Tools & Methodologies',
      type: 'tag',
      skills: [
        'Visual Studio',
        'Visual Studio Code',
        'Git',
        'JIRA',
        'Confluence',
        'Agile',
        'Scrum',
        'Kanban'
      ]
    }
  ];
  
  constructor(private readonly elementRef: ElementRef) {}
  
  ngOnInit() {
    // Initialization logic
  }
  
  ngAfterViewInit() {
    // Apply animations immediately without scroll dependency for initial view
    setTimeout(() => {
      // No scroll trigger for main section - make it immediately visible
      gsap.to(this.elementRef.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Animate skill categories with staggered effect - no scroll dependency
      this.animateSkillCategoriesImmediate();
      
      // Set up immediate animations for skill bars
      this.animateSkillBarsImmediate();
      
      // Animate skill tags immediately
      this.animateSkillTagsImmediate();
    }, 100);
  }
  
  /**
   * Animates skill categories with staggered effect
   */
  private animateSkillCategories() {
    if (!this.skillCategoryElements?.length) return;
    
    gsap.from(this.skillCategoryElements.map(cat => cat.nativeElement), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: this.elementRef.nativeElement,
        start: 'top 70%'
      }
    });
  }
  
  /**
   * Animates skill bars with Apple-style progress animation
   */
  private animateSkillBars() {
    if (!this.skillBars?.length) return;
    
    this.skillBars.forEach((bar, index) => {
      const progressBar = bar.nativeElement.querySelector('.skill-progress');
      const targetWidth = progressBar.style.width;
      const percentageEl = bar.nativeElement.querySelector('.skill-percentage');
      
      // Set initial state
      gsap.set(progressBar, { 
        width: 0,
        opacity: 0.5
      });
      
      gsap.set(percentageEl, {
        opacity: 0,
        y: 10
      });
      
      // Create scroll-triggered animation with timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bar.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      
      // Sequenced animation for Apple-like effect
      tl.to(progressBar, {
        width: 0,
        duration: 0,
        opacity: 0.5
      })
      .to(progressBar, {
        width: targetWidth,
        duration: 1.2,
        ease: 'power4.out',
        opacity: 1,
        delay: 0.1 * (index % 4)  // Staggered delay based on position within category
      })
      .to(percentageEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.5');  // Overlap with the bar animation
    });
  }
  
  /**
   * Animates skill tags with staggered effect using Apple-style animation
   */
  private animateSkillTags() {
    if (!this.skillTags?.length) return;
    
    // Group tags by their parent container for better control
    const tagsByContainer = new Map<Element, Element[]>();
    
    this.skillTags.forEach(tag => {
      const container = tag.nativeElement.closest('.skill-tags');
      if (!tagsByContainer.has(container)) {
        tagsByContainer.set(container, []);
      }
      tagsByContainer.get(container)?.push(tag.nativeElement);
    });
    
    // Animate each group of tags with its own timeline
    tagsByContainer.forEach((tags, container) => {
      // Set initial state
      gsap.set(tags, {
        opacity: 0,
        scale: 0.8,
        y: 15,
        rotateX: -10
      });
      
      // Create a timeline for this container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reset'
        }
      });
      
      // Add 3D perspective to container
      gsap.set(container, { perspective: 800 });
      
      // Add staggered animation with random delays for a more natural feel
      tl.to(tags, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 0.7,
        stagger: {
          amount: 0.8,  // Total stagger time
          from: "random",  // Start from random positions for organic feel
          ease: "power2.inOut"
        },
        ease: 'elastic.out(0.7, 0.5)',  // Elastic bounce like Apple UI
        onComplete: () => {
          // Add subtle floating animation to tags after they appear
          tags.forEach(tag => {
            gsap.to(tag, {
              y: '-=2',
              duration: 1.5 + Math.random(),  // Randomized duration
              repeat: -1,  // Infinite repeat
              yoyo: true,  // Go back and forth
              ease: 'sine.inOut',  // Smooth sine wave motion
              delay: Math.random()  // Random delay for each tag
            });
          });
        }
      });
    });
  }
  
  /**
   * Animates skill categories with immediate effect (no scroll trigger)
   */
  private animateSkillCategoriesImmediate() {
    if (!this.skillCategoryElements?.length) return;
    
    gsap.from(this.skillCategoryElements.map(cat => cat.nativeElement), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.2
    });
  }
  
  /**
   * Animates skill bars immediately without scroll triggers
   */
  private animateSkillBarsImmediate() {
    if (!this.skillBars?.length) return;
    
    this.skillBars.forEach((bar, index) => {
      const progressBar = bar.nativeElement.querySelector('.skill-progress');
      const targetWidth = progressBar.style.width;
      const percentageEl = bar.nativeElement.querySelector('.skill-percentage');
      
      // Set initial state
      gsap.set(progressBar, { 
        width: 0,
        opacity: 0.5
      });
      
      gsap.set(percentageEl, {
        opacity: 0,
        y: 10
      });
      
      // Create animation timeline without scroll trigger
      const tl = gsap.timeline({
        delay: 0.4 + (Math.floor(index / 3) * 0.2) // Delay based on position
      });
      
      // Sequenced animation for Apple-like effect
      tl.to(progressBar, {
        width: 0,
        duration: 0,
        opacity: 0.5
      })
      .to(progressBar, {
        width: targetWidth,
        duration: 1.2,
        ease: 'power4.out',
        opacity: 1,
        delay: 0.1 * (index % 4)  // Staggered delay based on position within category
      })
      .to(percentageEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.5');  // Overlap with the bar animation
    });
  }
  
  /**
   * Animates skill tags immediately without scroll triggers
   */
  private animateSkillTagsImmediate() {
    if (!this.skillTags?.length) return;
    
    // Group tags by their parent container for better control
    const tagsByContainer = new Map<Element, Element[]>();
    
    this.skillTags.forEach(tag => {
      const container = tag.nativeElement.closest('.skill-tags');
      if (!tagsByContainer.has(container)) {
        tagsByContainer.set(container, []);
      }
      tagsByContainer.get(container)?.push(tag.nativeElement);
    });
    
    // Animate each group of tags with its own timeline
    let containerIndex = 0;
    tagsByContainer.forEach((tags, container) => {
      // Set initial state
      gsap.set(tags, {
        opacity: 0,
        scale: 0.8,
        y: 15,
        rotateX: -10
      });
      
      // Create a timeline for this container with delay
      const tl = gsap.timeline({
        delay: 0.6 + (containerIndex * 0.3) // Add delay based on container index
      });
      
      // Add 3D perspective to container
      gsap.set(container, { perspective: 800 });
      
      // Add staggered animation with random delays for a more natural feel
      tl.to(tags, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 0.7,
        stagger: {
          amount: 0.8,  // Total stagger time
          from: "random",  // Start from random positions for organic feel
          ease: "power2.inOut"
        },
        ease: 'elastic.out(0.7, 0.5)',  // Elastic bounce like Apple UI
        onComplete: () => {
          // Add subtle floating animation to tags after they appear
          tags.forEach(tag => {
            gsap.to(tag, {
              y: '-=2',
              duration: 1.5 + Math.random(),  // Randomized duration
              repeat: -1,  // Infinite repeat
              yoyo: true,  // Go back and forth
              ease: 'sine.inOut',  // Smooth sine wave motion
              delay: Math.random()  // Random delay for each tag
            });
          });
        }
      });
      
      containerIndex++;
    });
  }
}
