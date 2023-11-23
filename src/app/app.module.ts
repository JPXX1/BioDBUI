import { BrowserModule } from 
	'@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 
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

const routes: Routes = [
	{ path: 'impeinzeldat', component: EineldatenimpComponent },
	{ path: 'fileupload', component: FileUploadComponent },
	//  { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
  ]
@NgModule({ 
declarations: [ 
	AppComponent, 
	FileUploadComponent, InfoBoxComponent, EineldatenimpComponent, HomeComponent, 
], 
imports: [ 
	ButtonModule,MatGridListModule,BrowserModule,TableModule, CdkTableModule, MatPaginatorModule,RouterModule.forRoot(routes),MatIconModule,MatButtonModule,
	HttpClientModule, BrowserAnimationsModule, AppRoutingModule 
], 
providers: [], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
