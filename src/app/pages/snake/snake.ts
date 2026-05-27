import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

interface Punto {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snake.html',
  styleUrl: './snake.css'
})
export class Snake implements OnInit, OnDestroy {
  gridSize = 20;
  get totalCeldas() { return this.gridSize * this.gridSize; }
  snake: Punto[] = [];
  food: Punto = { x: -1, y: -1 };
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  intervalId: any;
  gameOver = false;
  puntaje = 0;
  mejorPuntaje = 0;
  velocidad = 150;
  enviandoPuntaje = false;
  usuarioEmail = '';

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.reiniciarJuego();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.detenerIntervalo();
  }

  async cargarDatos() {
    try { await this.cargarUsuario(); } catch (err) { console.error('Error cargando usuario:', err); }
    try { await this.cargarMejorPuntaje(); } catch (err) { console.error('Error cargando mejor puntaje:', err); }
    this.cdr.detectChanges();
  }

  async cargarUsuario() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) this.usuarioEmail = user.email ?? '';
  }

  async cargarMejorPuntaje() {
    if (!this.usuarioEmail) return;
    const { data } = await supabase
      .from('resultados')
      .select('puntaje')
      .eq('usuario', this.usuarioEmail)
      .eq('juego', 'snake')
      .order('puntaje', { ascending: false })
      .limit(1);
    if (data?.length) this.mejorPuntaje = data[0].puntaje;
  }

  iniciarJuego() {
    this.detenerIntervalo();
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.actualizar();
          this.cdr.detectChanges();
        });
      }, this.velocidad);
    });
  }

  detenerIntervalo() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  actualizar() {
    if (this.gameOver) return;

    this.direction = this.nextDirection;
    const cabeza = { ...this.snake[0] };

    switch (this.direction) {
      case 'UP': cabeza.y--; break;
      case 'DOWN': cabeza.y++; break;
      case 'LEFT': cabeza.x--; break;
      case 'RIGHT': cabeza.x++; break;
    }

    if (cabeza.x < 0 || cabeza.x >= this.gridSize || cabeza.y < 0 || cabeza.y >= this.gridSize) {
      this.finalizarJuego();
      return;
    }

    if (this.snake.slice(0, -1).some(p => p.x === cabeza.x && p.y === cabeza.y)) {
      this.finalizarJuego();
      return;
    }

    this.snake.unshift(cabeza);

    if (cabeza.x === this.food.x && cabeza.y === this.food.y) {
      this.puntaje += 10;
      this.generarComida();
      if (this.velocidad > 60) {
        this.velocidad -= 1;
        this.iniciarJuego();
      }
    } else {
      this.snake.pop();
    }
  }

  generarComida() {
    let pos: Punto;
    let intentos = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
      intentos++;
      if (intentos > this.gridSize * this.gridSize) return;
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  }

  @HostListener('window:keydown', ['$event'])
  manejarTeclas(event: KeyboardEvent) {
    const key = event.key;
    const current = this.nextDirection;
    if (key === 'ArrowUp' && current !== 'DOWN') { event.preventDefault(); this.nextDirection = 'UP'; }
    if (key === 'ArrowDown' && current !== 'UP') { event.preventDefault(); this.nextDirection = 'DOWN'; }
    if (key === 'ArrowLeft' && current !== 'RIGHT') { event.preventDefault(); this.nextDirection = 'LEFT'; }
    if (key === 'ArrowRight' && current !== 'LEFT') { event.preventDefault(); this.nextDirection = 'RIGHT'; }
    if (key === ' ' && this.gameOver) { event.preventDefault(); this.reiniciarJuego(); }
  }

  async finalizarJuego() {
    this.gameOver = true;
    this.detenerIntervalo();
    if (this.puntaje > this.mejorPuntaje) this.mejorPuntaje = this.puntaje;
    await this.guardarResultado();
    this.cdr.detectChanges();
  }

  reiniciarJuego() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.puntaje = 0;
    this.velocidad = 150;
    this.gameOver = false;
    this.generarComida();
    this.iniciarJuego();
    this.cdr.detectChanges();
  }

  esSnake(index: number): boolean {
    const x = index % this.gridSize;
    const y = Math.floor(index / this.gridSize);
    return this.snake.some(s => s.x === x && s.y === y);
  }

  esCabeza(index: number): boolean {
    if (!this.snake.length) return false;
    const x = index % this.gridSize;
    const y = Math.floor(index / this.gridSize);
    return this.snake[0].x === x && this.snake[0].y === y;
  }

  esComida(index: number): boolean {
    const x = index % this.gridSize;
    const y = Math.floor(index / this.gridSize);
    return this.food.x === x && this.food.y === y;
  }

  async guardarResultado() {
    if (this.enviandoPuntaje) return;
    this.enviandoPuntaje = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('resultados').insert([{
          usuario: user.email,
          juego: 'snake',
          puntaje: this.puntaje
        }]);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      this.enviandoPuntaje = false;
    }
  }
}
