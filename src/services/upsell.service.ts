import { Product } from './../app/core/components/products-picker/products-picker.component';
import { Injectable } from '@angular/core';
import { YampiService } from './yampi.service';

export interface Upsell {
  id?: number;
  product_quantity?: number;
  product_price?: number;
  context?: string;
  email_subject?: string;
  description?: string;
  sms?: string;
  name?: string;
  suggested_product_id?: number;
  purchased_product_id?: number;
  suggested_product?: { data: Product };
  purchased_product?: { data: Product };
  promocode_id?: number;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UpsellService {
  constructor(private yampiService: YampiService) {}

  getAll(params: any) {
    return this.yampiService.getUpsellsWithParams(params);
  }
  create(upsell: Upsell) {
    return this.yampiService.createUpsell(upsell);
  }
  update(upsell: Upsell) {
    return this.yampiService.editUpsell(upsell);
  }
  delete(upsell: string) {
    return this.yampiService.deleteUpsell(upsell);
  }
}
