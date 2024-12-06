import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { map } from 'rxjs';
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators';  // Para el operador catchError
import { of } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  NombreUsuarioActual: string ='';
  uidDueñoProducto: string = '';
  productosCarrito: any[] = [];
  idUsuarioActual: string = '';


  ventanadepago: string | null = null;

  mostrarListaProductos = true; 
  productoSeleccionado: any; 

  
  abrirVentanaCompra(producto: any) {
    this.productoSeleccionado = producto;
    this.mostrarListaProductos = false;
  }
  cerrarVentanaCompra() {
    this.mostrarListaProductos = true;
    this.productoSeleccionado = null;
  }

  pago = {
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  };

  constructor(private authService: AuthService, private databaseService: DatabaseService) {}
  ngOnInit() {
    this.verificarUsuarioAutenticado(); 
  }


verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then(data => {
          this.NombreUsuarioActual = data?.nombre || ''; 
          this.idUsuarioActual = user.uid;
          this.obtenerProductosDelCarrito()
          console.log('Nombre desde Firestore:', this.NombreUsuarioActual);

        }).catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
        });
      } else {
        this.idUsuarioActual = ''; 
        this.NombreUsuarioActual = ''; 
      }
    });
  }
  
obtenerProductosDelCarrito() {
    if (this.idUsuarioActual) {
      this.databaseService.getContenidoCarrito(this.idUsuarioActual).subscribe((productos: any) => {
        console.log('Productos recibidos:', productos);
  
      
        this.productosCarrito = productos.map((doc: any) => {
          return {
            ID_DOCUMENTO: doc.ID_DOCUMENTO,
            ID_CARRITO: doc.id,  
            Nombre: doc.Nombre,
            CreadorProducto: doc.CreadorProducto,
            Precio: doc.Precio,
            imageUrl: doc.imageUrl,
            uid_DW: doc.uid_DW, 
            ID_VENTA: doc.ID_VENTA,
            cantidadDeseada: 1,
            stock: null 
          };
        });
        productos.forEach((producto: any, index: number) => {
          this.obtenerStock(producto.ID_VENTA).subscribe((stock: any) => {
            this.productosCarrito[index].stock = stock;
            if (index === productos.length - 1) {
              console.log('Productos con stock actualizado:', this.productosCarrito);
            }
          });
        });
      });
    }
  }

obtenerStock(ID_VENTA: string): Observable<number> {
  return this.databaseService.getStockProduct(ID_VENTA).pipe(
    map((productos: any[]) => {
      
      if (productos.length > 0 && productos[0].stock !== undefined) {
        console.log('Stock recibido:', productos[0].stock); 
        return productos[0].stock; 
      } else {
        console.error('Stock no encontrado para ID_VENTA:', ID_VENTA);
        return 0; 
      }
    }),
    catchError(error => {
      console.error('Error al obtener el stock:', error);
      return of(0);
    })
  );
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

PrepararCompraYventa(ID_CARRITO:string,ID_DOCUMENTO:string,
NombreXproducto: string,
CreadorXProducto: string, 
idCompra: string, 
stockproducto: number,
totalXproducto: number, 
cantidadDeseada: number, 
uid_DW:string,
pago: { numeroTarjeta: string; fechaExpiracion: string; cvv: string }) {
  const cantidadFinal = cantidadDeseada ?? 1;
  const stockProducto =  stockproducto;  
  
  if (!this.comprobarStockProducto(cantidadDeseada,stockProducto)) {
    console.log(`La cantidad deseada excede el stock disponible de ${NombreXproducto}`);


    return;  
  }

  if (!this.NombreUsuarioActual) {
    console.error("El nombre de usuario no está disponible.");
    return;
  }

  const compra = {
    usuarioId: this.idUsuarioActual,
    productoId: idCompra,
    nombre: NombreXproducto,
    creador: CreadorXProducto,
    cantidad: cantidadFinal,
    precioTotal: totalXproducto * cantidadFinal,
    fechaCompra: new Date().toISOString(),
    MetodoDepago: pago,
    Id_documento: ID_DOCUMENTO
  };

  this.databaseService.addHistorialDecompras(this.idUsuarioActual, compra).then(() => {
    console.log(`Compra de ${NombreXproducto} realizada con éxito`);
    const venta = {
      ID_venta: idCompra,
      nombre: NombreXproducto,
      comprador: this.NombreUsuarioActual,
      cantidad: cantidadFinal,
      Total_venta: totalXproducto * cantidadFinal,
    };
      this.actualizarStock(ID_DOCUMENTO,stockproducto,cantidadFinal)
      this.databaseService.addHistorialDeVentas(uid_DW, venta).then(() => {
      console.log(`Venta de ${NombreXproducto} registrada exitosamente`);
    }).catch((error) => {
      console.error(`Error al registrar la venta de ${NombreXproducto}:`, error);
    });

    this.cerrarVentanaCompra();

  }).catch((error) => {
    console.error(`Error al registrar la compra de ${NombreXproducto}:`, error);
  });
}

comprobarStockProducto(cantidadDeseada: number, cantidadXproducto: number): boolean {
  if (cantidadDeseada === null || cantidadDeseada <= 0) {
    console.log('Por favor ingrese una cantidad válida');
    return false;
  }

  if (cantidadDeseada > cantidadXproducto) {
    console.log('La cantidad deseada excede el stock disponible.');
    return false;
  }

  console.log('Cantidad disponible suficiente');
  return true;
}

actualizarStock(ID_DOCUMENTO: string, stock1: number, newstock: number) {
  const stockActualizado = {
    stock: stock1 - newstock
  };
  this.databaseService.updateProduct(ID_DOCUMENTO, stockActualizado);
}




  
  
  
  
  
}



