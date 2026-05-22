'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios'
import StationSelect from '../../components/StationSelect';
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
  <div className="station-shell">
    <Navbar/>
    <main className="station-main">
      <div className="subpage-header">
        <span className="station-label">Root Finding</span>
        <h1>Graphical <span>Method</span></h1>
        <div className="subpage-equation"><InlineMath math={`f(x) = ${fx || '…'}`} /></div>
      </div>

      <div className="subpage-grid">
        <section className="subpage-input-panel">
          <div className="station-console__header">
            <div>
              <span className="station-label">Parameters</span>
              <h2>Input</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="subpage-form">
            <label>
              <span><InlineMath math={`f(x)`} /></span>
              <input type="text" value={fx} onChange={(e) => setInputValue(e.target.value)} placeholder="e.g. x^3 - x - 2" />
            </label>
            <div className="subpage-form-row">
              <label>
                <span><InlineMath math={`X_L`} /></span>
                <input type="number" value={x0} onChange={(e) => setX0(e.target.value)} />
              </label>
              <label>
                <span><InlineMath math={`X_R`} /></span>
                <input type="number" value={xlass} onChange={(e) => setXlass(e.target.value)} />
              </label>
            </div>
            <label>
              <span>Tolerance</span>
              <input type="number" value={toleranceinput} onChange={(e) => setTolerance(e.target.value)} />
            </label>
            <button type="submit" className="bg-blue-500">Execute</button>
          </form>
        </section>

        <section className="subpage-history-panel">
          <div className="station-console__header">
            <div>
              <span className="station-label">Telemetry</span>
              <h2>History</h2>
            </div>
            <span className="station-console__state">{equation.length} REC</span>
          </div>
          <StationSelect
            placeholder="Select equation…"
            onChange={handleeuation}
            options={equation.map(item => ({
              value: item.value,
              label: item.label,
            }))}
          />
        </section>
      </div>

      {graphData.length > 0 && (
      <div className='bg-slate-200 subpage-section'>
        <div className="subpage-section-title">Graph</div>
        <div className="flex justify-center">
          <div className="max-w-full overflow-hidden">
            <MathGraph dataPoints={graphData} />
          </div>
        </div>
      </div>
      )}

      {iterations.length > 0 && (
      <div className='bg-slate-200 subpage-section'>
        <div className="subpage-table-header">
          <span>Iter</span>
          <span>Xk</span>
          <span>Yk</span>
          <span>Error</span>
        </div>
        <div className="subpage-table-body">
          {iterations.map((iteration, index) => (
            <div key={index} className="subpage-table-row">
              <span>{index}</span>
              <span>{iteration.xk.toFixed(6)}</span>
              <span>{roundToSignificantDecimals(iteration.result).toFixed(6)}</span>
              <span>{iteration.error.toFixed(6)}%</span>
            </div>
          ))}
        </div>
      </div>
      )}
    </main>
  </div>
);

}
