import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/services/product.service';
import { YampiService } from 'src/services/yampi.service';

@Component({
  selector: 'yad-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    const products = await this.productService.getProducts();
  }
}
