import React  from 'react';
import {VALUES_TYPES, } from '../../../constants/constants';
import TextIcon from '../../icons/TextIcon';
import Crallon from '../../../icons/crallon.svg';

export function colorByColorValue(value) {
    switch(value) {
        case 'Negro':
            return 'black';
        case 'Azul':
            return 'blue';
        case 'Rojo':
            return 'red';
        case 'Verde':
            return 'green';
        default:
            return value
    }
}

const ValueInfo = ({onClick, text, type}) => {
    switch(type) {
        case VALUES_TYPES.COLOR:
            return (
                <Crallon 
                    onClick={onClick}
                    style={{fill: colorByColorValue(text)}}/>
            );
        default:
            return (
                <TextIcon 
                    onClick={onClick} 
                    text={text}/>
            );
    }
    
}

export default ValueInfo;