import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntadosApiService, Pregunta } from '../../services/preguntados-api.service';
import { PreguntadosPartidasService } from '../../services/preguntados-partidas.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit, OnDestroy {

  private api = inject(PreguntadosApiService);
  private partidasService = inject(PreguntadosPartidasService);

  preguntas: Pregunta[] = [];
  indice = 0;
  puntaje = 0;
  total = 0;
  empezado = false;
  terminado = false;
  loading = false;

  categoria = '';
  dificultad = '';
  preguntaActual: Pregunta | null = null;

  private inicio = 0;
  tiempoSeg = 0;
  private timeoutId: any;

  ngOnInit() {}

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  empezar() {
    this.empezado = true;
    this.loading = true;
    this.preguntas = this.api.generarPreguntas();
    this.total = this.preguntas.length;
    this.indice = 0;
    this.puntaje = 0;
    this.terminado = false;
    this.inicio = Date.now();
    this.mostrarPregunta();
    this.loading = false;
  }

  mostrarPregunta() {
    if (this.indice >= this.preguntas.length) {
      this.terminar();
      return;
    }
    this.preguntaActual = this.preguntas[this.indice];
    this.categoria = this.preguntaActual.categoria;
    this.dificultad = this.preguntaActual.dificultad;
  }

  responder(opcion: string) {
    if (!this.preguntaActual || this.loading) return;
    if (opcion === this.preguntaActual.correcta) {
      this.puntaje++;
    }
    this.indice++;
    this.mostrarPregunta();
  }

  terminar() {
    this.terminado = true;
    this.preguntaActual = null;
    this.tiempoSeg = Math.floor((Date.now() - this.inicio) / 1000);
    this.partidasService.guardar({
      total: this.total,
      aciertos: this.puntaje,
      tiempoSeg: this.tiempoSeg
    });
  }
}
