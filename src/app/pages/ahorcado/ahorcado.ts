import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit {

  palabras: string[] = [
    'gato', 'perro', 'sol', 'luna', 'casa',
    'auto', 'agua', 'fuego', 'aire', 'tierra',
    'mesa', 'silla', 'pan', 'luz', 'mar'
  ];

  palabra: string = '';
  letrasUsadas: string[] = [];

  abecedario: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  errores: number = 0;
  maxErrores: number = 6;

  puntaje: number = 0;
  nivel: number = 1;

  tiempoInicio: number = 0;

  mostrarModal: boolean = false;
  mensajeModal: string = '';

  private bloqueado = false;

  ngOnInit(): void {
    this.tiempoInicio = Date.now();
    this.nuevaPalabra();
  }

  nuevaPalabra() {
    this.palabra =
      this.palabras[
        Math.floor(Math.random() * this.palabras.length)
      ].toUpperCase();

    this.letrasUsadas = [];
    this.errores = 0;
    this.bloqueado = false;
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

  verificarEstado() {

    const gano = this.palabra
      .split('')
      .every(l => this.letrasUsadas.includes(l));

    if (gano && !this.bloqueado) {

      this.bloqueado = true;

      this.puntaje++;
      this.nivel++;

      this.mensajeModal = `🎉 ¡Correcto! Pasaste al nivel ${this.nivel}`;
      this.mostrarModal = true;

      this.guardarResultado();
      return;
    }

    if (this.errores >= this.maxErrores) {

      this.bloqueado = true;

      this.mensajeModal = `💀 Perdiste en nivel ${this.nivel}`;
      this.mostrarModal = true;

      this.guardarResultado();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevaPalabra();
  }

  async guardarResultado() {

    const tiempoFinal =
      Math.floor((Date.now() - this.tiempoInicio) / 1000);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      console.log("Usuario no logueado");
      return;
    }

    const { error } = await supabase
      .from('resultados')
      .insert([
        {
          usuario: user.email,
          juego: 'ahorcado',
          puntaje: this.puntaje,
        
        }
      ]);

    if (error) {
      console.error('Error Supabase:', error.message);
    }
  }
}