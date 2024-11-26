  import { Component } from '@angular/core';
  import { AuthService } from '../services/auth.service';
  import { DatabaseService } from '../services/database.service';
  import { Router } from '@angular/router';
  import { UploadService } from '../services/upload.service';





  @Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
  })
  export class ProfilePage {
    sobremi: string=''//variable para agregar info de usuario
    perfilList: any[] = []; //contenidoDelperfil
    historialCompras: any[] = [];//Historial compras
    historialVentas: any[] = [];//Historial Ventas
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
    cursosSuscritos: any[] = [];
    detallesDelCurso: any[] = []; // Cursos a los que el usuario está suscrito
    CursoNombre: string = '';  // Nombre del curso
    DescripcionCurso: string = '';  // Descripción del curso
    CuposCurso: number | null = null;  // Número de cupos disponibles
    stockProducto: number | null = null; // Número de stocks disponibles
    Suscritos: string[] = []; // Suscritos al curso
    contenidoCurso: string = ''; // Contenido del curso
    selectedFile: File | undefined = undefined;
    selectedFilePPHOTO: File | undefined = undefined;
  



    selectedTab: string = 'productos';

    SAproducto: string = 'desactivado';

    SAubicacion: string = 'desactivado'
    
    SAcurso: string = 'desactivado';

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
          this.getHistorialDecompras();
          this.getHistorialDeventas();
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


    getHistorialDecompras(){
      this.databaseService.getHistoriaDecompras(this.user.uid).subscribe(historial => {
        this.historialCompras = historial;
      });
      }
    
    getHistorialDeventas(){
      this.databaseService.getHistorialVentas(this.user.uid).subscribe(historialV => {
        this.historialVentas = historialV;
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

    //Codigo importante no borrar ni alterar, tiene que ver con curso
Calificar: string = 'desactivado'

calificarCurso(Id: string, numCalificacion: number) {
  const calificacioncurso = {
    calificacion: isNaN(numCalificacion) ? null : numCalificacion
  };

  this.databaseService.CalificacionCurso(Id, calificacioncurso);
  console.log('Calificación enviada:', calificacioncurso); 
  this.Calificar = 'desactivado';
}
contenidocurso:string = 'desactivado';
cursoSeleccionado: any = null;
verContenidoCurso(curso: any) {
  this.cursoSeleccionado = curso;
  this.contenidocurso = 'activado';
}
cerrarContenido() {
  this.cursoSeleccionado = null;
  this.contenidocurso = 'desactivado';
}
    obtenerCursosSuscritos() {
      this.cursosSuscritos = [];
      this.databaseService.getCursosSuscritos(this.user.uid).subscribe((cursos: any[]) => {
        cursos.forEach(curso => {
          this.databaseService.getCurso(curso.cursoIdSub).subscribe((detallesCurso: any[]) => {
            const detallesMapeados = detallesCurso.map((detalle: any) => ({
              id: detalle.id,
              autor: detalle.Autor,  
              contenido: detalle.ContenidoCurso,  
              cupos: detalle.Cupos,  
              descripcion: detalle.Descripcion,  
              nombre: detalle.NombreCurso,  
              suscritos: detalle.Suscritos,  
              uid: detalle.uid  
            }));
            this.cursosSuscritos.push(...detallesMapeados);
          });
        });
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
              CCnombre:this.CursoNombre,
              CCdescripcion:this.DescripcionCurso,
              Cupos: this.CuposCurso,
              Tipo: 'CursoCapacitacion',
              uidCursoForo: this.user.uid,
              fecha: new Date().toISOString()
              
              
              
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


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  onFileSelectedPHOTO(event: any) {
    this.selectedFilePPHOTO = event.target.files[0];
    console.log('Archivo seleccionado:', this.selectedFilePPHOTO);  
  }

  cancelarSeleccionPhoto(fileInput: HTMLInputElement) {
    this.selectedFilePPHOTO = undefined;
    fileInput.value = '';
  }

  cancelarSeleccionFproducto(fileInput: HTMLInputElement) {
    this.selectedFile = undefined;
    fileInput.value = '';
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
        CreadorProducto: this.nombreUsuario,
        nombre: this.productName,
        descripcion: this.productDescription,
        precio: this.productPrice,
        uid_DW: this.user.uid,
        stock: this.stockProducto,
        imageUrl, 
        ID_VENTA:ID_VENTA,
        fecha: new Date().toISOString()
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
        this.products = products.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      });
    }
    

    getLocations() {
      this.databaseService.getLocationsByUser(this.user.uid).subscribe(locations => {
        this.locations = locations;
      });
    }
    obtenerCursosAgregados() {
      this.databaseService.getCursoByUser(this.user.uid).subscribe(cursos => {
        this.cursosAgregados = cursos;
      });
    }



    async addFotoPerfil() {
      if (!this.selectedFilePPHOTO) {
        console.error('Por favor, selecciona una imagen para el producto');
        return;
      }
    
      try {
        
        const imageUrl = await this.uploadService.uploadImage(this.selectedFilePPHOTO, `perfil/${this.user.uid}`);
    
        
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
