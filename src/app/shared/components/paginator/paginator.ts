import { Component, input, output } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
   length = input<number>(0);
  pageSize = input<number>(5);

  pageChange = output<any>();
}
