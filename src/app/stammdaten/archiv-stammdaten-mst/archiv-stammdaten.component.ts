import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
@Component({
  selector: 'app-archiv-stammdaten',
  templateUrl: './archiv-stammdaten.component.html',
  styleUrls: ['./archiv-stammdaten.component.css']
})
export class ArchivStammdatenComponent {
  // @Input()  
  messstellenStam: MessstellenStam[] = []; 
  displayedColumns: string[] = ['id_mst', 'namemst', 'ortslage','gewaessername','wk_name','melde_mst_str','repraesent_mst','rw_etrs','hw_etrs','updated_at'];
  dataSource=this.messstellenStam;
  constructor(public dialogRef: MatDialogRef<ArchivStammdatenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessstellenStam[]) {

      console.log (data)

  this.dataSource = data;
 
      }
      onClose(): void {
        this.dialogRef.close();
      }
}
