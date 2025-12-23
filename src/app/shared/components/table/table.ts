import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table',
  imports: [MatTableModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
columns = input<string[]>([]);
  data = input<any[]>([]);
  
}
