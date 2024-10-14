import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = ''; // Agregado para capturar el nombre del usuario
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Método para registrar un nuevo usuario
  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService
      .register(this.email, this.password, this.nombre) // Llama a register con el nombre
      .then(() => {
        // Si el registro es exitoso, redirigir a la página de inicio de sesión o perfil
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this.errorMessage = error.message; // Mostrar error en caso de fallar el registro
      });
  }
}
