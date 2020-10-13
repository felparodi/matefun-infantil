import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../../constants/constants';
import { EndPipe } from '../pipes/endPipe';
import { ConstPipe } from '../pipes/constPipe';
import { DummyPipe } from '../pipes/dummyPipe';
import { ConditionPipe } from '../pipes/conditionPipe';
import { VarPipe } from '../pipes/varPipe';
import { CustomFuncPipe } from '../pipes/customFuncPipe';
import { getDefaultFunction } from '../../constants/functions';

/*
*   @desc: Retorna una lista de Direction apartir de un DirectionType
*   @attr DirtectionType dir: DirectionType del que se quiren averiguar direciones 
*   @return: Array<Direction>
*   @scope: private
*/
function dirToDirections(dir) {
    const directions = []
    if(dir.left) { directions.push(DIRECTION.LEFT); }
    if(dir.top) { directions.push(DIRECTION.TOP); }
    if(dir.right) { directions.push(DIRECTION.RIGHT); }
    if(dir.bottom) { directions.push(DIRECTION.BOTTOM); }
    return directions;

}

/*
*   @desc: Retorna la lista de los ValueType de entrada que represent 
*           una DirtectionType
*   @attr DirectonType dir:
*   @return Array<ValueType>
*   @scope: private
*/
function dirToInTypes(dir) {
    return [dir.left, dir.top, dir.right].filter(d => d);
}

/*
*   @desc: Crea un Pipe que corresponede al AnySnapPipe que recibe
*   @attr AnySnapPipe snapshot: AnySnapPipe apartir de la que se crea la Pipe
*   @return: Pipe
*   @scope: public
*/
export function createPipeToSnap(snapshot) {
    const dir = snapshot.originDir ? snapshot.originDir: snapshot.dir;
    switch(snapshot.type) {
        case PIPE_TYPES.END:
            return new EndPipe(snapshot.dir.top);
        case PIPE_TYPES.DUMMY:
            return new DummyPipe(...(dirToDirections(snapshot.dir)));
        case PIPE_TYPES.FUNCTION:
            return getDefaultFunction(snapshot.name);
        case PIPE_TYPES.VARIABLE:
            return new VarPipe(snapshot.dir.bottom);
        case PIPE_TYPES.CONST:
            return new ConstPipe(snapshot.value);
        case PIPE_TYPES.CONDITION:
            return new ConditionPipe();
        case PIPE_TYPES.CUSTOM:
            const {dir} = snapshot;
            const inTypes = dirToInTypes(dir);
            const outType = dir.bottom;
            const metadata = snapshot.body
            const icon = snapshot.icon;
            return new CustomFuncPipe(snapshot.name, inTypes, outType, metadata, icon);
    }
}

/*
*   @desc: Devuevle una CleanSanpMatrix aprtir de una SnapMatrix para que 
*           no se manjen datos que son post calcuado por la Matiz
*   @attr SnapMatix snapshot: SnapMatrix que se desa tener de maner mas sensilla
*   @return: CleanSnapMatrix
*   @scope: public       
*/
export function cleanSnapshotMatrixInfo(snapshot) {
    const clean = { 
        pipes:[], 
        size: {
            x: snapshot.matrix.length,
            y: snapshot.matrix[0].length,
        }
    };
    snapshot.matrix.forEach(row => {
        row.forEach( pipe => {
            if(pipe) {
                clean.pipes.push({
                    type: pipe.type,
                    dir: pipe.originDir ? pipe.originDir : pipe.dir,
                    name: pipe.name,
                    value: pipe.type === PIPE_TYPES.CONST ? pipe.value : undefined,
                    pos: pipe.pos,
                    icon: pipe.icon
                })  
            }
        })
    });
    return clean;
}