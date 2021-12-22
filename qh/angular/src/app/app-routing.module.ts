import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // @ts-ignore
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: (window as any).__POWERED_BY_QIANKUN__ ? '/app-angular' : '/',
    },
  ],
})
export class AppRoutingModule {}
