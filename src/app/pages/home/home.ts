import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  authService = inject(Auth);

  usuario: any = null;

  async ngOnInit() {

    const { data } =
      await this.authService.supabase.auth.getUser();

    this.usuario = data.user;

  }

  async logout() {

    await this.authService.supabase.auth.signOut();

    this.usuario = null;

  }

}