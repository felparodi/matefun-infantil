import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import SpecificColorInput from '../../SpecificColorInput';
import { VALUES_TYPES } from '../../../constants/constants';
import { colorByColorValue } from './ValueInfo';
import Icon from '../../icons/Icon';
import * as icons from '../../../constants/icons';

export function hasInputValue(type) {
    return type === VALUES_TYPES.NUMBER ||
        type === VALUES_TYPES.COLOR ||
        type === VALUES_TYPES.POINT;
}

export function castValue(value, type) {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return Number(value);
        case VALUES_TYPES.COLOR:
            return value.color ? value : { color:value };
        case VALUES_TYPES.POINT:
            return { x:Number(value.x), y: Number(value.y) };
        default:
            return value;
    }
}

export const ValueInputNumber = ({value, onBlur}) => {
    const [fistTime, setFirstTime] = useState(true);
    const [temValue, setValue] = useState(value ? value : 0);
    useEffect(() => setValue(value), [value]);
    return <input className="value-input"
                ref={(input) => fistTime && setTimeout(() =>  { input && input.focus(); setFirstTime(false); })}
                onChange={(e) => e.target.value.length < 8 && setValue(e.target.value)}
                value={temValue}
                onBlur={() => onBlur(temValue)} 
                type="number"/> 
}

export const ValueInputColor = ({value, onBlur}) => {
    const colorStyle = value ? colorByColorValue(value.color) : 'black';
    const [more, setMore] = useState(false);
    return (
        <div className={ classNames("value-input color", { 'more': more })}>
            { !more &&
                <div className="color-options">
                    <div className="option black" onClick={() => onBlur('Negro') }/>
                    <div className="option red"  onClick={() => onBlur('Rojo') }/>
                    <div className="option blue"  onClick={() => onBlur('Azul') }/>
                    <div className="option green" onClick={() => onBlur('Verde') }/>
                    <div className="more-colors" onClick={() => setMore(true) }><Icon icon={icons.PALETTE}/></div>
                </div>
            }
            { more &&
               <SpecificColorInput
                    onBlur={(color) => onBlur(color, true)} 
                    value={value}/>
            }

        </div>
    );
}

export const ValueInputPoint = ({value, onBlur}) => {
    const [valueX, setValueX] = useState(value ? value.x ? value.x : 0 : 0);
    const [valueY, setValueY] = useState(value ? value.y ? value.y : 0 : 0);
    useEffect(() => { setValueX(value.x); setValueY(value.y); }, [value]);
    return (
        <div className="value-input point">
            <input value={valueX} 
                onChange={(e) => e.target.value.length < 4 && setValueX(e.target.value)}
                onBlur={() => onBlur({ x:valueX,  y:valueY})}
                className="number"
                type="number"/>
            <input  value={valueY} 
                onChange={(e) => e.target.value.length < 4 && setValueY(e.target.value)}
                onBlur={() => onBlur({ x:valueX,  y:valueY})}
                className="number"
                type="number"/>
        </div>
    );
}

export const ValueInputText = ({value, onBlur}) => {
    const [valueTemp, setValue] = useState(value);
    return <input className="value-input"
                value={valueTemp} 
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onBlur(valueTemp)}
                type="text"/> 
}


export const ValueInput = ({value, type, onBlur}) => {
    const handlerBlur = (temValue, end=false) => {
        onBlur(castValue(temValue, type), end);
    }

    switch(type) {
        case VALUES_TYPES.NUMBER:
            return <ValueInputNumber value={value} onBlur={handlerBlur}/>;
        case VALUES_TYPES.COLOR:
            return <ValueInputColor value={value} onBlur={handlerBlur}/>;
        case VALUES_TYPES.POINT:
            return <ValueInputPoint value={value} onBlur={handlerBlur}/>;
        default:
            return null;
    }
}

export default ValueInput;