import { Injectable } from '@angular/core';
import { MessstellenStam } from '../interfaces/messstellen-stam';
import { WasserkoerperStam } from '../interfaces/wasserkoerper-stam';
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
  public archivMst:any;
  constructor( private httpClient: HttpClient) {}
  public wk:any;
  wkStam:WasserkoerperStam;
  public wkarray:WasserkoerperStam[];



//    start2(kat:Boolean){
// this.callBwUebersicht2();
// console.log(this.mst);
//  this.filterMst(kat);
// console.log(this.mst);
//   }


async holeArchiv(parameter :number){
  await this.getArchivMstStamm(parameter);

}
async startwk(kat:Boolean){
  await this.holeSelectDataWK();
 
  await  this.filterWK(kat);
  console.log(this.wk);
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

    // getArStammMst(){ 
        
    //   return this.httpClient.get('http://localhost:3000/stamMst');
    //   }
    getWk(){
      return this.httpClient.get('http://localhost:3000/stamWK'); //stamWasserkoerper
          
    }
    
     
   async holeSelectDataWK() {
   
      await this.getWk().forEach(formen_ => {
        this.wk  = formen_;
        console.log(formen_);
        // return formen_;
      });  
    
     }
  //   callBwUebersicht2() {

  //   this.getStammMst().subscribe(mst_ => {
	// 		this.mst = mst_;
	// 		// console.log(this.mst);
	// 		//return einheiten;
	// 	});


	// }
    async callBwUebersicht() {

      await this.getStammMst().forEach(formen_ => {
        this.mst = formen_;
        console.log(formen_);
      });
    }
  

    async filterWK(kat:Boolean){

   
      let temp: any = this.wk;

      this.wkarray =[];
     
      await Promise.all(
        temp.map(async (f) => {
                  
            
         
    
          if (f.see===kat){
    
          //erzeugt Array mit WK
          
          
            this.wkarray.push({ id:f.id,
              wk_name: f.wk_name,
              see:f.see,
              kuenstlich:f.kuenstlich,
              hmwb:f.hmwb,
              eu_cd_wb:f.eu_cd_wb,
              bericht_eu:f.bericht_eu,
              kuerzel:f.kuerzel,
              id_gewaesser:f.id_gewaesser,
              land:f.land,
              wrrl_typ:f.wrrl_typ,
              mp_typ:f.mp_typ,
              dia_typ:f.dia_typ,
              pp_typ:f.pp_typ,
              pp_typ_str:f.pp_typ_str,
              dia_typ_str:f.dia_typ_str,
              mp_typ_str:f.mp_typ_str,
              wrrl_typ_str:f.wrrl_typ_str,
              gewaessername:f.gewaessername,
              updated_at:f.updated_at});
           
            // this.messstellenarray.push(this.messstellenStam);
            // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
    }})
    )
     //console.log (this.wkarray);

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
          dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs,updated_at:f.updated_at});
       
        // this.messstellenarray.push(this.messstellenStam);
        // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
}})
)
 console.log (this.messstellenarray);
 
}
//fügt die gesamte Mst ins archiv ein
archiviereMstStamm(messstellenStam:MessstellenStam){

  const body = new HttpParams()
  .set('id_mst',messstellenStam.id_mst)
  .set('namemst', messstellenStam.namemst)
  .set('idgewaesser',messstellenStam.idgewaesser)
  .set('ortslage',messstellenStam.ortslage)
  .set('see',messstellenStam.see)
  .set('repraesent',messstellenStam.repraesent)
  .set('wrrl_typ',messstellenStam.wrrl_typ)
  .set('mp_typ',messstellenStam.mp_typ)
  .set('id_wk',messstellenStam.id_wk)
  .set('eu_cd_sm',messstellenStam.eu_cd_sm)
  .set('dia_typ',messstellenStam.dia_typ)
  .set('pp_typ',messstellenStam.pp_typ)
  .set('rw_etrs',messstellenStam.rw_etrs)
  .set('hw_etrs',messstellenStam.hw_etrs)
  .set('melde_mst', messstellenStam.melde_mst)
  .set('updated_at', messstellenStam.updated_at)


  
  this.httpClient.post('http://localhost:3000/insertArchivStammMst', body).subscribe(resp => {
    console.log("response %o, ", resp);
  });
  
         
    
     //   const { id_mst,namemst, idgewaesser, ortslage, see, repraesent, natürlich, wrrl_typ, mp_typ, id_wk, eu_cd_sm, dia_typ, pp_typ, hw_etrs, rw_etrs, melde_mst } = request.body;
   
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



async getArchivMstStamm(parameter :number){ 

  let params = new HttpParams().set('mstid',parameter);
  console.log(params.toString())
 


  await this.httpClient.get('http://localhost:3000/arStammMst', {params}).forEach(formen_ => {
    this.archivMst = formen_;
    console.log(formen_);

   


  });

  
  }
}