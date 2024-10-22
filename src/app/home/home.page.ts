import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; 
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
  nombreUsuario: string = ''; 

  constructor(private dbService: DatabaseService, private authService: AuthService) {}

  ngOnInit() {
    this.obtenerUsuariosYDatos();
    this.verificarUsuarioAutenticado();
  }

  obtenerUsuariosYDatos() {
    this.dbService.getAllUsers().subscribe(users => {
      this.usuarios = users;

      this.usuarios.forEach(usuario => {
        const uid = usuario.uid;

        // Obtener productos por usuario
        this.dbService.getProductsByUser(uid).subscribe(products => {
          this.productosPorUsuario[uid] = products; 
        });

        this.dbService.getLocationsByUser(uid).subscribe(locations => {
          this.ubicacionesPorUsuario[uid] = locations; 
        });
      });
    });
  }

  verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        
        this.authService.getUserData(user.uid).then(data => {
          this.nombreUsuario = data?.nombre || ''; 
        });
      } else {
        this.nombreUsuario = ''; 
      }
    });
  }
}
