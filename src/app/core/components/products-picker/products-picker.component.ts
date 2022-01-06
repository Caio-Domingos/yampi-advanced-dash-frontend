import { BehaviorSubject, merge, of } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { delay, map, startWith, switchMap, tap } from 'rxjs/operators';
import { KitService } from 'src/services/kit.service';

@Component({
  selector: 'yad-products-picker',
  templateUrl: './products-picker.component.html',
  styleUrls: ['./products-picker.component.scss'],
})
export class ProductsPickerComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'status'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filterValue') filterValue!: ElementRef;
  filter$ = new BehaviorSubject<string>('');
  selection = new SelectionModel<number>(true, []);
  myProducts: Product[] = [];

  products = new MatTableDataSource<Product>([]);
  productsCount: number = 0;

  constructor(
    private kitService: KitService,
    public dialogRef: MatDialogRef<ProductsPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[] }
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const idProductsAlreadySelecteds: number[] = this.data.products.map(
        (p) => p.id
      );
      this.selection.select(...idProductsAlreadySelecteds);
    }, 200);

    this.products.paginator = this.paginator;

    this.filter$.subscribe((_) => (this.paginator.pageIndex = 0));
    merge(this.paginator.page, this.filter$)
      .pipe(
        startWith({}),
        map((_) => [
          { page: this.paginator.pageIndex },
          { value: this.filterValue!.nativeElement.value },
        ]),
        switchMap(([pageData, filterData]) => {
          let params = [
            'orderBy=name',
            'sortedBy=asc',
            `page=${pageData !== undefined ? pageData.page! + 1 : 1}`,
            `limit=${this.paginator.pageSize}`,
          ];

          if (filterData.value) {
            params.push(`search=${filterData.value}&searchFields=name:like`);
          }

          const queryParams = params.join('&');
          console.log('queryParams => ', queryParams);
          return this.kitService.getProducts(queryParams);
        }),
        tap((data) => {
          console.log('My Data => ', data);
          this.products.data = data.data;
        }),
        delay(100)
      )
      .subscribe((data) => {
        this.productsCount = data.meta.pagination.total;
        this.paginator.length = data.meta.pagination.total;
        this.paginator.pageIndex = data.meta.pagination.current_page - 1;
        // console.log('Products count => ', this.productsCount);

        // console.log('My Paginator => ', this.paginator);
      });

    this.selection.changed.subscribe((event) => {
      console.log('selection selecteds => ', this.selection.selected);
      console.log('selection event => ', event);

      if (event.added.length > 0) {
        const prod = !!this.products.data.find((e) => e.id === event.added[0])
          ? this.products.data.find((e) => e.id === event.added[0])
          : this.data.products.find((e) => e.id === event.added[0]);

        this.myProducts.push({
          id: event.added[0],
          name: prod!.name,
          active: prod!.active,
        });
      }

      if (event.removed.length > 0) {
        const prodIndex = this.myProducts.findIndex(
          (e) => e.id === event.removed[0]
        );

        this.myProducts.splice(prodIndex, 1);
      }

      console.log('My Product List => ', this.myProducts);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.products.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.products.data.map((e) => e.id));
  }

  refreshFilter() {
    console.log(this.filterValue!.nativeElement.value);
    this.filter$.next(this.filterValue!.nativeElement.value);
  }

  clearFilter() {
    this.filterValue!.nativeElement.value = '';
    this.filter$.next(this.filterValue!.nativeElement.value);
  }

  removeItem(item: Product) {
    this.selection.deselect(item.id);
  }

  closeDialog(sendData: boolean) {
    this.dialogRef.close({ data: sendData ? this.myProducts : null });
  }
}

export interface Product {
  id: number;
  name: string;
  active: boolean;
}
