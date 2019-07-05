import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
import { SafePipe } from './pipe';

import { MessageService } from './services/message.service';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'messages', component: OrderComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OrderComponent,
    LoginComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
