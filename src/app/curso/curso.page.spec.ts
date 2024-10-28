import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CursoPage } from './curso.page';

describe('CursoPage', () => {
  let component: CursoPage;
  let fixture: ComponentFixture<CursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
