import { PIPE_TYPES } from '../../constants/constants';

import { FuncPipe } from './funcPipe';


/*
*   @desc: 
*   @attr private String body: "JSON de como se costruyo la tuberia"
*   @attr private String icon:
*/
export class CustomFuncPipe extends FuncPipe {

    /*
    *   @desc: Constructor
    *   @attr String name:
    *   @attr Array<ValueType> inTypes:
    *   @attr ValueType outType:
    *   @attr String body:
    *   @scope: public
    */
    constructor(name, inTypes, outType, body="{}", icon='') {
       super(name, inTypes, outType);
       this.body = body;
       this.icon = icon;
    } 

    /*
    *   @desc: Devuelve el PipeType que representa a la CustomFuncPipe
    *   @return: PipeValue
    *   @scope: public
    *   @override
    */
    getType() {
        return PIPE_TYPES.CUSTOM;
    }

    toTree() {
        const tree = super.toTree();
        return {
            ...tree,
            subType: 'custom'
        };
    }

    snapshot() {
        return {
            ...super.snapshot(),
            icon: this.icon,
            body: this.body
        }
    }
}