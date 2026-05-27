import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {
  juegos = ['snake', 'mayor-menor', 'ahorcado', 'preguntados'];
  resultados: Record<string, any[]> = {
    snake: [],
    'mayor-menor': [],
    ahorcado: [],
    preguntados: []
  };
  loading = true;
  error = false;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    this.loading = true;
    this.error = false;

    try {
      for (const juego of this.juegos) {
        const { data, error } = await supabase
          .from('resultados')
          .select('usuario, puntaje')
          .eq('juego', juego)
          .order('puntaje', { ascending: false })
          .limit(5);

        if (error) {
          this.error = true;
        } else {
          this.resultados[juego] = data || [];
        }
      }
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  nombreJuego(juego: string): string {
    const nombres: Record<string, string> = {
      snake: 'Snake',
      'mayor-menor': 'Mayor o Menor',
      ahorcado: 'Ahorcado',
      preguntados: 'Preguntados'
    };
    return nombres[juego] || juego;
  }
}
