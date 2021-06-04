import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlltransacPageRoutingModule } from './alltransac-routing.module';

import { AlltransacPage } from './alltransac.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlltransacPageRoutingModule
  ],
  declarations: [AlltransacPage]
})
export class AlltransacPageModule {}
