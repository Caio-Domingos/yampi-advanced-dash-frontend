import { obDisplayRule } from './../../../../services/order-bump.service';
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
import { OrderBump, OrderBumpService } from 'src/services/order-bump.service';

@Component({
  selector: 'yad-order-bump-selector',
  templateUrl: './order-bump-selector.component.html',
  styleUrls: ['./order-bump-selector.component.scss'],
})
export class OrderBumpSelectorComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'product', 'rule', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() editOrderBump: EventEmitter<OrderBump> = new EventEmitter(true);
  @Output() deleteOrderBump: EventEmitter<number> = new EventEmitter(true);
  @Input() deleteEvent: EventEmitter<string> = new EventEmitter(true);

  orderBumps = new MatTableDataSource<OrderBump>([]);
  orderBumpsCount: number = 0;
  constructor(private orderBumpService: OrderBumpService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.orderBumps.paginator = this.paginator;

    merge(this.paginator.page, this.deleteEvent)
      .pipe(
        startWith({}),
        map((_) => [{ page: this.paginator.pageIndex }]),
        switchMap(([pageData, deleteEvent]) => {
          let params = [
            `page=${pageData !== undefined ? pageData.page! + 1 : 1}`,
            `limit=${this.paginator.pageSize}`,
            'skipCache=true',
            'include=resource',
          ];

          const queryParams = params.join('&');
          console.log('queryParams => ', queryParams);
          return this.orderBumpService.getAll(queryParams);
        }),
        tap((data) => {
          console.log('My Data => ', data);

          const tableData = data.data.map((item: OrderBump) => {
            return {
              id: item.id,
              name: item.name,
              product: item.resource?.data.name,
              rule: this.checkRule(item.display_rule),
              status: item.active ? 'Ativo' : 'Desativo',
              _: item,
            };
          });
          console.log('My Table Data => ', tableData);
          // return;

          this.orderBumps.data = tableData;
        }),
        delay(100)
      )
      .subscribe((data) => {
        this.orderBumpsCount = data.meta.pagination.total;
        this.paginator.length = data.meta.pagination.total;
        this.paginator.pageIndex = data.meta.pagination.current_page - 1;
      });
  }

  private checkRule(rule: obDisplayRule) {
    switch (rule) {
      case obDisplayRule.ALWAYS:
        return 'Sempre';

      case obDisplayRule.PRODUCTS_AMOUNT:
        return 'Valores';

      case obDisplayRule.SELECTED_PRODUCTS:
        return 'Produtos';

      default:
        return 'Sempre';
        break;
    }
  }
}
