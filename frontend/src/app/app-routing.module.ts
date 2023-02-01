import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './shared/core/guards/login/login.guard';
import { TokenGuard } from './shared/core/guards/login/token.guard';
import { UserGuard } from './shared/core/guards/user/user.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [TokenGuard],
    children: [
      {
        path: '',
        canActivate: [UserGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./todos/todos.module').then((m) => m.TodosModule),
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
