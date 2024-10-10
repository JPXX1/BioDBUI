import { NgModule } from '@angular/core'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
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
import { MatSortModule} from '@angular/material/sort';
import { MonitoringkarteComponent } from './monitoringkarte/monitoringkarte.component';
import { StammMessstellenComponent } from './stammdaten/stamm-messstellen/stamm-messstellen.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SelectWasserkoerperComponent } from './select/select-wasserkoerper/select-wasserkoerper.component';
import { EditStammdatenMstComponent } from './stammdaten/edit-stammdaten-mst/edit-stammdaten-mst.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ArchivStammdatenComponent } from './stammdaten/archiv-stammdaten-mst/archiv-stammdaten.component';
import { StammWkComponent } from './stammdaten/stamm-wk/stamm-wk.component';
import { EditStammdatenWkComponent } from './stammdaten/edit-stammdaten-wk/edit-stammdaten-wk.component';
import {MatDividerModule} from '@angular/material/divider';
import { ArchivStammdatenWkComponent } from './stammdaten/archiv-stammdaten-wk/archiv-stammdaten-wk.component';
import { MessstelleAendernComponent } from './file-upload/messstelle-aendern/messstelle-aendern.component';
import { EditableTableTypwrrlComponent } from './stammdaten/editable-table-typwrrl/editable-table-typwrrl.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './administration/register/register.component';
import { AdministrationComponent } from './administration/administration.component';
import { EditableTableGewaesserComponent } from './stammdaten/editable-table-gewaesser/editable-table-gewaesser.component';
import { EditableTableTypPPComponent } from './stammdaten/editable-table-typ-pp/editable-table-typ-pp.component';
import { EditableTableDiatypComponent } from './stammdaten/editable-table-diatyp/editable-table-diatyp.component';
import { EditableTableMptypComponent } from './stammdaten/editable-table-mptyp/editable-table-mptyp.component';
import { DatenExportComponent } from './daten-export/daten-export.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { RegisterDialogComponent } from './auth/register-dialog/register-dialog.component';

import { MapVBSelectionDialogComponent } from './map-vbselection-dialog/map-vbselection-dialog.component';
import { ExpertenurteilMstComponent } from './expertenurteil-mst/expertenurteil-mst.component';
import { MstExpertenurteilEditComponent } from './mst-expertenurteil-edit/mst-expertenurteil-edit.component';
import { EinzeldatephytoplanktonComponent } from './file-upload/einzeldatenimport_phytoplakton/einzeldatephytoplankton/einzeldatephytoplankton.component';
import { UserManagementComponent } from './auth/user-management/user-management.component';
import { EditUserDialogComponent } from './auth/edit-user-dialog/edit-user-dialog.component';
import { ConfirmDeleteDialogComponent } from './auth/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmPasswordDialogComponent } from './auth/confirm-password-dialog/confirm-password-dialog.component';
import { RoleGuard } from 'src/app/auth/auth/role.guard';
// StammWkComponent

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
	{ path: 'login', component: LoginComponent },
	{ path: 'monitoringkarte', component: MonitoringkarteComponent 
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'nutzer1' }  // Die erwartete Rolle
	},
	
	{ path: 'impeinzeldat', component: EineldatenimpComponent },
	{ path: 'datenimport', component: FileUploadComponent 
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'administrator' }  // Die erwartete Rolle

	},
	{ path: 'monitoringdaten', component: MonitoringComponent 
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'nutzer1' }  // Die erwartete Rolle
	},
	{ path: 'stammdaten', component: StammdatenComponent 
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'nutzer3' }  // Die erwartete Rolle
	},
	{ path: 'register', component: RegisterComponent },
	{path:'admin',component:AdministrationComponent
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'administrator' }  // Die erwartete Rolle
	},
	{path:'datenexport',component:DatenExportComponent
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'nutzer2' }  // Die erwartete Rolle
	},
	{path:'bewerten',component:ExpertenurteilMstComponent
		,canActivate: [RoleGuard],  // Guard aktivieren
		data: { expectedRole: 'nutzer3' }  // Die erwartete Rolle
	}
	
	//  { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
  ]
@NgModule({ 
declarations: [ 
	AppComponent, SelectUebersichtImportComponent,
	FileUploadComponent, InfoBoxComponent,SelectjahrComponent, EineldatenimpComponent,  SelectProbenehmerComponent, MonitoringComponent, UebersichtTabelleComponent, MakorphytenTabelleComponent, MakrophytenMstUebersichtComponent, MapComponent, MonitoringkarteComponent, StammdatenComponent, StammMessstellenComponent, SelectWasserkoerperComponent, EditStammdatenMstComponent, ArchivStammdatenComponent, StammWkComponent, EditStammdatenWkComponent, ArchivStammdatenWkComponent, MessstelleAendernComponent, EditableTableTypwrrlComponent, LoginComponent, RegisterComponent, AdministrationComponent, EditableTableGewaesserComponent, EditableTableTypPPComponent, EditableTableDiatypComponent, EditableTableMptypComponent, DatenExportComponent, CustomSnackbarComponent, RegisterDialogComponent,  MapVBSelectionDialogComponent, ExpertenurteilMstComponent, MstExpertenurteilEditComponent, EinzeldatephytoplanktonComponent, UserManagementComponent, EditUserDialogComponent, ConfirmDeleteDialogComponent, ConfirmPasswordDialogComponent,
], 
imports: [MatSnackBarModule,MatButtonToggleModule,FlexLayoutModule,MatDividerModule,MatSortModule, NgMultiSelectDropDownModule.forRoot(),MatCheckboxModule,MatSliderModule,MatRadioModule,MatMenuModule,MatExpansionModule,MatTableModule,MatToolbarModule,MatCardModule,ScrollingModule,BrowserModule,BrowserAnimationsModule,
	ButtonModule,MatGridListModule,TableModule, CdkTableModule, MatPaginatorModule,RouterModule.forRoot(routes),MatIconModule,MatButtonModule,
	HttpClientModule,  AppRoutingModule, MatSelectModule,MatFormFieldModule,MatInputModule,FormsModule ,
    ReactiveFormsModule,MatProgressSpinnerModule,MatDialogModule,MatTabsModule,
], 
providers: [SelectjahrComponent,StammMessstellenComponent,EditStammdatenMstComponent,StammWkComponent], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
