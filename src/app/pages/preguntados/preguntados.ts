import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of, retry, finalize } from 'rxjs';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {

  pregunta: any = null;
  opciones: string[] = [];
  puntaje = 0;
  loading = false;
  gameOver = false;

  // Control del Modal
  modalVisible = false;
  modalMensaje = '';
  modalSubtitulo = '';
  modalTipo: 'correcto' | 'incorrecto' | '' = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerPregunta();
  }

  decodeHtml(html: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  obtenerPregunta() {
    if (this.loading) return;
    this.loading = true;

    this.http.get<any>('https://opentdb.com/api.php?amount=1&type=multiple')
      .pipe(
        retry(1),
        catchError(err => {
          console.error('Error API:', err);
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((data) => {
        if (!data?.results?.length) return;

        const res = data.results[0];
        this.pregunta = {
          ...res,
          question: this.decodeHtml(res.question),
          correct_answer: this.decodeHtml(res.correct_answer),
          incorrect_answers: res.incorrect_answers.map((a: string) => this.decodeHtml(a))
        };

        this.opciones = [
          ...this.pregunta.incorrect_answers,
          this.pregunta.correct_answer
        ].sort(() => Math.random() - 0.5);
      });
  }

  verificarRespuesta(opcion: string) {
    if (!this.pregunta || this.modalVisible || this.loading) return;

    const esCorrecta = opcion === this.pregunta.correct_answer;

    if (esCorrecta) {
      this.puntaje++;
      this.mostrarModal('¡Correcto! 🔥', 'Sumaste un punto', 'correcto');
      
      // Limpiamos la pregunta actual y buscamos la siguiente de fondo
      this.pregunta = null;
      this.obtenerPregunta();
    } else {
      this.gameOver = true;
      this.mostrarModal('Incorrecto 💀', `Era: ${this.pregunta.correct_answer}`, 'incorrecto');
      
      // Guardamos el puntaje alcanzado antes de resetear
      this.guardarResultado(this.puntaje);
    }
  }

  mostrarModal(titulo: string, sub: string, tipo: 'correcto' | 'incorrecto') {
    this.modalMensaje = titulo;
    this.modalSubtitulo = sub;
    this.modalTipo = tipo;
    this.modalVisible = true;

    setTimeout(() => {
      this.modalVisible = false;
    }, 1200); // Un poco más de tiempo para que no sea tan brusco
  }

  async guardarResultado(puntajeFinal: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('resultados')
        .insert([{
          usuario: user.email,
          juego: 'preguntados',
          puntaje: puntajeFinal,
          fecha: new Date()
        }]);

      if (error) console.error('Error Supabase:', error.message);
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.gameOver = false;
    this.pregunta = null;
    this.obtenerPregunta();
  }
}