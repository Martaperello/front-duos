import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './Auth/auth.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavComponent } from './Shared/component/nav/nav.component';
import { FooterComponent } from './Shared/component/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
