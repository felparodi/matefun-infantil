import React from 'react';
import {VALUES_TYPES, } from '../../../constants/constants';
import TextIcon from './TextIcon';
import Crallon from '../../../icons/crallon.svg';

function testToColor(text) {
    switch(text) {
        case "Rojo":
            return 'red';
        case "Verde":
            return 'green'
        case "Azul":
            return 'blue';
        case "Negro":
            return 'black';
        default:
            return text;
    }
}
//TODO Agrear Mas Variantes para COLOR u otros
//TODO dobleClick
const ValueInfo = ({onClick, text, type}) => {
    switch(type) {
        case VALUES_TYPES.COLOR:
            return <Crallon onClick={onClick} style={{fill: testToColor(text)}}/>;
        default:
            return <TextIcon onClick={onClick} text={text}/>;
    }
    
}

export default ValueInfo;