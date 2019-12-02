import 'jasmine';
import { MatrixPipe, LEFT, RIGHT, DOWN, UP } from './matrix'
import { ValPipe, TYPE_NUMBER, TYPE_BOOLEAN, TYPE_STRING } from './valPipe'
import { DummyPipe } from './dummyPipe'
import { FuncPipe } from './funcPipe'
import { EndPipe } from './endPipe'

describe("MatrixPipe class test", ()=>{
    it("create single value matrix", () => { 
       const m = new MatrixPipe(5,5)
       m.addPipe(2,2, new ValPipe(3))
       m.addPipe(2,3, new EndPipe())
       m.join(2,2, true, [RIGHT])
       expect(m.processFunction()).toEqual("3 : <NUMBER>")
    })
    it("create single value using dummy pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3))
        m.addPipe(2,1, new DummyPipe())
        m.addPipe(2,2, new DummyPipe())
        m.addPipe(2,3, new EndPipe())
        m.join(2,0, true, [RIGHT])
        m.join(2,1, true, [RIGHT])
        m.join(2,2, true, [RIGHT])
        expect(m.processFunction()).toEqual("3 : <NUMBER>")
     })
     it("create single value using function pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3))
        m.addPipe(2,1, new FuncPipe('atoi',[TYPE_NUMBER], [TYPE_STRING]))
        m.addPipe(2,2, new DummyPipe())
        m.addPipe(2,3, new EndPipe())
        m.join(2,0, true, [RIGHT])
        m.join(2,1, true, [RIGHT])
        m.join(2,2, true, [RIGHT])
        expect(m.processFunction()).toEqual("atoi(3) : <STRING>")
     })
     it("create single value using function pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3))
        m.addPipe(1,1, new ValPipe(2))
        m.addPipe(2,1, new FuncPipe('add',[TYPE_NUMBER, TYPE_NUMBER], [TYPE_NUMBER]))
        m.addPipe(2,2, new DummyPipe())
        m.addPipe(2,3, new EndPipe())
        m.join(2,0, true, [RIGHT])
        m.join(1,1, true, [DOWN])
        m.join(2,1, true, [RIGHT])
        m.join(2,2, true, [RIGHT])
        expect(m.processFunction()).toEqual("add(3, 2) : <NUMBER>")
     })
     it("create single value using function pipe matrix", () => { 
        const m = new MatrixPipe(5,5)
        m.addPipe(2,0, new ValPipe(3))
        m.addPipe(1,1, new ValPipe(2))
        m.addPipe(2,1, new FuncPipe('duplicate',[TYPE_NUMBER, TYPE_NUMBER], [TYPE_NUMBER, TYPE_NUMBER]))
        m.addPipe(2,2, new FuncPipe('add',[TYPE_NUMBER, TYPE_NUMBER], [TYPE_NUMBER]))
        m.addPipe(2,3, new EndPipe())
        m.join(2,0, true, [RIGHT])
        m.join(1,1, true, [DOWN])
        m.join(2,1, true, [RIGHT])
        m.join(2,2, true, [RIGHT])
        expect(m.processFunction()).toEqual("add(duplicate(3, 2)) : <NUMBER>")
     })
});