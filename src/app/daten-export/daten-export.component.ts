import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { StammdatenService } from '../services/stammdaten.service';  // Adjust the path as needed

@Component({
  selector: 'app-daten-export',
  templateUrl: './daten-export.component.html',
  styleUrls: ['./daten-export.component.css']
})
export class DatenExportComponent implements OnInit {
  items = [
    // { id: 1, bezeichnung: 'Item 1' },
    // { id: 2, bezeichnung: 'Item 2' },
    // { id: 3, bezeichnung: 'Item 3' },
    // add more items as needed
  ];

  messstellen = [];
  wasserkorper = [];
  filteredMessstellen = [];
  filteredWasserkorper = [];
  years = Array.from({ length: 50 }, (v, k) => new Date().getFullYear() - k);

  form: FormGroup;
  messstellenFilterControl = new FormControl('');
  wasserkorperFilterControl = new FormControl('');
  isMessstellenOpen = false;
  isWasserkorperOpen = false;
  messstellenTypeControl = new FormControl('fluss'); // Default to Fließgewässer
  waterBodyTypeControl = new FormControl('fluss'); // Default to Fließgewässer

  constructor(private fb: FormBuilder, private stammdatenService: StammdatenService) {
    this.form = this.fb.group({
      yearFrom: [null],
      yearTo: [null],
      selectedComponents: [[]],
      selectedWasserkorper: [[]],
      dropdownSelection: [null],
      selectedItems: [[]],
      messstellenType: this.messstellenTypeControl,
      waterBodyType: this.waterBodyTypeControl
    });

    this.messstellenFilterControl.valueChanges.subscribe(value => this.filterMessstellen(value));
    this.wasserkorperFilterControl.valueChanges.subscribe(value => this.filterWasserkorper(value));
    this.messstellenTypeControl.valueChanges.subscribe(() => this.filterMessstellenType());
    this.waterBodyTypeControl.valueChanges.subscribe(() => this.filterWaterBodies());
  }

  ngOnInit() {
    this.loadWasserkorperData();
    this.loadMessstellenData();
    this.loadKomponentenData();
  }

  async loadWasserkorperData() {
    await this.stammdatenService.startwk(false, true);
    this.wasserkorper = this.stammdatenService.wkarray;
    this.sortWasserkorper();
    this.filterWaterBodies();
  }

  async loadKomponentenData() {
    await this.stammdatenService.callKomponenten();
    this.items = this.stammdatenService.komponenten;
  }

  async loadMessstellenData() {
    await this.stammdatenService.start(false, true);
    this.messstellen = this.stammdatenService.messstellenarray;
    this.sortMessstellen();
    this.filterMessstellenType();
  }

  sortWasserkorper() {
    this.wasserkorper.sort((a, b) => a.wk_name.localeCompare(b.wk_name));
  }

  sortMessstellen() {
    this.messstellen.sort((a, b) => a.namemst.localeCompare(b.namemst));
  }

  onMessstellenOpen() {
    this.isMessstellenOpen = true;
  }

  onMessstellenClose() {
    this.isMessstellenOpen = false;
  }

  onWasserkorperOpen() {
    this.isWasserkorperOpen = true;
  }

  onWasserkorperClose() {
    this.isWasserkorperOpen = false;
  }

  filterMessstellen(filterValue: string) {
    const selectedMessstellenIds = this.form.get('selectedComponents')?.value || [];
    const selectedMessstellen = this.filteredMessstellen.filter(m => selectedMessstellenIds.includes(m.id_mst));

    const filteredMessstellen = this.messstellen.filter(m =>
      m.namemst.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (!filterValue) {
      this.filteredMessstellen = [...this.filteredMessstellen];
    } else {
      this.filteredMessstellen = Array.from(new Set([...selectedMessstellen, ...filteredMessstellen]));
    }
  }

  filterWasserkorper(filterValue: string) {
    const selectedWasserkorperIds = this.form.get('selectedWasserkorper')?.value || [];
    const selectedWasserkorper = this.filteredWasserkorper.filter(w => selectedWasserkorperIds.includes(w.id));

    const filteredWasserkorper = this.wasserkorper.filter(w =>
      w.wk_name.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (!filterValue) {
      this.filteredWasserkorper = [...this.filteredWasserkorper];
    } else {
      this.filteredWasserkorper = Array.from(new Set([...selectedWasserkorper, ...filteredWasserkorper]));
    }
  }

  filterWaterBodies() {
    const waterBodyType = this.waterBodyTypeControl.value;
    if (waterBodyType === 'fluss') {
      this.filteredWasserkorper = this.wasserkorper.filter(w => !w.see);
    } else {
      this.filteredWasserkorper = this.wasserkorper.filter(w => w.see);
    }
    this.filterWasserkorper(this.wasserkorperFilterControl.value);
  }

  filterMessstellenType() {
    const messstellenType = this.messstellenTypeControl.value;
    if (messstellenType === 'fluss') {
      this.filteredMessstellen = this.messstellen.filter(m => !m.see);
    } else {
      this.filteredMessstellen = this.messstellen.filter(m => m.see);
    }
    this.filterMessstellen(this.messstellenFilterControl.value);
  }

  selectAllMessstellen() {
    const allIds = this.filteredMessstellen.map(component => component.id_mst);
    this.form.get('selectedComponents').setValue(allIds);
  }

  deselectAllMessstellen() {
    this.form.get('selectedComponents').setValue([]);
  }

  selectAllWasserkorper() {
    const allIds = this.filteredWasserkorper.map(w => w.id);
    this.form.get('selectedWasserkorper').setValue(allIds);
  }

  deselectAllWasserkorper() {
    this.form.get('selectedWasserkorper').setValue([]);
  }

  onSubmit() {
    const yearFrom = this.form.get('yearFrom')?.value;
    const yearTo = this.form.get('yearTo')?.value;
    const dropdownSelection = this.form.get('dropdownSelection')?.value;
    const selectedItems = this.form.get('selectedItems')?.value;

    if (dropdownSelection === 'messstellen') {
      const selectedComponents = this.form.get('selectedComponents')?.value;
      this.stammdatenService.queryArten('messstellen', selectedComponents, yearFrom, yearTo, selectedItems).subscribe(
        data => console.log('Messstellen Data:', data),
        error => console.error('Error:', error)
      );
    } else if (dropdownSelection === 'wasserkorper') {
      const selectedWasserkorper = this.form.get('selectedWasserkorper')?.value;
      this.stammdatenService.queryArten('wasserkorper', selectedWasserkorper, yearFrom, yearTo, selectedItems).subscribe(
        data => console.log('Wasserkörper Data:', data),
        error => console.error('Error:', error)
      );
    }
  }
}
