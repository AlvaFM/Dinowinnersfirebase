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
      this.databaseService.getContenidoCarrito(this.idUsuarioActual).subscribe(productos => {
        this.productosCarrito = productos;
        console.log('Productos del carrito:', this.productosCarrito);
      });
    }
  }

  eliminarProducto(ID_LUGAR_CARRITO: string) {
    if (this.idUsuarioActual) {
      this.databaseService.eliminarProductoDelCarrito(this.idUsuarioActual, ID_LUGAR_CARRITO)
        .then(() => {
          console.log('Producto eliminado con éxito');
    
          this.productosCarrito = this.productosCarrito.filter(producto => producto.ID_LUGAR_CARRITO !== ID_LUGAR_CARRITO);
          console.log('Productos en el carrito después de eliminar:', this.productosCarrito);
        })
        .catch((error) => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }
  
  
  
}
