import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-mayor-menor',
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {

  cartaActual: number = 0;
  puntaje: number = 0;

  palos = ['🪙', '🏆', '⚔️', '🪄'];
  paloActual = '';

  mostrarModal: boolean = false;
  mensajeModal: string = '';

  ngOnInit(): void {
    this.nuevaCarta();
  }

  nuevaCarta() {
    this.cartaActual = Math.floor(Math.random() * 12) + 1;

    this.paloActual =
      this.palos[Math.floor(Math.random() * this.palos.length)];
  }

  mostrarMensaje(msg: string) {
    this.mensajeModal = msg;
    this.mostrarModal = true;

    setTimeout(() => {
      this.mostrarModal = false;
    }, 1500);
  }

  async guardarResultado() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    await supabase.from('resultados').insert([
      {
        usuario: user.email,
        juego: 'mayor-menor',
        puntaje: this.puntaje
      }
    ]);
  }

  async jugar(eleccion: string) {

    const siguiente =
      Math.floor(Math.random() * 12) + 1;

    const nuevoPalo =
      this.palos[Math.floor(Math.random() * this.palos.length)];

    const correcto =
      (eleccion === 'mayor' && siguiente > this.cartaActual) ||
      (eleccion === 'menor' && siguiente < this.cartaActual);

    if (correcto) {

      this.puntaje++;
      this.mostrarMensaje('🎉 ¡Correcto!');

    } else {

      this.mostrarMensaje('💀 ¡Perdiste!');

      await this.guardarResultado();

      this.puntaje = 0;
    }

    this.cartaActual = siguiente;
    this.paloActual = nuevoPalo;
  }
}