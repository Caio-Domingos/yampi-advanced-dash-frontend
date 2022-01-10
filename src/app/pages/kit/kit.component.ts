import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
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
import { Kit, KitService } from 'src/services/kit.service';

import { DateTime } from 'luxon';

@Component({
  selector: 'yad-kit',
  templateUrl: './kit.component.html',
  styleUrls: ['./kit.component.scss'],
})
export class KitComponent implements OnInit, AfterViewInit {
  pageDisplay: string = 'home';
  editID: string = '';
  itemDelected: EventEmitter<string> = new EventEmitter(true);

  productsNewKit: Product[] = [];
  addKitForm: FormGroup = this.fb.group({
    addKitFormArray: this.fb.array([
      this.fb.group({
        name: ['', [Validators.required]],
        description: [''],
        active: [true],
      }),
      this.fb.group({
        products_ids: ['', [Validators.required]],
      }),
      this.fb.group({
        discount_type: ['p', [Validators.required]],
        discount_value: [0, [Validators.required, Validators.min(1)]],
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

    if (view === 'add') {
      this.addKitForm.reset();
      this.editID = '';
    }
  }

  removeProduct(item: Product): void {
    const index = this.productsNewKit.findIndex(
      (product) => product.id === item.id
    );

    this.productsNewKit.splice(index, 1);
    this.updateProductsID();
  }

  editKit(kit: any) {
    console.log('Kit editing => ', kit);
    this.editID = kit.kitObject.id;

    this.updateFormValues(kit);
    this.pageDisplay = 'edit';
  }

  private updateFormValues(kit: any) {
    this.addKitFormArray?.get([0])?.get('name')?.setValue(kit.kitObject.name);
    this.addKitFormArray
      ?.get([0])
      ?.get('description')
      ?.setValue(kit.kitObject.description);
    this.addKitFormArray
      ?.get([0])
      ?.get('active')
      ?.setValue(kit.kitObject.active);

    const prodString = kit.kitObject.products_ids!.join(', ');
    this.productsNewKit = kit.kitObject.products_ids!.map(
      (product: Product) => {
        return {
          id: product,
        };
      }
    );
    this.addKitFormArray?.get([1])?.get('products_ids')?.setValue(prodString);

    this.addKitFormArray
      ?.get([2])
      ?.get('discount_type')
      ?.setValue(kit.kitObject.discount_type);
    this.addKitFormArray
      ?.get([2])
      ?.get('discount_value')
      ?.setValue(kit.kitObject.discount_value);

    console.log('date => ', new Date(kit.kitObject.start_at.date));
    this.addKitFormArray
      ?.get([3])
      ?.get('range')
      ?.get('start_at')
      ?.setValue(new Date(kit.kitObject.start_at.date));
    this.addKitFormArray
      ?.get([3])
      ?.get('range')
      ?.get('end_at')
      ?.setValue(new Date(kit.kitObject.end_at.date));

    this.addKitForm.updateValueAndValidity();
  }

  async deleteKit(kit: any) {
    try {
      console.log('Kit deleting => ', kit);
      const response = await this.kitService.deleteKit(kit.kitObject);
      console.log('Response => ', response);
      this.itemDelected.emit(kit.kitObject.id);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
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
      let response;
      if (this.pageDisplay === 'add') {
        response = await this.kitService.saveKit(form);
      } else if (this.pageDisplay === 'edit') {
        response = await this.kitService.updateKit({
          ...form,
          id: this.editID,
        });
      }
      console.log('response => ', response);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }
}
