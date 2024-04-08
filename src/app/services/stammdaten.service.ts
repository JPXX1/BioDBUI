import { Injectable } from '@angular/core';
import { MessstellenStam } from '../interfaces/messstellen-stam';
import { MeldeMst } from '../interfaces/melde-mst';
import { HttpClient,HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StammdatenService {
  messstellenStam:MessstellenStam;
  public messstellenarray: MessstellenStam[];
  public meldemst:MeldeMst[];
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
  this.meldemst =[];
  await Promise.all(
    temp.map(async (f) => {
              
        
     

      if (f.see===kat){

      //erzeugt Array mit Meldemessstellen
      if (f.repraesent_mst===true){

        this.meldemst.push({id_mst: f.id_mst, namemst: f.namemst,repraesent:f.repraesent_mst});
        console.log(f);
      }
        this.messstellenarray.push({ id_mst :f.id_mst,namemst: f.namemst,idgewaesser:f.idgewaesser,gewaessername:f.gewaessername,wk_name:f.wk_name,ortslage:f.ortslage,see:f.see,repraesent:f.repraesent_mst,melde_mst_str:f.melde_mst_str,
          melde_mst:f.melde_mst,wrrl_typ:f.wrrl_typ,mp_typ:f.mp_typ,id_wk:f.id_wk,eu_cd_sm:f.eu_cd_sm,
          dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs});
       
        // this.messstellenarray.push(this.messstellenStam);
        // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
}})
)
 console.log (this.messstellenarray);
 
}

speichereMst(messstellenStam:MessstellenStam){
 
  const body = new HttpParams()
  .set('id_mst',messstellenStam.id_mst)
  .set('id_wk',messstellenStam.id_wk)
  .set('melde_mst', messstellenStam.melde_mst)
  .set('namemst', messstellenStam.namemst)
  .set('ortslage',messstellenStam.ortslage)
  .set('repraesent',messstellenStam.repraesent)
  .set('rw_etrs',messstellenStam.rw_etrs)
  .set('hw_etrs',messstellenStam.hw_etrs)
  


  
  this.httpClient.post('http://localhost:3000/insertStammMst', body).subscribe(resp => {
    console.log("response %o, ", resp);
  });    
}

}