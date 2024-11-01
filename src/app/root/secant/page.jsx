'use client';
import { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import dynamic from 'next/dynamic';
import {findx, roundToSignificantDecimals } from '../../components/function'; 
import axios from 'axios'
import { Select, Space } from 'antd';


export default function Secant() {
  const Mathsecant = dynamic(() => import('../../components/mathsecant'), { ssr: false });
    const [fx, setInputValue] = useState('x^2 - 7');
    const [x0 , setX0] = useState('');
    const [x1 , setX1] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [equation,setEquation]= useState([]);
    function secant(fx, x0num, tolerance, x1num) {
        const newIterations = [];
        let x1 = x1num;
        let x2 = 0;
        let x0 = x0num;
        let Error = 1;
        let i = 0;

        if (x0 === '' || x1 === '' || isNaN(x0num) || isNaN(x1num)) {
            alert('กรุณาใส่ค่า X0 และ X1 ที่ถูกต้อง');
            return;
        }
        if (tolerance <= 0) {
            alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
            return;
        }

        while (Error > tolerance) {
            if (findx(fx, x1) - findx(fx, x0) === 0) {
                alert('เกิด 0/0');
                return;
            }
            x2 = x1 - (findx(fx, x1) * (x1 - x0) / (findx(fx, x1) - findx(fx, x0)));
            Error = Math.abs(findx(fx, x2));

            if (!newIterations.some(iter => iter.iter === i)) {
                newIterations.push({ xk: x2, result: findx(fx, x2), error: Error * 100 });
            }
            x0 = x1;
            x1 = x2;
            i++;
        }

        const graphPoints = newIterations.map(iter => ({ x: iter.xk, y: iter.result }));
        console.log(graphPoints)
        setIterations(newIterations);
        setGraphData(graphPoints);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newEquation = fx;
        let x0num = parseFloat(x0);
        let x1num = parseFloat(x1);
        const tolerance = parseFloat(toleranceinput);
        secant(newEquation, x0num, tolerance, x1num);
        const now = new Date();
        const formattedDateTime = now.toLocaleString('th-TH', {
          timeZone: 'Asia/Bangkok',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        try{
            await axios.post('/api/root',{
              name:fx,
              proublem:"Secant",
              xl:x0num,
              xr:x1num,
              Date:formattedDateTime 
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
        setX1(Response.data.xr)
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
                        Secant methods
                          <div> <InlineMath math={`f(x) = ${fx}`} /></div>
                          <form onSubmit={handleSubmit}>
                        <div className="pt-4">
                        <InlineMath math={`f(x)`} /> <input type="text" className='w-full' value={fx} onChange={(e) => setInputValue(e.target.value)} />
                            </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
                            <div className="pt-4">
                            <InlineMath math={`x_{0}`} /> <input type="number" className='w-full' value={x0} onChange={(e) => setX0(e.target.value)} />
                            </div>
                            <div className="pt-4">
                            <InlineMath math={`x_{1}`} /> <input type="number" className='w-full' value={x1} onChange={(e) => setX1(e.target.value)} />
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
            </div>

            <div className='bg-slate-200 m-10 p-8 h-auto'>
                <div className="text-blue-500 text-3xl mb-4">Graph</div>
                <div className="flex justify-center">
                    <div className="max-w-full ">
                        <Mathsecant dataPoints={graphData} />
                    </div>
                </div>
            </div>

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

    );
}
