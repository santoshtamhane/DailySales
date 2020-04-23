import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderSKUsPage } from './order-skus.page';
import { ExpandableComponent } from '../../components/expandable/expandable.component';

const routes: Routes = [
  {
    path: '',
    component: OrderSKUsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ExpandableComponent],
  declarations: [OrderSKUsPage, ExpandableComponent],

})
export class OrderSKUsPageModule {}
