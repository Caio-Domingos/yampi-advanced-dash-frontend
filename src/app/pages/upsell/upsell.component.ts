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
  deletedItem: EventEmitter<number> = new EventEmitter(true);
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

  errorsShow = false;
  errors: string[] = [];

  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private upsellService: UpsellService
  ) {}

  ngOnInit(): void {}

  setView(view: string) {
    this.pageDisplay = view;

    switch (view) {
      case 'home': {
        this.errorsShow = false;
        this.errors = [];
        break;
      }

      case 'add': {
        this.editID = 0;
        this.purchaseProductEditing = 0;

        this.suggestedProduct = null;
        this.purchasedProducts = [];
        this.createNewUpsellForm();
        break;
      }
      case 'edit': {
        break;
      }

      default: {
        break;
      }
    }

    if (view === 'add') {
    }
  }

  private validateForm() {
    const errors = [];

    // this.upsellForm1
    const name = this.upsellForm1.get('name')?.value;
    const context = this.upsellForm1.get('context')?.value;
    if (!name) {
      errors.push('1. Nome é obrigatório');
    }

    // this.upsellForm2
    const purchased_product_id = this.upsellForm2.get(
      'purchased_product_id'
    )?.value;
    if (!purchased_product_id) {
      errors.push('2. Produto comprado é obrigatório');
    }

    // this.upsellForm3
    const suggested_product_id = this.upsellForm2.get(
      'suggested_product_id'
    )?.value;
    if (!suggested_product_id && !this.sameProduct) {
      errors.push('3. Produto sugerido é obrigatório');
    }

    // this.upsellForm4
    const product_quantity = this.upsellForm2.get('product_quantity')?.value;
    const product_price = this.upsellForm2.get('product_price')?.value;
    if (
      context !== 'before' &&
      typeof product_quantity === 'number' &&
      product_quantity <= 0
    ) {
      errors.push('4. Quantidade do produto é obrigatório');
    }
    if (
      context !== 'before' &&
      typeof product_quantity === 'number' &&
      product_price <= 0
    ) {
      errors.push('4. Valor do produto é obrigatório');
    }

    // this.upsellForm5
    const email_subject = this.upsellForm5.get('email_subject')?.value;
    const description = this.upsellForm5.get('description')?.value;

    if (context === 'delayed' && !email_subject) {
      errors.push('5. Assunto do email é obrigatório');
    }
    if (context !== 'before' && !description) {
      errors.push('5. Descrição do Upsell/Email é obrigatório');
    }

    return errors;
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

  public async deleteUpsell(upsell: number) {
    try {
      console.log('delete => ', upsell);
      const response = await this.upsellService.delete(upsell);
      this.deletedItem.emit(response);
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

  public async saveUpsell() {
    try {
      const validation = this.validateForm();
      console.log('errors =>', validation);

      if (validation.length > 0) {
        this.errors = validation;
        this.errorsShow = true;
        return;
      } else {
        this.errors = [];
        this.errorsShow = false;
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
          if (atualIndex === this.purchasedProducts.length) {
            clearInterval(intervalID);
            this.setView('home');
          }
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
