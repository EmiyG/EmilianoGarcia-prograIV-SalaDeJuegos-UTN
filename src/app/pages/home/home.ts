import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  authService = inject(Auth);

  cdr = inject(ChangeDetectorRef);

  usuario: any = null;

  async ngOnInit() {

    const { data } =
      await this.authService.supabase.auth.getUser();

    this.usuario = data.user;

    this.cdr.detectChanges();

    this.authService.supabase.auth.onAuthStateChange(

      (event, session) => {

        this.usuario = session?.user ?? null;

        this.cdr.detectChanges();

      }

    );

  }

  async logout() {

    await this.authService.supabase.auth.signOut();

  }

}