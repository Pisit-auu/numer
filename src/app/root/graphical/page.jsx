'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios'
import { Select, Space } from 'antd';
import Navbar from  "../../components/header";
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });
import { findx, roundToSignificantDecimals } from '../../components/function'; 

export default function Graphical() {
  const [fx, setInputValue] = useState('');
  const [x0 , setX0] = useState('');
  const [xlass , setXlass] = useState('');
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [equation,setEquation]= useState([]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const newEquation = fx;
      let x0Num = parseFloat(x0);
      let xlassNum = parseFloat(xlass);
      const tolerance = parseFloat(toleranceinput)
      graphical(newEquation,x0Num,xlassNum,tolerance)
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
          proublem:"graphical",
          xl:x0Num,
          xr:xlassNum,
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
      setXlass(Response.data.xr)
      setInputValue(Response.data.name)
    }
  
    useEffect(()=>{
      fetchequation()
    },[])
  

function graphical(fx, x0Num, xlassNum, tolerance) {
    const newIterations = [];
    if (isNaN(x0Num) || isNaN(xlassNum) || x0Num >= xlassNum ||!isNaN(fx)) {
        alert('กรุณาใส่ค่า x0 และ xlass ที่ถูกต้อง และ fx');
        return;
    }
    if (tolerance <= 0) {
        alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
        return;
    }
    let tolerancestart = 1;
    let found = false;
    let checkfirstPhase= true; 
    let x1= x0Num;
    let x2 = xlassNum;
    let fx_i 
    let fx_i1 
    let Error =1
    let Error1 =1
    try {
      while(Error1>tolerance&&checkfirstPhase){
        for(let i=x1;i<x2;i+=tolerancestart){
            fx_i = findx(fx, i);
            fx_i1 = findx(fx, i + tolerancestart);
            Error = Math.abs(fx_i)
            Error1 = Math.abs(fx_i1)
            if(fx_i*fx_i1 < 0){
              x1 = i;
              x2 = i + tolerancestart;
                if (!newIterations.some(iter => iter.iter === i)) {
                  newIterations.push({ iter: i, xk: i, result: fx_i, error: Error * 100 });
                }
               if(Math.abs(fx_i.toFixed(6))>tolerance ){
                  newIterations.push({ iter: i+tolerancestart, xk: i+tolerancestart, result: fx_i1, error: Error1 * 100 });       
               }
               checkfirstPhase =true;
               break;
            }else if(Math.abs(fx_i.toFixed(6))<tolerance){
                if (!newIterations.some(iter => iter.iter === i)) {
                  newIterations.push({ iter: i, xk: i, result: fx_i, error: Error * 100 });
              }
              if (Math.abs(fx_i1.toFixed(6)) < tolerance) {
                if (!newIterations.some(iter => iter.iter === i + 1)) {
                    newIterations.push({ iter: i + tolerancestart, xk: i + tolerancestart, result: fx_i1, error: Error1 * 100 });
                }
              }
                found=true;
                break;
            }else{
              Error = Math.abs(fx_i);    
                if (!newIterations.some(iter => iter.iter === i)) {
                  newIterations.push({ iter: i, xk: i, result: fx_i, error: Error * 100 });
              }
              
            }
            checkfirstPhase =false;
            }
          if(found){
            break;
          }
          tolerancestart=tolerancestart*0.1;
          }
          
       
        const graphPoints = newIterations.map(iter => ({
          x: iter.xk,
          y: iter.result
        }));
        graphPoints.sort((a, b) => a.x - b.x);
        setIterations(newIterations);
        setGraphData(graphPoints);

    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
    }
}

return (
  <div>
    <Navbar/>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-4">
      <div>{/*column 1*/}</div>

      <div className="text-center text-blue-500 text-3xl mt-4">
        Graphical methods
        <div className='pt-4'>
          <InlineMath math={`f(x) = ${fx}`} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pt-4">
            <InlineMath math={`f(x)`} /> 
            <input type="text" className='w-full' value={fx} onChange={(e) => setInputValue(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
            <div className="pt-4">
              <InlineMath math={`X_L`} /> 
              <input type="number" className='w-full' value={x0} onChange={(e) => setX0(e.target.value)} />
            </div>
            <div className="pt-4">
              <InlineMath math={`X_R`} />
              <input type="number" className='w-full' value={xlass} onChange={(e) => setXlass(e.target.value)} />
            </div>
          </div>
          <div className="pt-4 pb-4">
            Tolerance 
            <input type="number" className='w-full' value={toleranceinput} onChange={(e) => setTolerance(e.target.value)} />
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
      <div>{/*column 3*/}</div>
    </div>

    <div className='bg-slate-200 m-10 p-8 h-auto'>
      <div className="text-blue-500 text-3xl mb-4">Graph</div>
      <div className="flex justify-center">
        <div className="max-w-full overflow-hidden">
          <MathGraph dataPoints={graphData} />
        </div>
      </div>
    </div>

    <div className='bg-slate-200 m-10 p-8 h-auto'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4'>
        <div>Iter</div>
        <div>Xk</div>
        <div>Yk</div>
        <div>Error</div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4">
        {iterations.map((iteration, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
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
