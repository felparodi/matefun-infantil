import React, {useState} from 'react';
import { connect } from 'react-redux';
import { setPipeValue, joinOutput } from '../../api/board';
import './ValPipe.scss';
import {  VALUES_TYPES, DIRECTION } from '../../constants/constants';

import Output from './function-parts/Output';

export const TextValue = ({onClick, valueText}) => {
    return (
        <text x="50%" y="40%" 
        dominantBaseline="central" 
        textAnchor="middle" 
        fontSize="12" 
        onClick={onClick}
        fill='white'>
        {valueText}
        </text>
    );
}

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
            const [value, setValue] = useState(props.value && props.value.color ? props.value.color : "Verde");
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
        this.joinOutput = this.joinOutput.bind(this);
        this.onClickValue = this.onClickValue.bind(this);
    }

    joinOutput() {
        const {pipe} = this.props;
        if(pipe.pos) {
            this.props.joinOutput({...pipe.pos, dir:DIRECTION.BOTTOM})
        }
    }

    leaveEditing(value) {
        const { pipe } = this.props;
        value = castValue(value, pipe.dir.bottom);
        this.setState({ edit: false });
        this.props.setPipeValue(pipe.pos.x, pipe.pos.y, value);
    }

    onClickValue() {
        const {origin} = this.props;
        if(origin !== "toolbox") {
            this.setState({edit:true})
        }
    }
    
    render() {
        const { pipe, origin } = this.props;
        const {edit} = this.state;
        return (
            <div className="ValPipe">
                <svg viewBox="0 0 40 40">
                    <g>
                        <title>Value Bottom</title>
                        <path d="M 20 0 C 10 0 0 10 0 20 C 0 30 10 20 10 30 L 10 33 L 30 33 L 30 30 C 30 20 40 30 40 20 C 40 0 20 0 20 0 z"/>
                        <Output onClick={this.joinOutput} className={pipe.dir.bottom}></Output>
                    </g>
                    {!edit && <TextValue 
                                    onClick={this.onClickValue} 
                                    valueText={pipe.valueText}/>
                    }
                </svg>
                { edit && <InputType value={pipe.value} onBlur={this.leaveEditing} type={pipe.dir.bottom}/> }
            </div>
        )
    }
}

const mapDispath = {
    setPipeValue,
    joinOutput
}

export default connect(null, mapDispath)(ValPipe);
