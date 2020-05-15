import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { VALUES_TYPES, PIPE_TYPES } from '../constants/constants';
import { setPipeValue } from '../api/board';
import { SketchPicker } from 'react-color';
import { typeTranslate } from './DisplayResult';

import './SelectPipeInfo.scss';

function valueToColor(value) {
    if(value) {
        switch(value.color) {
            case 'Rojo':
                return 'rgb(255,0,0)';
            case 'Verde':
                return 'rgb(0,255,0)';
            case 'Azul': 
                return 'rgb(0,0, 255)';
            case 'Negro': 
                return 'rgb(0,0,0)';
            default:
                return value.color;
        }
    } else {
        return 'rgb(0,0,0)';
    }
}

const ColorInput  = ({onBlur, value, selected}) => {
    const [tempValue, setTempValue] = useState(value);
    useEffect(() => { setTempValue(value); }, [value]);
    return (
        <SketchPicker disableAlpha={true} 
            onBlur={console.log}
            onChangeComplete={(color) => onBlur({color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`}, selected)}
            color={valueToColor(tempValue)} 
            onChange={(color) => setTempValue({color: `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`}) }/>
    );
}

const NumberInput = ({onBlur, value, selected}) => {
    const [tempValue, setTempValue] = useState(value);
    useEffect(() => { setTempValue(value); }, [value]);
    return (
        <div className="NumberInput value-info">
            <span className="label">Valor:</span>
            <input type="number"
                className="value"
                value={tempValue} 
                onBlur={() => onBlur && onBlur(tempValue, selected)}
                onChange={(e) => setTempValue(Number(e.target.value))} />
        </div>
    );
}

const PointInput = ({value, onBlur, selected}) => {
    const [valueX, setValueX] = useState(value ? value.x ? value.x : 0 : 0);
    const [valueY, setValueY] = useState(value ? value.y ? value.y : 0 : 0);
    useEffect(() => { setValueX(value.x); setValueY(value.y); }, [value]);
    return (
        <div className="PointInput">
            <div className="value-info">
                <span className="label">Valor X:</span>
                <input value={valueX} 
                    onChange={(e) => setValueX(e.target.value)}
                    onBlur={() => onBlur({ x:valueX,  y:valueY}, selected)}
                    className="value" 
                    type="number"/>
            </div>
            <div className="value-info">
                <span className="label">Valor Y:</span>
                <input  value={valueY} 
                    onChange={(e) => setValueY(e.target.value)}
                    onBlur={() => onBlur({ x:valueX,  y:valueY}, selected)}
                    className="value"
                    type="number"/>
            </div>
        </div>
    );
}


export class SelectPipeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handlerOnChange = this.handlerOnChange.bind(this);
    }

    handlerOnChange(value, selected) {
        this.props.setPipeValue(selected.x, selected.y, value);
    }

    render() {
        const { selected, matrix} = this.props;
        if(!selected) return null;
        const selectedPipe = matrix[selected.x][selected.y];
        if(!selectedPipe || (selectedPipe.type !== PIPE_TYPES.VALUE && selectedPipe.type !== PIPE_TYPES.VARIABLE)) {
            return null;
        }
        if(selectedPipe.value === null || selectedPipe.value === undefined) {
            return null;
        }
        const type = selectedPipe.dir.bottom;

        return (
            <div className="SelectPipeInfo info-panel">
                <div className="title">
                    <p>{selectedPipe.type === PIPE_TYPES.VALUE ? 'Valor' :  'Variable' }: {typeTranslate(type)}</p>
                </div>
                { type === VALUES_TYPES.NUMBER && <NumberInput value={selectedPipe.value} selected={selected} onBlur={this.handlerOnChange}/> }
                { type === VALUES_TYPES.COLOR && <ColorInput onBlur={this.handlerOnChange} selected={selected} value={selectedPipe.value}/> }
                { type === VALUES_TYPES.POINT && <PointInput value={selectedPipe.value} selected={selected} onBlur={this.handlerOnChange} />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected: state.matrix.selectedCell,
        matrix: state.matrix.board,
    }
};

const mapDispatch = {
    setPipeValue
}

export default connect(mapStateToProps, mapDispatch)(SelectPipeInfo);
