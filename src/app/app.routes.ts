import { Routes } from '@angular/router';
import { Juegos } from './pages/juegos/juegos';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { MayorMenor } from './pages/mayor-menor/mayor-menor';
import { Chat } from './pages/chat/chat';
import { Ahorcado } from './pages/ahorcado/ahorcado';
import { Preguntados } from './pages/preguntados/preguntados';
import { Snake } from './pages/snake/snake';
import { Resultados } from './pages/resultados/resultados';
import { Encuesta } from './pages/encuesta/encuesta';
import { EncuestaResultados } from './pages/encuesta-resultados/encuesta-resultados';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'quien-soy', component: QuienSoy },
  { path: 'juegos', component: Juegos, canActivate: [authGuard] },
  { path: 'mayor-menor', component: MayorMenor },
  { path: 'chat', component: Chat },
  { path: 'ahorcado', component: Ahorcado },
  { path: 'preguntados', component: Preguntados },
  { path: 'snake', component: Snake },
  { path: 'resultados', component: Resultados },
  { path: 'encuesta', component: Encuesta },
  { path: 'encuesta-resultados', component: EncuestaResultados, canActivate: [adminGuard] }
];
