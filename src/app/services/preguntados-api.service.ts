import { Injectable } from '@angular/core';
import { PAISES, Pais } from '../data/preguntados-geografia';

export interface Pregunta {
  enunciado: string;
  correcta: string;
  opciones: string[];
  categoria: string;
  dificultad: string;
  pais: Pais;
}

export interface Partida {
  total: number;
  aciertos: number;
  tiempoSeg: number;
}

@Injectable({ providedIn: 'root' })
export class PreguntadosApiService {

  private readonly CANTIDAD = 10;

  generarPreguntas(): Pregunta[] {
    const copia = [...PAISES];
    this.mezclar(copia);
    const seleccionados = copia.slice(0, this.CANTIDAD);

    return seleccionados.map((pais, i) => {
      const tipo = i % 2 === 0 ? 'capital' : 'pais';
      const distractores = this.obtenerDistractores(pais, 3);

      let enunciado: string;
      let correcta: string;
      let opciones: string[];

      if (tipo === 'capital') {
        enunciado = `¿Cuál es la capital de ${pais.nombre}?`;
        correcta = pais.capital;
        opciones = [pais.capital, ...distractores.map(d => d.capital)];
      } else {
        enunciado = `${pais.capital} es la capital de qué país?`;
        correcta = pais.nombre;
        opciones = [pais.nombre, ...distractores.map(d => d.nombre)];
      }

      this.mezclar(opciones);

      return {
        enunciado,
        correcta,
        opciones,
        categoria: 'Geografía',
        dificultad: pais.dificultad,
        pais
      };
    });
  }

  private obtenerDistractores(pais: Pais, cantidad: number): Pais[] {
    const otros = PAISES.filter(p => p.nombre !== pais.nombre);
    this.mezclar(otros);
    return otros.slice(0, cantidad);
  }

  private mezclar(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}
