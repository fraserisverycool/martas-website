import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService, ContentItem } from '../../services/content.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  content = signal<ContentItem | null>(null);
  portfolioImage = signal<string | null>(null);
  otherProjectsImage = signal<string | null>(null);

  constructor(public contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAllContent('home').subscribe(data => {
      if (data.length > 0) {
        this.content.set(data[0]);
      }
    });

    // Fetch random images for buttons
    forkJoin({
      tattoos: this.contentService.getAllContent('tattoos'),
      sketches: this.contentService.getAllContent('sketches'),
      tattooProjects: this.contentService.getAllContent('tattoo-projects')
    }).subscribe(({ tattoos, sketches, tattooProjects }) => {
      const allPortfolio = [...tattoos, ...sketches, ...tattooProjects].filter(i => i.imageUrl);
      if (allPortfolio.length > 0) {
        const randomItem = allPortfolio[Math.floor(Math.random() * allPortfolio.length)];
        this.portfolioImage.set(randomItem.imageUrl || null);
      }
    });

    this.contentService.getAllContent('other-projects').subscribe(data => {
      const withImages = data.filter(i => i.imageUrl);
      if (withImages.length > 0) {
        const randomItem = withImages[Math.floor(Math.random() * withImages.length)];
        this.otherProjectsImage.set(randomItem.imageUrl || null);
      }
    });
  }
}
