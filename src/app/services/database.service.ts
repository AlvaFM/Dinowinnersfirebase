import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService  
  ) {}

  //_______________________________________ 
  // Metodos relacionados con Productos 

  addProduct(product: any): Promise<any> {
    return this.firestore.collection('productos').add(product);
  }

  
  getProductsByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('productos', (ref) => ref.where('uid_DW', '==', uid)).valueChanges();
  }

  getProductsByUserForSEND(uid: string, ID_VENTA: string): Observable<any[]> {
    return this.firestore.collection('productos', (ref) => 
      ref.where('uid', '==', uid).where('ID_VENTA', '==', ID_VENTA)
    ).valueChanges();
  }
  // __________________________________________________________
  
  // metodos relacionados con cursos
  addCurso(Curso: any): Promise<any> {
    return this.firestore.collection('Curso').add(Curso);
  }
  getCursosAgregados(userId: string) {
    return this.firestore.collection('Curso', ref => ref.where('uid', '==', userId)).valueChanges();
  }

  
  getCursosSuscritos(userId: string) {
    return this.firestore.collection('suscripciones', ref => ref.where('idUsuarioSub', '==', userId)).valueChanges();
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
  
}

  
  

  






