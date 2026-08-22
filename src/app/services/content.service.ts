import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContentItem {
  id?: number;
  type: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/content'
    : '/api/content';

  constructor(private http: HttpClient) {}

  private getAdminHeaders(password: string) {
    return { headers: new HttpHeaders({ 'x-admin-password': password }) };
  }

  getAllContent(type?: string): Observable<ContentItem[]> {
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    return this.http.get<ContentItem[]>(url);
  }

  getContentById(id: number): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.apiUrl}/${id}`);
  }

  createContent(formData: FormData, password: string): Observable<ContentItem> {
    return this.http.post<ContentItem>(this.apiUrl, formData, this.getAdminHeaders(password));
  }

  updateContent(id: number, formData: FormData, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, this.getAdminHeaders(password));
  }

  deleteContent(id: number, password: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAdminHeaders(password));
  }
}
