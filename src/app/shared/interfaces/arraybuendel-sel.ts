import {WasserkoerperStam} from 'src/app/shared/interfaces/wasserkoerper-stam';
import { MessstellenStam } from 'src/app/shared/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/shared/interfaces/melde-mst';
import {TypWrrl} from 'src/app/shared/interfaces/typ-wrrl';
export interface ArraybuendelSel {

mststam:MessstellenStam;
wkstam:WasserkoerperStam[];
melde:MeldeMst[];
gewaesser:TypWrrl[];
}
