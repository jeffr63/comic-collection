import 'jest-preset-angular/setup-jest';
import { enableFetchMocks } from 'jest-fetch-mock';

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

enableFetchMocks();
