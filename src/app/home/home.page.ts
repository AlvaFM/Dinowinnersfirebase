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
  perfilList: any[] = [];
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
    this.verificarUsuarioAutenticado();
    this.obtenerUsuariosYDatos();
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
  
            this.productosPorUsuario[uid] = products.map((producto: any) => {
              console.log('Producto mapeado:', producto);
  
              return {
                ID_DOCUMENTO: producto.id,
                CreadorProducto: producto.CreadorProducto, 
                ID_VENTA: producto.ID_VENTA,  
                descripcion: producto.descripcion,  
                fecha: producto.fecha,
                imageUrl: producto.imageUrl,
                nombre: producto.nombre,
                precio: producto.precio,
                stock: producto.stock,
                uid_DW: producto.uid_DW
              };
            });
  
            console.log('Productos del usuario:', this.productosPorUsuario[uid]);
            if (products && products.length > 0) {
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
  

  ContenidoDelPerfil() {
    if (this.idUsuarioActual) {
      this.dbService.getContenidoPerfil(this.idUsuarioActual).subscribe(perfil => {
        this.perfilList = perfil;
        console.log('Contenido: ', this.perfilList);
      });
    } else {
      console.error('idUsuarioActual no está disponible');
    }
  }
  
  verificarContenido(nombreContenido: string): boolean {
    return this.perfilList.some(perfil => nombreContenido in perfil);
  }


  addCarrito(ID_DOCUMENTO: string,
  Nombre: string,
  precio: number,
  CreadorProducto: string,
  Id_venta: string, imageUrl: string,
  productostock: number,
  uid_DW:string) {

    const contenidoCarrito = {

      ID_DOCUMENTO:ID_DOCUMENTO,
      imageUrl : imageUrl,
      ID_VENTA: Id_venta,
      Nombre: Nombre,
      Precio: precio,
      CreadorProducto: CreadorProducto,
      Fecha: new Date().toISOString(),
      UsuarioId: this.idUsuarioActual,
      productostock: productostock,
      uid_DW:uid_DW,
    };
  
    this.dbService.addContenidoCarrito(this.idUsuarioActual, contenidoCarrito).then(() => {
      this.notificacionAccion('Producto añadido al carrito con éxito', 'exito');
      console.log('Producto añadido al carrito con éxito');
    }).catch((error) => {
      console.error('Error al añadir producto al carrito:', error);
      this.notificacionAccion('Error, no se pudo agregar al carrito', 'error');
    });
  }
  
  

  verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then(data => {
          this.nombreUsuario = data?.nombre || ''; 
          this.idUsuarioActual = user.uid;
          this.ContenidoDelPerfil();  
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
      
      this.notificacionAccion('Comentario agregado con éxito', 'exito');

      this.comentarioForo = '';
    } else {
      this.notificacionAccion('Error, no se pudo comentar', 'error');
    }
    
 
  }


  notificacionAccion(mensaje: string, tipomensaje: string): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipomensaje;
    
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 3000);
  }
  

  irASuscripcion(uidCurso: string, nombreCurso: string, autor: string) {
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
