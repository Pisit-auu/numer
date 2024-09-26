'use client'
import { useState, useEffect } from 'react';
import { derivative } from 'mathjs';
import dynamic from 'next/dynamic';
import { fixEquation, findx, roundToSignificantDecimals } from '../../components/function'; 
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Newton() {
    const [fx, setInputValue] = useState('');
    const [x0 , setX0] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);


    function newton(fx, x0num, tolerance,divfx) {
        const newIterations = [];
        let x1 =0;
        let x0 = x0num
        let Error=1
        let i=0
        if (isNaN(x0num)) {
            alert('กรุณาใส่ค่า x0 และ xlass ที่ถูกต้อง และ fx');
            return;
        }
        if (tolerance <= 0) {
            alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
            return;
        }
        while (Error > tolerance) {
            x1 = x0-(findx(fx,x0)/findx(divfx,x0))
            Error = Math.abs(findx(fx,x0));
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
        setIterations(newIterations);
        setGraphData(graphPoints);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const fixedEquation = fixEquation(fx);
        const divfx = derivative(fx,'x').toString();
       // console.log(divfx) 
        let x0num = parseFloat(x0);
        const tolerance = parseFloat(toleranceinput)
        newton(fixedEquation,x0num,tolerance,divfx)
        
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
                       Newton-Raphson methods
                              <div>f(x) = <InlineMath math={fx} /></div>
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
                          <MathGraph dataPoints={graphData} />
                        </div>
                      </div>
                    </div>

                  <div className='bg-slate-200	m-10 p-8 h-auto '>table 
     
    
                  <div className="grid grid-cols-4 gap-4 p-4">
    
                        <div>iter
                        <div>
                          {iterations.map((iteration, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4">
                            <div>{index }</div>
                          </div>
                          ))}

                          </div>
    
                        </div>
    
                        <div>Xk
                        <div>
                          {iterations.map((iteration, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4">
                            <div>{iteration.xk.toFixed(6)}</div>
                          </div>
                          ))}
    
    
                          </div>
                
                          
                        </div>
                        <div>yk
                        <div>
                          {iterations.map((iteration, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4">
                            <div>{roundToSignificantDecimals(iteration.result.toFixed(6))}</div>
                          </div>
                          ))}
    
    
                          </div>
                          
                        </div>
                        <div>error
                        <div>
                          {iterations.map((iteration, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4">
                            <div>{iteration.error.toFixed(6)}%</div>
                          </div>
                          ))}
    
    
                          </div>
                          
                        </div>
    
    
    
                  </div>
                  </div>
    
        </div>
      );
    }
    