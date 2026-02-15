import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FarbeBewertungService } from 'src/app/shared/services/farbe-bewertung.service';
import { MstUebersicht } from 'src/app/shared/interfaces/mst-uebersicht';

@Component({
  selector: 'app-makrophyten-mst-uebersicht',
  templateUrl: './makrophyten-mst-uebersicht.component.html',
  styleUrls: ['./makrophyten-mst-uebersicht.component.css']
})
export class MakrophytenMstUebersichtComponent implements OnChanges {

  @Input() pros: any[] = [];

  dataSource = new MatTableDataSource<MstUebersicht>();
  displayColumnNames: string[] = [];
  displayedColumns: string[] = [];

  constructor(private farbeBewertung: FarbeBewertungService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.pros || this.pros.length < 3) return;

    this.displayColumnNames = this.pros[1];
    this.displayedColumns = this.pros[2];
    this.dataSource.data = this.pros[0];
  }

  getIndex(colName: string): number {
    return Number(colName.replace('sp', '')) - 1;
  }

  getColor(value: any, element: MstUebersicht): string | null {
    if (!element?.isOEZK) return null;
    return this.farbeBewertung.getColor(value);
  }

  isYearColumn(col: string): boolean {
    return col?.toLowerCase().startsWith('sp');
  }
}
