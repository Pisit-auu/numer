'use client'
import { InlineMath,BlockMath } from 'react-katex';
import {useState,useEffect} from 'react'
import 'katex/dist/katex.min.css';
import { evaluate } from 'mathjs';



export default function Simpson(){
const [fx,setfx] = useState('2x+2');
const [a,seta] = useState(1)
const [b,setb] = useState(2)
const [x1,setx1] = useState(2)
const [h,seth] = useState()
const [xi,setxi] = useState([])
const [fxpushx0,setfxpushx0] = useState()
const [fxpushx1,setfxpushx1] = useState()
const [fxpushx2,setfxpushx2] = useState()
const [show,setshow] = useState(false)
const [result,setresult] = useState()
function simpson(x0,x1,x2,h,fx){
    let xi=[]
    xi[0] = evaluate(fx,{x:x0})
    xi[1] = evaluate(fx,{x:x1})
    xi[2] = evaluate(fx,{x:x2})
    setxi(xi)
    let result = (1/3)*(h)*(xi[0]+(4*xi[1])+(xi[2]))
    setresult(result)
}
const handlesubmit = (event)=>{
    event.preventDefault();
    const x0 =a;
    const x2 =b;
    const x1 = x0+(b-a)/2;
    setx1(x1)
    const h =  x1-x0
    seth(h)
    setfxpushx0(fx.replace(/x/g, `(${x0})`))
    setfxpushx1(fx.replace(/x/g, `(${x1})`))
    setfxpushx2(fx.replace(/x/g, `(${x2})`))
    simpson(x0,x1,x2,h,fx)

    setshow(true)

}
return(
    <div>
            <div>
                    <div className="text-2xl text-blue-500 text-center pt-4">Simpson Rule
                        <div> 
                                <form onSubmit={handlesubmit}>
                                    <div> <InlineMath math={`\\int_{${a}}^{${b}} ${fx} \\,dx`} /> </div>
                                    <input type='text' className='' value={fx} onChange={(e)=>setfx(e.target.value)} />
                                    <div className='grid grid-cols-2'>
                                    <div><BlockMath math='a=x_0'/><input type='number' value={a} onChange={(e)=> seta(e.target.value)} /></div>
                                    <div><BlockMath math='b=x_1'/><input type='number' value={b} onChange={(e)=> setb(e.target.value)} /></div>
                                    </div>
                                    <div><button className='bg-blue-500 text-white px-4 py-2 rounded my-5'>submit</button></div>
                                </form>


                        </div>
                    </div>
                
            </div>

            <div className='bg-slate-200 m-10 p-8 h-auto'> solution
        { show&& (
                    <div>
                            <BlockMath math='I = \frac{1}{3}(h)(f(x_0)+4f(x_1)+f(x_2))'/>
                            <BlockMath math='h = \frac{(b-a)}{2}'/>
                            <BlockMath math={`h = \\frac{(${b}-${a})}{2}`}/>
                            <BlockMath math={`h = ${h}`}/>
                            <BlockMath math= {`f(x_1) = ${fxpushx0} = ${xi[0]} \\quad; x_1 = ${a} `}/>
                            <BlockMath math= {`f(x_1) = ${fxpushx1} = ${xi[1]} \\quad; x_1 = ${x1} `}/>
                            <BlockMath math= {`f(x_1) = ${fxpushx2} = ${xi[2]} \\quad; x_1 = ${b} `}/>
                            <BlockMath math={`I = \\frac{1}{3}(${h})(${xi[0]}+4(${xi[1]})+${xi[2]})`}/>
                            <BlockMath math={`\\therefore I = ${result}`}/>
                     </div>
        )}


    </div>



    </div>
)
}