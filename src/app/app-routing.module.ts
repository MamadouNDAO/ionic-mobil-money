import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {LoginPage} from './pages/login/login.page';
import {MenuPage} from './pages/menu/menu.page';
import {HostPage} from './pages/host/host.page';
import {DepotPage} from './pages/depot/depot.page';
import {PrincipalPage} from './pages/principal/principal.page';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'depot', loadChildren: () => import('./pages/depot/depot.module').then( m => m.DepotPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'menu', component: MenuPage,
    canActivate: [AuthGuardService]
  },
  {
    path: 'host', loadChildren: () => import('./pages/host/host.module').then( m => m.HostPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'retrait',
    loadChildren: () => import('./pages/retrait/retrait.module').then( m => m.RetraitPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'calcul',
    loadChildren: () => import('./pages/calcul/calcul.module').then( m => m.CalculPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'transaction',
    loadChildren: () => import('./pages/transaction/transaction.module').then( m => m.TransactionPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'alltransac',
    loadChildren: () => import('./pages/alltransac/alltransac.module').then( m => m.AlltransacPageModule)
  },
  {
    path: 'commission',
    loadChildren: () => import('./pages/commission/commission.module').then( m => m.CommissionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
