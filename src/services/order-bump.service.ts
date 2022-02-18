import { Product } from './../app/core/components/products-picker/products-picker.component';
import { YampiService } from 'src/services/yampi.service';
import { Injectable } from '@angular/core';

export interface OrderBump {
  id: number;
  name: string;
  active: boolean;

  params: {
    button_text: string;
    title?: string;
    message?: string;
  };

  pre_select_variation: boolean; // always true
  resource_id: number;
  resource_type: string; // always 'products'
  price_sale: number;
  price_discount: number;

  accepted_payment: obPaymentsType; // start in 'all'
  display_rule: obDisplayRule; // start in 'always'

  amount_rule: obAmountRule; // display_rule=PRODUCTS_AMOUNT in case, start in greater_than
  amount_value: number; // display_rule=PRODUCTS_AMOUNT in case, start in 0

  display_product_ids: number[]; // display_rule=SELECTED_PRODUCTS in case

  resource?: {
    data: Product
  }
}

export enum obPaymentsType {
  ALL = 'all',
  CREDIT_CARD = 'credit_card',
  BILLET = 'billet',
  DEPOSIT = 'deposit',
  PIX = 'pix',
}
export enum obDisplayRule {
  ALWAYS = 'always',
  PRODUCTS_AMOUNT = 'products_amount',
  SELECTED_PRODUCTS = 'selected_products',
}
export enum obAmountRule {
  GREATER_THAN = 'greater_than',
  LOWER_THAN = 'lower_than',
}

@Injectable({
  providedIn: 'root',
})
export class OrderBumpService {
  constructor(private yampiService: YampiService) {}

  getAll(params: any) {
    return this.yampiService.getOrderBumpsWithParams(params);
  }
  create(orderBump: OrderBump) {
    return this.yampiService.createOrderBump(orderBump);
  }
  update(orderBump: OrderBump) {
    return this.yampiService.editOrderBump(orderBump);
  }
  delete(orderBump: number) {
    return this.yampiService.deleteOrderBump(orderBump);
  }
}
