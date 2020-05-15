import { VALUES_TYPES, MATEFUN_TYPE } from '../../constants/constants'

/*
*   @desc: Retrona si el ValueTypes es de tipo lista
*   @attr ValueTypes type: ValueTypes que se desea analizar
*   @return: Boolean
*   @scope: public
*/
export function isList(type) {
    return /LIST<.*>/.test(type);
}   

/*
*   @desc: Retorna el sub ValueTypes de un value type de tipo lista
*   @attr ValueTypes type: ValueTypes de tipo lista
*   @return: ValueTypes
*/
export function listSubType(type) {
    const regexType = /LIST<(.*)>/;
    return type.match(regexType)[1];
}

/*
*   @desc: Retorna el MatefunTypes que representa un ValueTypes
*   @attr ValueType type: ValueTypes que se desa transformar
*   @return: MateFunTypes
*   @scope: public
*/
export function getMateFunType(type) {
    switch (type) {
        case VALUES_TYPES.NUMBER:
            return MATEFUN_TYPE.NUMBER;
        case VALUES_TYPES.FIGURE:
            return MATEFUN_TYPE.FIGURE;
        case VALUES_TYPES.POINT:
            return MATEFUN_TYPE.POINT;
        case VALUES_TYPES.COLOR:
            return MATEFUN_TYPE.COLOR;
        case VALUES_TYPES.GENERIC:
            return MATEFUN_TYPE.GENERIC;
        default:
            if(isList(type)) {
                const subType = listSubType(type)
                return MATEFUN_TYPE.list(getMateFunType(subType))
            }
            return "?";
    }
}

export function listSubTypeMatefun(type) {
    return type.replace(/\*$/,'');
}

export function isMatefunList(type) {
    return type.match(/\*$/)
}

export function getMateFunPipeType(type) {
    switch (type) {
        case MATEFUN_TYPE.NUMBER:
            return VALUES_TYPES.NUMBER;
        case MATEFUN_TYPE.FIGURE:
            return VALUES_TYPES.FIGURE;
        case MATEFUN_TYPE.POINT:
            return VALUES_TYPES.POINT;
        case MATEFUN_TYPE.COLOR:
            return VALUES_TYPES.COLOR;
        case MATEFUN_TYPE.GENERIC:
            return VALUES_TYPES.GENERIC;
        default:
            if(isMatefunList(type)) {
                const subType = listSubTypeMatefun(type)
                return VALUES_TYPES.list(getMateFunPipeType(subType))
            }
            return VALUES_TYPES.UNDEFINED;
    }
}



/*
*   @desc: Devuelve si dos ValueTypess pueden machear
*   @attr ValueTypes type1: ValueTypes que se desea comparar
*   @attr ValueTypes type2: ValueTypes que se desea comparar
*   @return: Boolean
*   @scope: public
*/
export function matchTypes(type1, type2) {
    const oneNotDefined = (!isDefined(type1) && !isList(type1)) || (!isDefined(type2) && !isList(type2));
    const sameType = type1 === type2;
    const listMatch = isList(type1) && isList(type2) && matchTypes(listSubType(type1), listSubType(type2));
    return oneNotDefined || sameType|| listMatch;
}

/*
*   @desc: Devuelve un nuevo ValueTypes sustitullendo los generic del mismo
*   @attr ValueTypes type: ValueTypes que puede tener generic
*   @attr ValueTypes subsType: ValueTypes por que se desa sustituir
*   @retrun: ValueTypes
*   @scope: private
*/
function subGenericInType(type, subsType)  {
    if(isGeneric(type)) {
        return type.replace(/GENERIC/, subsType);
    } else {
        return type;
    }
}

/*
*   @desc: Devuvle una funcion que retorn susticiones  de generic de los ValueTypes que reciba
*   @attr ValueTypes subsType: ValueTypes por el que se sustitullen en la funcion
*   @return: (ValueTypes) => ValueTypes
*   @scope: public
*/
export function genericReplace(subsType) {
    return (type) => subGenericInType(type, subsType);
}

/*
*   @desc: Retorna si el ValueTypes tiene generics
*   @attr ValueTypes type: ValueTypes que se evalua
*   @return: Boolean
*   @scope: public
*/
export function isGeneric(type) {
    return /GENERIC/.test(type);
}

/*
*   @desc: Retorna si un ValueTypes es un ValueTypes definido
*   @attr ValueTypes type: ValueTypes que se desea evaluar
*   @return: Boolean
*   @scope: public
*/
export function isDefined(type) {
    const { UNDEFINED } = VALUES_TYPES;
    return type !== UNDEFINED && !isGeneric(type);
}

/*
*   @desc: Retorna el valor de ValueTypes que recibe con mejor Definido
*   @attr ValueTypes t1: ValueTypes que se desea comparar
*   @attr ValueTypes t2: ValueTypes que se desaa comparar
*   @return: Boolean
*   @scope: public
*/
export function typeCompare(t1, t2) {
    if(isDefined(t1)) { return t1; }
    if(isDefined(t2)) { return t2; }
    if(isList(t1) && isGeneric(t1)) { return t1; }
    if(isList(t2) && isGeneric(t2)) { return t2; }
    if(isGeneric(t1)) { return t1; }
    if(isGeneric(t2)) { return t2; }

    return VALUES_TYPES.UNDEFINED;
}

/*
*   @desc: Retorna el typo por el que se debe sustiuri los generic de una lista de generic
*   @attr ValueTypes genType:
*   @attr ValueTypes otherType:
*   @return: ValueTypes
*   @scope: public
*   @TODO Soprtar listas anidadas,
*           ya que por eso no se valida el nivel de profundida
*            de la lista para caclular los subtypes
*/
export function listGenericSubs(genType, otherType) {
    return listSubType(otherType)
}

/*
*   @desc: Debuevle a el ValueTypes que pertence un Value
*   @attr Value value: Value que se analiza
*   @return: ValueTypes
*   @scope: public
*/
export function evalValueType(value) {
    switch(typeof value) {
        case 'boolean': return VALUES_TYPES.BOOLEAN;
        case 'number': return VALUES_TYPES.NUMBER;
        case 'object': {
            if(value === null) return VALUES_TYPES.UNDEFINED;
            if(value.x !== undefined && value.y !== undefined)  return VALUES_TYPES.POINT;
            if(value.color) return VALUES_TYPES.COLOR;
            if (Array.isArray(value)) {
                let subType = evalValueType(value[0]);
                subType = subType !== VALUES_TYPES.UNDEFINED ? subType : VALUES_TYPES.GENERIC
                //TODO array of number
                return VALUES_TYPES.list(subType);
            }
            return VALUES_TYPES.OTHER;
        }
        default:
            return VALUES_TYPES.UNDEFINED;
    }
}

/*
*   @desc: Retorna el string que reprsenta un Value conrespecto a su tipo
*   @attr Value value: Value que se quiere tranformar
*   @attr ValueTypes type: ValueTypes que representa como se transforma
*   @return: String
*   @scope: public
*/
export const valueToString = (value, type) => {
    if(value === null || value == undefined) return '()';
    if(type === VALUES_TYPES.NUMBER) return `${value}`;
    if(type === VALUES_TYPES.BOOLEAN) return `${value}`;
    if(type === VALUES_TYPES.COLOR) return `${value.color}`;
    if(type === VALUES_TYPES.POINT) return `(${value.x}, ${value.y})`;
    return `${JSON.stringify(value)}`;
}

/*
*   @desc: Retorna las class de css que represtna un ValueTypes
*   @attr ValueTypes type: ValueTypes que se quiere saber las css class
*   @return: String
*   @scope: public
*/
export function typeToClass(type) {
    if(isList(type)) {
        return `LIST ${typeToClass(listSubType(type))}`;
    }
    return type;
}
