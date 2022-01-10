import { Injectable } from '@angular/core';
import { YampiService } from './yampi.service';
export interface Kit {
  id?: number;
  total_products?: number;
  expired?: boolean;
  active?: boolean;
  name?: string;
  description?: string;
  discount_type?: string;
  discount_value?: number;
  products_ids?: number[];
  start_at?: string;
  end_at?: string;
}
@Injectable({
  providedIn: 'root',
})
export class KitService {
  constructor(private yampiService: YampiService) {}

  getProducts(params: string) {
    return this.yampiService.getProductsWithParams(params);
  }

  getKits(params: string) {
    return this.yampiService.getKitsWithParams(params);
  }

  saveKit(kit: Kit): Promise<any> {
    return this.yampiService.createKit(kit);
  }
  updateKit(kit: Kit): Promise<any> {
    return this.yampiService.editKit(kit);
  }
  deleteKit(kit: Kit): Promise<any> {
    return this.yampiService.deleteKit(kit);
  }
}
