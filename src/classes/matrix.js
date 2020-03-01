import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../constants/constants';
import { FuncPipe } from './pipes/funcPipe';
import { EndPipe } from './pipes/endPipe';
import { ConstPipe } from './pipes/constPipe';
import { DummyPipe } from './pipes/dummyPipe';
import { ConditionPipe } from './pipes/conditionPipe';
import { VarPipe } from './pipes/varPipe';
import { isMarked, sortPipe } from './pipes/pipe';
import { Context } from './context';

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

export function createPipe(snapshot) {
    switch(snapshot.type) {
        case PIPE_TYPES.END:
            return new EndPipe(snapshot.dir.top);
        case PIPE_TYPES.DUMMY:
            return new DummyPipe(...(dirToDirections(snapshot.dir)));
        case PIPE_TYPES.FUNCTION:
            return new FuncPipe(snapshot.name, dirToInTypes(snapshot.dir), snapshot.dir.bottom);
        case PIPE_TYPES.VARIABLE:
            return new VarPipe(snapshot.dir.bottom);
        case PIPE_TYPES.VALUE:
            return new ConstPipe(snapshot.value);
        case PIPE_TYPES.CONDITION:
            return new ConditionPipe();
    }
}

function getMateFunType(v) {
    const type = v.getValueType();
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return MATEFUN_TYPE.NUMBER;
        case VALUES_TYPES.FIGURE:
            return MATEFUN_TYPE.FIGURE;
        case VALUES_TYPES.POINT:
            return MATEFUN_TYPE.POINT;
        case VALUES_TYPES.COLOR:
            return MATEFUN_TYPE.COLOR;
        default:
            return "?";
    }
}

/*
* Attr:
    maxY -> 
    maxX ->
    values -> 
*/
export class MatrixPipe {

    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.funcName = 'func';
        this.clean();
    }

    getAllPipes() {
        const pipes = new Array();
        for(let i = 0; i < this.maxY; i++) {
            for(let j = 0; j < this.maxX; j++) {
                const pipe = this.value(j,i);
                if (pipe !== null && pipe !== undefined) {
                    pipes.push(pipe);
                }
            }
        }
        return pipes;
    }

    getEndPipes() {
        return this.getAllPipes()
            .filter(pipe => pipe.getType() === PIPE_TYPES.END);
    }

    clean() {
        this.values = new Array();
        for(let i = 0; i < this.maxX; i++) {
            const column = new Array();
            for(let j = 0; j < this.maxY; j++) {
                column.push(null);
            }
            this.values.push(column);
        }
    }

    value(x, y) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position")} 
        return this.values[x][y];
    }

    size() {
        return [this.maxX, this.maxY];
    }

    isValidRange(x, y) {
        return x < 0 || x >= this.maxX || y < 0 || y >= this.maxY
    }

    addPipeSnap(x, y, pipeSnap) {
        this.addPipe(x, y, createPipe(pipeSnap));
    }

    addPipe(x, y, p) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        this.values[x][y] = p;
        p.setBoard(this);
        p.setPos(x, y);
        this.updateMatrix();
    }

    updateMatrix() {
        this.getAllPipes().forEach(p => p.clean());
        const context = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context, this));
        //this.getAllPipes().filter((p) => !isMarked(context, p)).forEach((p) => p.addWarning('No procesado'))
    }

    removePipe(x, y) {
        this.values[x][y] = null
        this.updateMatrix();
    }

    process() {
        if (this.isFunction()) {
            return { isFunction: true, body:this.processFunction(this.funcName) };
        } else {
            return { isFunction: false, body:this.processInstruction() };
        }
    }

    processFunction(name) {
        const def = this.getFunctionDefinition(name)
        const code = this.getFunctionCode(name)
        return `${def}\n${code}`
    }

    processInstruction() {
        const ends = this.getEndPipes();
        const p = ends.length > 0 ? ends[0] : null;
        if (p === null)  throw new Error('Not Have valid init cell to process');
        return p.toCode(null, this);
    }

    isFunction() {
        return [...this.getAllVars(), ...this.getAllConditions()].length > 0;
    }

    getAllConditions() {
        return this.getAllPipes().filter((pipe) => pipe.getType() === PIPE_TYPES.CONDITION);
    }

    getFunctionDefinition(name) {
        console.log('Matrix.getFunctionDefinition')
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes()[0];
        const varsType = varsPipes.reduce(
            (prev, v, index) => index > 0 ? `${prev} X ${getMateFunType(v)}` :`${getMateFunType(v)}`, ''
        );
        const endType = getMateFunType(endPipe);
        return `${name} :: ${varsType} -> ${endType}`;
    }

    getFunctionCode(name) {
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes();
        const code = endPipe[0].toCode();
        return `${name}(${varsPipes.map(pipe => pipe.getName()).join(', ')}) = ${code}`
    }

    getAllVars() {
        return this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
    }

    evaluateFunction() {
        if(this.isFunction()) {
            const varsPipes = this.getAllVars();
            const varValueList = varsPipes.map((pipe) => pipe.getValueEval());
            return `${this.funcName}(${varValueList.join(', ')})`
        }
        return this.processInstruction();
    }

    snapshot() {
        let canProcess =  this.getEndPipes().length === 1;
        const snap = Array(this.maxX).fill([]).map(() => Array(this.maxY));
        for(let x = 0; x < this.maxX; x++) {
            for(let y = 0; y < this.maxY; y++) {
                const pipe = this.value(x,y);
                if (pipe !== null) {
                    snap[x][y] = pipe.snapshot();
                    canProcess = canProcess && !snap[x][y].errors
                }
            }
        }
        const canFuncEval = this.getAllVars().reduce((hasValue, pipe) => hasValue && pipe.getValue() !== undefined && pipe.getValue() !== null, true);
        console.log( { board:snap,  isFunction: this.isFunction(), canProcess, canFuncEval });
        return { board:snap,  isFunction: this.isFunction(), canProcess, canFuncEval };
    }

    setPipeValue(x, y, value) {
        const p = this.value(x, y);
        if (p !== null && p !== undefined && p.setValue) {
            p.setValue(value);
            this.updateMatrix();
        } else {
            throw new Error("No se le puede asiganr valor a el pipe")
        }
    }

    moverPipe(x, y, pos) {
        const pipe = this.value(pos.x, pos.y);
        this.values[pos.x][pos.y] = null;
        this.addPipe(x, y, pipe);
    }

    setMateFunValue(value) {
        const endPipe = this.getEndPipes()[0];
        endPipe.setMateFunValue(value);
    }

    validateMatrix() {

    }
}