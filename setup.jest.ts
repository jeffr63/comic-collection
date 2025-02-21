//import 'jest-preset-angular/setup-jest';
import { enableFetchMocks } from 'jest-fetch-mock';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

enableFetchMocks();
setupZoneTestEnv();
