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

  addProduct(product: any): Promise<any> {
    return this.firestore.collection('productos').add(product);
  }

  addContenidoPerfil(uid: string, contenido: any): Promise<any> {
    return this.firestore.collection(`Usuario/${uid}/perfil`).add(contenido);
  }
  
  getContenidoPerfil(uid: string): Observable<any[]> {
    return this.firestore.collection(`Usuario/${uid}/perfil`).valueChanges();
  }
  

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



  addLocation(location: any): Promise<any> {
    return this.firestore.collection('ubicaciones').add(location);
  }
  
  addCommentForo(CommentForo: any): Promise<any> {
    return this.firestore.collection('Foro').add(CommentForo);
  }
  getAllCommentsForo(): Observable<any[]> {
    return this.firestore.collection('Foro').valueChanges();
  }

  getProductsByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('productos', (ref) => ref.where('uid', '==', uid)).valueChanges();
  }

  getLocationsByUser(uid: string): Observable<any[]> {
    return this.firestore.collection('ubicaciones', (ref) => ref.where('uid', '==', uid)).valueChanges();
  }


  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('usuarios').valueChanges();
  }
  
}
