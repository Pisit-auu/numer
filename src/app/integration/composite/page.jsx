'use client'
import { InlineMath,BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useEffect,useState } from 'react'
import { evaluate } from 'mathjs';
export default function Composite(){
    const [fx,setfx] = useState('2x+2')
    const [a,seta] = useState(2)
    const [b,setb] = useState(4)
    const [n,setn] = useState(3)
    const [h,seth] = useState()
    const [fxi,setfxi] = useState([])
    const [show,setshow] = useState(false)
    const [x0,setx0] = useState()
    const [xn,setxn] = useState()
    const [xi,setxi] = useState()
    const [result,setresult] = useState()

    function composit(x,h,fx,n){
        let calx = []
        for(let i=0;i<=n;i++){
            calx[i] = evaluate(fx,{x:x[i]})
        }
        let fxpushxi =[]
        let settext =''
        for(let i=0;i<=n;i++){
            settext = `f(x_{${i}}) = ${fx.replace(/x/g,`(${x[i]})`)} = ${calx[i]} \\quad ; x_{${i}} = ${x[i]}`
            fxpushxi[i] = settext
            settext =''
        }
        setx0(calx[0])
        setxn(calx[n])
        setfxi(fxpushxi)
        settext = `${calx[1]}`
        for(let i=2;i<=n-1;i++){
            settext+= `+${calx[i]}`
        }
        setxi(settext)
        let sum=0;
        for(let i=1;i<=n-1;i++){
            sum+=calx[i]
        }
        sum*=2;
        sum+= calx[0]+calx[n]
        sum = sum * (h/2);
        setresult(sum)
        setshow(true)

    }
const handlesubmit =(event)=>{
    event.preventDefault();

    const newn = n
    const h = (b-a)/newn
    let xstart = a;
    let  x = [] 
    seth(h)
    for(let i=0;i<=n;i++){
        x[i] = xstart;
        xstart+=h
    }
    
    composit(x,h,fx,n)
    
}
return(

<div>
    <div className="text-2xl text-blue-500 text-center pt-4">Composite Trapezoidal
        <div>
                
               <form onSubmit={handlesubmit}>

               <div className=""> <InlineMath math={`\\int_${a}^${b} ${fx} \\,dx`}/></div>
                <div>
                    <BlockMath math="f(x)" />
                    <input type='text' className='' value={fx} onChange={(e)=>setfx(e.target.value)} />
                    <div className='grid grid-cols-3'>
                    <div><BlockMath math='a=x_0'/><input type='number' value={a} onChange={(e)=> seta(e.target.value)} /></div>
                    <div><BlockMath math='b=x_1'/><input type='number' value={b} onChange={(e)=> setb(e.target.value)} /></div>
                    <div><BlockMath math='n=' /><input type='number' value={n} onChange={(e)=> setn(e.target.value)} /></div>
                    </div>
                    <div><button className='bg-blue-500 text-white px-4 py-2 rounded my-5'>submit</button></div>
                </div>
               </form>



        </div>
    </div>

    <div className='bg-slate-200 m-10 p-8 h-auto'> solution
        { show&& (
                    <div>
                            <BlockMath math='I = \frac{1}{3} (h)(f(x_0)+f(x_n)+\sum_{i=1}^{n-1}f(x_i))'/>
                            <BlockMath math={`h= \\frac{b-a}{n}`}/>
                            <BlockMath math={`h= \\frac{${b}-${a}}{${n}}`}/>
                            <BlockMath math={`h= ${h}`}/>
                            {fxi.map((fxi,index) => (
                                    <div key={index} className='py-1'>
                                        <BlockMath math={fxi} />
                                    </div>
                            ))}
                            <BlockMath math={`I = \\frac{1}{3} (${h})(${x0}+${xn}+(2(${xi}))`}/>
                            <BlockMath math={`\\therefore I = ${result}`}/>

                     </div>
        )}


    </div>

</div>
)
}
