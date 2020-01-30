import React from 'react';
import PaintBucket from '../../../icons/paint-bucket.svg'

export default class Base extends React.Component {

    render() {
        return (
            <svg viewBox="0 0 40 40">
                <path d="M 10 7 L 7 10 L 7 30 L 10 33 L 30 33 L 33 30 L 33 10 L 30 7">
                </path>
            </svg>
        )
    }
}

