import 'jasmine';
import { DIRECTION } from '../constants/constants';
import { MatrixPipe } from './matrix'
import { ValPipe } from './valPipe'
import { DummyPipe } from './dummyPipe'
import { FuncPipe } from './funcPipe'
import { EndPipe } from './endPipe'

describe("MatrixPipe class test", () => {
    //*/
    it("create single value matrix", () => { 
       const m = new MatrixPipe(5,5)
       m.addPipe(2,2, new ValPipe(3, [DIRECTION.RIGHT]))
       m.addPipe(2,3, new EndPipe(DIRECTION.LEFT));
       expect(m.processFunction()).toEqual("3")
    })
    //*/
    it("create single value using dummy pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(2,1, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT))
        expect(m.processFunction()).toEqual("3")
     })
    //*/
    it("create single value using dummy pipe invert matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(2,1, new DummyPipe(DIRECTION.RIGHT, DIRECTION.LEFT))
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT))
        expect(m.processFunction()).toEqual("3")
    })
    //*/
    it("create single value using function pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(2,1, new FuncPipe('atoi',[DIRECTION.LEFT], [DIRECTION.RIGHT]))
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT))
        expect(m.processFunction()).toEqual("atoi(3)")
    })
    //*/
    it("create single value using function double arg pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(1,1, new ValPipe(2, DIRECTION.BOTTOM))
        m.addPipe(2,1, new FuncPipe('add', [DIRECTION.LEFT, DIRECTION.TOP], [DIRECTION.RIGHT]))
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT))
        expect(m.processFunction()).toEqual("add(3, 2)")
    })
    //*/
    it("create single value matrix clone", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,2, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT));
        const m2 = m.clone();
        m2.addPipe(2,2, new ValPipe(2, DIRECTION.RIGHT))
        expect(m.processFunction()).toEqual("3")
        expect(m2.processFunction()).toEqual("2")
    })
    //*/
    it("create single value using function double arg pipe matrix pending arg", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3, DIRECTION.RIGHT))
        m.addPipe(2,1, new FuncPipe('add', [DIRECTION.LEFT, DIRECTION.TOP], [DIRECTION.RIGHT]))
        m.addPipe(2,2, new DummyPipe(DIRECTION.LEFT, DIRECTION.RIGHT))
        m.addPipe(2,3, new EndPipe(DIRECTION.LEFT))
        expect(m.processFunction()).toEqual("add(3, ?)")
        expect(m.processFunction()).toEqual("add(3, ?)")
    })
    //*/
});