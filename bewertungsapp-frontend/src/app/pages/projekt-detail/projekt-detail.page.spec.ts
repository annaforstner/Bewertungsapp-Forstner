import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjektDetailPage } from './projekt-detail.page';

describe('ProjektDetailPage', () => {
  let component: ProjektDetailPage;
  let fixture: ComponentFixture<ProjektDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjektDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
