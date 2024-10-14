'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { findx, roundToSignificantDecimals } from '../../components/function'; 
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios'
import { Select, Space } from 'antd';

export default function falseposition() {
    const [fx, setInputValue] = useState('');
    const [xl , setXl] = useState('');
    const [xr , setXr] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [equation,setEquation]= useState([]);



    function falseposition(fx, xlnum, xrNum, tolerance) {
        const newIterations = [];
        let xm=0
        let xl = xlnum
        let xr = xrNum
        let Error=1
        let i=0
        if (isNaN(xlnum) || isNaN(xrNum) || xlnum >= xrNum||!isNaN(fx) ) {     
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
            xm = (findx(fx,xr)*xl-findx(fx,xl)*xr)/(findx(fx,xr)-findx(fx,xl))
            if(findx(fx,xm)*findx(fx,xr)>0){
                xr=xm
            }else if(findx(fx,xm)*findx(fx,xr)<0){
                xl=xm
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
          graphPoints.sort((a, b) => a.x - b.x);
        setIterations(newIterations);
        setGraphData(graphPoints);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newEquation = fx;
        let xlnum = parseFloat(xl);
        let xrNum = parseFloat(xr);
        const tolerance = parseFloat(toleranceinput)
        falseposition(newEquation,xlnum,xrNum,tolerance)
            try{
              await axios.post('/api/root',{
                name:fx,
                xl:xlnum,
                xr:xrNum
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
            setXl(Response.data.xl)
            setXr(Response.data.xr)
            setInputValue(Response.data.name)
          }
        
          useEffect(()=>{
            fetchequation()
          },[])
    return (
          <div>    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div>{/*column 1*/}</div>

              <div className="text-center text-blue-500 text-3xl">
                          False position methods
                          <div> <InlineMath math={`f(x) = ${fx}`} /></div>
                          <form onSubmit={handleSubmit}>
                        <div className="pt-4">
                        <InlineMath math={`f(x)`} /> <input type="text" className='w-full' value={fx} onChange={(e) => setInputValue(e.target.value)} />
                            </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
                            <div className="pt-4">
                            <InlineMath math={`X_L`} /> <input type="number" className='w-full' value={xl} onChange={(e) => setXl(e.target.value)} />
                            </div>
                            <div className="pt-4">
                            <InlineMath math={`X_R`} /> <input type="number" className='w-full' value={xr} onChange={(e) => setXr(e.target.value)} />
                            </div>
                          </div>
                          <div className="pt-4 pb-4">
                            Tolerance <input type="number" className='w-full' value={toleranceinput} onChange={(e) => setTolerance(e.target.value)} />
                          </div>
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                        </form>
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


            <div className="bg-slate-200 m-10 p-8 h-auto">
              <div className="text-blue-500 text-3xl mb-4">Graph</div>
              <div className="flex justify-center">
                <div className="max-w-full">
                  <MathGraph dataPoints={graphData} />
                </div>
              </div>
            </div>

            <div className="bg-slate-200 m-10 p-8 h-auto">
              <div className="grid grid-cols-1 gap-4 p-4">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="font-bold">iter</div>
                  <div className="font-bold">Xk</div>
                  <div className="font-bold">yk</div>
                  <div className="font-bold">error</div>
                </div>

                {iterations.map((iteration, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border border-gray-300 rounded-md">
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
    