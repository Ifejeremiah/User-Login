import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RegisterComponent } from './register/register.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RouteModule } from './route/route.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FrameworkComponent } from './framework/framework.component';
import { appInit } from './config/app.initializer';
import { jwtIntercept } from './config/jwt.interceptor';
import { errorIntercept } from './config/error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterComponent,
    UserListComponent,
    UserDetailsComponent,
    LoginComponent,
    FrameworkComponent
  ],
  imports: [
    BrowserModule,
    RouteModule,
    HttpClientModule, 
    ReactiveFormsModule
  ],
  providers: [
    appInit,
    jwtIntercept,
    errorIntercept
  ],

  bootstrap: [FrameworkComponent]
})
export class AppModule { }
