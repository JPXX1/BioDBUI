
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
import { HomeComponent } from './home/home.component';
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
// import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
	{ path: 'impeinzeldat', component: EineldatenimpComponent },
	{ path: 'fileupload', component: FileUploadComponent },
	//  { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
  ]
@NgModule({ 
declarations: [ 
	AppComponent, SelectUebersichtImportComponent,
	FileUploadComponent, InfoBoxComponent,SelectjahrComponent, EineldatenimpComponent, HomeComponent, SelectProbenehmerComponent,   
], 
imports: [ MatTableModule,MatToolbarModule,MatCardModule,ScrollingModule,BrowserModule,BrowserAnimationsModule,
	ButtonModule,MatGridListModule,TableModule, CdkTableModule, MatPaginatorModule,RouterModule.forRoot(routes),MatIconModule,MatButtonModule,
	HttpClientModule,  AppRoutingModule, MatSelectModule,MatFormFieldModule,MatInputModule,FormsModule 
], 
providers: [SelectjahrComponent], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
