import { FuncPipe } from '../pipes/funcPipe'
import { DIRECTION } from '../../constants/constants';

const lineFunction = /\s*(\w+)\s::\s?(.+)\s?->\s?(\w+)/
//Esta funcion agara un archivo de texto de 
//matefun y devuleve una lista de tubos custom
//que hay en ella
export function invertMateFun(text) {
    const pipes = [];
    if (text && typeof text === 'string') {
        const lines = text.split('\n');
       
        lines.forEach((line) => {
            const exec = lineFunction.exec(line)
            if (exec) {
                const name = exec[1]
                const inDir = [DIRECTION.LEFT, DIRECTION.RIGHT]
                pipes.push(new FuncPipe(name, inDir,[DIRECTION.BOTTOM]))
            }
        })
    }
    return pipes;
}