import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  nombreUsuario: string = '';  // Almacena exclusivamente el nombre del usuario 
  user: any;  // Almacena la información del usuario
  productName: string = '';  // Almacena el nombre del producto
  productDescription: string = '';  // Almacena la descripción del producto
  productPrice: number | null = null;  // Almacena el precio del producto
  city: string = '';  // Almacena la ciudad
  address: string = '';  // Almacena la dirección
  products: any[] = [];  // Arreglo para almacenar los productos del usuario
  locations: any[] = [];
  cursosAgregados: any[] = [];  // Cursos que el usuario ha agregado
  cursosSuscritos: any[] = [];  // Cursos a los que el usuario está suscrito
  CursoNombre: string = '';  // Nombre del curso
  DescripcionCurso: string = '';  // Descripción del curso
  CuposCurso: number | null = null;  // Número de cupos disponibles
  Suscritos: string[] = []; // Suscritos al curso
  contenidoCurso: string = ''; // Contenido del curso

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.verificarUsuarioAutenticado();
    this.authService.getUser().subscribe(user => {
      this.user = user;  
      if (user) {
        this.getProducts();
        this.getLocations();
        this.obtenerCursosAgregados();
        this.obtenerCursosSuscritos();
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
    if (!this.CursoNombre || !this.nombreUsuario || !this.DescripcionCurso || this.CuposCurso === null || this.CuposCurso <= 0) {
      console.error('Todos los campos del curso son obligatorios y los cupos deben ser mayores que 0');
      return;
    }
    if (!this.user) {
      console.error('El usuario no está autenticado');
      return;
    }
    const NewCurso = {
      uid: this.user.uid,
      Autor: this.nombreUsuario,
      NombreCurso: this.CursoNombre,
      Descripcion: this.DescripcionCurso,
      ContenidoCurso: this.contenidoCurso,
      Cupos: this.CuposCurso,
      Suscritos: []
    };

    try { 
      await this.databaseService.addCurso(NewCurso);
      console.log('Curso agregado con éxito');
      alert('Curso Agregado a curso')
      this.CursoNombre = '';
      this.DescripcionCurso = '';
      this.CuposCurso = null;
    } catch (error) {
      console.error('Error: no se puede agregar el curso', error);
    }
  }

  async ComentarForo() {
    
    if (!this.CursoNombre || !this.DescripcionCurso || !this.nombreUsuario) {
      console.error('Todos los campos son obligatorios.');
      alert('Por favor, completa todos los campos antes de comentar.');
      return;
  }
    const ComentarioForo = {
      Autor:this.nombreUsuario,  
      Comentario: `
      Curso de capacitación++++++.
      Nombre: ${this.CursoNombre}
      Descripción: ${this.DescripcionCurso}. 
      Cupos disponibles: ${this.CuposCurso}`,
      Tipo: 'CursoCapacitacion',
      NameCursoForo:this.CursoNombre,
      uidCursoForo:this.user.uid
    };

    try {
      await this.databaseService.addCommentForo(ComentarioForo);
      alert('Curso publicado con éxito');
    } catch (error) {
      console.error('Error: no se pudo agregar el comentario al foro', error);
      alert('Error: no se pudo comentar');
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
  obtenerCursosAgregados() {
    this.databaseService.getCursosAgregados(this.user.uid).subscribe(cursos => {
      this.cursosAgregados = cursos;
    });
  }
  
  obtenerCursosSuscritos() {
    this.databaseService.getCursosSuscritos(this.user.uid).subscribe(cursos => {
      this.cursosSuscritos = cursos;
    });
  }
  

  async logout() {
    await this.authService.logout();
    console.log('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
