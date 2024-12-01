import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WasserkoerperStam } from 'src/app/shared/interfaces/wasserkoerper-stam';

@Component({
  selector: 'app-archiv-stammdaten-wk',
  templateUrl: './archiv-stammdaten-wk.component.html',
  styleUrls: ['./archiv-stammdaten-wk.component.css']
})
/**
 * Komponente zur Anzeige und Verwaltung archivierter Wasserkörperdaten.
 * 
 * @export
 * @class ArchivStammdatenWkComponent
 * 
 * @property {WasserkoerperStam[]} wasserkoerperStam - Array von Wasserkörperdaten.
 * @property {string[]} displayedColumns - Array von Spaltennamen, die in der Tabelle angezeigt werden sollen.
 * @property {WasserkoerperStam[]} dataSource - Datenquelle für die Tabelle.
 * 
 * @constructor
 * @param {MatDialogRef<ArchivStammdatenWkComponent>} dialogRef - Referenz auf den Dialog, der diese Komponente enthält.
 * @param {WasserkoerperStam[]} data - Array von Wasserkörperdaten, die an die Komponente übergeben werden.
 * 
 * @method onClose - Schließt den Dialog.
 * 
 * @autor Dr. Jens Päzolt, Umweltsoft
 */
export class ArchivStammdatenWkComponent { 
  wasserkoerperStam: WasserkoerperStam[] = []; 
  displayedColumns: string[] = ['id_wk', 'wk_name', 'see','kuenstlich','hmwb','bericht_eu','eu_cd_wb','land','pp_typ_str','dia_typ_str','wrrl_typ_str','mp_typ_str','mzb_typ_str','gewaessername','updated_at'];
  dataSource = this.wasserkoerperStam;

  constructor(
    public dialogRef: MatDialogRef<ArchivStammdatenWkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WasserkoerperStam[]
  ) {
    console.log(data);
    this.dataSource = data;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
