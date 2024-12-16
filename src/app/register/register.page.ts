import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = ''; 
  

  constructor(private authService: AuthService, private router: Router,
    private databaseService: DatabaseService
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      
      this.databaseService.mensajeNotification('Las contraseñas no coinciden','error');
      return;
    }

    this.authService
      .register(this.email, this.password, this.nombre) 
      .then(() => {
        this.databaseService.mensajeNotification('Las contraseñas no coinciden','error');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this.databaseService.mensajeNotification( error,'error'); 
      });
  }
}
