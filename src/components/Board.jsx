import React from 'react';
import Cell from './Cell'
import classNames from 'classnames';
import './Board.scss';
export default class Board extends React.Component {

    constructor(props) {
        super();
        this.handlerKeyDown = this.handlerKeyDown.bind(this);
        this.handlerKeyUp = this.handlerKeyUp.bind(this);
        this.state = {
            isCopy: false
        }
    }

    handlerKeyDown(e) {
        if(e.type === 'keydown') {
            switch(e.keyCode) {
                case 18:
                    return this.setState({isCopy: true})
            }
        }
    }

    handlerKeyUp(e) {
        if(e.type === 'keyup') {
            switch(e.keyCode) {
                case 18:
                    return this.setState({isCopy: false})
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handlerKeyDown)
        window.addEventListener('keyup', this.handlerKeyUp)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handlerKeyDown)
        window.removeEventListener('keyup', this.handlerKeyUp)
    }

    createRows() {
        const { content } = this.props;
        const {isCopy} = this.state;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={this.props.content[i][j]} 
                        onDrop={(pipe) => this.props.onDrop(i, j, pipe, {isCopy})}
                        onChangeVarValue={this.props.onChangeVarValue}>
                    </Cell>
                );
            }
            rows.push(<div className="board-row" key={i}>{cells}</div>)
        }
        return rows
    }

    render() {
        const {isCopy} = this.state;
        return (
            <div className={classNames('Board',{'copy': isCopy})} >
                {this.createRows()}
            </div>
        )
    }
}