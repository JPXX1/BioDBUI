export interface Messgroup {
        
        _Nr:number;
		_Messstelle: string;
		_AnzahlTaxa: number;
		_TypMP:string;
		_TypDIA:string;
		_TypWRRL:string;
		_TypPhytoBenthos:string;
		_UMG:string;
		_Veroedung:string;
		_B_veroedung:string;
		_Helo_dom:string;
		_Oekoreg:string;
		MstOK:boolean;//Mst in Stammdatenvorhanden
		OK:boolean;
		KeineMP:boolean;//kein Makrophyten
		gesamtdeckg:string;
}
