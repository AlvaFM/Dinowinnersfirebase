import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore,
    private databaseService : DatabaseService
  ) {}

  // Método para iniciar sesión
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  logout(): Promise<any> {
    
    return this.afAuth.signOut();
    
  }

  // Método para obtener el estado del usuario autenticado
  getUser(): Observable<any> {
    return this.afAuth.authState;
  }

  // Metodo para registrar un nuevo usuario
  async register(email: string, password: string, nombre: string): Promise<any> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    
    const user = userCredential.user;
    if (user) {
      
      await this.firestore.collection('usuarios').doc(user.uid).set({
        email: user.email,
        nombre: nombre,
        uid: user.uid,
        
      });
    }
    return user; 
  }

  async getUserData(uid: string): Promise<any> {
    const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
    return userDoc?.exists? userDoc.data() : null;
  }
}
