import { Component, ElementRef, OnInit, AfterViewInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animation } from '../../services/animation';
import gsap from 'gsap';

interface Project {
  id: number;
  title: string;
  company: string;
  tags: string[];
  description: string;
  details: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit, AfterViewInit {
  private readonly animationService = inject(Animation);
  
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef>;
  
  // Filter states
  activeFilter: string = 'All';
  filterTags: string[] = ['All', 'C#', '.NET Core', 'Azure', 'SQL Server', 'Angular', 'AWS'];
  
  // Projects data
  projects: Project[] = [
    {
      id: 1,
      title: 'Big-8 Audit Tool',
      company: 'Microsoft Corporation',
      tags: ['C#', '.NET Core', 'SQL Server', 'Angular', 'Azure'],
      description: 'Understanding existing codebase, implementing features as per requirements, and suggesting solutions for given problem statements.',
      details: [
        'Analysed existing functionality and fixed bugs',
        'Migrated Web Jobs to Container App Jobs for better cloud optimizations',
        'Implemented new features with careful consideration of potential solutions',
        'Ensured optimal code coverage to maintain quality',
        'Debugged and troubleshooted to understand end-to-end functionality'
      ]
    },
    {
      id: 2,
      title: 'Compressor Enhancement Portal',
      company: 'Nagarro Software Pvt Ltd',
      tags: ['C#', '.NET Core', 'SQL Server', 'Docker', 'Kubernetes', 'Angular'],
      description: 'Developing API solution from scratch to suggest improvements in existing compressors for reducing operational expenses in refineries.',
      details: [
        'Built API solution from scratch using .Net Core 3.1 and Entity Framework',
        'Integrated token-based authentication, Serilog, and Swagger',
        'Integrated Sonarqube and Stylecop for static code analysis',
        'Added comprehensive unit test coverage using xUnit and MOQ',
        'Developed background jobs using Hangfire for performance',
        'Migrated from .Net Core 3.1 to .Net Core 6'
      ]
    },
    {
      id: 3,
      title: 'Employee Onboarding Platform',
      company: 'GlobalLogic India Pvt Ltd',
      tags: ['C#', '.NET Core', 'AWS', 'Postgres', 'MongoDB'],
      description: 'Microservice-based platform for digital documentation and employee onboarding in school districts.',
      details: [
        'Developed various features in microservices architecture',
        'Enhanced Identity Server 3 functionality',
        'Improved API performance through RCA and documentation',
        'Created technical documentation for complex features',
        'Implemented comprehensive unit testing with NUnit'
      ]
    },
    {
      id: 4,
      title: 'Claim Examiner Portal',
      company: 'Infogain India Pvt Ltd',
      tags: ['C#', 'ASP.NET MVC', 'Entity Framework', 'SQL Server'],
      description: 'Business rules implementation for insurance claim processing according to US Healthcare Guidelines.',
      details: [
        'Implemented business rules per US Worker Compensation guidelines',
        'Collaborated with Business Analysts for technical implementation',
        'Integrated solutions for Worker Compensation and Auto Physical Damage',
        'Developed stored procedures for enhanced performance',
        'Worked in Agile and Kanban methodologies'
      ]
    }
  ];
  
  filteredProjects: Project[] = [];
  
  constructor(private readonly elementRef: ElementRef) {}
  
  ngOnInit() {
    // Initialize filtered projects
    this.filteredProjects = [...this.projects];
  }
  
  ngAfterViewInit() {
    // Apply animations with a slight delay
    setTimeout(() => {
      // Apply fade-in animation to the section
      this.animationService.fadeInOnScroll(this.elementRef);
      
      // Animate project cards with staggered effect
      this.animateProjectCards();
    }, 100);
  }
  
  /**
   * Filter projects by tag
   */
  filterProjects(tag: string) {
    this.activeFilter = tag;
    
    if (tag === 'All') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Re-apply animations after filtering
    setTimeout(() => this.animateProjectCards(), 100);
  }
  
  /**
   * Animate project cards with staggered effect
   */
  private animateProjectCards() {
    if (!this.projectCards?.length) return;
    
    // Reset animations
    gsap.set(this.projectCards.map(card => card.nativeElement), {
      opacity: 0,
      y: 50,
      scale: 0.95
    });
    
    // Apply staggered animation
    gsap.to(this.projectCards.map(card => card.nativeElement), {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });
    
    // Add hover animations
    this.projectCards.forEach(card => {
      const element = card.nativeElement;
      
      // Remove any existing listeners
      element.onmouseenter = null;
      element.onmouseleave = null;
      
      // Add hover effect
      element.onmouseenter = () => {
        gsap.to(element, {
          y: -10,
          scale: 1.02,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      };
      
      element.onmouseleave = () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
          duration: 0.4,
          ease: 'power2.out'
        });
      };
    });
  }
}
