import { Component, OnInit, signal } from '@angular/core';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent implements OnInit {
  content = signal<ContentItem | null>(null);

  constructor(public contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAllContent('about').subscribe(data => {
      if (data.length > 0) {
        this.content.set(data[0]);
      }
    });
  }
}
