'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { findx, roundToSignificantDecimals } from '../../components/function'; 
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathGraphmanypoint = dynamic(() => import('../../components/mathonepoint'), { ssr: false });

export default function onepoint() {
    const [fx, setInputValue] = useState('');
    const [x0 , setX0] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);


    function onepoint(fx, x0num, tolerance) {
        const newIterations = [];
        let x1 =0;
        let x0 = x0num
        let Error=1
        let i=0
        if (x0 === '' || isNaN(x0num)|| !isNaN(fx) ) {
          alert('กรุณาใส่ค่า X0 และfx ที่ถูกต้อง');
          return;
      }
        if (tolerance <= 0) {
            alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
            return;
        }
        while (Error > tolerance&&i<100) {
            x1 = findx(fx,x0)
            Error = Math.abs((x1-x0)/x1);
            if (!newIterations.some(iter => iter.iter === i)) {
            newIterations.push({ xk: x0,result: findx(fx,x0), error: Error * 100 });
            }
            x0=x1;
            i++;

        }
        const graphPoints = newIterations.map(iter => ({
            x: iter.xk,
            y: iter.result
          }));
          graphPoints.sort((a, b) => a.x - b.x);
        setIterations(newIterations);
        setGraphData(graphPoints);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const newEquation = fx;
       // console.log(divfx) 
        let x0num = parseFloat(x0);
        const tolerance = parseFloat(toleranceinput)
        onepoint(newEquation,x0num,tolerance)
        
      };
    return (
        <div>    
              <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="text-center text-blue-500 text-3xl">input   
                                  <form onSubmit={handleSubmit}>Xn+1= 
                                  <input type="text" value={fx} onChange={(e) => setInputValue(e.target.value)}/>
                                    <div className="pt-4">Xstart
                                          <input type="number"  value={x0}  onChange={(e) => setX0(e.target.value)}  ></input>
                                    </div>
                                    <div className="pt-4">tolerance
                                    <input type="number"  value={toleranceinput}  onChange={(e) => setTolerance(e.target.value)}  ></input>
                                    </div>
                                  <button type="submit">Submit</button>
                                </form>
                      </div>
    
                       <div className="text-center text-blue-500 text-3xl">
                       onepoint methods

                    <div>fx = <InlineMath math={fx} /></div>
                              <div> Xstart =  {x0} </div>
                        </div>
    
                    <div className="text-center text-blue-500 text-3xl"></div>
                        
                    <div>
                    </div>
    
                  </div >
                    <div className='bg-slate-200 m-10 p-8 h-auto'>
                      <div className="text-blue-500 text-3xl mb-4">Graph</div>
                      <div className="flex justify-center">
                        <div className="max-w-full overflow-hidden"> 
                          <MathGraphmanypoint dataPoints={graphData} />
                        </div>
                      </div>
                    </div>

                  <div className='bg-slate-200	m-10 p-8 h-auto '>table 
     
    
                  <div className='bg-slate-200 m-10 p-8 h-auto'>
                        <div className='grid grid-cols-3 gap-3 p-4"'> <div>iter</div> <div>Xk</div>    <div>error</div>

                         </div>
                        <div className="grid grid-cols-1 gap-3 p-4">

                            {iterations.map((iteration, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 p-4">
                                    <div>{index}</div>
                                    <div>{iteration.xk.toFixed(6)}</div>
                                    <div>{iteration.error.toFixed(6)}%</div>
                                </div>
                            ))}
                        </div>

            </div>
            </div>
            </div>
      );
    }
    