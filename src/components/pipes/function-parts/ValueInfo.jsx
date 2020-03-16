import React from 'react';
import TextIcon from './TextIcon';

//TODO Agrear Mas Variantes para COLOR u otros
//TODO dobleClick
const ValueInfo = ({onClick, text, type}) => {
    return <TextIcon onClick={onClick} text={text}/>;
}

export default ValueInfo;