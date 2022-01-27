import { Product } from './../../core/components/products-picker/products-picker.component';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductsPickerComponent } from 'src/app/core/components/products-picker/products-picker.component';
import { KitService } from 'src/services/kit.service';
import { BehaviorSubject } from 'rxjs';
import { Upsell, UpsellService } from 'src/services/upsell.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'yad-upsell',
  templateUrl: './upsell.component.html',
  styleUrls: ['./upsell.component.scss'],
})
export class UpsellComponent implements OnInit {
  pageDisplay: string = 'add';
  deletedItem: EventEmitter<string> = new EventEmitter(true);
  editID: number = 0;
  purchaseProductEditing: number = 0;

  suggestedProduct: Product | null = null;
  purchasedProducts: Product[] = [];

  sameProduct: boolean = false;

  upsellForm: FormGroup = this.fb.group({
    array: this.fb.array([
      this.fb.group({
        name: this.fb.control(''),
        active: this.fb.control(true),
        context: this.fb.control('before'),
      }),
      this.fb.group({
        purchased_product_id: this.fb.control(''),
      }),
      this.fb.group({
        suggested_product_id: this.fb.control(''),
      }),
      this.fb.group({
        product_quantity: this.fb.control(0),
        product_price: this.fb.control(0),
      }),
      this.fb.group({
        email_subject: this.fb.control(''),
        description: this.fb.control(''),
      }),
    ]),
  });

  get upsellFormArray(): AbstractControl {
    return this.upsellForm.get('array')!;
  }
  get upsellForm1(): AbstractControl {
    return this.upsellForm.get('array')?.get([0])!;
  }
  get upsellForm2(): AbstractControl {
    return this.upsellForm.get('array')?.get([1])!;
  }
  get upsellForm3(): AbstractControl {
    return this.upsellForm.get('array')?.get([2])!;
  }
  get upsellForm4(): AbstractControl {
    return this.upsellForm.get('array')?.get([3])!;
  }
  get upsellForm5(): AbstractControl {
    return this.upsellForm.get('array')?.get([4])!;
  }

  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private upsellService: UpsellService
  ) {}

  ngOnInit(): void {}

  setView(view: string) {
    this.pageDisplay = view;

    if (view === 'add') {
      this.editID = 0;
      this.purchaseProductEditing = 0;

      this.suggestedProduct = null;
      this.purchasedProducts = [];
      this.createNewUpsellForm();
    }
  }

  public openProductPickerDialog(relativeArray: 's' | 'p') {
    const dialogRef = this.matDialog.open(ProductsPickerComponent, {
      width: '80vw',
      data: {
        products:
          relativeArray === 'p'
            ? this.purchasedProducts
            : !!this.suggestedProduct?.id
            ? [this.suggestedProduct]
            : [],
        multiple: relativeArray === 's' ? false : true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed => ', result);

      if (result.data !== null) {
        if (relativeArray === 's') {
          this.suggestedProduct = result.data[0];
        } else {
          this.purchasedProducts = result.data;
        }
        this.updateProductsID(relativeArray);
        // this.updateProductsID(relativeArray);
      } else {
        console.log('Canceled => ', result);
      }
    });
  }

  private updateProductsID(relativeArray: 's' | 'p') {
    if (relativeArray === 's') {
      this.upsellForm3
        .get('suggested_product_id')
        ?.setValue(this.suggestedProduct!.id ? this.suggestedProduct!.id : '');

      console.log('value => ', this.upsellForm2.value);
    }
  }

  private createNewUpsellForm() {
    this.upsellForm = this.fb.group({
      array: this.fb.array([
        this.fb.group({
          name: this.fb.control(''),
          active: this.fb.control(true),
          context: this.fb.control('before'),
        }),
        this.fb.group({
          purchased_product_id: this.fb.control([]),
        }),
        this.fb.group({
          suggested_product_id: this.fb.control(''),
        }),
        this.fb.group({
          product_quantity: this.fb.control(0),
          product_price: this.fb.control(0),
        }),
        this.fb.group({
          email_subject: this.fb.control(''),
          description: this.fb.control(''),
        }),
      ]),
    });
  }

  public changeSameProductToggle(event: MatSlideToggleChange) {
    this.sameProduct = event.checked;
  }

  public async editUpsell(upsell: any) {
    console.log('Upsell editing => ', upsell);

    const data: Upsell = upsell._;

    this.upsellForm = this.fb.group({
      array: this.fb.array([
        this.fb.group({
          name: this.fb.control(data.name),
          active: this.fb.control(data.active),
          context: this.fb.control(data.context),
        }),
        this.fb.group({
          purchased_product_id: this.fb.control(data.purchased_product_id),
        }),
        this.fb.group({
          suggested_product_id: this.fb.control(data.suggested_product_id),
        }),
        this.fb.group({
          product_quantity: this.fb.control(data.product_quantity),
          product_price: this.fb.control(data.product_price),
        }),
        this.fb.group({
          email_subject: this.fb.control(data.email_subject),
          description: this.fb.control(data.description),
        }),
      ]),
    });

    this.sameProduct = data.purchased_product_id === data.suggested_product_id;

    this.editID = data.id!;
    this.purchaseProductEditing = data.purchased_product_id!;

    this.suggestedProduct = data.suggested_product!.data;
    this.purchasedProducts = [data.purchased_product!.data];

    console.log('editID => ', this.editID);
    console.log('purchaseProductEditing => ', this.purchaseProductEditing);
    console.log('suggestedProduct => ', this.suggestedProduct);
    console.log('purchasedProducts => ', this.purchasedProducts);

    this.pageDisplay = 'edit';
  }

  public async deleteUpsell(upsell: string) {
    try {
    } catch (error) {}
  }

  public async saveUpsell() {
    try {
      if (
        this.pageDisplay === 'add' &&
        (this.purchasedProducts.length === 0 || !this.suggestedProduct)
      ) {
        throw { response: { data: { error: 'Sem produtos escolhidos' } } };
      }

      let form: Upsell = {};
      this.upsellFormArray?.value.forEach((element: any) => {
        form = { ...form, ...element };
      });

      console.log('products => ', this.purchasedProducts);
      console.log('form => ', form);
      let atualIndex = 0;
      const intervalID = setInterval(async () => {
        try {
          const product = this.purchasedProducts[atualIndex];

          if (this.sameProduct) {
            form.suggested_product = { data: product };
            form.suggested_product_id = product.id;

            form.product_price = product.skus?.data![0].price_discount
              ? product.skus?.data![0].price_discount! -
                product.skus?.data![0].price_discount! *
                  (form.product_price! / 100)
              : product.skus?.data![0].price_sale! -
                product.skus?.data![0].price_sale! *
                  (form.product_price! / 100);
          }

          form.purchased_product_id = product.id;
          let response;
          if (this.purchaseProductEditing === product.id) {
            // Editing
            response = await this.upsellService.update({
              ...form,
              id: this.editID,
            });
          } else {
            // Adding
            response = await this.upsellService.create({
              ...form,
              name:
                form.name +
                ` | Produto comprado - ${product.name} => ${this.suggestedProduct?.name}`,
            });
          }
          console.log('response =>', response);

          atualIndex++;
          if (atualIndex === this.purchasedProducts.length)
            clearInterval(intervalID);
        } catch (error: any) {
          if (error.response) {
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          clearInterval(intervalID);
          console.log(error.config);
        }
      }, 1000);
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
