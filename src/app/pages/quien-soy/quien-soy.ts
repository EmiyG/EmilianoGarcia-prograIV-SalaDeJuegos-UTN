import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { supabase } from '../../services/supabase';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {

  http = inject(HttpClient);

  cdr = inject(ChangeDetectorRef);

  usuario: any;

  ngOnInit() {

    this.http
      .get('https://api.github.com/users/EmiyG')
      .subscribe(data => {

        this.usuario = data;

        this.cdr.detectChanges();

      });

  }

}