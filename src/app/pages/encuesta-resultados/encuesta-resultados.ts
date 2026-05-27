import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-encuesta-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta-resultados.html',
  styleUrl: './encuesta-resultados.css'
})
export class EncuestaResultados implements OnInit {

  resultados: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const { data, error } = await supabase
        .from('encuestas')
        .select('*');

      if (error) throw error;

      this.resultados = data || [];
    } catch (err: any) {
      this.errorMsg = err.message || 'Error al cargar resultados';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
