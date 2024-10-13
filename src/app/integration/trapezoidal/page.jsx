'use client'
import { InlineMath,BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useEffect,useState } from 'react';
import { evaluate } from 'mathjs';

export default function Trapezoidal(){
    const [fx,setfx] = useState('2x+2')
    const [a,seta] = useState(0)
    const [b,setb] = useState(1)
    const [h,seth] = useState()
    const [calfxx0 ,setcalfxx0] = useState()
    const [calfxx1 ,setcalfxx1] =useState()
    const [fxpushx0,setfxpushx0] = useState(fx)
    const [fxpushx1,setfxpushx1] = useState(fx)
    const [result,setResult] = useState()
    const [show,setshow] = useState(false)
    function trapezoidal(fx,x0,x1,h){
            let calfxx1 = evaluate(fx,{x:x1})
            let calfxx0 = evaluate(fx,{x:x0})
            setcalfxx0(calfxx0)
            setcalfxx1(calfxx1)
            setfxpushx0(fx.replace(/x/g, `(${x0})`))
            setfxpushx1(fx.replace(/x/g, `(${x1})`))
            let calresult = 1/2* (calfxx0+ calfxx1)*(h)
            setResult(calresult)
            setshow(true)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const x0 =a
        const x1 = b
        const h = b-a

        seth(h)
        trapezoidal(fx,x0,x1,h)
        




    }
    

    return(    
    <div className="">
        <div className="text-2xl text-blue-500 text-center pt-4">
            Trapezoidal  Rule 
            <div>
            <form onSubmit={handleSubmit}>
            <div className='pt-4'> <InlineMath math= {`\\int_{${a}}^{${b}} ${fx} \\,dx`} /></div>
            <div> <BlockMath math=' f(x)'/>
            <input type="text" className='' value={fx} onChange={(e) => setfx(e.target.value)}/>  </div>
            <div className='grid grid-cols-2 '>
            <div> <BlockMath math='a = x0' /> <input type="number" value={a} onChange={(e) => seta(e.target.value)} /></div>
            <div>  <BlockMath math='b = x1' /> <input type="number" value={b} onChange={(e)=> setb(e.target.value)} /></div>
            </div>
            <div> <button className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>submit</button></div>
            </form>
        </div>
        
        </div>

        <div className='bg-slate-200 m-10 p-8 h-auto'> solution
                {show && (
                        <div>
                                    <BlockMath math='I = \frac{1}{2} (h)(f(x_0)+f(x_1))'/>
                                    <BlockMath math='h = x_1 - x_0'/>   
                                    <BlockMath math= {`h = ${b}-${a}`}/>
                                    <BlockMath math= {`h = ${h}`}/>
                                    <BlockMath math= {`f(x) = ${fx}`}/>
                                    <BlockMath math= {`f(x_0) = ${fxpushx0} = ${calfxx0}\\quad ; x_0 = ${a} `}/>
                                    <BlockMath math= {`f(x_1) = ${fxpushx1} = ${calfxx1} \\quad; x_1 = ${b} `}/>
                                    <BlockMath math={`I = \\frac{1}{2} (${h})(${calfxx0}+${fxpushx1})`}/>
                                    <BlockMath math={`\\therefore I = ${result}`}/>


                            </div>
                )}



        </div>








    </div>
    );
}