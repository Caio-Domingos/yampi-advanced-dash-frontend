import { Injectable } from '@angular/core';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  createAxiosOptions(
    baseUrl: string,
    url: string,
    headers: AxiosRequestHeaders,
    params?: any,
    data?: any
  ): AxiosRequestConfig {
    return {
      url,
      baseURL: baseUrl,
      headers,
      params: params ? params : {},
      data: data ? data : {},
    };
  }
}
