import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'yad-errors-viewer',
  templateUrl: './errors-viewer.component.html',
  styleUrls: ['./errors-viewer.component.scss'],
})
export class ErrorsViewerComponent implements OnInit {
  @Input() errors: string[] = [
    '2. Produto a ser oferecido é obrigatório',
    '3. Valor de desconto deve ser menor que o preço de venda',
  ];
  @Input() show: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
