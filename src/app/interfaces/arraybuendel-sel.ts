import {WasserkoerperStam} from '../interfaces/wasserkoerper-stam';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';
import { MeldeMst } from 'src/app/interfaces/melde-mst';
export interface ArraybuendelSel {

mststam:MessstellenStam;
wkstam:WasserkoerperStam;
melde:MeldeMst[];

}
