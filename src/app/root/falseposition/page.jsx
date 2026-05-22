'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { findx, roundToSignificantDecimals } from '../../components/function';
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios'
import StationSelect from '../../components/StationSelect';
import Navbar from  "../../components/header";

export default function Falseposition() {
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
                proublem:"falseposition",
                xl:xlnum,
                xr:xrNum,
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
            setXl(Response.data.xl)
            setXr(Response.data.xr)
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
                  <h1>False Position <span>Method</span></h1>
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
                          <input type="number" value={xl} onChange={(e) => setXl(e.target.value)} />
                        </label>
                        <label>
                          <span><InlineMath math={`X_R`} /></span>
                          <input type="number" value={xr} onChange={(e) => setXr(e.target.value)} />
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
                <div className="bg-slate-200 subpage-section">
                  <div className="subpage-section-title">Graph</div>
                  <div className="flex justify-center">
                    <div className="max-w-full">
                      <MathGraph dataPoints={graphData} />
                    </div>
                  </div>
                </div>
                )}

                {iterations.length > 0 && (
                <div className="bg-slate-200 subpage-section">
                  <div className="subpage-table-header">
                    <span>Iter</span>
                    <span>Xk</span>
                    <span>yk</span>
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

