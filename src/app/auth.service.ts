import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

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

  // Método para registrar un nuevo usuario
  async register(email: string, password: string, nombre: string): Promise<any> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    
    const user = userCredential.user;
    if (user) {
      // Guardar el usuario en Firestore
      await this.firestore.collection('usuarios').doc(user.uid).set({
        email: user.email,
        nombre: nombre,
        uid: user.uid,
        // Agrega más campos si es necesario
      });
    }
    return user; // Puedes devolver el usuario registrado si es necesario
  }
}
