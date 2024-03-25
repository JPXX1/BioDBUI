import { Injectable } from '@angular/core';
import { MessstellenStam } from '../interfaces/messstellen-stam';
import { HttpClient,HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StammdatenService {
  messstellenStam:MessstellenStam;
  public messstellenarray: MessstellenStam[];
  public mst:any;
  constructor( private httpClient: HttpClient) {}
  public wk:any;

   start2(kat:Boolean){
this.callBwUebersicht2();
console.log(this.mst);
 this.filterMst(kat);
console.log(this.mst);
  }
  async start(kat:Boolean){
    await this.callBwUebersicht();
    console.log(this.mst);
    await  this.filterMst(kat);
    console.log(this.mst);
      }
  getStammMst(){ 
        
    return this.httpClient.get('http://localhost:3000/stamMst');
    }
   
    getWk(){
      return this.httpClient.get('http://localhost:3000/stamWasserkoerper');
          
    }
    
     
   async holeSelectDataWK() {
    // this.getWk().subscribe(formen_ => {
		// 	this.wk = formen_;
		// 	// console.log(this.mst);
		// 	//return einheiten;
		// }); 
      await this.getWk().forEach(formen_ => {
        this.wk  = formen_;
        console.log(formen_);
        // return formen_;
      });  
    
     }
    callBwUebersicht2() {

    this.getStammMst().subscribe(mst_ => {
			this.mst = mst_;
			// console.log(this.mst);
			//return einheiten;
		});


	}
    async callBwUebersicht() {

      await this.getStammMst().forEach(formen_ => {
        this.mst = formen_;
        console.log(formen_);
      });
    }
  


async filterMst(kat:Boolean){
   
  let temp: any = this.mst;

  this.messstellenarray =[];

  await Promise.all(
    temp.map(async (f) => {
              
        
     

      if (f.see===kat)

        this.messstellenarray.push({ id_mst :f.id_mst,namemst: f.namemst,idgewaesser:f.idgewaesser,gewaessername:f.gewaessername,wk_name:f.wk_name,ortslage:f.ortslage,see:f.see,fliess:f.fliess,
          natürlich:f.natürlich,wrrl_typ:f.wrrl_typ,mp_typ:f.mp_typ,id_wk:f.id_wk,eu_cd_sm:f.eu_cd_sm,
          dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs});
       
        // this.messstellenarray.push(this.messstellenStam);
        // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
    })
)
 console.log (this.messstellenarray);
 
}



}