import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css'
})
export class Encuesta {
  authService = inject(Auth);
  nombre = '';
  apellido = '';
  edad: number | null = null;
  telefono = '';
  juegoFavorito = '';
  recomendaria: string | null = null;
  mejoras: string[] = [];
  comentario = '';

  errorMsg = '';
  successMsg = '';
  saving = false;

  opcionesJuego = ['Snake', 'Mayor o Menor', 'Ahorcado', 'Preguntados'];
  opcionesMejora = ['Más juegos', 'Modo multijugador', 'Mejor diseño', 'Sonidos', 'Leaderboard global'];

  constructor(private router: Router) {}

  validar(): boolean {
    this.errorMsg = '';

    if (!this.nombre?.trim() || !this.apellido?.trim()) { this.errorMsg = 'Nombre y apellido son requeridos'; return false; }
    if (this.nombre.trim().length < 2) { this.errorMsg = 'Nombre debe tener al menos 2 caracteres'; return false; }
    if (this.apellido.trim().length < 2) { this.errorMsg = 'Apellido debe tener al menos 2 caracteres'; return false; }

    if (this.edad === null || this.edad === undefined) { this.errorMsg = 'Edad es requerida'; return false; }
    if (this.edad < 18 || this.edad > 99) { this.errorMsg = 'Edad debe ser entre 18 y 99 años'; return false; }

    if (!this.telefono?.trim()) { this.errorMsg = 'Teléfono es requerido'; return false; }
    if (!/^\d+$/.test(this.telefono.trim())) { this.errorMsg = 'Teléfono debe contener solo números'; return false; }
    if (this.telefono.trim().length < 7) { this.errorMsg = 'Teléfono debe tener al menos 7 dígitos'; return false; }
    if (this.telefono.trim().length > 10) { this.errorMsg = 'Teléfono no puede tener más de 10 dígitos'; return false; }

    if (!this.juegoFavorito) { this.errorMsg = 'Seleccioná tu juego favorito'; return false; }
    if (!this.recomendaria) { this.errorMsg = 'Decinos si recomendarías la sala'; return false; }
    if (this.mejoras.length === 0) { this.errorMsg = 'Seleccioná al menos una mejora'; return false; }
    if (!this.comentario?.trim()) { this.errorMsg = 'El comentario es requerido'; return false; }

    return true;
  }

  toggleMejora(opcion: string) {
    const idx = this.mejoras.indexOf(opcion);
    if (idx >= 0) this.mejoras.splice(idx, 1);
    else this.mejoras.push(opcion);
  }

  async guardar() {
    if (!this.validar()) return;
    if (this.saving) return;
    this.saving = true;
    this.errorMsg = '';

    try {
      const { data: { user } } = await this.authService.supabase.auth.getUser();
      if (!user) { this.errorMsg = 'Debés iniciar sesión'; this.saving = false; return; }

      const { error } = await this.authService.supabase.from('encuestas').insert([{
        usuario: user.email,
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        edad: this.edad,
        telefono: this.telefono.trim(),
        juego_favorito: this.juegoFavorito,
        recomendaria: this.recomendaria,
        mejoras: this.mejoras,
        comentario: this.comentario.trim()
      }]);

      if (error) throw error;

      this.successMsg = '¡Encuesta guardada correctamente!';
      setTimeout(() => this.router.navigateByUrl('/'), 1500);
    } catch (err: any) {
      this.errorMsg = err.message || 'Error al guardar la encuesta';
    } finally {
      this.saving = false;
    }
  }
}
