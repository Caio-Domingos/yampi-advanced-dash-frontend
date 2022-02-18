import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge } from 'rxjs';
import { startWith, map, switchMap, tap, delay } from 'rxjs/operators';
import { Kit } from 'src/services/kit.service';
import { Upsell, UpsellService } from 'src/services/upsell.service';

@Component({
  selector: 'yad-upsell-selector',
  templateUrl: './upsell-selector.component.html',
  styleUrls: ['./upsell-selector.component.scss'],
})
export class UpsellSelectorComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'status',
    'suggested_product',
    'purchased_product',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() editUpsell: EventEmitter<Upsell> = new EventEmitter(true);
  @Output() deleteUpsell: EventEmitter<number> = new EventEmitter(true);
  @Input() deleteEvent: EventEmitter<number> = new EventEmitter(true);

  upsells = new MatTableDataSource<Upsell>([]);
  upsellsCount: number = 0;
  constructor(private upsellService: UpsellService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.upsells.paginator = this.paginator;

    merge(this.paginator.page, this.deleteEvent)
      .pipe(
        startWith({}),
        map((_) => [{ page: this.paginator.pageIndex }]),
        switchMap(([pageData, deleteEvent]) => {
          let params = [
            `page=${pageData !== undefined ? pageData.page! + 1 : 1}`,
            `limit=${this.paginator.pageSize}`,
            'skipCache=true',
            'include=suggested_product.name,purchased_product.name'
          ];

          const queryParams = params.join('&');
          console.log('queryParams => ', queryParams);
          return this.upsellService.getAll(queryParams);
        }),
        tap((data) => {
          console.log('My Data => ', data);

          const tableData = data.data.map((item: Upsell) => {
            return {
              id: item.id,
              name: item.name,
              suggested_product: item.suggested_product!.data.name,
              purchased_product: item.purchased_product!.data.name,
              status: item.active ? 'Ativo' : 'Desativo',
              _: item,
            };
          });
          console.log('My Table Data => ', tableData);
          // return;

          this.upsells.data = tableData;
        }),
        delay(100)
      )
      .subscribe((data) => {
        this.upsellsCount = data.meta.pagination.total;
        this.paginator.length = data.meta.pagination.total;
        this.paginator.pageIndex = data.meta.pagination.current_page - 1;
      });
  }
}
