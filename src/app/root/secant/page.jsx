'use client';
import { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import dynamic from 'next/dynamic';
import {findx, roundToSignificantDecimals } from '../../components/function'; 
import axios from 'axios'
import StationSelect from '../../components/StationSelect';
import Navbar from  "../../components/header";


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
        <div className="station-shell">
          <Navbar />
          <main className="station-main">
            <div className="subpage-header">
              <span className="station-label">Root Finding</span>
              <h1>Secant <span>Method</span></h1>
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
                      <span><InlineMath math={`x_{0}`} /></span>
                      <input type="number" value={x0} onChange={(e) => setX0(e.target.value)} />
                    </label>
                    <label>
                      <span><InlineMath math={`x_{1}`} /></span>
                      <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} />
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
                <div className="max-w-full">
                  <Mathsecant dataPoints={graphData} />
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
