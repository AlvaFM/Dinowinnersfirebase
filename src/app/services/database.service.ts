import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: AngularFirestore, 
  ) {}

  //_______________________________________ 
  // Metodos relacionados con Productos 

  addProduct(product: any): Promise<any> {
    return this.firestore.collection('productos').add(product);
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



  
}

  
  

  






