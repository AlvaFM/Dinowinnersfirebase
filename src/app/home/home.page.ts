import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuarios: any[] = [];
  productosPorUsuario: { [key: string]: any[] } = {};
  ubicacionesPorUsuario: { [key: string]: any[] } = {};

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.obtenerUsuariosYDatos();
  }

  obtenerUsuariosYDatos() {
    
    this.dbService.getAllUsers().subscribe(users => {
      this.usuarios = users;

      this.usuarios.forEach(usuario => {
        const uid = usuario.uid;

        
        this.dbService.getProductsByUser(uid).subscribe(products => {
          this.productosPorUsuario[uid] = products; 
        });

        
        this.dbService.getLocationsByUser(uid).subscribe(locations => {
          this.ubicacionesPorUsuario[uid] = locations; 
        });
      });
    });
  }
}
