import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatToolbar, MatButton, MatRippleModule, MatInput, MatFormField, MatCard, MatProgressBar,
  MatSpinner, MatDialogModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { DialogComponent } from './dialog/dialog.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: SearchComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    MatToolbar,
    MatCard,
    MatFormField,
    MatButton,
    MatInput,
    MatProgressBar,
    MatSpinner,
    LoginComponent,
    SearchComponent,
    DialogComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MatRippleModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [DialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
