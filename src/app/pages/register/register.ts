import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  authService = inject(Auth);
  router = inject(Router);

  nombre = '';
  apellido = '';
  edad = 0;
  email = '';
  password = '';

  mensaje = '';
  mostrarModal = false;

  abrirModal(texto: string) {

    this.mensaje = texto;

    this.mostrarModal = true;

  }

  async registrarse() {

    if (
      !this.nombre ||
      !this.apellido ||
      !this.edad ||
      !this.email ||
      !this.password
    ) {

      this.abrirModal('Completa todos los campos');

      return;

    }

    if (this.nombre.length < 3) {

      this.abrirModal(
        'El nombre debe tener más de 2 caracteres'
      );

      return;

    }

    if (this.apellido.length < 3) {

      this.abrirModal(
        'El apellido debe tener más de 2 caracteres'
      );

      return;

    }

    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(this.nombre)) {

      this.abrirModal(
        'El nombre no puede contener números'
      );

      return;

    }

    if (!regex.test(this.apellido)) {

      this.abrirModal(
        'El apellido no puede contener números'
      );

      return;

    }

    if (this.edad < 18) {

      this.abrirModal(
        'Debes ser mayor de 18 años'
      );

      return;

    }

    if (!this.email.includes('@')) {

      this.abrirModal(
        'El email debe contener @'
      );

      return;

    }

    if (this.email.length < 8) {

      this.abrirModal(
        'El email debe tener al menos 8 caracteres'
      );

      return;

    }

    if (this.password.length < 6) {

      this.abrirModal(
        'La contraseña debe tener mínimo 6 caracteres'
      );

      return;

    }

    const { data, error } =
      await this.authService.supabase.auth.signUp({

        email: this.email,
        password: this.password

      });

    if (error) {

      this.abrirModal(
        'Error al registrarse'
      );

      return;

    }

    await this.authService.supabase
      .from('usuarios')
      .insert({

        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        email: this.email

      });

    this.abrirModal('Usuario registrado correctamente');

    setTimeout(() => {

      this.router.navigateByUrl('/');

    }, 1500);

  }

}