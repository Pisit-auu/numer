'use client'
import { InlineMath,BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useEffect,useState } from 'react';
import { evaluate } from 'mathjs';

export default function Compositesimpson(){
    const [fx,setfx] = useState('2x+2')
    const [a ,seta] = useState(-1)
    const [b,setb] =useState(2)
    const [n,setn] = useState(2)
    const [h,seth] = useState()
    const [xi,setxi] = useState([])
    const [fxi,setfxi] = useState([])
    const [fxcalodd,setfxcalodd] = useState()
    const [fxcaleven,setfxcaleven] = useState()
    const [show,setshow] = useState(false)
    const [sumeven,Setsumeven] = useState()
    const [sumodd,Setsumodd] = useState()
    const [result,setresult] = useState()
    function compositesimpson(fx,xi,h,n){
        let calxi =[] 
        for(let i=0;i<=n*2;i++){
            calxi[i] = evaluate(fx,{x: xi[i]})
        }
        console.log(calxi)
        setxi(calxi)

        let fxpushxi =[]
        let settext =''
        for(let i=0;i<=n*2;i++){
            settext = `f(x_{${i}}) = ${fx.replace(/x/g,`(${xi[i]})`)} = ${calxi[i]} \\quad ; x_{${i}} = ${xi[i]}`
            fxpushxi[i] = settext
            settext =''
        }
        setfxi(fxpushxi)
        let setsumodd = `${calxi[1]}`
        for(let i=2;i<=n*2;i++){
            if(i%2!==0){
                setsumodd += `+${calxi[i]}`
            }
        }
        setfxcalodd(setsumodd)

        let setsumeven = `${calxi[2]}`
        for(let i=4;i<n*2;i++){
            if(i%2===0){
                setsumeven += `+${calxi[i]}`
            }
        }
        setfxcaleven(setsumeven)

        let sumodd=0;
        for(let i=1;i<=n*2;i++){
            if(i%2!==0){
                sumodd += calxi[i]
            }
        }
        sumodd*=4

        let sumeven=0;
        for(let i=2;i<n*2;i++){
            if(i%2===0){
                sumeven += calxi[i]
            }
        }
        sumeven*=2

        let sum = sumodd+sumeven
        sum+= calxi[0]+calxi[n*2]
        sum = sum*(1/3)*h
        setresult(sum)
        setshow(true)
    }
    const handlesubmit = (event) =>{
        event.preventDefault();
        let h = (b-a)/(2*n)
        let newn = n
        let xi =[]
        let xstart = a
        for(let i=0;i<=newn*2;i++){
            xi[i] = xstart
            xstart+=h
        }
        console.log(xi)
       
        let setsumodd =`\\sum_{i=1`
        for(let i=2;i<=n*2;i++){
            if(i%2!==0){
                setsumodd += `,${i}`
            }

        }
        setsumodd += `}^{${n*2-1}}f(x_i)`
        Setsumodd(setsumodd)


        let setsumeven =`\\sum_{i=2`
        for(let i=4;i<n*2;i++){
            if(i%2===0){
                setsumeven += `,${i}`
            }

        }   
        setsumeven+= `}^{${n*2-2}}f(x_i)`
        Setsumeven(setsumeven)
        seth(h)
        compositesimpson(fx,xi,h,n)
    }
    return(
            <div>
                        <div className="text-2xl text-blue-500 text-center pt-4">Composite Trapezoidal
                            <div>
                                    
                                <form onSubmit={handlesubmit}>

                                <div className=""> <InlineMath math={`\\int_{${a}}^{${b}} ${fx} \\,dx`}/></div>
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
                                                <BlockMath math={`I = \\frac{1}{3} (h)(f(x_0)+f(x_n)+(4(${sumodd})+(2(${sumeven}))`}/>
                                                <BlockMath math={`h= \\frac{b-a}{(n)(2)}`}/>
                                                <BlockMath math={`h= \\frac{${b}-${a}}{${n*2}}`}/>
                                                <BlockMath math={`h= ${h}`}/>
                                                {fxi.map((fxi,index) => (
                                                        <div key={index} className='py-1'>
                                                            <BlockMath math={fxi} />
                                                        </div>
                                                ))}
                                                <BlockMath math={`I = \\frac{1}{3} (${h})(${xi[0]}+${xi[n*2]}+(4(${fxcalodd}))+(2(${fxcaleven}))`}/>
                                                <BlockMath math={`\\therefore I = ${result}`}/>
                                        </div>
                            )}



                            </div>
            </div>
    )
}