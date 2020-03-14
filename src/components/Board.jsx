import React from 'react';
import { connect } from 'react-redux';
import { dropPipe, loadPenndingBoard} from '../api/board';
import Cell from './Cell'
import classNames from 'classnames';
import './Board.scss';


export class Board extends React.Component {

    constructor(props) {
        super();
        this.handlerKeyDown = this.handlerKeyDown.bind(this);
        this.handlerKeyUp = this.handlerKeyUp.bind(this);
        this.onDrop = this.onDrop.bind(this);
        
    }

    handlerKeyDown(e) {
        if(e.type === 'keydown') {
            switch(e.keyCode) {
               
            }
        }
    }

    handlerKeyUp(e) {
        if(e.type === 'keyup') {
            switch(e.keyCode) {
              
            }
        }
    }


    onDrop(drop) {
        this.props.dropPipe(drop);
    }


    componentDidMount() {
        window.addEventListener('keydown', this.handlerKeyDown);
        window.addEventListener('keyup', this.handlerKeyUp);
        if(this.props.hasPendding) {
            //if(confirm('Desa Cargar Pendient')) {
                this.props.loadPenndingBoard();
            //}
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handlerKeyDown);
        window.removeEventListener('keyup', this.handlerKeyUp);
    }

    createRows() {
        const { content } = this.props;
        let rows = [];
        for (let i = 0; i < content.length; i++) {
            let cells = []
            for (let j = 0; j < content[i].length; j++) {
               
                cells.push(
                    <Cell 
                        key={i + "-" + j} 
                        content={this.props.content[i][j]} 
                        posX={i}
                        posY={j}
                        onDrop={this.onDrop}>
                    </Cell>
                );
            }
            rows.push(<div className="board-row" key={i}>{cells}</div>)
        }
        return rows
    }

    render() {
        return (
            <div className='Board'>
                {this.createRows()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    content: state.matrix.board,
    hasPendding: state.matrix.hasPendding,
});

const mapDispatchToProps = {
    dropPipe,
    loadPenndingBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);