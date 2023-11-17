import { BrowserModule } from 
	'@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component'; 

import { AppComponent } from './app.component'; 
import {HttpClientModule} from 	'@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatTableModule} from '@angular/material/table';

import { InfoBoxComponent } from './file-upload/info-box/info-box.component';
import { AppRoutingModule } from './app-routing.module';
import { EineldatenimpComponent } from './file-upload/eineldatenimp/eineldatenimp.component';
import { HomeComponent } from './home/home.component';
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
	BrowserModule, MatTableModule, RouterModule.forRoot(routes),
	HttpClientModule, BrowserAnimationsModule, AppRoutingModule 
], 
providers: [], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
