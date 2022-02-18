import { ProductsPickerComponent } from 'src/app/core/components/products-picker/products-picker.component';
import { Product } from './../../core/components/products-picker/products-picker.component';
import { MatDialog } from '@angular/material/dialog';
import {
  OrderBumpService,
  obPaymentsType,
  obDisplayRule,
  obAmountRule,
  OrderBump,
} from './../../../services/order-bump.service';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'yad-order-bump',
  templateUrl: './order-bump.component.html',
  styleUrls: ['./order-bump.component.scss'],
})
export class OrderBumpComponent implements OnInit {
  get obPaymentsType() {
    return obPaymentsType;
  }
  get obDisplayRule() {
    return obDisplayRule;
  }
  get obAmountRule() {
    return obAmountRule;
  }

  pageDisplay: string = 'add';

  editID: number = 0;
  deletedItem: EventEmitter<string> = new EventEmitter(true);

  orderBumpForm: FormGroup = new FormGroup({
    array: new FormArray([
      new FormGroup({
        name: new FormControl('Teste'),
        active: new FormControl(true),
      }),
      new FormGroup({
        pre_select_variation: new FormControl(true),
        resource_type: new FormControl('product'),
        resource_id: new FormControl(null),
        sameProduct: new FormControl(false),
        percentDiscount: new FormControl(0),
      }),
      new FormGroup({
        price_sale: new FormControl(10),
        price_discount: new FormControl(20),
        accepted_payment: new FormControl(obPaymentsType.ALL),
      }),
      new FormGroup({
        display_rule: new FormControl(obDisplayRule.ALWAYS),
        amount_rule: new FormControl(obAmountRule.GREATER_THAN),
        amount_value: new FormControl(0),
        display_product_ids: new FormControl([]),
      }),
      new FormGroup({
        p_title: new FormControl('Titulo do botão'),
        p_message: new FormControl('Mensagem do botão'),
        p_button_text: new FormControl('Texto do botão'),
      }),
    ]),
  });

  get orderBumpFormArray(): AbstractControl {
    return this.orderBumpForm.get('array')!;
  }
  get orderBumpForm1(): AbstractControl {
    return this.orderBumpForm.get('array')?.get([0])!;
  }
  get orderBumpForm2(): AbstractControl {
    return this.orderBumpForm.get('array')?.get([1])!;
  }
  get orderBumpForm3(): AbstractControl {
    return this.orderBumpForm.get('array')?.get([2])!;
  }
  get orderBumpForm4(): AbstractControl {
    return this.orderBumpForm.get('array')?.get([3])!;
  }
  get orderBumpForm5(): AbstractControl {
    return this.orderBumpForm.get('array')?.get([4])!;
  }

  get sameProductControl(): AbstractControl {
    return this.orderBumpForm2.get('sameProduct')!;
  }

  resourceProduct: Product | null = null;
  displayProducts: Product[] = [];

  mySubs: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private orderBumpService: OrderBumpService
  ) {}

  ngOnInit(): void {
    this.orderBumpForm4
      .get('display_rule')
      ?.valueChanges.subscribe((_) => this.changeDisplayRule());
    this.orderBumpForm2
      .get('sameProduct')
      ?.valueChanges.subscribe((_) => this.changeSameProduct());

    // this.openProductPickerDialog('d');
  }

  public setView(view: string) {
    this.pageDisplay = view;

    switch (view) {
      case 'home': {
        this.clearSubsValueChanges();
        break;
      }

      case 'add': {
        this.editID = 0;
        this.createNewOrderBumpForm();
        this.createSubsValueChanges();
        break;
      }
      case 'edit': {
        this.createSubsValueChanges();
        break;
      }

      default: {
        break;
      }
    }
  }

  private createSubsValueChanges() {
    const s1 = this.orderBumpForm4
      .get('display_rule')
      ?.valueChanges.subscribe((_) => this.changeDisplayRule());
    const s2 = this.orderBumpForm2
      .get('sameProduct')
      ?.valueChanges.subscribe((_) => this.changeSameProduct());

    return [s1, s2];
  }

  private clearSubsValueChanges() {
    this.mySubs.forEach((el) => {
      el.unsubscribe();
    });

    this.mySubs = [];
  }

  public editOrderBump(event: OrderBump) {
    console.log('edit => ', event);
    this.fillEditForm(event);
    this.editID = event.id;
    this.resourceProduct = event.resource?.data!;
    this.displayProducts = event.display_product_ids.map((el) => {
      return { id: el };
    });

    this.setView('edit');
  }

  private fillEditForm(orderBump: OrderBump) {
    this.orderBumpForm = this.fb.group({
      array: this.fb.array([
        this.fb.group({
          name: this.fb.control(orderBump.name),
          active: this.fb.control(orderBump.active),
        }),
        this.fb.group({
          pre_select_variation: this.fb.control(orderBump.pre_select_variation),
          resource_type: this.fb.control(orderBump.resource_type),
          resource_id: this.fb.control(orderBump.resource_id),
          sameProduct: this.fb.control(
            orderBump.display_product_ids.findIndex(
              (el) => el === orderBump.resource_id
            ) !== -1
          ),
          percentDiscount: this.fb.control(
            orderBump.display_product_ids.findIndex(
              (el) => el === orderBump.resource_id
            ) !== -1
              ? (orderBump.price_discount * 100) / orderBump.price_sale
              : 0
          ),
        }),
        this.fb.group({
          price_sale: this.fb.control(orderBump.price_sale),
          price_discount: this.fb.control(orderBump.price_discount),
          accepted_payment: this.fb.control(orderBump.accepted_payment),
        }),
        this.fb.group({
          display_rule: this.fb.control(orderBump.display_rule),
          amount_rule: this.fb.control(orderBump.amount_rule),
          amount_value: this.fb.control(orderBump.amount_value),
          display_product_ids: this.fb.control(orderBump.display_product_ids),
        }),
        this.fb.group({
          p_title: this.fb.control(orderBump.params.title),
          p_message: this.fb.control(orderBump.params.message),
          p_button_text: this.fb.control(orderBump.params.button_text),
        }),
      ]),
    });
  }

  public async deleteOrderBump(event: number) {
    try {
      console.log('delete => ', event);
      const response = await this.orderBumpService.delete(event);
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

  public openProductPickerDialog(relativeArray: 'r' | 'd') {
    const dialogRef = this.matDialog.open(ProductsPickerComponent, {
      width: '80vw',
      data: {
        products:
          relativeArray === 'd'
            ? this.displayProducts
            : !!this.resourceProduct?.id
            ? [this.resourceProduct]
            : [],
        multiple: relativeArray === 'r' ? false : true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed => ', result);

      if (result.data !== null) {
        if (relativeArray === 'r') {
          this.resourceProduct = result.data[0];
        } else {
          this.displayProducts = result.data;
        }
        this.updateProductsID(relativeArray);
      } else {
        console.log('Canceled => ', result);
      }
    });
  }

  private createNewOrderBumpForm() {
    this.orderBumpForm = this.fb.group({
      array: this.fb.array([
        this.fb.group({
          name: this.fb.control('Teste'),
          active: this.fb.control(true),
        }),
        this.fb.group({
          pre_select_variation: this.fb.control(true),
          resource_type: this.fb.control('product'),
          resource_id: this.fb.control(null),
          sameProduct: this.fb.control(false),
          percentDiscount: this.fb.control(0),
        }),
        this.fb.group({
          price_sale: this.fb.control(10),
          price_discount: this.fb.control(20),
          accepted_payment: this.fb.control(obPaymentsType.ALL),
        }),
        this.fb.group({
          display_rule: this.fb.control(obDisplayRule.ALWAYS),
          amount_rule: this.fb.control(obAmountRule.GREATER_THAN),
          amount_value: this.fb.control(0),
          display_product_ids: this.fb.control([]),
        }),
        this.fb.group({
          p_title: this.fb.control('Titulo do botão'),
          p_message: this.fb.control('Mensagem do botão'),
          p_button_text: this.fb.control('Texto do botão'),
        }),
      ]),
    });
  }

  private updateProductsID(relativeArray: string) {
    if (relativeArray === 'r') {
      console.log('this.resourceProduct => ', this.resourceProduct);
      this.orderBumpForm2
        .get('resource_id')
        ?.setValue(this.resourceProduct?.id);
    } else {
      console.log('this.displayProducts => ', this.displayProducts);
      this.orderBumpForm4
        .get('display_product_ids')
        ?.setValue(this.displayProducts.map((product) => product.id));
    }
  }

  private changeDisplayRule() {
    const value = this.orderBumpForm4.get('display_rule')?.value;

    switch (value) {
      case obDisplayRule.ALWAYS:
        {
          this.orderBumpForm4
            .get('amount_rule')
            ?.setValue(obAmountRule.GREATER_THAN);
          this.orderBumpForm4.get('amount_value')?.setValue(0);

          this.orderBumpForm4.get('display_product_ids')?.setValue([]);
        }

        break;
      case obDisplayRule.PRODUCTS_AMOUNT:
        {
          this.orderBumpForm4.get('display_product_ids')?.setValue([]);
        }

        break;
      case obDisplayRule.SELECTED_PRODUCTS:
        {
          this.orderBumpForm4
            .get('amount_rule')
            ?.setValue(obAmountRule.GREATER_THAN);
          this.orderBumpForm4.get('amount_value')?.setValue(0);
        }

        break;

      default:
        console.log('default changeDisplayRule');
        break;
    }
  }

  private changeSameProduct() {
    if (this.sameProductControl.value) {
      this.orderBumpForm4
        .get('display_rule')
        ?.setValue(obDisplayRule.SELECTED_PRODUCTS);
      this.orderBumpForm3.get('price_sale')?.setValue(0);
      this.orderBumpForm3.get('price_discount')?.setValue(0);
      this.orderBumpForm2.get('percentDiscount')?.setValue(0);

      console.log(
        'change!! => ',
        this.orderBumpForm4.get('display_rule')?.value
      );
    }
  }

  public async saveOrderBump() {
    try {
      let form: OrderBump[] = this.mapForm();
      const orderBumps = form;

      console.log('orderBumps => ', orderBumps);

      let myIndex = 0;

      const intervalID = setInterval(async () => {
        const orderBump = orderBumps[myIndex];
        console.log('called => ', orderBump);
        if (this.pageDisplay === 'add') {
          const response = await this.orderBumpService.create(orderBump);
          console.log('my response', response);
        } else if (this.pageDisplay === 'edit') {
          const response = await this.orderBumpService.update(orderBump);
          console.log('my response', response);
        }
        myIndex++;
        if (myIndex === orderBumps.length) {
          clearInterval(intervalID);
          console.log('Finish');
          this.setView('home');
        }
      }, 1000);
    } catch (error) {}
  }

  private mapForm() {
    let form: any = {};
    this.orderBumpFormArray?.value.forEach((element: any) => {
      form = { ...form, ...element };
    });

    form.params = {
      button_text: form.p_button_text,
      title: form.p_title,
      message: form.p_message,
    };
    delete form.p_button_text;
    delete form.p_title;
    delete form.p_message;

    const sameProduct = form.sameProduct;
    const percentDiscount: number = form.percentDiscount;
    delete form.sameProduct;
    delete form.percentDiscount;

    const obj: OrderBump = form;
    const list: OrderBump[] = [];
    if (sameProduct) {
      obj.display_product_ids.forEach((element) => {
        const data: any = this.sameProductCase(element, percentDiscount);
        list.push({ ...obj, ...data });
      });
    } else {
      list.push(obj);
    }

    const ret = list.map((orderBump) => {
      return {
        ...orderBump,
        id: this.pageDisplay === 'edit' ? this.editID : 1,
        name:
          list.length === 1
            ? orderBump.name
            : orderBump.name +
              ' => ' +
              this.displayProducts.find(
                (dp) => dp.id === orderBump.resource_id
              )!.name +
              ' com ' +
              percentDiscount +
              '% de desconto',
      };
    });
    return ret;
  }

  private sameProductCase(element: number, percentDiscount: number) {
    // resource id = element
    const _resourceId = element;
    // price_sale = product price
    // price_discount = product price - % discount
    const product = this.displayProducts.find((p) => p.id === element);
    const productValue = product?.skus?.data![0].price_discount
      ? product?.skus?.data![0].price_discount
      : product?.skus?.data![0].price_sale;
    const _priceSale = productValue;
    const _priceDiscount =
      productValue! - productValue! * (percentDiscount / 100);

    // display products ids = element
    const _displayProductsIds = [element];

    return {
      resource_id: _resourceId,
      price_sale: _priceSale,
      price_discount: _priceDiscount,
      display_product_ids: _displayProductsIds,
    };
  }
}
