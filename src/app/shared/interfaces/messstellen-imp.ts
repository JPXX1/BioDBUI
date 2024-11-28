import { Uebersicht } from '../interfaces/uebersicht';

export interface MessstellenImp {
    id_mst:number;
    id_para:number;
    id_import:number;
    datum:string;
    id_einh:number;
    id_pn:number;
    wert:string;
    uebersicht:Uebersicht;
    jahr?: string;
}
