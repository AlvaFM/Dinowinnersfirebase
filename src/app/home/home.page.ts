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

  comentarioForo: string = '';
  comentariosForo: any[] = [];
  usuarios: any[] = [];
  productosPorUsuario: { [key: string]: any[] } = {};
  ubicacionesPorUsuario: { [key: string]: any[] } = {};
  nombreUsuario: string = '';
  idUsuarioActual : string ='';
  selectedTab: string = 'productos';
  mensaje: string = '';
  tipoMensaje: string = '';

  constructor(private dbService: DatabaseService, private authService: AuthService, private router: Router) {}

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
      this.usuarios = []; 
  
      users.forEach(usuario => {
        const uid = usuario.uid;
  
        if (!this.productosPorUsuario[uid]) {
          this.dbService.getProductsByUser(uid).subscribe(products => {
            products.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            if (products && products.length > 0) {
              this.productosPorUsuario[uid] = products;
              this.usuarios.push(usuario);  
            }
          });
        }
  
        this.dbService.getLocationsByUser(uid).subscribe(locations => {
          this.ubicacionesPorUsuario[uid] = locations;
        });
      });
    });
  }

  generateUniqueIdforPosition(): string {
    return 'ID_Carrito' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }

  addCarrito(Nombre: string, precio: number, CreadorProducto: string, Id_venta: string, imageUrl: string) {
    const ID_posicion_carrito = this.generateUniqueIdforPosition();
    const contenidoCarrito = {
      
      imageUrl : imageUrl,
      ID_LUGAR_CARRITO : ID_posicion_carrito,
      ID_VENTA: Id_venta,
      Nombre: Nombre,
      Precio: precio,
      CreadorProducto: CreadorProducto,
      Fecha: new Date().toISOString(),
      UsuarioId: this.idUsuarioActual, 
    };
  
    this.dbService.addContenidoCarrito(this.idUsuarioActual, contenidoCarrito).then(() => {
      console.log('Producto añadido al carrito con éxito');
    }).catch((error) => {
      console.error('Error al añadir producto al carrito:', error);
    });
  }
  
  

  verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then(data => {
          this.nombreUsuario = data?.nombre || ''; 
          this.idUsuarioActual = user.uid; 
        });
      } else {
        this.nombreUsuario = ''; 
        this.idUsuarioActual = ''; 
      }
    });
  }

  ComentarForo() {
    if (this.nombreUsuario !== '' && this.comentarioForo !== '') {
      const ComentarioForo = {
        Usuario: this.nombreUsuario,
        Comentario: this.comentarioForo,
        tipo: 'comentarioNormal',
        fecha: new Date().toISOString()
      };
      this.dbService.addCommentForo(ComentarioForo);
      
      this.mensaje = 'Comentario agregado con éxito';
      this.tipoMensaje = 'exito';

      this.comentarioForo = '';
    } else {
      this.mensaje = 'Error, no se pudo comentar';
      this.tipoMensaje = 'error';
    }
    
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 3000); 
  }

  irASuscripcion(uidCurso: string, nombreCurso: string, autor: string) {
    console.log(uidCurso, nombreCurso, autor); 
    this.router.navigate(['/suscripcion', uidCurso, nombreCurso, autor]);
  }

  obtenerComentariosForo() {
    this.dbService.getAllCommentsForo().subscribe(comentarios => {
      comentarios.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
      this.comentariosForo = comentarios;      
    });
  }
  

  async logout() {
    await this.authService.logout();
    console.log('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
