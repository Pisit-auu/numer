'use client'
import { useState, useEffect } from 'react';
import { derivative } from 'mathjs';
import dynamic from 'next/dynamic';
import { findx, roundToSignificantDecimals } from '../../components/function'; 
import axios from 'axios'
import StationSelect from '../../components/StationSelect';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Navbar from  "../../components/header";

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
            proublem:"Newton",
            xl:x0num,
            xr:0,
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
        setInputValue(Response.data.name)
      }
    
      useEffect(()=>{
        fetchequation()
      },[])
      return (
        <div className="station-shell">
          <Navbar />
          <main className="station-main">
            <div className="subpage-header">
              <span className="station-label">Root Finding</span>
              <h1>Newton-Raphson <span>Method</span></h1>
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
                  <label>
                    <span><InlineMath math={`x_{start}`} /></span>
                    <input type="number" value={x0} onChange={(e) => setX0(e.target.value)} />
                  </label>
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
                <div className="max-w-full">
                  <Mathnewtonroot dataPoints={graphData} />
                </div>
              </div>
            </div>
            )}

            {iterations.length > 0 && (
            <div className='bg-slate-200 subpage-section'>
              <div className="subpage-table-header">
                <span>iter</span>
                <span>Xk</span>
                <span>yk</span>
                <span>error</span>
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
    