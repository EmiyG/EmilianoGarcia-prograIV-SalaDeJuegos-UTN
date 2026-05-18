import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Github {

  http = inject(HttpClient);

  obtenerUsuario(usuario: string) {

    return this.http.get(
      `https://api.github.com/users/${usuario}`
    );

  }

}