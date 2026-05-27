import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../services/supabase';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})

export class Chat implements OnInit, OnDestroy {
  mensajes: any[] = [];
  nuevoMensaje: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {

    await this.cargarMensajes();
    this.cdr.detectChanges();

    const channel = supabase.channel('chat-global');

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes'
      },
      (payload: any) => {

        this.mensajes = [
          ...this.mensajes,
          payload.new
        ];
        this.cdr.detectChanges();

      }
    );

    await channel.subscribe();

  }

  async cargarMensajes() {

    const { data } = await supabase
      .from('mensajes')
      .select('*')
      .order('fecha');

    this.mensajes = data || [];
  }

  async enviarMensaje() {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!this.nuevoMensaje.trim()) return;

    await supabase
      .from('mensajes')
      .insert([
        {
          usuario: user?.email,
          mensaje: this.nuevoMensaje
        }
      ]);

    this.nuevoMensaje = '';
  }

  ngOnDestroy(): void {

    supabase.removeAllChannels();

  }
}
