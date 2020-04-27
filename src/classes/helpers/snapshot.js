import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../../constants/constants';
import { FuncPipe } from '../pipes/funcPipe';
import { EndPipe } from '../pipes/endPipe';
import { ConstPipe } from '../pipes/constPipe';
import { DummyPipe } from '../pipes/dummyPipe';
import { ConditionPipe } from '../pipes/conditionPipe';
import { VarPipe } from '../pipes/varPipe';
import { CustomFuncPipe } from '../pipes/customFuncPipe';

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
    const inTypes = []
    if(dir.left !== undefined) { inTypes.push(dir.left); }
    if(dir.top !== undefined) { inTypes.push(dir.top); }
    if(dir.right !== undefined) { inTypes.push(dir.right); }
    return inTypes;
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
            return new FuncPipe(snapshot.name, dirToInTypes(dir), dir.bottom);
        case PIPE_TYPES.VARIABLE:
            return new VarPipe(snapshot.dir.bottom);
        case PIPE_TYPES.VALUE:
            return new ConstPipe(snapshot.value);
        case PIPE_TYPES.CONDITION:
            return new ConditionPipe();
        case PIPE_TYPES.CUSTOM:
            return new CustomFuncPipe(snapshot.name, dirToInTypes(dir), dir.bottom, snapshot.body, snapshot.icon);
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
            x: snapshot.board.length,
            y: snapshot.board[0].length,
        }
    };
    snapshot.board.forEach(row => {
        row.forEach( pipe => {
            if(pipe) {
                clean.pipes.push({
                    type: pipe.type,
                    dir: pipe.originDir ? pipe.originDir : pipe.dir,
                    name: pipe.name,
                    icon: pipe.icon,
                    value: pipe.type === PIPE_TYPES.VALUE ? pipe.value : undefined,
                    pos: pipe.pos
                })  
            }
        })
    });
    return clean;
}