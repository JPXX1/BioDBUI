import { Injectable } from '@angular/core'; 
import {HttpClient} from '@angular/common/http'; 
import {Observable} from 'rxjs'; 

@Injectable({ 
providedIn: 'root'
}) 
/**
	 * Service zum Hochladen von Dateien.
	 * 
	 * @bemerkungen
	 * Dieser Dienst bietet eine Methode zum Hochladen von Dateien zu einem angegebenen API-Endpunkt.
	 * 
	 * 
	 * @public
	 * @autor Dr. Jens Päzolt, Umweltsoft
	 */
export class FileUploadService { 
	
	
// API url 
baseApiUrl = "https://file.io"
	
constructor(private http:HttpClient) { } 

// Returns an observable 
/**
 * Lädt eine Datei auf den Server hoch.
 *
 * @param file - Die hochzuladende Datei.
 * @returns Ein Observable, das die Antwort des Servers sendet.
 */
upload(file):Observable<any> { 

	// Create form data 
	const formData = new FormData(); 
		
	// Store form name as "file" with file data 
	formData.append("file", file, file.name); 
		
	// Make http post request over api 
	// with formData as req 
	return this.http.post(this.baseApiUrl, formData) 
} 
} 
