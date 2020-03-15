import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../constants/constants';
import {DummyPipe} from './pipes/dummyPipe';
import { isMarked, sortPipe, invertDirection, pipeDirValueType, directionMove } from './pipes/pipe';
import { Context } from './context';
import DI from '../components/pipes/dummies/DI';

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


function getArroundPos(pos, matrix) {
    const {x, y} = pos;
    const arround = []
    if(x-1 >= 0) arround.push({x:x-1, y, dir:DIRECTION.TOP});
    if(y-1 >= 0) arround.push({x, y:y-1, dir:DIRECTION.LEFT});
    if(x+1 < matrix.maxX) arround.push({x:x+1, y, dir:DIRECTION.BOTTOM});
    if(y+1 < matrix.maxY) arround.push({x, y:y+1, dir:DIRECTION.RIGHT});
    return arround;
}

function equalPos(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
class BFS {
    constructor(pos1, pos2, matrix) {
        this.peandinProces = [[pos1, []]];
        this.matrix = matrix;
        this.end = pos2;
        this.context = new Context(matrix.maxX, matrix.maxY);
    }

    procces() {
        if(this.peandinProces.length === 0) return null;
        debugger;
        const [actual, path] = this.peandinProces.shift();
        if(equalPos(actual, this.end)) { 
            return [...path, actual];
        }
        const arround = getArroundPos(actual, this.matrix);
        const childer = arround
            .filter(pos => !this.context.isMark([pos.x, pos.y]))
            .filter(pos => {
                const pipe = this.matrix.value(pos.x, pos.y);
                return !pipe || 
                    (pipe.getType() === PIPE_TYPES.DUMMY &&
                    pipe.hasDirection(invertDirection(pos.dir)));
            });
        for (let i = 0; i < childer.length; i++) {
            const p = childer[i];
            this.peandinProces.push([p, [...path, actual]]);
            this.context.mark([p.x, p.y]);
        }
        return this.procces();
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
        this.isWorking = false;
        this.clean();
    }

    startWork() {
        this.isWorking = true;
    }

    endWork() {
        this.isWorking = false;
        this.getAllPipes()
            .filter(p => p.endWork )
            .forEach(p => p.endWork());
    }

    getArroundPos() {
        const arround = []
        if(x-1 >= 0) arround.push([x-1, y]);
        if(y-1 >= 0) arround.push([x, y-1]);
        if(x+1 < this.maxX) arround.push([x+1, y]);
        if(y+1 < this.maxY) arround.push([x, y+1]);
        return arround;
    }

    getArroundPipe(x, y) {
        const arround = []
        if(x-1 >= 0) arround.push({ dir: DIRECTION.TOP, p: this.value(x-1,y) })
        if(y-1 >= 0) arround.push({ dir: DIRECTION.LEFT, p: this.value(x, y-1) })
        if(x+1 < this.maxX) arround.push({ dir: DIRECTION.BOTTOM, p: this.value(x+1,y) })
        if(y+1 < this.maxY) arround.push({ dir: DIRECTION.RIGHT, p: this.value(x,y+1) })
        return arround.filter(a => a.p);
    }

    addWorkPipe(x, y) {
        if (!this.isWorking) { throw new Error("La matrix no esta en porces de agrera working Pipe") }
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        const act = this.value(x, y)
        if(act && act.getType() !== PIPE_TYPES.DUMMY) return;
        debugger;
        const arrounds = this.getArroundPipe(x, y);
        const dir = [];
        arrounds.forEach(arr => {
            const pipe = arr.p;
            const invD = invertDirection(arr.dir);
            if(pipe.getType() === PIPE_TYPES.DUMMY && pipe.isWorking) {
                pipe.addDir(invD);
                dir.push(arr.dir);
            } else if(pipe.hasDirection(invD)) {
                dir.push(arr.dir);
            }
        })
        const newDummy =  new DummyPipe(...dir);
        newDummy.startWork()
        this.addPipeSpeed(x, y, newDummy);
        this.updateMatrix();
    }

    join(j1, j2) {
        debugger;
        const pipe1 = this.value(j1.x, j1.y);
        const pipe2 = this.value(j2.x, j2.y);
        //Validar tipos
        const [ip1x, ip1y] = directionMove([j1.x, j1.y], j1.dir);
        const [ip2x, ip2y] = directionMove([j2.x, j2.y], j2.dir);
        const toCreate = new BFS(
            { x:ip1x, y:ip1y, dir:j1.dir }, 
            { x:ip2x, y: ip2y, dir:j2.dir }, 
            this).procces();
        console.log(toCreate);
        if(toCreate) {
            toCreate.forEach((pos, index, arr) => {
                if(index < arr.length-1) {
                    const pipe = this.value(pos.x, pos.y);
                    const next = arr[index+1];
                    if(pipe) {
                        pipe.addDir(next.dir);
                    } else {
                        const invDir = invertDirection(pos.dir);
                        this.addPipeSpeed(pos.x, pos.y, new DummyPipe(invDir, next.dir));
                    }
                }
            })
            const endDir = invertDirection(toCreate[toCreate.length-1].dir);
            this.addPipeSpeed(ip2x, ip2y, new DummyPipe(endDir, invertDirection(j2.dir)))
        }
        this.updateMatrix()
        debugger
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
            const column = new Array(this.maxY);
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

    addPipeBulck(pipeBulck) {
        pipeBulck.forEach(info => {
            const {x, y} = info.pos;
            this.addPipe(x, y, info.pipe);
        })
        this.updateMatrix();
    }

    //No valida ni actualiza la matirz
    addPipeSpeed(x, y, pipe) {
        this.values[x][y] = pipe;
        pipe.setBoard(this);
        pipe.setPos(x, y);
    }

    addPipe(x, y, pipe) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        this.addPipeSpeed(x, y, pipe)
        this.updateMatrix();
    }

    updateMatrix() {
        this.getAllPipes().forEach(p => p.clean());
        const context = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context, this));
        //this.getAllPipes().filter((p) => !isMarked(context, p)).forEach((p) => p.addWarning('No procesado'))
    }

    removePipe(x, y) {
        delete this.values[x][y];
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
                if (pipe) {
                    snap[x][y] = pipe.snapshot();
                    canProcess = canProcess && !snap[x][y].errors
                }
            }
        }
        const canFuncEval = this.getAllVars().reduce((hasValue, pipe) => hasValue && pipe.getValue() !== undefined && pipe.getValue() !== null, true);
        const isFunction = this.isFunction();
        canProcess = canProcess && (!isFunction || canFuncEval);
        console.log( { board:snap,  isFunction, canProcess });
        return { board:snap,  isFunction, canProcess, isWorking: this.isWorking };
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
        delete this.values[pos.x][pos.y];
        this.addPipe(x, y, pipe);
    }

    setMateFunValue(value) {
        const endPipe = this.getEndPipes()[0];
        endPipe.setMateFunValue(value);
    }
}