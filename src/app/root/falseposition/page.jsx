'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fixEquation, findx, roundToSignificantDecimals } from '../../components/function'; 
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios'
export default function falseposition() {
    const [fx, setInputValue] = useState('');
    const [xl , setXl] = useState('');
    const [xr , setXr] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [equation,setEquation]= useState([]);

    const fetchequation = async () => {
      try{
          const Response= await axios.get('/api/equation')
          setEquation(Response.data)
      }catch(error){
        console.log('error',error)
      }
    }
  
    useEffect(()=>{
      fetchequation()
    },[])
  
    const deleteequation = async (id) => {
      try {
        await axios.delete(`/api/equation/${id}`);
        alert('Delete Successful!');
        fetchequation();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Something went wrong');
      }
    };

    function falseposition(fx, xlnum, xrNum, tolerance) {
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
            xm = (findx(fx,xr)*xl-findx(fx,xl)*xr)/(findx(fx,xr)-findx(fx,xl))
            console.log(xr)
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
        setIterations(newIterations);
        setGraphData(graphPoints);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const fixedEquation = fixEquation(fx);
        let xlnum = parseFloat(xl);
        let xrNum = parseFloat(xr);
        const tolerance = parseFloat(toleranceinput)
        falseposition(fixedEquation,xlnum,xrNum,tolerance)
        try{
          await axios.post('/api/equation',{
            name:fx
          })
      }catch(error){
        console.log('error',error)
      }
        
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
                              falseposition
                              <div>fx = <InlineMath math={fx} /></div>
                              <div> XL =  {xl} </div>
                              <div> XR =  {xr}</div>
                        </div>
    
                    <div className="text-center text-blue-500 text-3xl"></div>
                        
                    <div>
                    </div>
    
                  </div >


                  <div className="max-w-5xl mt-4 mx-auto bg-white shadow-md rounded-lg p-8">
          <div className="grid grid-cols-1 border-b-2 border-gray-300 pb-4">
          <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Equation History</h2>
            </header>
            <div className="grid grid-cols-1 gap-4">
              {equation.map((cat) => (
                <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                  <button className="font-bold">{cat.name}</button>
                  <div className="space-x-4">
                    <button onClick={() => deleteequation(cat.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
          </div>



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
    