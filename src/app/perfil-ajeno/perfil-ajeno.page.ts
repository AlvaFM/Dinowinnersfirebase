import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service'; 

@Component({
  selector: 'app-perfil-ajeno',
  templateUrl: './perfil-ajeno.page.html',
  styleUrls: ['./perfil-ajeno.page.scss'],
})
export class PerfilAjenoPage implements OnInit {
  
  uid: string = '';  
  productos: any[] = [];
  ubicaciones: any[] = [];
  cursos: any[] = [];
  contenidoPerfil: any[] = [];
  contactoUser: any[] = [];
  historialVentas: any[] = [];

  constructor(private route: ActivatedRoute, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid') || '';  

      if (this.uid) {  
        this.obtenerProductos();
        this.obtenerUbicaciones();
        this.obtenerCursos();
        this.obtenerContenidoPerfil();
        this.extraerInfoContacto();
        this.getHistorialDeventas();
      }
    });
  }

  verificarContenido(nombreContenido: string): boolean {
    return this.contenidoPerfil.some(perfil => nombreContenido in perfil);
  }

  
  obtenerProductos() {
    this.databaseService.getProductsByUser(this.uid).subscribe(products => {
      this.productos = products; 
    });
  }
  getHistorialDeventas(){
    this.databaseService.getHistorialVentas(this.uid).subscribe(historialV => {
      this.historialVentas = historialV;
    });
  }

  obtenerUbicaciones() {
    this.databaseService.getLocationsByUser(this.uid).subscribe(locations => {
      this.ubicaciones = locations;
    });
  }
  obtenerCursos() {
    this.databaseService.getCursoByUser(this.uid).subscribe(courses => {
      this.cursos = courses; 
    });
  }

 
  obtenerContenidoPerfil() {
    this.databaseService.getContenidoPerfil(this.uid).subscribe(profileContent => {
      this.contenidoPerfil = profileContent; 
    });
  }
  extraerInfoContacto() {
    this.databaseService.getOneUser(this.uid).subscribe(
      usercontacto => {
        this.contactoUser = usercontacto;
      });
  }

  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
}
