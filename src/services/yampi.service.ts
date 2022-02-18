import { OrderBump } from './order-bump.service';
import { Upsell } from 'src/services/upsell.service';
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

  public getCredentialKeys(): Observable<{
    alias: string;
    token: string;
    key: string;
  }> {
    return this.credentialKeys.asObservable();
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

  public async getKitsWithParams(
    params: string,
    options: any = {}
  ): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/combos?${params}`,
        this.headerWithAuthentication
      );

      const { data } = await axios.request({ ...coreOptions, ...options });
      return data;
    } catch (error) {
      throw error;
    }
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
        data: kit,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async editKit(kit: Kit, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/combos/${kit.id}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'PUT',
        data: kit,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async deleteKit(kit: Kit, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/combos/${kit.id}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getUpsellsWithParams(
    params: string,
    options: any = {}
  ): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/upsells?${params}`,
        this.headerWithAuthentication
      );

      const { data } = await axios.request({ ...coreOptions, ...options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async createUpsell(upsell: Upsell, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/upsells`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'POST',
        data: upsell,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async editUpsell(upsell: Upsell, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/upsells/${upsell.id}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'PUT',
        data: upsell,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async deleteUpsell(upsell: string, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/upsells/${upsell}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getOrderBumpsWithParams(
    params: string,
    options: any = {}
  ): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/order-bumps?${params}`,
        this.headerWithAuthentication
      );

      const { data } = await axios.request({ ...coreOptions, ...options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async createOrderBump(orderBump: OrderBump, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/order-bumps`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'POST',
        data: orderBump,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async editOrderBump(orderBump: OrderBump, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/order-bumps/${orderBump.id}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'PUT',
        data: orderBump,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async deleteOrderBump(orderBump: number, options: any = {}): Promise<any> {
    try {
      const credentials = await this.getCredentialKeys()
        .pipe(first())
        .toPromise();

      const coreOptions = this.utilsService.createAxiosOptions(
        environment.yampiURL,
        `${credentials.alias}/pricing/order-bumps/${orderBump}`,
        this.headerWithAuthentication
      );

      const data = await axios.request({
        ...coreOptions,
        ...options,
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
