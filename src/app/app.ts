import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  authService = inject(Auth);

  usuario: any = null;

  async ngOnInit() {

    const { data } =
      await this.authService.supabase.auth.getUser();

    this.usuario = data.user;

    this.authService.supabase.auth.onAuthStateChange(

      (event, session) => {

        this.usuario = session?.user ?? null;

      }

    );

  }

  async logout() {

    await this.authService.supabase.auth.signOut();

  }

}