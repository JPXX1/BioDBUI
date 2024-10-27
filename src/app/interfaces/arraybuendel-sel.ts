import {WasserkoerperStam} from '../interfaces/wasserkoerper-stam';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
import {TypWrrl} from '../interfaces/typ-wrrl';
export interface ArraybuendelSel {

mststam:MessstellenStam;
wkstam:WasserkoerperStam[];
melde:MeldeMst[];
gewaesser:TypWrrl[];
}
