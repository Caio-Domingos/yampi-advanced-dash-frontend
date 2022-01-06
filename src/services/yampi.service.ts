import { UtilsService } from './utils.service';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { YampiVariables } from '../../testVariables';

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Kit } from './kit.service';

@Injectable({
  providedIn: 'root',
})
export class YampiService {
  private headerWithoutAuthentication: AxiosRequestHeaders = {
    'Content-Type': 'application/json',
  };
  private headerWithAuthentication: AxiosRequestHeaders = {
    'Content-Type': 'application/json',
  };

  private credentialKeys = new BehaviorSubject<{
    alias: string;
    token: string;
    key: string;
  }>({
    alias: YampiVariables.alias,
    token: YampiVariables.token,
    key: YampiVariables.key,
  });

  constructor(private utilsService: UtilsService) {
    this.credentialKeys.subscribe((ev) => {
      this.headerWithAuthentication = {
        'Content-Type': 'application/json',
        'User-Token': ev.token,
        'User-Secret-Key': ev.key,
      };
    });
  }

  public async getProducts(options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/catalog/products`,
        this.headerWithAuthentication
      );

      const { data } = await axios.request({ ...coreOptions, ...options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async getProductsWithParams(
    params: string,
    options: any = {}
  ): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/catalog/products?${params}`,
        this.headerWithAuthentication
      );

      const { data } = await axios.request({ ...coreOptions, ...options });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public getCredentialKeys(): Observable<{
    alias: string;
    token: string;
    key: string;
  }> {
    return this.credentialKeys.asObservable();
  }

  public async createKit(kit: Kit, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/combos`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'POST',
        data: kit
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public updateYampiCredentialKeys(
    credentials: {
      alias: string;
      token: string;
      key: string;
    } = {
      alias: '',
      token: '',
      key: '',
    }
  ): void {
    this.credentialKeys.next(YampiVariables);
  }
}
