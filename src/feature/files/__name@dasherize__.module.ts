import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { <%= dasherize(name) %>tComponent } from './<%= dasherize(name) %>/<%= dasherize(name) %>.component';
import { <%= dasherize(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';

@NgModule({
  declarations: [<%= classify(name) %>Component],
  imports: [CommonModule, SharedModule, AboutRoutingModule]
})
export class <%= classify(name) %>Module {}
