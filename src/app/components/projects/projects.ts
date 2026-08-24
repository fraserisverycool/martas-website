import { Component, OnInit, signal } from '@angular/core';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})
export class ProjectsComponent implements OnInit {
  otherProjects = signal<ContentItem[]>([]);

  constructor(public contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAllContent('other projects').subscribe(data => this.otherProjects.set(data));
  }
}
