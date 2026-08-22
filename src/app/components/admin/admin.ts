import { Component, OnInit, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, ContentItem } from '../../services/content.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  password = '';
  isLoggedIn = false;
  loginError = '';

  contentItems = signal<ContentItem[]>([]);
  contentTypes = ['tattoos', 'sketches', 'tattoo-projects', 'other-projects'];
  selectedType = signal('tattoos');

  newItem: ContentItem = { type: 'tattoos', title: '', description: '' };
  selectedFile: File | null = null;

  editingItem: ContentItem | null = null;
  editFile: File | null = null;

  filteredContentItems = computed(() =>
    this.contentItems().filter(item => item.type === this.selectedType())
  );

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword === 'worldpeace') {
      this.password = savedPassword;
      this.isLoggedIn = true;
      this.loadContent();
    }
  }

  login() {
    if (this.password === 'worldpeace') {
      this.isLoggedIn = true;
      this.loginError = '';
      sessionStorage.setItem('adminPassword', this.password);
      this.loadContent();
    } else {
      this.loginError = 'Incorrect password';
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.password = '';
    sessionStorage.removeItem('adminPassword');
  }

  loadContent() {
    this.contentService.getAllContent().subscribe(data => {
      this.contentItems.set(data);
    });
  }

  selectType(type: string) {
    this.selectedType.set(type);
    this.newItem.type = type;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onEditFileSelected(event: any) {
    this.editFile = event.target.files[0];
  }

  createItem() {
    const formData = new FormData();
    formData.append('type', this.newItem.type);
    formData.append('title', this.newItem.title || '');
    formData.append('description', this.newItem.description || '');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.contentService.createContent(formData, this.password).subscribe({
      next: () => {
        this.newItem = { type: this.selectedType(), title: '', description: '' };
        this.selectedFile = null;
        this.loadContent();
      },
      error: (err) => alert('Error creating content: ' + err.error.error)
    });
  }

  startEdit(item: ContentItem) {
    this.editingItem = { ...item };
    this.editFile = null;
  }

  cancelEdit() {
    this.editingItem = null;
    this.editFile = null;
  }

  updateItem() {
    if (!this.editingItem || !this.editingItem.id) return;

    const formData = new FormData();
    formData.append('type', this.editingItem.type);
    formData.append('title', this.editingItem.title || '');
    formData.append('description', this.editingItem.description || '');
    if (this.editFile) {
      formData.append('image', this.editFile);
    }

    this.contentService.updateContent(this.editingItem.id, formData, this.password).subscribe({
      next: () => {
        this.editingItem = null;
        this.editFile = null;
        this.loadContent();
      },
      error: (err) => alert('Error updating content: ' + err.error.error)
    });
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.contentService.deleteContent(id, this.password).subscribe({
        next: () => this.loadContent(),
        error: (err) => alert('Error deleting content: ' + err.error.error)
      });
    }
  }
}
