import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string='';
  password: string='';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log('Login exitoso');
      this.router.navigate(['/home']);
      this.email ='';
      this.password = ''; 
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  }
} 