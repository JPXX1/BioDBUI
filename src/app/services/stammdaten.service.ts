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


   start(){
this.callBwUebersicht2();
console.log(this.mst);
 this.filterMst();
console.log(this.mst);
  }

  getStammMst(){ 
        
    return this.httpClient.get('http://localhost:3000/stamMst');
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
  


async filterMst(){
   
  let temp: any = this.mst;

  this.messstellenarray =[];

  await Promise.all(
    temp.map(async (f) => {
              
        
       
        // let messstellenStam={} as MessstellenStam;
        // messstellenStam.namemst=f.namemst;
        // messstellenStam.eu_cd_sm=f.eu_cd_sm;
        // messstellenStam.dia_typ=f.dia_typ;
        // messstellenStam.fliess=f.fliess;
        // messstellenStam.hw_etrs=f.hw_etrs;
        // messstellenStam.rw_etrs=f.rw_etrs;
        // messstellenStam.id_mst=f.id_mst;
        // messstellenStam.id_wk=f.id_wk;
        // messstellenStam.idgewaesser=f.idgewaesser;
        // messstellenStam.mp_typ=f.mp_typ;
        // messstellenStam.natürlich=f.natürlich;



        this.messstellenarray.push({ id_mst :f.id_mst,namemst: f.namemst,idgewaesser:f.idgewaesser,ortslage:f.ortslage,see:f.see,fliess:f.fliess,
          natürlich:f.natürlich,wrrl_typ:f.wrrl_typ,mp_typ:f.mp_typ,id_wk:f.id_wk,eu_cd_sm:f.eu_cd_sm,
          dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs});
       
        // this.messstellenarray.push(this.messstellenStam);
        // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
    })
)
 console.log (this.messstellenarray);
 
}



}