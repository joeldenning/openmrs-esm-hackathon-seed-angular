import 'core-js/es7/reflect';

import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import singleSpaAngular from 'single-spa-angular';
import { parcelPropsSubject } from './app/parcel-props.service';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: (props) => {
    parcelPropsSubject.next(props)
    return platformBrowserDynamic().bootstrapModule(AppModule)
  },
  template: '<app-root />',
  NgZone: NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;