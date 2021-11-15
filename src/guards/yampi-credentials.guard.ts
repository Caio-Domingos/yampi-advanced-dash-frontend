import { YampiService } from './../services/yampi.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YampiCredentialsGuard implements CanActivate {
  constructor(private yampiService: YampiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.yampiService.getCredentialKeys().pipe(
      map((ev) => {

        if (ev.alias) return true;
        else {
          this.createCredentialModal();
          return false;
        }
      })
    );
  }

  createCredentialModal() {
    // create modal
  }
}
