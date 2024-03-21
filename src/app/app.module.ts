
import { NgModule } from '@angular/core'; 
 import { BrowserModule } from '@angular/platform-browser'; 
 import {MatToolbarModule} from '@angular/material/toolbar'; 
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component'; 
import {MatGridListModule} from '@angular/material/grid-list'; 
import { AppComponent } from './app.component'; 
import {HttpClientModule} from 	'@angular/common/http';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {CdkTableModule} from '@angular/cdk/table'; 
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { InfoBoxComponent } from './file-upload/info-box/info-box.component';
import { AppRoutingModule } from './app-routing.module';
import { EineldatenimpComponent } from './file-upload/eineldatenimp/eineldatenimp.component';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {SelectjahrComponent} from './select/selectjahr/selectjahr.component';
import { SelectProbenehmerComponent } from './select/select-probenehmer/select-probenehmer.component';
import {SelectUebersichtImportComponent} from './select/select-uebersicht-import/select-uebersicht-import.component';
import {MatCardModule} from '@angular/material/card'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatExpansionModule} from '@angular/material/expansion';
import {MonitoringComponent} from './monitoring/monitoring/monitoring.component'; 
import { StammdatenComponent } from './stammdaten/stammdaten.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { UebersichtTabelleComponent } from './monitoring/uebersicht-tabelle/uebersicht-tabelle.component';
import { MakorphytenTabelleComponent } from './monitoring/makorphyten-tabelle/makorphyten-tabelle.component';
import { MakrophytenMstUebersichtComponent } from './monitoring/makrophyten-mst-uebersicht/makrophyten-mst-uebersicht.component';
import {MatSliderModule} from '@angular/material/slider';
import { MapComponent } from './map/map.component';
import { MonitoringkarteComponent } from './monitoringkarte/monitoringkarte.component';
import { StammMessstellenComponent } from './stammdaten/stamm-messstellen/stamm-messstellen.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
	{ path: 'monitoringkarte', component: MonitoringkarteComponent },
	{ path: 'impeinzeldat', component: EineldatenimpComponent },
	{ path: 'datenimport', component: FileUploadComponent },
	{ path: 'monitoring', component: MonitoringComponent },
	{ path: 'stammdaten', component: StammdatenComponent },
	//  { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
  ]
@NgModule({ 
declarations: [ 
	AppComponent, SelectUebersichtImportComponent,
	FileUploadComponent, InfoBoxComponent,SelectjahrComponent, EineldatenimpComponent,  SelectProbenehmerComponent, MonitoringComponent, UebersichtTabelleComponent, MakorphytenTabelleComponent, MakrophytenMstUebersichtComponent, MapComponent, MonitoringkarteComponent, StammdatenComponent, StammMessstellenComponent,    
], 
imports: [ MatCheckboxModule,MatSliderModule,MatRadioModule,MatMenuModule,MatExpansionModule,MatTableModule,MatToolbarModule,MatCardModule,ScrollingModule,BrowserModule,BrowserAnimationsModule,
	ButtonModule,MatGridListModule,TableModule, CdkTableModule, MatPaginatorModule,RouterModule.forRoot(routes),MatIconModule,MatButtonModule,
	HttpClientModule,  AppRoutingModule, MatSelectModule,MatFormFieldModule,MatInputModule,FormsModule ,
    ReactiveFormsModule,MatProgressSpinnerModule
], 
providers: [SelectjahrComponent], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
