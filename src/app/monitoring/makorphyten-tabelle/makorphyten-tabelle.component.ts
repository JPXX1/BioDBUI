// makorphyten-tabelle.component.ts
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MstMakrophyten } from 'src/app/shared/interfaces/mst-makrophyten';
import { FarbeBewertungService } from 'src/app/shared/services/farbe-bewertung.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnzeigeBewertungMPService } from 'src/app/shared/services/anzeige-bewertung-mp.service';
@Component({
  selector: 'app-makorphyten-tabelle',
  templateUrl: './makorphyten-tabelle.component.html',
  styleUrls: ['./makorphyten-tabelle.component.css']
})

export class MakorphytenTabelleComponent implements OnInit, OnChanges {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() mstMakrophyten: MstMakrophyten[] = [];
  @Input() displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<MstMakrophyten>();
  // displayedColumns: string[] = ['mst', 'gewaessername','jahr', 'taxon', 'wert', 'einheit', 'taxonzusatz', 'RoteListeD', 'tiefe_m', 'letzteAenderung'];

  constructor(private anzeigeBewertungMPService:AnzeigeBewertungMPService,private farbeBewertg: FarbeBewertungService) { }

  ngOnInit() {
    this.dataSource.data = this.mstMakrophyten;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mstMakrophyten']) {
      if (this.mstMakrophyten && this.anzeigeBewertungMPService.value && this.anzeigeBewertungMPService.Artvalue) {
      if (this.anzeigeBewertungMPService.Artvalue.length===0 && this.anzeigeBewertungMPService.value.length===0 && this.mstMakrophyten.length===0)
    {this.mstMakrophyten=this.anzeigeBewertungMPService.mstMakrophyten;}}
   this.dataSource.data = this.mstMakrophyten;
   this.displayedColumns = this.anzeigeBewertungMPService.displayedColumns;
    }
  }

  getColor(OZK: string): string {
    return this.farbeBewertg.getColorRL(OZK);
  }
}
