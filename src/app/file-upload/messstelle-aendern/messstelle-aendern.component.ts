import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArraybuendelMstaendern } from 'src/app/shared/interfaces/arraybuendel-mstaendern';
import { MeldeMst } from 'src/app/shared/interfaces/melde-mst';

@Component({
  selector: 'app-messstelle-aendern',
  templateUrl: './messstelle-aendern.component.html',
  styleUrls: ['./messstelle-aendern.component.css']
})
export class MessstelleAendernComponent {

  Mst_name: string;

  formInstance: FormGroup;

  dropdownGewaesserList: GewaesserSelect[] = [];
  dropdownMeldeMst: MeldeMst[] = [];

  constructor(
    public dialogRef: MatDialogRef<MessstelleAendernComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArraybuendelMstaendern,
    private fb: FormBuilder
  ) {

    this.formInstance = this.fb.group({
      id_mst: ['', Validators.required],
      namemst: ['', Validators.required],
      idgewaesser: ['', Validators.required],
      gewaessername: ['', Validators.required],
    });

    this.Mst_name = "Messstelle '" + this.data.namemst + "' ändern.";

    // Gewässer distinct erzeugen
    const gewaesserDistinct = Array.from(
      new Map(
        this.data.mststam.map(m => [
          m.idgewaesser,
          {
            idgewaesser: m.idgewaesser,
            gewaessername: m.gewaessername
          }
        ])
      ).values()
    ).sort((a, b) =>
      a.gewaessername.localeCompare(b.gewaessername, 'de', {
        sensitivity: 'base'
      })
    );

    this.dropdownGewaesserList = gewaesserDistinct;
  }

  // 🔹 Wenn Gewässer gewählt wird
  onGewaesserChange(gewaesserId: number) {

    const gewaesser = this.dropdownGewaesserList.find(g => g.idgewaesser === gewaesserId);

    this.formInstance.patchValue({
      idgewaesser: gewaesserId,
      gewaessername: gewaesser?.gewaessername
    });

    // Messstellen filtern
    this.dropdownMeldeMst = this.data.mststam
      .filter(m => m.idgewaesser === gewaesserId)
      .map(m => ({
        id_mst: m.id_mst,
        namemst: m.namemst,
        repraesent: m.repraesent ?? false
      }));
  }

  // 🔹 Wenn Messstelle gewählt wird
  onMessstelleChange(mstId: number) {

    const mst = this.dropdownMeldeMst.find(m => m.id_mst === mstId);

    this.formInstance.patchValue({
      id_mst: mstId,
      namemst: mst?.namemst
    });
  }

  save(): void {
    this.dialogRef.close(this.formInstance.value);
  }
}

interface GewaesserSelect {
  idgewaesser: number;
  gewaessername: string;
}
