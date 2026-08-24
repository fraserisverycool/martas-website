import { Component, OnInit, signal } from '@angular/core';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class ContactComponent implements OnInit {
  content = signal<ContentItem | null>(null);

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAllContent('contact').subscribe(data => {
      if (data.length > 0) {
        this.content.set(data[0]);
      }
    });
  }
}
