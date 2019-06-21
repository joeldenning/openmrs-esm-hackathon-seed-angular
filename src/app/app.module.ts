import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormEntryModule } from 'ngx-openmrs-formentry/dist/ngx-formentry';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OpenmrsResourcesService } from './openmrs-resources.service';
import { FormDataSourceService } from './form-data-source.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormEntryModule,
    BrowserAnimationsModule,
  ],
  providers: [OpenmrsResourcesService, FormDataSourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
