import React, {useState} from 'react';
import './ValPipe.scss';
import {  VALUES_TYPES } from '../../constants/constants'

export const InputType = (props) => {
    switch(props.type) {
        case VALUES_TYPES.NUMBER: {
            const [value, setValue] = useState(props.value ? props.value : 0);
            return <input className="form-control"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        onBlur={() => props.onBlur(value)} 
                        type="number"/> 
        }
        case VALUES_TYPES.COLOR: {
            const [value, setValue] = useState(props.value ? props.value : "Rojo");
            return (
                <select value={value}
                    className="form-control"
                    onBlur={() => props.onBlur(value)} 
                    onChange={(e) => setValue(e.target.value)} >
                    <option value="Rojo">Rojo</option> 
                    <option value="Verde">Verde</option> 
                    <option value="Azul">Azul</option> 
                    <option value="Negro">Negro</option> 
                </select>
            );
        }
        case VALUES_TYPES.POINT: {
            //TODO Ver que se puedan cambiar mas de un a la vezs
            const [valueX, setValueX] = useState(props.value ? props.value.x ?  props.value.x : 0 : 0);
            const [valueY, setValueY] = useState(props.value ? props.value.y ? props.value.y : 0 : 0);
            return (
                <div className="form-control point">
                    <input value={valueX} 
                        onChange={(e) => setValueX(e.target.value)}
                        onBlur={() => props.onBlur({ x:valueX,  y:valueY})}
                        className="number" 
                        type="number"/>
                    <input  value={valueY} 
                        onChange={(e) => setValueY(e.target.value)}
                        onBlur={() => props.onBlur({ x:valueX,  y:valueY})}
                        className="number"
                        type="number"/>
                </div>
            );
        }
        default: {
            const [value, setValue] = useState(props.value);
            return <input className="form-control"
                        value={value} 
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => props.onBlur(value)} type="text"/> 
        }
    }
}

export const castValue = (value, type) => {
    switch(type) {
        case VALUES_TYPES.NUMBER:
            return Number(value);
        case VALUES_TYPES.COLOR:
            return { color:value }
        case VALUES_TYPES.POINT:
            return { x:Number(value.x), y: Number(value.y) }
        default:
            return value;
    }
}

export class ValPipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false
        }
        this.leaveEditing = this.leaveEditing.bind(this);
    }

    leaveEditing(value) {
        const { pipe, onChangeVarValue } = this.props;
        value = castValue(value, pipe.outType);
        this.setState({ edit: false });
        onChangeVarValue(pipe.posX, pipe.posY, value);
    }
    
    render() {
        const { pipe, origin } = this.props;
        const {edit} = this.state;
        return (
            <div className="ValPipe">
                <svg viewBox="0 0 40 40">
                    <g>
                        <title>Value Bottom</title>
                        <path d="M 20 0 C 10 0 0 10 0 20 C 0 30 10 20 10 30 L 10 40 L 30 40 L 30 30 C 30 20 40 30 40 20 C 40 0 20 0 20 0 z"/>
                    </g>
                    {!edit &&
                        <text x="50%" y="50%" 
                            dominantBaseline="central" 
                            textAnchor="middle" 
                            fontSize="15" 
                            onClick={() => origin !== "toolbox" && this.setState({edit:true})}
                            fill='white'>
                            {pipe.valueText}
                        </text>
                    }
                </svg>
                { edit && <InputType value={pipe.value} onBlur={this.leaveEditing} type={pipe.outType}/> }
            </div>
        )
    }
}

