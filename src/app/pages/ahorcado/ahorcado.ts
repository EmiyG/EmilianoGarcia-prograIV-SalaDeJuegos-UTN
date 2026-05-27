import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit {

  palabras: string[] = [
    'gato',
    'perro',
    'sol',
    'luna',
    'casa',
    'auto',
    'agua',
    'fuego',
    'aire',
    'tierra',
    'mesa',
    'silla',
    'pan',
    'luz',
    'mar'
  ];

  palabra = '';

  letrasUsadas: string[] = [];

  abecedario: string[] = [
    'A','B','C','D','E','F','G',
    'H','I','J','K','L','M',
    'N','O','P','Q','R','S',
    'T','U','V','W','X','Y','Z'
  ];

  errores = 0;

  maxErrores = 6;

  puntaje = 0;

  // ✅ MODAL
  mostrarModal = false;

  mensajeModal = '';

  ngOnInit(): void {
    this.nuevaPalabra();
  }

  nuevaPalabra() {

    this.palabra =
      this.palabras[
        Math.floor(Math.random() * this.palabras.length)
      ].toUpperCase();

    this.letrasUsadas = [];

    this.errores = 0;
  }

  seleccionarLetra(letra: string) {

    if (this.letrasUsadas.includes(letra)) return;

    if (this.mostrarModal) return;

    this.letrasUsadas.push(letra);

    if (!this.palabra.includes(letra)) {
      this.errores++;
    }

    this.verificarEstado();
  }

  mostrarPalabra(): string {

    let resultado = '';

    for (let letra of this.palabra) {

      resultado += this.letrasUsadas.includes(letra)
        ? letra + ' '
        : '_ ';
    }

    return resultado;
  }

  async verificarEstado() {

    const gano = this.palabra
      .split('')
      .every(letra =>
        this.letrasUsadas.includes(letra)
      );

    if (gano) {

      this.puntaje++;

      this.mensajeModal =
        ` ¡Ganaste! Puntaje: ${this.puntaje}`;

      this.mostrarModal = true;

      await this.guardarResultado();

      return;
    }

    if (this.errores >= this.maxErrores) {

      this.mensajeModal =
        ` Perdiste. La palabra era: ${this.palabra}`;

      this.mostrarModal = true;

      await this.guardarResultado();

      this.puntaje = 0;
    }
  }

  cerrarModal() {

    this.mostrarModal = false;

    this.nuevaPalabra();
  }

  async guardarResultado() {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('resultados')
      .insert([
        {
          usuario: user.email,
          juego: 'ahorcado',
          puntaje: this.puntaje
        }
      ]);

    if (error) {
      console.error(error.message);
    }
  }
}