import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    const { data } = await this.authService.supabase.auth.getUser();
    this.usuario = data.user;
    this.cdr.detectChanges();

    this.authService.supabase.auth.onAuthStateChange((event: any, session: any) => {
      this.usuario = session?.user ?? null;
      this.cdr.markForCheck();
    });
  }

  async logout() {
    await this.authService.supabase.auth.signOut();
  }
}
