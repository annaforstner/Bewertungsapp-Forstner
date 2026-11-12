import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Project, ProjectEvaluation} from '../../services/api.service';

@Component({
  selector: 'app-projekt-detail',
  templateUrl: './projekt-detail.page.html',
  styleUrls: ['./projekt-detail.page.scss'],
  standalone: false,
})
export class ProjektDetailPage implements OnInit {
  // Signale aktualisieren die Anzeige, sobald das Backend antwortet.
  readonly project = signal<Project | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  // Hält die Bewertungen und ihren Ladestatus getrennt von den Projektdaten.
readonly evaluations = signal<ProjectEvaluation[]>([]);
readonly evaluationsLoading = signal(true);
readonly evaluationsError = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
  ) {}

  ngOnInit(): void {
    // Liest die Projekt-ID aus der URL und prüft sie.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.error.set('Ungültige Projekt-ID.');
      this.loading.set(false);
      return;
    }

    // Fragt genau dieses Projekt beim Backend ab.
    this.api.getProject(id).subscribe({
      next: project => {
        this.project.set(project);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Das Projekt konnte nicht geladen werden.');
        this.loading.set(false);
      },
    });
    // Lädt die Bewertungen. Bei einem Fehler bleiben die Projektdetails sichtbar.
this.api.getProjectEvaluations(id).subscribe({
  next: evaluations => {
    this.evaluations.set(evaluations);
    this.evaluationsLoading.set(false);
  },
  error: () => {
    this.evaluationsError.set('Die Bewertungen konnten nicht geladen werden.');
    this.evaluationsLoading.set(false);
  },
});
  }
}