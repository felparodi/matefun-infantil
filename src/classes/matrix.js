import { PIPE_TYPES, DIRECTION, VALUES_TYPES, MATEFUN_TYPE } from '../constants/constants';
import { invertDirection, directionMove } from './helpers/direction';
import { getMateFunType } from './helpers/type';
import { sortPipe, pipeDirValueType, matchPipeTypeDir } from './helpers/pipe';
import { DummyPipe } from './pipes/dummyPipe';
import { Context } from './context';
import { BFS } from './BFSMatrix';

const DEFAULT_FUNCTION_NAME = 'func';
export function equlasPos(p1, p2) {
    return (!p1 && !p2) || (p1 && p2 && p1.x === p2.x && p1.y === p2.y);
}
/*
*   @desc: Esta classe matine la estrcutra de los blockes en forma 
*           de matriz y 
*           tambien los ustiliza para generar el codigo que
*           matefun interpreta, tanto instruciones como 
*           definicion de funciones nuevas
*   @attr private Integer maxX: Tamanio maximo en el eje X de la matriz 
*   @attr private Integer maxY: Tamanio maximo en el eje Y de la matriz
*   @attr private Array<Array<Pipe>> values: Lista de Lista que representa la matriz
*   @scope: public
*   @TODO Cambiar nombre
*/
export class MatrixPipe {

    /*
    *   @desc: Constructor de la clase, construlle la matiz vacia
    *   @attr Integer x: El tamnio maximo que se setea en el eje X
    *   @attr Integer y: El tamnio maximo que se setea en el eje Y
    *   @scope: public
    */
    constructor(x, y) {
        this.maxX = x;
        this.maxY = y;
        this.clean();
    }

    /*
    *   @desc: Desabilita que los todo pipe que tiene alguna se auto juntan cuando estan en modo Working
    *   @TODO: working se podria converti en autoJoin para tener mas sentido
    *   @return: void
    *   @scope: public
    */
    endWork() {
        this.getAllPipes()
            .filter(p => p.endWork )
            .forEach(p => p.endWork());
    }

    /*
    *   @desc: Retorna lista de posisiones alreder de un punto
    *   @attr Posicion pos: Posicion de la que se quiere concer las posiciones al rededor
    *   @return: List<Posicion>
    *   @scope: public 
    */
    getArroundPos(pos) {
        const {x, y} = pos;
        const arround = []
        if(x-1 >= 0) arround.push({x:x-1, y, dir:DIRECTION.TOP});
        if(y-1 >= 0) arround.push({x, y:y-1, dir:DIRECTION.LEFT});
        if(x+1 < this.maxX) arround.push({x:x+1, y, dir:DIRECTION.BOTTOM});
        if(y+1 < this.maxY) arround.push({x, y:y+1, dir:DIRECTION.RIGHT});
        return arround;
    }

    /*
    *   @desc: Retorna todos los Pipe al rededor de una posicion
    *   @attr: Position pos: Posision de la que se quiren los tubos alredero
    *   @return: List<Pipe>
    *   @scope: public
    */
    getArroundPipe(pos) {
        const arround = this.getArroundPos(pos).map((arr) => {
            const {x, y} = arr;
            return { dir: arr.dir, p: this.value(x,y) };
        })
        return arround.filter(a => a.p);
    }

    /*
    *   @desc: Agrega una DummyPipe en estado 'working' en la posicion indicada
    *       conectado con todos los tubos que pueda a su al rededor, 
    *       tambien le aniade conexiones a todos los tubos en estado working a su alredero.
    *   @attr Position pos: Posicion que se utliza para crear la DummyPipe
    *   @return: void
    *   @scope: private
    */
    addDummyWorkingPipe(pos) {
        const arrounds = this.getArroundPipe(pos);
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
        newDummy.startWork();
        this.addPipeSpeed(pos, newDummy);
    }

    /*
    *   @desc: Agrega un tuberia Dummy en estado 'working' si es posible, 
    *         tambien la une con todas tuberias que le corresponda
    *   @attr Position pos: 
    *   @TODO: Ver un nombre mejor como addAutoJoinPipe
    *   @return: void
    *   @scope: public
    */
    addWorkPipe(pos) {
        const {x, y} = pos;
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        const act = this.value(x, y)
        if(act && act.getType() !== PIPE_TYPES.DUMMY) return;
        this.addDummyWorkingPipe(pos);
        this.cleanEndValues();
        this.updateMatrix();
    }

    /*
    *   @desc: Crear los DummyPipe conectados entre si que esta en 
    *      el camino "toCreate" hasta la posicion "end"
    *   @attr List<Position> toCreate: Lista de Posiciones que llegan a la posicion "end"
    *   @attr Position end: Position final que se desea llegar
    *   @return: void
    *   @scope: private
    */
    cratedJoinPipe(toCreate, end) {
        if(toCreate) {
            toCreate.forEach((pos, index, arr) => {
                if(index < arr.length-1) {
                    const pipe = this.value(pos.x, pos.y);
                    const next = arr[index+1];
                    if(pipe) {
                        pipe.addDir(next.dir);
                    } else {
                        const invDir = invertDirection(pos.dir);
                        this.addPipeSpeed(pos, new DummyPipe(invDir, next.dir));
                    }
                }
            })
            const endInDir = invertDirection(toCreate[toCreate.length-1].dir);
            const endOutDir =  invertDirection(end.dir);
            this.addPipeSpeed(end, new DummyPipe(endInDir, endOutDir));
        }
    }

    /*
    *   @desc: Crea un camino de DummyPipe de la PositionDirection "j1" al "j2"
    *   @attr PositionDirection j1: PositionDirection inicial del camino
    *   @attr PositionDirection j2: PositionDirection final del camino 
    *   @scope: public
    */
    join(j1, j2) {
        if(equlasPos(j1, j2)) return;
        const pipe1 = this.value(j1.x, j1.y);
        const pipe2 = this.value(j2.x, j2.y);
        if(matchPipeTypeDir(pipe1, j1.dir, pipe2, j2.dir)) {
            const start = { ...directionMove(j1, j1.dir), dir:j1.dir };
            const end = { ...directionMove(j2, j2.dir), dir:j2.dir };
            const toCreate = new BFS(start, end, this).procces();
            this.cratedJoinPipe(toCreate, end);
            this.cleanEndValues();
            this.updateMatrix()
        } else {
            throw new Error('No mapena tipos lo que se quiere unir');
        }
    }

    /*
    *   @desc: Debuelve la lista de todos los Pipe que hay en la matriz
    *   @retun: List<Pipe>
    *   @scope: private
    */
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

    /*
    *   @desc: Retorna la lista de todos los EndPipe en la matriz
    *   @return List<EndPipes>
    *   @scope: private
    */
    getEndPipes() {
        return this.getAllPipes()
            .filter(pipe => pipe.getType() === PIPE_TYPES.END);
    }

    /*
    *   @desc: Limpia todos los Pipe de la matriz
    *   @return: void
    *   @scope: public
    */
    clean() {
        this.values = new Array();
        for(let i = 0; i < this.maxX; i++) {
            const column = new Array(this.maxY);
            this.values.push(column);
        }
    }

    /*
    *   @desc: Devuelve la Pipe que este en la posicion indicad en la matriz
    *   @TODO Ver solo con la structura Position
    *   @attr Int x: Valor de la posicion en el eje X
    *   @attr Int y: Valor de la posicion en el eje Y
    *   @return: Pipe
    *   @scope: public
    */
    value(x, y) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position")} 
        return this.values[x][y];
    }

    /*
    *   @desc: Retrona el tamanio de la matriz
    *   @return: [Int, Int]
    *   @scope: public
    */
    size() {
        return [this.maxX, this.maxY];
    }

    /*
    *   @desc: Devuelve si la posicion esta en un rango valido
    *   @attr Int x: Valor de la posicion en el eje X
    *   @attr Int y: Valor de la posicion en el eje Y
    *   @return: Boolean
    *   @scope: private 
    */
    isValidRange(x, y) {
        return x < 0 || x >= this.maxX || y < 0 || y >= this.maxY
    }

    /*
    *   @desc: Agrega todos los Pipe a la matriz en la posicion indicada, 
    *           limpia los valores finales y actualiza la informacion de la matriz
    *   @attr List<PositionPipe> pipeBulck: Lista de Pipe y sus posiciones a agregar
    *   @return void
    *   @socpe public
    */
    addPipeBulck(pipeBulck) {
        pipeBulck.forEach(info => {
            this.addPipeSpeed(info.pos, info.pipe);
        })
        this.cleanEndValues();
        this.updateMatrix();
    }

    /*
    *   @desc: Agrega una tuberi a un posicion sin valida ni actualiza la matirz
    *   @attr Position pos: Posicion en la que se quiere agregar el 'pipe'
    *   @attr Pipe pipe: Pipe que se quiere ageregar
    *   @return: void
    *   @scope: private
    */
    addPipeSpeed(pos, pipe) {
        const {x, y} = pos;
        this.values[x][y] = pipe;
        pipe.setBoard(this);
        pipe.setPos(x, y);
    }

    /*
    *   @desc: Agreaga un Pipa a una pisicon si esta es valida, 
            limpia los valores finales y a actualiza la informacion de la matrix
    *   @attr Int x:
    *   @attr Int y:
    *   @attr Pipe pipe:
    *   @scope: public
    */
    addPipe(x, y, pipe) {
        if (this.isValidRange(x,y)) { throw new Error("Exist pipe in this position") }
        this.addPipeSpeed({x, y}, pipe)
        this.cleanEndValues();
        this.updateMatrix();
    }

    /*
    *   @desc: Actualiza la informacion de la matriz, calculando todos los tipos que no estan asignados
    *        de los Pipe de las matriz,  
    *        si esta ta tiene una estructura consitente
    *   @retrun: void
    *   @scope: public
    */
    updateMatrix() {
        this.getAllPipes().forEach(p => p.clean());
        const context = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context, this));
        //Con dos veces se calcula mejor porque siemrpoe queda algo suelto, ver mejor la algorimia
        const context2 = new Context(this.maxX, this.maxY);
        this.getAllPipes().sort(sortPipe).forEach(p => p.calc(context2, this));
    }

    /*
    *   @desc: Remueve un pipe de la poscion indicadado,
    *    limpia los valors finales y actualuza la informacion de la matriz
    *   @attr Int x: Valor del eje X en la posicion
    *   @attr Int y: Valor del eje Y en la posicion
    *   @return: void
    *   @scope: public
    */
    removePipe(x, y) {
        delete this.values[x][y];
        this.cleanEndValues();
        this.updateMatrix();
    }

    /*
    *   @desc: Retorna si es una funcion lo que se proceso o un instrucion y el conteniod que la misma tiene para
    *       ejecutarse o guardares en un archivo Matefun para se usada en el futuro
    *   @attr String name: Nombre de la funcion en caso de que sea una lo que se cosntruye
    *   @return: ProcessInfo
    *   @scope: public
    */
    process(name=DEFAULT_FUNCTION_NAME) {
        if (this.isFunction()) {
            return { isFunction: true, body:this.processFunction(name) };
        } else {
            return { isFunction: false, body:this.processInstruction() };
        }
    }

    /*
    *   @desc: Retorna el contenido de una una funcion que se puede guardar en un archivo de Matefun
    *   @attr String name: Nombre de la funcion que se construye
    *   @return: String
    *   @scope: private
    */
    processFunction(name) {
        const def = this.getFunctionDefinition(name)
        const code = this.getFunctionCode(name)
        return `${def}\n${code}`
    }

    /*
    *   @desc: Debuelve la instrucion que representa el arbol contenido en la matriz.
    *           Se asume que la raiz es el unico EndPipe en la misma
    *   @return: String
    *   @scope: private
    */
    processInstruction() {
        const ends = this.getEndPipes();
        const p = ends.length > 0 ? ends[0] : null;
        if (p === null)  throw new Error('Not Have valid init cell to process');
        return p.toCode(null, this);
    }

    /*
    *   @desc: Devuelve si la matriz contiene una funcion 
    *   @retrun: Boolean
    *   @scope: private
    */
    isFunction() {
        return [...this.getAllVars(), ...this.getAllConditions()].length > 0;
    }

    /*
    *   @desc: Retorna todas las ConditionPipe que estan en la matriz
    *   @return: Boolean
    *   @scope: private
    */
    getAllConditions() {
        return this.getAllPipes().filter((pipe) => pipe.getType() === PIPE_TYPES.CONDITION);
    }

    /*
    *   @desc: Retrona la definicion de la funcion que se utiliza en un archivo Matefun
    *   @attr String name: Nombre de la funcion a definir
    *   @return: String
    *   @scope: private
    */
    getFunctionDefinition(name) {
        console.log('Matrix.getFunctionDefinition')
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes()[0];
        const varsType = varsPipes.reduce(
            (prev, v, index) => index > 0 ? `${prev} X ${getMateFunType(v.getValueType())}` :`${getMateFunType(v.getValueType())}`, ''
        );
        const endType = getMateFunType(endPipe.getValueType());
        return `${name} :: ${varsType} -> ${endType}`;
    }

    /*
    *   @desc: Retorna el codigo representa la implementacion de una funcion para un archivo de Matefun
    *   @attr String name: Nombre de la funcion que se desa implementar
    *   @return: String
    *   @scope: private
    */
    getFunctionCode(name) {
        const varsPipes = this.getAllVars();
        const endPipe = this.getEndPipes();
        const code = endPipe[0].toCode();
        return `${name}(${varsPipes.map(pipe => pipe.getName()).join(', ')}) = ${code}`
    }

    /*
    *   @desc: Debuelve la lista de todas la VarPipe que contine la matriz
    *   @return: List<VarPipe>
    *   @scope: private
    */
    getAllVars() {
        return this.getAllPipes().filter(pipe => pipe.getType() === PIPE_TYPES.VARIABLE);
    }

    /*
    *   @desc: Retorna la instrucion de ejecucion de una funcion con los valores cargados en las variables
    *   @attr String name: Nombre de la funcion que se desea ejecutar
    *   @return: String
    *   @scope: public
    */
    evaluateFunction(name=DEFAULT_FUNCTION_NAME) {
        if(this.isFunction()) {
            const varsPipes = this.getAllVars();
            const varValueList = varsPipes.map((pipe) => pipe.getValueEval());
            return `${name}(${varValueList.join(', ')})`
        }
        return this.processInstruction();
    }

    /*
    *   @desc: Retorna una estructura de Snapshot de la matriz para trabajar con ella 
    *       sin modificar la memoria de las misma
    *   @return: SnapMatrix
    *   @scope: public
    */
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
        return { board:snap,  isFunction, canProcess };
    }

    /*
    *   @desc: Set un valor en el Pipe de la posicion si es que este puede contener el mismo 
    *      y limpia los valores finales
    *   @attr Int x: Valor en el eje X de la posicion
    *   @attr Int y: Valor en el eje Y de la posicion
    *   @attr Value value: Valor que se desea asignar
    *   @return: void
    *   @scope: public
    */
    setPipeValue(x, y, value) {
        const p = this.value(x, y);
        if (p !== null && p !== undefined && p.setValue) {
            p.setValue(value);
            this.cleanEndValues();
        } else {
            throw new Error("No se le puede asiganr valor a el pipe")
        }
    }

    /*
    *   @desc: Mueve la tuberia de una posicion a otra, 
    *           limpia los valores finales y 
    *           actualiza la informacion de la matriz
    *   @attr Int x:
    *   @attr Int y:
    *   @attr Position pos:
    *   @return: void 
    *   @scope: public
    */
    moverPipe(x, y, pos) {
        const pipe = this.value(pos.x, pos.y);
        delete this.values[pos.x][pos.y];
        this.addPipe(x, y, pipe);
        this.cleanEndValues();
        this.updateMatrix();
    }

    /*
    *   @desc: Setea un EndValue en una tuberia final
    *   @attr EndValue value: Valor que se desa setear
    *   @return: void
    *   @scope: public
    */
    setMateFunValue(value) {
        const endPipe = this.getEndPipes()[0];
        endPipe.setValue(value);
    }

    /*
    *   @desc: Limpia los valores finales, estos son los valores en las EndPipe
    *   @return: void
    *   @scope: private
    */
    cleanEndValues() {
        this.getEndPipes().forEach(p => p.setValue(null));
    }
}