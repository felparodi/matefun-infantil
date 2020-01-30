import 'jasmine';
import { DIRECTION, VALUES_TYPES } from '../constants/constants';
import { MatrixPipe } from './matrix'
import { ConstPipe } from './pipes/constPipe'
import { DummyPipe } from './pipes/dummyPipe'
import { FuncPipe } from './pipes/funcPipe'
import { EndPipe } from './pipes/endPipe'

describe("MatrixPipe class test", () => {
    //*/
    it("create single value matrix", () => { 
       const m = new MatrixPipe(5,5);
       m.addPipe(2,2, new ConstPipe(null, 3));
       m.addPipe(3,2, new EndPipe());
       expect(m.process()).toEqual("3");
    })
    //*/
    it("create single value using dummy pipe matrix", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(1,1, new ConstPipe(null, 3));
        m.addPipe(2,1, new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT));
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.BOTTOM));
        m.addPipe(3,2, new EndPipe());
        expect(m.process()).toEqual("3");
     })
    ///
    it("create single value using dummy pipe invert matrix", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(1,1, new ConstPipe(null, 3));
        m.addPipe(2,1, new DummyPipe(DIRECTION.RIGHT, DIRECTION.TOP));
        m.addPipe(2,2, new DummyPipe(DIRECTION.BOTTOM, DIRECTION.LEFT));
        m.addPipe(3,2, new EndPipe());
        expect(m.process()).toEqual("3");
    })
    ///
    it("create single value using function pipe matrix", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(0,1, new ConstPipe(null, 3));
        m.addPipe(1,1, new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM));
        m.addPipe(2,1, new FuncPipe('atoi',[VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER));
        m.addPipe(3,1, new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM));
        m.addPipe(4,1, new EndPipe());
        expect(m.process()).toEqual("atoi(3)");
    })
    //*/
    it("create single value using function double arg pipe matrix", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(0,0, new ConstPipe(null, 3));
        m.addPipe(1,0, new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT));
        m.addPipe(0,2, new ConstPipe(null, 2));
        m.addPipe(1,2, new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT));
        m.addPipe(1,1, new FuncPipe('add', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER));
        m.addPipe(2,1, new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM));
        m.addPipe(3,1, new EndPipe());
        expect(m.process()).toEqual("add(3, 2)");
    })
    //*/
    it("create single value matrix clone", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(0,0, new ConstPipe(null, 3));
        m.addPipe(1,0, new EndPipe());
        const m2 = m.clone();
        m2.addPipe(0,0, new ConstPipe(null, 2));
        expect(m.process()).toEqual("3");
        expect(m2.process()).toEqual("2");
    })
    //*/
    it("create single value using function double arg pipe matrix pending arg", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(0,0, new ConstPipe(null, 3));
        m.addPipe(1,0, new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT));
        m.addPipe(1,1, new FuncPipe('add', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER));
        m.addPipe(2,1, new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM));
        m.addPipe(3,1, new EndPipe());
        expect(m.process()).toEqual("add(3, ?)");
    })
    //*/
    it("create single value using function double arg pipe matrix using multi dummy", () => { 
        const m = new MatrixPipe(5,5);
        m.addPipe(0,0, new ConstPipe(null, 3));
        m.addPipe(1,0, new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM));
        m.addPipe(2,0, new DummyPipe(DIRECTION.TOP, DIRECTION.RIGHT));
        m.addPipe(1,1, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT));
        m.addPipe(1,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.BOTTOM));
        m.addPipe(2,2, new DummyPipe(DIRECTION.TOP, DIRECTION.LEFT));
        m.addPipe(2,1, new FuncPipe('add', [VALUES_TYPES.NUMBER, VALUES_TYPES.NUMBER], VALUES_TYPES.NUMBER));
        m.addPipe(3,1, new DummyPipe(DIRECTION.TOP, DIRECTION.BOTTOM));
        m.addPipe(4,1, new EndPipe());
        expect(m.process()).toEqual("add(3, 3)");
    })
    //*/
});