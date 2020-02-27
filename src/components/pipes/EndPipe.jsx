import React from 'react';
import { Modal } from 'react-bootstrap';
import InputTop from './function-parts/InputTop';

export class EndPipe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showResult: false
        }
    }

    render() {
        //console.log('render EndPipe')
        const { pipe, origin } = this.props;
        return (
            <React.Fragment>
                <svg viewBox="0 0 40 40">
                    <g transform="rotate(-180 20 20)">
                        <path d="M 20 0 L 0 20 L 10 30 L 10 40 L 30 40 L 30 30 L 40 20 z"/>
                    </g>
                    <InputTop className={pipe.dir.top}/>
                    {pipe.value != null &&
                        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="35" fill='white'>
                            {pipe.value}
                        </text>
                    }
                </svg>
            </React.Fragment>
        )
    }
}
