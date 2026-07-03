import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorizedGuard } from './pages/guards/authorized.guard';
import { LiderPgGuard } from './pages/guards/lider-pg.guard';
import { InterceptService } from './core/utils/intercept.service';
import { PequenoGrupoService } from './core/_services/pequeno-grupo.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthorizedGuard, LiderPgGuard, PequenoGrupoService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		}],
  bootstrap: [AppComponent],
})
export class AppModule {}
