import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../../constants/constants';
import { FuncPipe } from '../pipes/funcPipe';
import { EndPipe } from '../pipes/endPipe';
import { ConstPipe } from '../pipes/constPipe';
import { DummyPipe } from '../pipes/dummyPipe';
import { ConditionPipe } from '../pipes/conditionPipe';
import { VarPipe } from '../pipes/varPipe';

function dirToDirections(dir) {
    const directions = []
    if(dir.left) { directions.push(DIRECTION.LEFT); }
    if(dir.top) { directions.push(DIRECTION.TOP); }
    if(dir.right) { directions.push(DIRECTION.RIGHT); }
    if(dir.bottom) { directions.push(DIRECTION.BOTTOM); }
    return directions;

}

function dirToInTypes(dir) {
    const inTypes = []
    if(dir.left) { inTypes.push(dir.left); }
    if(dir.top) { inTypes.push(dir.top); }
    if(dir.right) { inTypes.push(dir.right); }
    return inTypes;
}

export function createPipeToSnap(snapshot) {
    switch(snapshot.type) {
        case PIPE_TYPES.END:
            return new EndPipe(snapshot.dir.top);
        case PIPE_TYPES.DUMMY:
            return new DummyPipe(...(dirToDirections(snapshot.dir)));
        case PIPE_TYPES.FUNCTION:
            return new FuncPipe(snapshot.name, dirToInTypes(snapshot.originDir), snapshot.originDir.bottom);
        case PIPE_TYPES.VARIABLE:
            return new VarPipe(snapshot.dir.bottom);
        case PIPE_TYPES.VALUE:
            return new ConstPipe(snapshot.value);
        case PIPE_TYPES.CONDITION:
            return new ConditionPipe();
    }
}

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
                    dir: pipe.dir,
                    originDir: pipe.originDir,
                    name: pipe.name,
                    value: pipe.value,
                    pos: pipe.pos
                })  
            }
        })
    });
    return clean;
}