import { KitService } from 'src/services/kit.service';
import { Kit } from './../../../../services/kit.service';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, switchMap, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'yad-kit-selector',
  templateUrl: './kit-selector.component.html',
  styleUrls: ['./kit-selector.component.scss'],
})
export class KitSelectorComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'discount',
    'products_count',
    'status',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() editKit: EventEmitter<Kit> = new EventEmitter(true);
  @Output() deleteKit: EventEmitter<Kit> = new EventEmitter(true);
  @Input() deleteEvent: EventEmitter<string> = new EventEmitter(true);

  kits = new MatTableDataSource<Kit>([]);
  kitsCount: number = 0;

  constructor(private kitService: KitService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.kits.paginator = this.paginator;

    merge(this.paginator.page, this.deleteEvent)
      .pipe(
        startWith({}),
        map((_) => [{ page: this.paginator.pageIndex }]),
        switchMap(([pageData, deleteEvent]) => {
          let params = [
            'orderBy=name',
            'sortedBy=asc',
            `page=${pageData !== undefined ? pageData.page! + 1 : 1}`,
            `limit=${this.paginator.pageSize}`,
            'skipCache=true'
          ];

          const queryParams = params.join('&');
          console.log('queryParams => ', queryParams);
          return this.kitService.getKits(queryParams);
        }),
        tap((data) => {
          console.log('My Data => ', data);

          const tableData = data.data.map((item: Kit) => {
            return {
              id: item.id,
              name: item.name,
              discount:
                item.discount_type === 'p'
                  ? item.discount_value + '%'
                  : 'R$ ' + item.discount_value,
              products_count: item.total_products,
              status: item.expired ? 'Ativo' : 'Desativo',
              kitObject: item,
            };
          });
          console.log('My Table Data => ', tableData);
          // return;

          this.kits.data = tableData;
        }),
        delay(100)
      )
      .subscribe((data) => {
        this.kitsCount = data.meta.pagination.total;
        this.paginator.length = data.meta.pagination.total;
        this.paginator.pageIndex = data.meta.pagination.current_page - 1;
      });
  }
}
