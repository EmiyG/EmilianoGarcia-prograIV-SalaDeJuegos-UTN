import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authService = inject(Auth);
  router = inject(Router);

  email = '';
  password = '';

  usuariosRapidos = [

  {
    email: 'admin@test.com',
    password: '123456'
  },

  {
    email: 'user1@test.com',
    password: '123456'
  },

  {
    email: 'user2@test.com',
    password: '123456'
  }

];

  async login() {

    const { data, error } =
      await this.authService.supabase.auth.signInWithPassword({

        email: this.email,
        password: this.password

      });

    if(error){

      alert(error.message);
      return;

    }

    alert('Login exitoso');

    this.router.navigateByUrl('/');

  }
  
  accesoRapido() {

  this.email = 'eemilianogarcia1211@gmail.com';
  this.password = '42334013';

}

}