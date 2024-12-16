import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';



@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private alertController:AlertController 
  ) {}

  //_______________________________________ 
  // Metodos relacionados con Productos 

addProduct(product: any): Promise<any> {
    return this.firestore.collection('productos').add(product);
}
addComentarioProducto(id: string, contenido: any): Promise<any> {
  return this.firestore.collection(`productos/${id}/Comentarios`).add(contenido);
}

getComentarioProducto(id: string): Observable<any[]> {
  return this.firestore.collection(`productos/${id}/Comentarios`).snapshotChanges().pipe(
    map(actions =>
      actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;

        return { id, ...data|| [] };  
      })
    )
  );
}

  updateProduct(productId: string, newData: any): Observable<any> {
    return from(this.firestore.collection('productos').doc(productId).update(newData));
}

getStockProduct(ID_VENTA: string): Observable<any[]> {
  return this.firestore.collection('productos', ref => ref.where('ID_VENTA', '==', ID_VENTA))
  .snapshotChanges().pipe(
    map(actions =>
      actions.map(a => {
        const data = a.payload.doc.data();  
        const id = a.payload.doc.id;       

        return { id, ...data || {} };  

      })
    )
  );
}

  getProductsByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('productos', ref => ref.where('uid_DW', '==', uid))
    .snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;       

          return { id, ...data || {} };  

        })
      )
    );
    
  }
  CalificacionProducto(ID: string, Calificacion: any): Promise<any> {
    return this.firestore.collection(`productos/${ID}/Calificacion`).add(Calificacion);
  }

  obtenerCalificacionProducto(ID: string): Observable<any[]> {
    return this.firestore.collection(`productos/${ID}/Calificacion`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data || {} }; 
        }))
     );
  }

  // ________________________________________________________
  // Carrito

addContenidoCarrito(uid: string, contenido: any): Promise<any> {
    return this.firestore.collection(`usuarios/${uid}/carrito`).add(contenido);
  }
  eliminarProductoDelCarrito(uid: string, ID_CARRITO: string): Promise<void> {
    return this.firestore.collection(`usuarios/${uid}/carrito`).doc(ID_CARRITO).delete();
  }

  getContenidoCarrito(uid: string): Observable<any[]> {
    return this.firestore.collection(`usuarios/${uid}/carrito`).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;       

          return { id, ...data || {} };  

        })
      )
    );
  }

  extraerONEPRODUCTCarrito(uid: string, idVenta: string): Observable<any[]> {
    return this.firestore.collection(`usuarios/${uid}/carrito`, ref =>
      ref.where("ID_VENTA", "==", idVenta)  
    ).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;       
  
          return { id, ...data || {} };  
        })
      )
    );
  }
  
  
  
  

addHistorialDecompras(uid: string, contenido: any): Promise<any> {
    return this.firestore.collection(`usuarios/${uid}/HistorialDecompras`).add(contenido);
  }

  // __________________________________________________________
  
  // metodos relacionados con cursos
  addCurso(curso: any): Promise<any> {
    return this.firestore.collection('Curso').add(curso);
  }
  
  
 
  getCursosSuscritos(userId: string) {
    return this.firestore.collection('suscripciones', ref => ref.where('idUsuarioSub', '==', userId)).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;
          
          console.log('Datos del curso:', data); 
          return { id, ...data || {} };
        })
      )
    );
  }
  

  getCurso(idsub: string) {
    return this.firestore.collection('Curso', ref => ref.where('uid', '==', idsub))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data|| {} };
        }))
      );
  }
  
  getCursoByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('Curso', (ref) => ref.where('uid', '==', uid)).valueChanges();

  }
  addsubscription(subscription: any): Promise<any> {
    return this.firestore.collection('suscripciones').add(subscription);
  }

  CalificacionCurso(ID: string, Calificacion: any): Promise<any> {
    return this.firestore.collection(`Curso/${ID}/Calificacion`).add(Calificacion);
  }

  obtenerCalificacion(ID: string): Observable<any[]> {
    return this.firestore.collection(`Curso/${ID}/Calificacion`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data || {} }; 
        }))
     );
  }
  
  

  // ___________________________________________________________
  // Metodos relacionados con lacalidades  
  addLocation(location: any): Promise<any> {
    return this.firestore.collection('ubicaciones').add(location);
  }
  getLocationsByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('ubicaciones', (ref) => ref.where('uid', '==', uid)).valueChanges();
  }
  // ____________________________________________________________
  
  // Metodos relacionados con el foro

  addCommentForo(CommentForo: any): Promise<any> {
    return this.firestore.collection('Foro').add(CommentForo);
  }
  getAllCommentsForo(): Observable<any[]> {
    return this.firestore.collection('Foro').valueChanges();
  }
  // ____________________________________________________________

  // Metodos relacionados con Usuario y contenidos 
  
  addContenidoPerfil(uid: string, contenido: any): Promise<any> {
    return this.firestore.collection(`usuarios/${uid}/perfil`).add(contenido);
  }
  getContenidoPerfil(uid: string): Observable<any[]> {
    return this.firestore.collection(`usuarios/${uid}/perfil`).valueChanges();
  }
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges();
  }
  getOneUser(uid: string): Observable<any[]> {
    return this.firestore.collection('usuarios', (ref) => ref.where('uid', '==', uid)).valueChanges();
  }

  addHistorialDeVentas(uid: string, contenido: any): Promise<any> {
    return this.firestore.collection(`usuarios/${uid}/HistorialDeVentas`).add(contenido);
  }


  getHistoriaDecompras(uid: string): Observable<any[]> {

    return this.firestore.collection(`usuarios/${uid}/HistorialDecompras`).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;       

          return { id, ...data || {} };  

        })
      )
    );
  }

  getHistorialVentas(uid: string): Observable<any[]> {

    return this.firestore.collection(`usuarios/${uid}/HistorialDeVentas`).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;       

          return { id, ...data || {} };  

        })
      )
    );
  }

  //Métodos de las categorías

  async initializeDefaultCategories(): Promise<void> {
    const defaultCategories = [
      { nombre: 'Electrónica', descripcion: 'Productos tecnológicos' },
      { nombre: 'Ropa', descripcion: 'Prendas de vestir y accesorios' },
      { nombre: 'Hogar', descripcion: 'Artículos para el hogar y cocina' },
      { nombre: 'Libros', descripcion: 'Libros y material educativo' },
      { nombre: 'Manualidades', descripcion: 'Objetos artesanales' },
      { nombre: 'Infantil', descripcion: 'Juguetes y objetos infantiles' },
      { nombre: 'Deportes', descripcion: 'Productos para actividades deportivas' },  
      { nombre: 'Salud', descripcion: 'Productos para el bienestar y la salud' },    
      { nombre: 'Jardinería', descripcion: 'Herramientas y productos para jardinería' } 
    ];
  
    try {
      const existingCategories = await this.firestore.collection('categorias').get().toPromise();
  
      if (existingCategories?.empty) {
        const batch = this.firestore.firestore.batch();
  
        defaultCategories.forEach((category) => {
          const docRef = this.firestore.collection('categorias').doc().ref;
          batch.set(docRef, category);
        });
  
        await batch.commit();
        console.log('Categorías predeterminadas inicializadas');
      }
    } catch (error) {
      console.error('Error al inicializar categorías predeterminadas:', error);
      throw error;
    }
  }  
  getAllCategories(): Promise<any[]> {
    return this.firestore.collection('categorias').get().toPromise().then((snapshot) => {
      if (!snapshot || snapshot.empty) {
        return []; 
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data && typeof data === 'object') {
          return { id: doc.id, ...data }; 
        }
        return { id: doc.id }; 
      });
    }).catch(error => {
      console.error('Error al obtener las categorías:', error);
      return []; 
    });
  }  


  // notificaciones generales exito o error

  async mensajeNotification(mensaje: string, suceso: 'exito' | 'error') {
    if (suceso === 'exito') {

      const toast = await this.toastController.create({
        message: mensaje,
        duration: 4000,
        position: 'top',
        color: 'warning', 
      });
      toast.present();
    } else if (suceso === 'error') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: mensaje,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}


  

