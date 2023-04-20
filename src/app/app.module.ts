import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresentationComponent } from './presentation/presentation.component';
import { ConsultantComponent } from './consultant/consultant.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import localeDEExtra from '@angular/common/locales/extra/de';
import { NgxEchartsModule } from 'ngx-echarts';

registerLocaleData(localeDE, 'de-DE', localeDEExtra);

@NgModule({
  declarations: [
    AppComponent,
    PresentationComponent,
    ConsultantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
