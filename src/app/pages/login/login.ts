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

  mensaje = '';
  mostrarModal = false;

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

  abrirModal(texto: string){

    this.mensaje = texto;

    this.mostrarModal = true;

  }

  async login() {

    if(!this.email || !this.password){

      this.abrirModal('Completa todos los campos');

      return;

    }

    const { data, error } =
      await this.authService.supabase.auth.signInWithPassword({

        email: this.email,
        password: this.password

      });

    if(error){

      this.abrirModal('Email o contraseña incorrectos');

      return;

    }

    this.abrirModal('Login exitoso');

    setTimeout(() => {

      this.router.navigateByUrl('/');

    }, 1000);

  }

  accesoRapido(usuario: any) {

    this.email = usuario.email;

    this.password = usuario.password;

  }

}