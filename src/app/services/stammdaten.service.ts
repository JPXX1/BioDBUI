import { Injectable } from '@angular/core';
import { MessstellenStam } from '../interfaces/messstellen-stam';
import { WasserkoerperStam } from '../interfaces/wasserkoerper-stam';
import { TypWrrl } from '../interfaces/typ-wrrl';
import { MeldeMst } from '../interfaces/melde-mst';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StammdatenService {
  messstellenStam:MessstellenStam;
  public messstellenarray: MessstellenStam[];
  public meldemst:MeldeMst[];
  public wrrltyp:TypWrrl[];
  public diatyp:TypWrrl[];
  public mptyp:TypWrrl[];
  public pptyp:TypWrrl[];
  public gewaesser:TypWrrl[];
  public mst:any;
  public komponenten:any;
  public diatyp_t:any;
  public mptyp_t:any;
  public pptyp_t:any;
  public wrrltyp_t:any;
  public gewaesser_T:any;
  public archivMst:any;
  public archivWK:any;
  constructor( private httpClient: HttpClient) {}
  public wk:any;
  private apiUrl = environment.apiUrl;
  wkStam:WasserkoerperStam;
  public wkarray:WasserkoerperStam[];


  async holeArchivWK(parameter :number){
    await this.getArchivWKStamm(parameter);
  
  }
  


  queryArten(type: string,  ids: number[], yearFrom: number, yearTo: number, selectedItems: number[]): Observable<any> {
   
    return this.httpClient.post<any>(`${this.apiUrl}/queryArten`, { type, ids, yearFrom, yearTo, selectedItems });
  }
async holeArchiv(parameter :number){
  await this.getArchivMstStamm(parameter);

}
async startwk(kat:boolean,allewk:boolean){
  await this.holeSelectDataWK();
 
  await  this.filterWK(kat,allewk);
  //console.log(this.wk);
    }

  async start(kat:Boolean,allemst:boolean){
    await this.callBwUebersicht();
    //console.log(this.mst);
    await  this.filterMst(kat,allemst);
    //console.log(this.mst);
      }
  getStammMst() {
    return this.httpClient.get(`${this.apiUrl}/stamMst`);
  }
  getStammDiaTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamDiaTypen`);
  }
  getStammMpTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamMpTypen`);
  }
  getStammPpTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamPPTypen`);
  }
  getStammWrrlTyp() {
    return this.httpClient.get(`${this.apiUrl}/stamWRRLTypen`);
  }


  getKomponenten(){
    return this.httpClient.get(`${this.apiUrl}/tblkomp`);
    
  }
 
  getStammGewasser() {
    return this.httpClient.get(`${this.apiUrl}/stamGewaesser`);
  }
 public  getWk() {
    return this.httpClient.get(`${this.apiUrl}/stamWK`); //stamWasserkoerper   
  }
    
     
   async holeSelectDataWK() {
   
      await this.getWk().forEach(formen_ => {
        this.wk  = formen_;
        // console.log(formen_);
        // return formen_;
      });  
    
     }

    async callBwUebersicht() {

      await this.getStammMst().forEach(formen_ => {
        this.mst = formen_;
        console.log(formen_);
      });
    }
    async callDiatyp() {

      await this.getStammDiaTyp().forEach(formen_ => {
        this.diatyp_t = formen_;
        console.log(formen_);
      });
    }
    async callGewaesser() {

      await this.getStammGewasser().forEach(formen_ => {
        this.gewaesser_T = formen_;
        // console.log(formen_);
      });
    }
    async callMptyp() {

      await this.getStammMpTyp().forEach(formen_ => {
        this.mptyp_t = formen_;
        console.log(formen_);
      });
    }
    async callPptyp() {

      await this.getStammPpTyp().forEach(formen_ => {
        this.pptyp_t = formen_;
        // console.log(formen_);
      });
    }

  
    async callKomponenten() {

      await this.getKomponenten().forEach(formen_ => {
        this.komponenten = formen_;
        // console.log(formen_);
      });
    }
    async callWrrltyp() {

      await this.getStammWrrlTyp().forEach(formen_ => {
        this.wrrltyp_t = formen_;
        // console.log(formen_);
      });
    }
    async wandleTypWRRLAlle(){
      
      let temp: any = this.wrrltyp_t;
      this.wrrltyp=[];
      temp.map(async (f) => {
      if (f.seefliess!==null){
        let fliess:boolean;
      if (f.seefliess===true){fliess=false;}
      if (f.seefliess===false){fliess=true;}
        this.wrrltyp.push({id:f.id,typ:f.wrrl_typ,seefliess:f.seefliess,fliess:fliess})}
      })
    }
    async wandleTypWRRL(see:boolean){
      let fliess:boolean;
      if (see===true){fliess=false;}
      if (see===false){fliess=true;}
      let temp: any = this.wrrltyp_t;
      this.wrrltyp=[];
      temp.map(async (f) => {
        if (f.seefliess===see || f.seefliess===null){
        this.wrrltyp.push({id:f.id,typ:f.wrrl_typ,seefliess:f.seefliess,fliess:fliess})}
      })
    }

    
   neueMst(seefliess: boolean) {


    const messstellenStam_neu: MessstellenStam = {
      id_mst: 0,
      namemst: 'neue Messstelle',
      idgewaesser: 36,
      gewaessername: '',
      ortslage: '',
      see: seefliess,
      melde_mst: 1,
      melde_mst_str: '',
      repraesent: false,
      wrrl_typ: 5,
      mp_typ: 4,
      id_wk: 17,
      wk_name: '',
      eu_cd_sm: null,
      dia_typ: 5,
      pp_typ: 7,
      hw_etrs: 5821570,
      rw_etrs: 393198,
      updated_at: null,
    };
  
    this.insertNewMstStamm(messstellenStam_neu).subscribe(
      (response) => {
        if (response && response.id) {
          const neueMst: MessstellenStam = { ...messstellenStam_neu };
          neueMst.id_mst = response.id;
          this.messstellenarray.push(neueMst);
        } else {
          console.error('Response does not contain an id', response);
        }
      },
      (error) => {
        console.error('Error adding row:', error);
      }
    );
  }
  
 
 

   
    
    async wandleTypDia(diatypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.diatyp_t;
      this.diatyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
          if (f.seefliess===true){fliess=false;}
          if (f.seefliess===false){fliess=true;}
          if ((f.dia_typ!=='kein Typ' && diatypbearbeiten===true) || diatypbearbeiten===false){
          this.diatyp.push({id:f.id_dia,typ:f.dia_typ,seefliess:f.seefliess,fliess:fliess})}}else{
            if (f.seefliess===seefliess || f.seefliess===null )
              {  this.diatyp.push({id:f.id_dia,typ:f.dia_typ,seefliess:f.seefliess,fliess:fliess})}
          }
      })
      }
    async wandleTypMP(mptypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.mptyp_t;
      this.mptyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
          if (f.seefliess===true){fliess=false;}
          if (f.seefliess===false){fliess=true;}
          if ((f.mp_typ!=='kein Typ' && mptypbearbeiten===true) || mptypbearbeiten===false){
          this.mptyp.push({id:f.id,typ:f.mp_typ,seefliess:f.seefliess,fliess:fliess})}}else{
            if (f.seefliess===seefliess || f.seefliess===null )
              {  this.mptyp.push({id:f.id,typ:f.mp_typ,seefliess:f.seefliess,fliess:fliess})}
          }
      })
      }
    async wandleTypPP(pptypbearbeiten:boolean, seefliess:boolean){
      let fliess:boolean;
      let temp: any = this.pptyp_t;
      this.pptyp=[];
      temp.map(async (f) => {
        if (seefliess===null){
        if (f.seefliess===true){fliess=false;}
        if (f.seefliess===false){fliess=true;}
        if ((f.pp_typ!=='kein Typ' && pptypbearbeiten===true) || pptypbearbeiten===false){
        this.pptyp.push({id:f.id,typ:f.pp_typ,seefliess:f.seefliess,fliess:fliess})}}else{
          if (f.seefliess===seefliess || f.seefliess===null )
            {  this.pptyp.push({id:f.id,typ:f.pp_typ,seefliess:f.seefliess,fliess:fliess})}
        }
    })
    }
    async wandleGewaesser(gewaesserbearbeiten:boolean){
      let fliess:boolean;let see:boolean;
      let temp: any = this.gewaesser_T;
      this.gewaesser=[];
      temp.map(async (f) => {
        if (f.kategorie==='f'){fliess=true;see=false;}else
        if (f.kategorie==='s'){fliess=false;see=true;}
        if ((gewaesserbearbeiten===true && f.gewaessername!=='n.b.')|| (gewaesserbearbeiten===false))
        {this.gewaesser.push({id:f.idgewaesser,typ:f.gewaessername,seefliess:see,fliess:fliess})}
      })
    }
    async filterWK(kat:boolean,allewk:boolean){

   
      let temp: any = this.wk;

      this.wkarray =[];
     
      await Promise.all(
        temp.map(async (f) => {
                  
            
         
    if (allewk===false){
          if (f.see===kat){
    
          //erzeugt Array mit WK
          
         let gewasserart:boolean=true;
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
    }}else{let gewasserart:boolean=true;
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
        updated_at:f.updated_at});}})
    )
     //console.log (this.wkarray);

    }
async filterMst(kat:Boolean, alleMst:boolean){
   
  let temp: any = this.mst;

  this.messstellenarray =[];
  this.meldemst =[];
  await Promise.all(
    temp.map(async (f) => {
              
        
     
if (alleMst===false){
      if (f.see===kat){

      //erzeugt Array mit Meldemessstellen
      if (f.repraesent_mst===true){

        this.meldemst.push({id_mst: f.id_mst, namemst: f.namemst,repraesent:f.repraesent_mst});
        // console.log(f);
      }
        this.messstellenarray.push({ id_mst :f.id_mst,namemst: f.namemst,idgewaesser:f.idgewaesser,gewaessername:f.gewaessername,wk_name:f.wk_name,ortslage:f.ortslage,see:f.see,repraesent:f.repraesent_mst,melde_mst_str:f.melde_mst_str,
          melde_mst:f.melde_mst,wrrl_typ:f.wrrl_typ,mp_typ:f.mp_typ,id_wk:f.id_wk,eu_cd_sm:f.eu_cd_sm,
          dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs,updated_at:f.updated_at});
       
        // this.messstellenarray.push(this.messstellenStam);
        // else if(f.Jahr===parseInt(filter)){this.dbMPUebersichtMst.push(f)}
}}else { this.messstellenarray.push({ id_mst :f.id_mst,namemst: f.namemst,idgewaesser:f.idgewaesser,gewaessername:f.gewaessername,wk_name:f.wk_name,ortslage:f.ortslage,see:f.see,repraesent:f.repraesent_mst,melde_mst_str:f.melde_mst_str,
  melde_mst:f.melde_mst,wrrl_typ:f.wrrl_typ,mp_typ:f.mp_typ,id_wk:f.id_wk,eu_cd_sm:f.eu_cd_sm,
  dia_typ:f.dia_typ,pp_typ:f.pp_typ,hw_etrs:f.hw_etrs,rw_etrs:f.rw_etrs,updated_at:f.updated_at});}})
)
//  console.log (this.messstellenarray);
 
}



//fügt die gesamten WK ins Archiv ein
archiviereWKStamm(wasserkoerperStam:WasserkoerperStam){
         const body = new HttpParams()
        .set('id',wasserkoerperStam.id)
        .set('wk_name', wasserkoerperStam.wk_name)
        .set('see',wasserkoerperStam.see)
       
        .set('kuenstlich',wasserkoerperStam.kuenstlich)
        .set('hmwb',wasserkoerperStam.hmwb)
        .set('bericht_eu',wasserkoerperStam.bericht_eu)
        .set('id_gewaesser',wasserkoerperStam.id_gewaesser)
        .set('eu_cd_wb',wasserkoerperStam.eu_cd_wb)
        .set('land',wasserkoerperStam.land)
        .set('wrrl_typ',wasserkoerperStam.wrrl_typ)
        .set('dia_typ',wasserkoerperStam.dia_typ)
        .set('pp_typ',wasserkoerperStam.pp_typ)
        .set('mp_typ',wasserkoerperStam.mp_typ)
        .set('updated_at', wasserkoerperStam.updated_at)
        this.httpClient.post(`${this.apiUrl}/insertArchivStammWK`, body).subscribe(resp => {
    console.log("response %o, ", resp);  });
 }
 //fügt eine neue Mst in Stam_Messstellen ein
 insertNewMstStamm(messstellenStam: MessstellenStam): Observable<any> {
  const body = new HttpParams()
    .set('namemst', messstellenStam.namemst)
    .set('idgewaesser', messstellenStam.idgewaesser)
    .set('ortslage', messstellenStam.ortslage)
    .set('see', messstellenStam.see) // Konvertiere Boolean zu String
    .set('repraesent', messstellenStam.repraesent) // Konvertiere Boolean zu String
    .set('wrrl_typ', messstellenStam.wrrl_typ)
    .set('mp_typ', messstellenStam.mp_typ)
    .set('id_wk', messstellenStam.id_wk)
    .set('eu_cd_sm', messstellenStam.eu_cd_sm ? messstellenStam.eu_cd_sm.toString() : '')
    .set('dia_typ', messstellenStam.dia_typ)
    .set('pp_typ', messstellenStam.pp_typ)
    .set('rw_etrs', messstellenStam.rw_etrs)
    .set('hw_etrs', messstellenStam.hw_etrs)
    .set('melde_mst', messstellenStam.melde_mst );

  return this.httpClient.post<any>(`${this.apiUrl}/addNewMst`, body);
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


  
  this.httpClient.post(`${this.apiUrl}/insertArchivStammMst`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });
  
         
    
     //   const { id_mst,namemst, idgewaesser, ortslage, see, repraesent, natürlich, wrrl_typ, mp_typ, id_wk, eu_cd_sm, dia_typ, pp_typ, hw_etrs, rw_etrs, melde_mst } = request.body;
   
}

speichereWK(wasserkoerperStam:WasserkoerperStam){
  const body = new HttpParams()
  .set('id',wasserkoerperStam.id)
  .set('wk_name',wasserkoerperStam.wk_name)
  .set('see', wasserkoerperStam.see)
  .set('kuenstlich', wasserkoerperStam.kuenstlich)
  .set('hmwb',wasserkoerperStam.hmwb)
  .set('bericht_eu',wasserkoerperStam.bericht_eu)
  .set('id_gewaesser',wasserkoerperStam.id_gewaesser)
  .set('eu_cd_wb',wasserkoerperStam.eu_cd_wb)
  .set('land',wasserkoerperStam.land)
  .set('wrrl_typ',wasserkoerperStam.wrrl_typ)
  .set('mp_typ',wasserkoerperStam.mp_typ)
  .set('dia_typ',wasserkoerperStam.dia_typ)
  .set('pp_typ',wasserkoerperStam.pp_typ)

  
  this.httpClient.post(`${this.apiUrl}/insertStammWK`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });    
     
}
speichereMst(messstellenStam:MessstellenStam){
 
  const body = new HttpParams()
  .set('id_mst',messstellenStam.id_mst)
  .set('id_wk',messstellenStam.id_wk)
  .set('idgewaesser', messstellenStam.idgewaesser)
  .set('namemst', messstellenStam.namemst)
  .set('ortslage',messstellenStam.ortslage)
  .set('repraesent',messstellenStam.repraesent)
  .set('rw_etrs',messstellenStam.rw_etrs)
  .set('hw_etrs',messstellenStam.hw_etrs)
  .set('see',messstellenStam.see)
  


  
  this.httpClient.post(`${this.apiUrl}/insertStammMst`, body).subscribe(resp => {
    console.log("response %o, ", resp);
  });    
}



async getArchivMstStamm(parameter :number){ 

  let params = new HttpParams().set('mstid',parameter);
  console.log(params.toString())
 


  await this.httpClient.get(`${this.apiUrl}/arStammMst`, {params}).forEach(formen_ => {
    this.archivMst = formen_;
    console.log(formen_);

   


  });

  
  }
  async getArchivWKStamm(parameter :number){ 

    let params = new HttpParams().set('id',parameter);
    console.log(params.toString())
   
  
  
    await this.httpClient.get(`${this.apiUrl}/arStammWK`, {params}).forEach(formen_ => {
      this.archivWK = formen_;
      console.log(formen_);
  
     
  
  
    });
  
    
    }
    
    addRowGewaesser(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addGewaesser`, data);
    }
    addRowTypWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addTypWrrl`, data);
    }

    addRowPPWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addPPWrrl`, data);
    }
    addRowMpWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addMpWrrl`, data);
    }
    addRowDiaWRRL(data: any): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}/addDiaWrrl`, data);
    }
    aktualisierePPTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('pp_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamPPTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereMpTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('mp_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamMpTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereDiaTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id_dia',id)
      .set('dia_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamDiaTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereWrrlTyp(typwrrl:string,id:number,seefliess:boolean){

      const body = new HttpParams()
      .set('id',id)
      .set('wrrl_typ',typwrrl)
      .set('seefliess',seefliess)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamWrrlTyp`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
    aktualisiereGewaesser(gewaessername:string,id:number,seefliess:boolean){
      let kat:string;
      if (seefliess===true){kat='s'}else{kat='f'}
      const body = new HttpParams()
      .set('id',id)
      .set('name',gewaessername)
      .set('kategorie',kat)
      
     
      this.httpClient.post(`${this.apiUrl}/updateStamGewaesser`,body).subscribe(resp => {
     console.log("response %o, ", resp);  });
  
    }
}