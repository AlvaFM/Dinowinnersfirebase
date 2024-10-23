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
  nombreUsuario: string=''//AlmacenaExclisivamenteElnombreDelusuario 
  user: any;  // Almacena la información del usuario
  productName: string = '';  // Almacena el nombre del producto, inicializado como cadena vacía
  productDescription: string = '';  // Almacena la descripción del producto, inicializado como cadena vacía
  productPrice: number | null = null;  // Almacena el precio del producto, puede ser un número o null
  city: string = '';  // Almacena la ciudad para la ubicación, inicializado como cadena vacía
  address: string = '';  // Almacena la dirección para la ubicación, inicializado como cadena vacía
  products: any[] = [];  // Arreglo para almacenar los productos del usuario
  locations: any[] = [];  // Arreglo para almacenar las ubicaciones del usuario
  CursoNombre: string = '';  // Nombre del curso
  DescripcionCurso: string = '';  // Descripción del curso
  CuposCurso: number | null = null;  // Número de cupos disponibles, puede ser null
  Suscritos: string[] = []; //Suscritos al curso
  contenidoCurso: String =''; //Contenido del curso 

  constructor(private authService: AuthService, private databaseService: DatabaseService,private router: Router) {}

  async ngOnInit() {
    this.verificarUsuarioAutenticado()
    this.authService.getUser().subscribe(user => {
      this.user = user;  
      if (user) {
        this.getProducts();
        this.getLocations();
      }
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

  async addCurso() {

    if (!this.CursoNombre || this.nombreUsuario || !this.DescripcionCurso || this.CuposCurso === null || this.CuposCurso <= 0) {
      console.error('Todos los campos del curso son obligatorios y los cupos deben ser mayores que 0');
      return;
    }
    const NewCurso = {
      uid: this.user.uid,
      Dueño: this.nombreUsuario,  
      NombreCurso: this.CursoNombre,  
      Descripcion: this.DescripcionCurso,
      ContenidoCurso: this.contenidoCurso,  
      Cupos: this.CuposCurso,  
      Suscritos: []  
    };

    try{ 
      await this.databaseService.addCurso(NewCurso);
      console.log ('Curso agregado con exito')
      this.CursoNombre = '';
      this.DescripcionCurso = '';
      this.CuposCurso = null;
    }catch(error){
      console.error('Error no se puede agregar el curso') 
    

    }
  }
  async ComentarForo() {
    const ComentarioForo = {
      Usuario: `******El usuario ${this.nombreUsuario}`,  
      Comentario: `ha subido un curso de capacitación. Descripción: 
      ${this.DescripcionCurso}. 
      Cupos disponibles: ${this.CuposCurso}`  
    };
  
    try {
      await this.databaseService.addCommentForo(ComentarioForo);
      alert('Curso publicado con éxito');
    } catch (error) {
      console.error('Error: No se pudo agregar el comentario al foro', error);
      alert('Error: No se pudo comentar');
    }
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


