import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loading: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.loading = true; 
    try {
      await this.authService.login(this.email, this.password);
      console.log('Login exitoso');

      setTimeout(() => {
        this.router.navigate(['/home']);
        this.email = '';
        this.password = '';
        this.loading = false; 
      }, 3000); 

    } catch (error) {
      console.error('Error al iniciar sesión', error);
      this.loading = false; 
    } 
  }
}
