import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { UploadService } from '../services/upload.service';
import firebase from 'firebase/compat';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  sobremi: string=''//variable para agregar info de usuario
  perfilList: any[] = []; //contenidoDelperfil
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
  selectedFile: File | null = null; // Para manejar el archivo seleccionado



  selectedTab: string = 'perfil';

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router,private uploadService: UploadService,
    
  ) {}
  

  async ngOnInit() {

    this.verificarUsuarioAutenticado();
    this.authService.getUser().subscribe(user => {
      this.user = user;  
      if (user) {
        this.ContenidoDelPerfil();
        this.getProducts();
        this.getLocations();
        this.obtenerCursosAgregados();
        this.obtenerCursosSuscritos();
      }
    });
  }

  ContenidoDelPerfil() {
    this.databaseService.getContenidoPerfil(this.user.uid).subscribe(perfil => {
      this.perfilList = perfil;
    });
  }
  verificarContenido(nombreContenido: string): boolean {
    return this.perfilList.some(perfil => nombreContenido in perfil);
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


  
  
  

  async agregarCursoYComentar() {
    
    if (!this.CursoNombre || !this.nombreUsuario || !this.DescripcionCurso || this.CuposCurso === null || this.CuposCurso <= 0) {
        console.error('Todos los campos del curso son obligatorios y los cupos deben ser mayores que 0');
        alert('Por favor, completa todos los campos del curso antes de continuar.');
        return;
    }
    
    if (!this.user) {
        console.error('El usuario no está autenticado');
        alert('Debes estar autenticado para agregar un curso.');
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
        alert('Curso agregado a la base de datos.');

        const ComentarioForo = {
            Autor: this.nombreUsuario,  
            Comentario: `
            Curso de capacitación++++++.
            Nombre: ${this.CursoNombre}
            Descripción: ${this.DescripcionCurso}. 
            Cupos disponibles: ${this.CuposCurso}`,
            Tipo: 'CursoCapacitacion',
            NameCursoForo: this.CursoNombre,
            uidCursoForo: this.user.uid,
            
            
            
        };

        
        await this.databaseService.addCommentForo(ComentarioForo);
        alert('Curso publicado en el foro con éxito');
        this.CursoNombre = '';
        this.DescripcionCurso = '';
        this.CuposCurso = null;

    } catch (error) {
        console.error('Error: no se pudo agregar el curso o el comentario al foro', error);
        alert('Error: no se pudo agregar el curso o comentar en el foro');
    }
}


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Archivo seleccionado:', this.selectedFile);  
}

generateUniqueId(): string {
  return 'ID_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}



async addProduct() {
  if (!this.selectedFile) {
    console.error('Por favor, selecciona una imagen para el producto');
    return;
  }

  try {
    
    const imageUrl = await this.uploadService.uploadImage(this.selectedFile, `productos/${this.user.uid}`);

    const ID_VENTA = this.generateUniqueId();


    
    const product = {
      nombre: this.productName,
      descripcion: this.productDescription,
      precio: this.productPrice,
      uid_DW: this.user.uid,
      imageUrl, 
      ID_VENTA:ID_VENTA,


    };

   
    await this.databaseService.addProduct(product);
    console.log('Producto agregado con éxito con imagen');
    
  } catch (error) {
    console.error('Error al agregar producto con imagen: ', error);
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

  async addFotoPerfil() {
    if (!this.selectedFile) {
      console.error('Por favor, selecciona una imagen para el producto');
      return;
    }
  
    try {
      
      const imageUrl = await this.uploadService.uploadImage(this.selectedFile, `perfil/${this.user.uid}`);
  
      
      const contenido = {
        uidUser: this.user.uid,
        fotoPerfil: imageUrl
      };
  
      await this.databaseService.addContenidoPerfil(this.user.uid, contenido);
  
      console.log("Foto de perfil añadida correctamente");
    } catch (error) {
      console.error("Error al añadir la foto de perfil:", error);
    }
  }

  async addinfosobremi() {
    const Identidad = {
      Identidad: this.sobremi
    };
  
    try {
      await this.databaseService.addContenidoPerfil(this.user.uid, Identidad);
      console.log("Información 'Sobre mí' añadida correctamente.");
    } catch (error) {
      console.error("Error al añadir la información 'Sobre mí':", error);
    }
  }
  
  

  
  

  async logout() {
    await this.authService.logout();
    console.log('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
