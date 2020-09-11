import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import ReactTooltip from 'react-tooltip';
import { Modal, Button } from 'react-bootstrap';
import {createErrorMessage} from '../../api/toast';
import { closeImportModal, getCustomFunctionsByText, appendMyFunctions } from '../../api/matefun';
import './Import.scss';
import Icon from '../icons/Icon';
import Pipe from '../pipes/Pipe';
import * as icon from '../../constants/icons';


const PipeDisplay = ({pipes}) => (
    <React.Fragment>
        <div className='pipes'>
            {
                pipes.map((pipe, index) => 
                    <div key={`${index}-custom`}
                        className='pipe-button'
                        data-tip={`${pipe.name}`}
                        data-for='pipe-import-custom'>
                        <Pipe pipe={pipe}/>
                    </div>
                ) 
            }
        </div>
        { pipes.length > 0 && 
            <ReactTooltip
                key={pipes.reduce((p, c) => `${p}-${c}`, '')}
                id='pipe-import-custom' 
                effect='solid'
                place='bottom'
                className='pipe-button-tooltip'
                delayShow={500}
            />
        }
    </React.Fragment>
)

const UploadFile = ({onUpload}) => (
    <Dropzone onDrop={onUpload}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div className="uploaded-file drop-zone" {...getRootProps()}>
                    <input {...getInputProps()} />
                        <p><Icon icon={icon.IMPORT}/></p>
                        <p className="uploaded-file-text">Subir archivo</p>
                </div>
            </section>
        )}
    </Dropzone>
)

export class Import extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipes: [],
            textFile: '',
            name: ''
        }
        this.onUpload = this.onUpload.bind(this);
        this.onImport = this.onImport.bind(this);
    }

    componentDidUpdate(prevProp) {
        if(prevProp.open != this.props.open) {
            this.setState({  pipes: [], textFile: '', name: '' });
        }
    }

    onImport() {
        const { textFile, name } = this.state;
        this.props.appendMyFunctions(name, textFile);
    }

    onUpload(acceptedFiles) {
        acceptedFiles.forEach((file) => {
            if(file.name.endsWith('.mf')) {
                const reader = new FileReader()
                reader.onload = (event) => {    
                const textFile = reader.result;
                const pipes = getCustomFunctionsByText(textFile).map(pipe => pipe.snapshot());
                this.setState({ textFile,  pipes, name: file.name});
                }
                reader.readAsText(file);
            } else {
                createErrorMessage(file.name, 'No contiene la extensión .mf de los archivos matefun')
            }
        });
    }

    render() {
        const { pipes } = this.state;
        const {open} = this.props;
        return (
            <Modal className="Import" 
                show={open}
                onHide={() => this.props.closeImportModal()}>
                <Modal.Header closeButton>
                    <h5><Icon icon={icon.IMPORT}/> Importar funciones</h5>
                </Modal.Header>
                <div className="body">
                    {pipes.length == 0 ? 
                        <UploadFile onUpload={this.onUpload}/>
                    : 
                        <PipeDisplay pipes={pipes}/>    
                    }
                </div>
                <Modal.Footer>
                    <Button variant="primary"
                        className="mf-primary-button"
                        onClick={this.onImport}
                        disabled={!pipes.length}>
                            Importar
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    open: state.environment.modalImport
});

const mapDispatchFunction = {
    closeImportModal,
    appendMyFunctions
}

export default connect(mapStateToProps, mapDispatchFunction)(Import);
