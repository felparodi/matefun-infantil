import 'jasmine';
import {invertMateFun} from './invMateFunPipe'

describe("Invertir Matefun file", () => {
    //*/
    it("A single extra function", () => { 
        const text = "func1 :: R x R -> R\nfunc1(x0, x1) = (x0 * (x0 + x1))"
        const pipes = invertMateFun(text)
        expect(pipes.length).toEqual(1)
        expect(pipes[0].getName()).toEqual("func1")
    })
    //*/
    //*/
    it("A Multi extra function", () => { 
        const text = "func1 :: R x R -> R\nfunc1(x0, x1) = (x0 * (x0 + x1))\n\nfunc2 :: R x R -> R\nfunc2(x0, x1) = (x0 * (x0 + x1))\n\nfunc3 :: R x R -> R\nfunc3(x0, x1) = (x0 * (x0 + x1))\n\nfunc4 :: R x R -> R\nfunc4(x0, x1) = (x0 * (x0 + x1))"
        const pipes = invertMateFun(text)
        expect(pipes.length).toEqual(4)
        expect(pipes[0].getName()).toEqual("func1")
        expect(pipes[1].getName()).toEqual("func2")
        expect(pipes[2].getName()).toEqual("func3")
        expect(pipes[3].getName()).toEqual("func4")
    })
    //*/
    //*/
    it("A Single invalid extra function", () => { 
        const text = "func1 :: R x R x R x R -> R\nfunc1(x0, x1) = (x0 * (x0 + x1))"
        const pipes = invertMateFun(text)
    })
    //*/
    //*/
    it("A Mix valid and invalid extra function", () => { 
        const text = "func1 :: R x R x R -> R x R\nfunc1(x0, x1) = (x0 * (x0 + x1))\n\nfunc2 :: R x R -> R\nfunc2(x0, x1) = (x0 * (x0 + x1))\n\nfunc3 :: B x B x R x R -> R\nfunc3(x0, x1) = (x0 * (x0 + x1))\n\nfunc4 :: R x R -> R\nfunc4(x0, x1) = (x0 * (x0 + x1))"
        const pipes = invertMateFun(text)
    })
    //*/
});