import { Injectable } from '@angular/core';
import { ShopifyService } from './shopify.service';
import { YampiService } from './yampi.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private yampiService: YampiService,
    private shopifyService: ShopifyService
  ) {}

  getProducts() {}
}
