import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';


@Component({
  selector: 'app-piedra-papel-tijera',
  imports: [CommonModule],
  templateUrl: './piedra-papel-tijera.html',
  styleUrl: './piedra-papel-tijera.css'
})
export class PiedraPapelTijera {

  opciones = ['🪨', '📄', '✂️'];

  jugador = '';

  maquina = '';

  resultado = '';

  puntaje = 0;

  jugando = false;

  async jugar(eleccion: string) {

    this.jugando = true;

    this.jugador = eleccion;

    this.maquina =
      this.opciones[
        Math.floor(Math.random() * this.opciones.length)
      ];

    if(this.jugador === this.maquina){

      this.resultado = 'Empate';

    }

    else if(

      (this.jugador === '🪨' && this.maquina === '✂️') ||

      (this.jugador === '📄' && this.maquina === '🪨') ||

      (this.jugador === '✂️' && this.maquina === '📄')

    ){

      this.resultado = 'Ganaste';

      this.puntaje++;

    }

    else{

      this.resultado = 'Perdiste';

      await this.guardarResultado();

      this.puntaje = 0;

    }

  }

  async guardarResultado() {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase
      .from('resultados')
      .insert([
        {
          usuario: user?.email,
          juego: 'piedra-papel-tijera',
          puntaje: this.puntaje
        }
      ]);

  }

}