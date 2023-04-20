import { ConsultantComponent } from './consultant/consultant.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentationComponent } from './presentation/presentation.component';

const routes: Routes = [
  {path: '', component: ConsultantComponent},
  {path: 'presentation', component: PresentationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
