import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Beschreibt die Projektdaten, die unsere API einschließlich Team zurückgibt.
export interface Project {
  id: number;
  titel: string;
  beschreibung: string;
  praesentiertAm: string;
  Team: { id: number; name: string; klasse: string } | null;
}

// Beschreibt eine Einzelbewertung mit Punkten, Kommentar und Kriterium.
export interface ProjectEvaluation {
  id: number;
  score: number;
  comment: string;
  Criterion: { name: string } | null;
}

// Bündelt die Projektanfragen, damit die Seiten keine URLs selbst bauen müssen.
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly url = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // Lädt alle Projekte für die Listenansicht.
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.url}/projects`);
  }

  // Lädt ein Projekt anhand seiner ID für die Detailansicht.
  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.url}/projects/${id}`);
  }

  // Lädt alle Einzelbewertungen des ausgewählten Projekts.
getProjectEvaluations(id: number): Observable<ProjectEvaluation[]> {
  return this.http.get<ProjectEvaluation[]>(`${this.url}/projects/${id}/evaluations`);
}
}