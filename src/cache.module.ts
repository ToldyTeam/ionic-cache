import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CacheConfig, CacheService } from './cache.service';
import { CacheStorageService } from './cache-storage';

export const CONFIG = new InjectionToken<CacheConfig>('CONFIG');

let cacheConfigDefaults: CacheConfig = {
  keyPrefix: '',
};

export function buildCacheService( cacheConfig: CacheConfig) {
  cacheConfig = Object.assign(cacheConfigDefaults, cacheConfig);

  return new CacheService(
    new CacheStorageService( cacheConfig.keyPrefix)
  );
}

@NgModule({
  imports: [
   
  ],
})
export class CacheModule {
  static forRoot(cacheConfig?: CacheConfig): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        { provide: CONFIG, useValue: cacheConfig },
        {
          provide: CacheService,
          useFactory: buildCacheService,
          deps: [ CONFIG],
        },
      ],
    };
  }
}
