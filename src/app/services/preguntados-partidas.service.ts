import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({ providedIn: 'root' })
export class PreguntadosPartidasService {

  async guardar(partida: { total: number; aciertos: number; tiempoSeg: number }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('resultados').insert([{
        usuario: user.email,
        juego: 'preguntados',
        puntaje: partida.aciertos
      }]);
      if (error) console.error('Error Supabase:', error.message);
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  }
}
