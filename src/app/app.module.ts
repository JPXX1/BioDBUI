import { BrowserModule } from 
	'@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 

import { FileUploadComponent } from './file-upload/file-upload.component'; 

import { AppComponent } from './app.component'; 
import {HttpClientModule} from 
	'@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatTableModule} from '@angular/material/table'; 
@NgModule({ 
declarations: [ 
	AppComponent, 
	FileUploadComponent, 
], 
imports: [ 
	BrowserModule, MatTableModule,
	HttpClientModule, BrowserAnimationsModule 
], 
providers: [], 
bootstrap: [AppComponent] 
}) 

export class AppModule { } 
