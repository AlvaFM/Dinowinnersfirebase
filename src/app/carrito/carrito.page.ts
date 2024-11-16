import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  uidDueñoProducto: string = '';
  productosCarrito: any[] = [];
  idUsuarioActual: string = '';

  constructor(private authService: AuthService, private databaseService: DatabaseService) {}

  ngOnInit() {
    
    this.verificarUsuarioAutenticado();
    
  }

  verificarUsuarioAutenticado() {
   
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.idUsuarioActual = user.uid; 
        this.obtenerProductosDelCarrito();
         
      } else {
        this.idUsuarioActual = ''; 
        this.productosCarrito = [];  
      }
    });
  }

  obtenerProductosDelCarrito() {
    if (this.idUsuarioActual) {
      this.databaseService.getContenidoCarrito(this.idUsuarioActual).subscribe((productos: any) => {
        console.log('Productos recibidos:', productos);
  
        this.productosCarrito = productos.map((doc: any) => {
          console.log('Producto mapeado:', doc);  
          return {
            ID_CARRITO: doc.id,  
            Nombre: doc.Nombre,
            CreadorProducto: doc.CreadorProducto,
            Precio: doc.Precio,
            imageUrl: doc.imageUrl
          };
        });
  
        console.log('Productos del carrito:', this.productosCarrito);
      });
    }
  }
  
  
  
  
  
  eliminarProducto(ID_CARRITO: string) {
    if (this.idUsuarioActual) {
      console.log('Producto a eliminar:', ID_CARRITO);
      this.databaseService.eliminarProductoDelCarrito(this.idUsuarioActual, ID_CARRITO)
        .then(() => {
          console.log('Producto eliminado con éxito');
          this.productosCarrito = this.productosCarrito.filter(producto => producto.id !== ID_CARRITO);
          console.log('Productos en el carrito después de eliminar:', this.productosCarrito);
        })
        .catch((error) => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }
  
  
  
  
  
}
