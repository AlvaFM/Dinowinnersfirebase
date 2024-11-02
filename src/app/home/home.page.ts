  import { Component, OnInit } from '@angular/core';
  import { AuthService } from '../services/auth.service'; 
  import { DatabaseService } from '../services/database.service';
  import { Router } from '@angular/router';
 

  @Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
  })
  export class HomePage implements OnInit {


    comentarioForo : string='';
    comentariosForo : any[] = [];
    usuarios: any[] = [];
    productosPorUsuario: { [key: string]: any[] } = {};
    ubicacionesPorUsuario: { [key: string]: any[] } = {};
    nombreUsuario: string = '';
    selectedTab: string = 'productos';
  
    constructor(private dbService: DatabaseService, private authService: AuthService, private router : Router) {}

    ngOnInit() {
      this.obtenerUsuariosYDatos();
      this.verificarUsuarioAutenticado();
      this.obtenerComentariosForo();
    }

    changeTab(tab: string) {
      this.selectedTab = tab;
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

    ComentarForo() {
      if (this.nombreUsuario !== '' && this.comentarioForo !== '') {
        const ComentarioForo = {
          Usuario: this.nombreUsuario,
          Comentario: this.comentarioForo,
          tipo: 'comentarioNormal'
        };
        this.dbService.addCommentForo(ComentarioForo);
        alert('Comentario agregado con exito')
        this.comentarioForo='';
      } else {
        alert('Error: No se pudo comentar');
      }
    }
    
    irASuscripcion(uidCurso: string, nombreCurso: string, autor: string) {
      console.log(uidCurso, nombreCurso, autor); 
      this.router.navigate(['/suscripcion', uidCurso, nombreCurso, autor]);
    }
    
    
  
    

    obtenerComentariosForo() {
      this.dbService.getAllCommentsForo().subscribe(comentarios => {
          this.comentariosForo = comentarios;      
      });
  }
  
    async logout() {
      await this.authService.logout();
      console.log('Sesión cerrada');
      this.router.navigate(['/home']);
    }
    
  }
