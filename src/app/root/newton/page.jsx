'use client'
import { useState, useEffect } from 'react';
import { derivative } from 'mathjs';
import dynamic from 'next/dynamic';
import { findx, roundToSignificantDecimals } from '../../components/function'; 
import axios from 'axios'
import { Select, Space } from 'antd';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Newton() {
    const Mathnewtonroot = dynamic(() => import('../../components/mathnewtonroot'), { ssr: false });
    const [fx, setInputValue] = useState('');
    const [x0 , setX0] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [equation,setEquation]= useState([]);

    function newton(fx, x0num, tolerance,divfx) {
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newEquation = fx;
        const divfx = derivative(fx,'x').toString();
       // console.log(divfx) 
        let x0num = parseFloat(x0);
        const tolerance = parseFloat(toleranceinput)
        newton(newEquation,x0num,tolerance,divfx)
        try{
          await axios.post('/api/root',{
            name:fx,
            xl:x0num,
            xr:0,
          })
      }catch(error){
        console.log('error',error)
      }
      };
      const fetchequation = async () => {
        try{
            const Response= await axios.get('/api/root')
            let test = Response.data
            let keepequation = []
            for(let i=0;i< test.length;i++){
              keepequation.push({ value: test[i].id, label: test[i].name});
            }
            setEquation(keepequation)
        }catch(error){
          console.log('error',error)
        }
      }
      const handleeuation = async (value)=>{
        const Response = await axios.get(`/api/root/${value}`)
        setX0(Response.data.xl)
        setInputValue(Response.data.name)
      }
    
      useEffect(()=>{
        fetchequation()
      },[])
    return (
        <div>    
              <div className="grid grid-cols-3 gap-4 p-4">
                          <div>{/*column 1*/}</div>
    
    
                        <div className="text-center text-blue-500 text-3xl">
                        Newton-Raphson methods
                          <div> <InlineMath math={`f(x) = ${fx}`} /></div>
                          <form onSubmit={handleSubmit}>
                        <div className="pt-4">
                        <InlineMath math={`x_{n+1}`} /> <input type="text" className='w-full' value={fx} onChange={(e) => setInputValue(e.target.value)} />
                            </div>
                          <div className="p-4">
                            <div className="pt-2">
                            <InlineMath math={`x_{start}`} /> <input type="number" className='w-full' value={x0} onChange={(e) => setX0(e.target.value)} />
                            </div>
                          </div>
                          <div className="pt-4 pb-4">
                            Tolerance <input type="number" className='w-full' value={toleranceinput} onChange={(e) => setTolerance(e.target.value)} />
                          </div>
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                        </form>
                        <div className='mt-4'>Root Equation History</div>
                                <Select
                          defaultValue="-"
                          style={{ width: 200 }}
                          onChange={handleeuation}
                          options={equation.map(item => ({
                            value: item.value,
                            label: item.label,
                          }))}
                          className="ml-4"
                        />
                    </div>

                    <div>{/*column 2*/}</div>
                        
                    <div>
                    </div>
    
                  </div >

                  <div className='bg-slate-200 m-10 p-8 h-auto'>
                      <div className="text-blue-500 text-3xl mb-4">Graph</div>
                      <div className="flex justify-center">
                        <div className="max-w-full ">
                          <Mathnewtonroot dataPoints={graphData} />
                        </div>
                      </div>
                    </div>

                  <div className='bg-slate-200	m-10 p-8 h-auto '>table 
                                <div className='bg-slate-200 m-10 p-8 h-auto'>
                                      <div className='grid grid-cols-4 gap-4 p-4"'> <div>iter</div> <div>Xk</div> <div>yk</div>   <div>error</div>

                                      </div>
                                      <div className="grid grid-cols-1 gap-4 p-4">

                                          {iterations.map((iteration, index) => (
                                              <div key={index} className="grid grid-cols-4 gap-4 p-4">
                                                  <div>{index}</div>
                                                  <div>{iteration.xk.toFixed(6)}</div>
                                                  <div>{roundToSignificantDecimals(iteration.result).toFixed(6)}</div>
                                                  <div>{iteration.error.toFixed(6)}%</div>
                                              </div>
                                          ))}
                                      </div>

                          </div>
                  </div>
    
        </div>
      );
    }
    