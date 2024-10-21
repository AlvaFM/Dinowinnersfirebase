import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: any;  // Almacena la información del usuario
  productName: string = '';  // Almacena el nombre del producto, inicializado como cadena vacía
  productDescription: string = '';  // Almacena la descripción del producto, inicializado como cadena vacía
  productPrice: number | null = null;  // Almacena el precio del producto, puede ser un número o null
  city: string = '';  // Almacena la ciudad para la ubicación, inicializado como cadena vacía
  address: string = '';  // Almacena la dirección para la ubicación, inicializado como cadena vacía

  products: any[] = [];  // Arreglo para almacenar los productos del usuario
  locations: any[] = [];  // Arreglo para almacenar las ubicaciones del usuario

  constructor(private authService: AuthService, private databaseService: DatabaseService,private router: Router) {}

  async ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;  
      if (user) {
        this.getProducts();
        this.getLocations();
      }
    });
  }

  async addProduct() {
    const product = {
      nombre: this.productName,
      descripcion: this.productDescription,
      precio: this.productPrice,
      uid: this.user.uid 
    };

    try {
      await this.databaseService.addProduct(product);
      console.log('Producto agregado con éxito');
      this.productName = '';
      this.productDescription = '';
      this.productPrice = null;
      this.getProducts();
    } catch (error) {
      console.error('Error al agregar producto: ', error);
    }
  }

  
  async addLocation() {
    const location = {
      ciudad: this.city,
      direccion: this.address,
      uid: this.user.uid 
    };

    try {
      await this.databaseService.addLocation(location);
      console.log('Ubicación agregada con éxito');
      this.city = '';
      this.address = '';
      
      this.getLocations();
    } catch (error) {
      console.error('Error al agregar ubicación: ', error);
    }
  }

  
  getProducts() {
    this.databaseService.getProductsByUser(this.user.uid).subscribe(products => {
      this.products = products;
    });
  }

  
  getLocations() {
    this.databaseService.getLocationsByUser(this.user.uid).subscribe(locations => {
      this.locations = locations;
    });
  }

  
  async logout() {
    await this.authService.logout();
    console.log('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
