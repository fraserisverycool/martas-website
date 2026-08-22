import { Component, OnInit, signal } from '@angular/core';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css'],
})
export class PortfolioComponent implements OnInit {
  tattoos = signal<ContentItem[]>([]);
  sketches = signal<ContentItem[]>([]);
  tattooProjects = signal<ContentItem[]>([]);

  expandedSections: { [key: string]: boolean | undefined } = {
    tattoos: false,
    sketches: false,
    tattooProjects: false
  };

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAllContent('tattoos').subscribe(data => this.tattoos.set(data));
    this.contentService.getAllContent('sketches').subscribe(data => this.sketches.set(data));
    this.contentService.getAllContent('tattoo-projects').subscribe(data => this.tattooProjects.set(data));
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }
}
