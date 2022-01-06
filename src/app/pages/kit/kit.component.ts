import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  Product,
  ProductsPickerComponent,
} from 'src/app/core/components/products-picker/products-picker.component';
import { KitService } from 'src/services/kit.service';

import { DateTime } from 'luxon';

@Component({
  selector: 'yad-kit',
  templateUrl: './kit.component.html',
  styleUrls: ['./kit.component.scss'],
})
export class KitComponent implements OnInit, AfterViewInit {
  pageDisplay: string = 'add';

  productsNewKit: Product[] = [];
  addKitForm: FormGroup = this.fb.group({
    addKitFormArray: this.fb.array([
      this.fb.group({
        name: ['Meu novo Kit', [Validators.required]],
        description: ['Um bom kit novo'],
        active: [true],
      }),
      this.fb.group({
        products_ids: ['1, 2, 3', [Validators.required]],
      }),
      this.fb.group({
        discount_type: ['p', [Validators.required]],
        discount_value: [20, [Validators.required, Validators.min(1)]],
      }),
      this.fb.group({
        range: this.fb.group({
          start_at: ['', [Validators.required]],
          end_at: ['', [Validators.required]],
        }),
      }),
    ]),
  });

  get addKitFormArray(): AbstractControl | null {
    return this.addKitForm.get('addKitFormArray');
  }

  get products_ids(): AbstractControl | null {
    return this.addKitFormArray?.get([1])!.get('products_ids')!;
  }

  get rangeDate(): AbstractControl | null {
    return this.addKitFormArray?.get([3])!.get('range')!;
  }

  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private kitService: KitService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public openProductPickerDialog() {
    const dialogRef = this.matDialog.open(ProductsPickerComponent, {
      width: '80vw',
      data: { products: this.productsNewKit },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed => ', result);

      if (result.data !== null) {
        this.productsNewKit = result.data;
        this.updateProductsID();
      } else {
        console.log('Canceled => ', result);
      }
    });
  }

  updateProductsID() {
    this.products_ids?.setValue(
      this.productsNewKit.length > 0
        ? this.productsNewKit.map((product) => product.id).join(', ')
        : ''
    );

    console.log('new products id => ', this.products_ids?.value);
  }

  setView(view: string) {
    this.pageDisplay = view;
  }

  removeProduct(item: Product): void {
    const index = this.productsNewKit.findIndex(
      (product) => product.id === item.id
    );

    this.productsNewKit.splice(index, 1);
    this.updateProductsID();
  }

  async saveKit() {
    try {
      let form: any = {};
      this.addKitFormArray?.value.forEach((element: any) => {
        form = { ...form, ...element };
      });
      form.products_ids = form.products_ids
        .split(', ')
        .map((ids: string) => +ids);

      const yampiFormat = 'yyyy-LL-dd hh:mm:ss';

      form.start_at = DateTime.fromISO(
        (form.range.start_at as Date).toISOString()
      ).toFormat(yampiFormat);
      form.end_at = DateTime.fromISO(
        (form.range.end_at as Date).toISOString()
      ).toFormat(yampiFormat);
      delete form.range;
      console.log('My form values => ', form);

      // return;
      const response = await this.kitService.saveKit(form);
      console.log('response => ', response);
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }
}
