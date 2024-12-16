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
  categories: any[] = [];
  products: any[] = [];

  

  constructor(private dbService: DatabaseService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.verificarUsuarioAutenticado();
    this.obtenerUsuariosYDatos();
    this.obtenerComentariosForo();
    this.loadCategories();
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }
  async loadCategories() {
    try {
      this.categories = await this.dbService.getAllCategories();  
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  }

  calcularPromedio(calificaciones: any[]): number {
    if (!calificaciones || calificaciones.length === 0) {
      return 0;
    }
    const totalPuntaje = calificaciones.reduce((total, cal) => total + cal.calificacion, 0);
    return totalPuntaje / calificaciones.length;
  }
  




  comentarioPorIdproducto: { [key: string]: any[] } = {}; 
  calificacionesPorProducto: { [key: string]: any[] } = {}; 

  obtenerUsuariosYDatos() {
    this.dbService.getAllUsers().subscribe(users => {
      this.usuarios = [];
    
      users.forEach(usuario => {
        const uid = usuario.uid;

        this.dbService.getLocationsByUser(uid).subscribe(locations => {
          
          this.ubicacionesPorUsuario[uid] = locations;

          console.log(this.ubicacionesPorUsuario[uid])
    
        if (!this.productosPorUsuario[uid]) {
          this.dbService.getProductsByUser(uid).subscribe(products => {
            products.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
            this.productosPorUsuario[uid] = products.map((producto: any) => {
      
              this.comentariosdelproducto(producto.id).subscribe(comentarios => {
                this.comentarioPorIdproducto[producto.id] = comentarios || [];
                console.log('Comentarios del producto:', this.comentarioPorIdproducto[producto.id]);
              });
    
              this.dbService.obtenerCalificacionProducto(producto.id).subscribe((calificaciones: any[]) => {
                this.calificacionesPorProducto[producto.id] = calificaciones || [];
    
                if (calificaciones && calificaciones.length > 0) {
                  const totalPuntaje = calificaciones.reduce((total, cal) => total + cal.calificacion, 0);
                  const promedio = totalPuntaje / calificaciones.length;
                  producto.calificacionPromedio = promedio.toFixed(1);  
                  console.log(`Promedio de calificaciones para el producto ${producto.id}: ${producto.calificacionPromedio}`);
                } else {
          
                  producto.calificacionPromedio = 'N/A';
                  console.warn(`No se encontraron calificaciones para el producto ${producto.id}.`);
                }
              });
    
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
                uid_DW: producto.uid_DW,
                categoria: producto.categoria,
                calificacionPromedio: producto.calificacionPromedio,  
              };
            });
    
            if (products && products.length > 0) {
              this.usuarios.push(usuario);
            }
          });
        }
  
        });
      });
    });
  }
  
  
  
  comentariosdelproducto(id_documento: string) {
    return this.dbService.getComentarioProducto(id_documento);  
  }
  getComentariosCount(productId: string): number {
    const comentarios = this.comentarioPorIdproducto[productId];
    return comentarios ? comentarios.length : 0;
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
      this.dbService.mensajeNotification('Producto añadido al carrito con éxito', 'exito');

      console.log('Producto añadido al carrito con éxito');
    }).catch((error) => {
      console.error('Error al añadir producto al carrito:', error);
      this.dbService.mensajeNotification('Error, no se pudo agregar al carrito', 'error');

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

      this.dbService.mensajeNotification('Comentario agregado con éxito', 'exito');
      

      this.comentarioForo = '';
    } else {
      this.dbService.mensajeNotification('Error, no se pudo comentar', 'error');
  
    }
    
 
  }


  irASuscripcion(uidCurso: string, nombreCurso: string, autor: string) {
    this.router.navigate(['/suscripcion', uidCurso, nombreCurso, autor]);
  }




// IMPORTANTE NO ALTERAR NI BORRAR, CODIGO DE 3 DIAS 
  calificacion: any[] = []; 

  obtenerComentariosForo() {
    this.dbService.getAllCommentsForo().subscribe(comentarios => {
      console.log('Comentarios obtenidos:', comentarios); 
      comentarios.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      this.comentariosForo = comentarios;
      comentarios.forEach(comentario => {
        if (comentario.uidCursoForo) { 
          console.log('Procesando comentario con UID:', comentario.uidCursoForo); 
          this.obtenerCalificacionCurso(comentario.uidCursoForo, comentario);
        } else {
          console.warn('Comentario sin UID de curso:', comentario); 
        }
      });
    }, error => {
      console.error('Error al obtener comentarios:', error); 
    });
  }

  obtenerCalificacionCurso(uidCursoForo: string, comentario: any) {
    console.log(`Obteniendo cursos para uidCursoForo: ${uidCursoForo}`); 
    this.dbService.getCurso(uidCursoForo).subscribe((cursos: any[]) => {
      if (cursos && cursos.length > 0) {
        console.log('Cursos obtenidos:', cursos); 
        cursos.forEach(curso => {
          if (curso.uid) { 
            this.dbService.obtenerCalificacion(curso.uid).subscribe((calificaciones: any[]) => {
              if (calificaciones && calificaciones.length > 0) {
                const calificacionesMapeadas = calificaciones.map((calificacion: any) => ({
                  id: calificacion.id,
                  puntaje: calificacion.calificacion,
                }));
                const totalPuntaje = calificacionesMapeadas.reduce((total, cal) => total + cal.puntaje, 0);
                const promedio = calificacionesMapeadas.length > 0 ? totalPuntaje / calificacionesMapeadas.length : 0;
                comentario.calificacionPromedio = promedio.toFixed(1);
                console.log(`Calificación promedio para el curso ${curso.uid}:`, comentario.calificacionPromedio);
              } else {
                console.warn(`No se encontraron calificaciones para el curso ${curso.uid}.`); 
              }
            }, error => {
              console.error(`Error al obtener calificaciones para el curso ${curso.uid}:`, error); 
            });
          } else {
            console.warn('Curso sin UID válido:', curso); 
          }
        });
      } else {
        console.warn(`No se encontraron cursos para uidCursoForo ${uidCursoForo}.`); 
      }
    }, error => {
      console.error(`Error al obtener cursos para uidCursoForo ${uidCursoForo}:`, error); 
    });
  }

  mensajelogo(){
    this.dbService.mensajeNotification('Deja tu huella emprendiendo','exito')
  }
  
  
  
  
  
  
  
  

  async logout() {
    await this.authService.logout();
    this.dbService.mensajeNotification('Sesión cerrada','error')
    console.log('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
