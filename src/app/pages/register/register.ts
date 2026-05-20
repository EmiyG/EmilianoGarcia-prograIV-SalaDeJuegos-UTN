import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

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

  async registrarse() {

    const { data, error } =
      await this.authService.supabase.auth.signUp({

        email: this.email,
        password: this.password

      });

    if(error){

      alert(error.message);
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

    alert('Usuario registrado');
    this.router.navigateByUrl('/');

  }

}