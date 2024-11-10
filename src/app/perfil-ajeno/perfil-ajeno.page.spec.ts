import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAjenoPage } from './perfil-ajeno.page';

describe('PerfilAjenoPage', () => {
  let component: PerfilAjenoPage;
  let fixture: ComponentFixture<PerfilAjenoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAjenoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
