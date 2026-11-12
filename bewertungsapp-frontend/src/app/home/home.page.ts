// Importiert signal, damit Angular Änderungen an der Liste und am Ladestatus erkennt.
import { Component, OnInit, signal } from '@angular/core';
import { ApiService, Project } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  constructor(private readonly api: ApiService) {}

  // Speichert die Liste und den Zustand der Anfrage als Signale.
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  // Lädt die Projekte und beendet den Ladehinweis bei Erfolg oder Fehler.
  ngOnInit(): void {
    this.api.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Die Projekte konnten nicht geladen werden.');
        this.loading.set(false);
      },
    });
  }
}
