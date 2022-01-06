import { Injectable } from '@angular/core';
import { YampiService } from './yampi.service';
export interface Kit {
  id?: number;
  active: boolean;
  name: string;
  description?: string;
  discount_type: string;
  discount_value: number;
  products_ids: number[];
}
@Injectable({
  providedIn: 'root',
})
export class KitService {
  constructor(private yampiService: YampiService) {}

  getProducts(params: string) {
    return this.yampiService.getProductsWithParams(params);
  }

  saveKit(kit: Kit): Promise<any> {
    return this.yampiService.createKit(kit);
  }
}
