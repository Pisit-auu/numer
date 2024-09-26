'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fixEquation, findx, roundToSignificantDecimals } from '../../components/function'; 
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });

export default function Bisection() {
    const [fx, setInputValue] = useState('');
    const [xl , setXl] = useState('');
    const [xr , setXr] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);


    function bisection(fx, xlnum, xrNum, tolerance) {
        const newIterations = [];
        let xm=0
        let xl = xlnum
        let xr = xrNum
        let Error=1
        let i=0
        if (isNaN(xlnum) || isNaN(xrNum) || xlnum >= xrNum ) {
            alert('กรุณาใส่ค่า x0 และ xlass ที่ถูกต้อง และ fx');
            return;
        }
        if (tolerance <= 0) {
            alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
            return;
        }
        if(findx(fx,xl)*findx(fx,xr)>0){
            alert('fxl*fxr ต้อง <0');
            return;
        }
        while (Error > tolerance) {
            xm = (xl+xr)/2.0
            if(findx(fx,xm)*findx(fx,xr)>0){
                xr=xm
                console.log(xr)
            }else if(findx(fx,xm)*findx(fx,xr)<0){
                xl=xm
                console.log(xl)
            }
            Error = Math.abs(findx(fx, xm));
            if (!newIterations.some(iter => iter.iter === i)) {
            newIterations.push({ xk: xm, result: findx(fx,xm), error: Error * 100 });
            }

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
        let xlnum = parseFloat(xl);
        let xrNum = parseFloat(xr);
        const tolerance = parseFloat(toleranceinput)
        bisection(fixedEquation,xlnum,xrNum,tolerance)
        
        
      };
    return (
        <div>    
              <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="text-center text-blue-500 text-3xl">input   
                                  <form onSubmit={handleSubmit}>fx
                                  <input type="text" value={fx} onChange={(e) => setInputValue(e.target.value)}/>
                                    <div className="pt-4">XL
                                          <input type="number"  value={xl}  onChange={(e) => setXl(e.target.value)}  ></input>
                                    </div>
                                    <div className="pt-4">XR
                                    <input type="number"  value={xr}  onChange={(e) => setXr(e.target.value)}  ></input>
                                    </div>
                                    <div className="pt-4">tolerance
                                    <input type="number"  value={toleranceinput}  onChange={(e) => setTolerance(e.target.value)}  ></input>
                                    </div>
                                  <button type="submit">Submit</button>
                                </form>
                      </div>
    
                       <div className="text-center text-blue-500 text-3xl">
                              bisection 
                              <div>fx = <InlineMath math={fx} /></div>
                              <div> XL =  {xl} </div>
                              <div> XR =  {xr}</div>
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
                            <div>{roundToSignificantDecimals(iteration.xk.toFixed(6))}</div>
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
                            <div>{roundToSignificantDecimals(iteration.error.toFixed(6))}%</div>
                          </div>
                          ))}
    
    
                          </div>
                          
                        </div>
    
    
    
                  </div>
                  </div>
    
        </div>
      );
    }
    