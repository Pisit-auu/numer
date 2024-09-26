'use client';
import { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import dynamic from 'next/dynamic';
import { fixEquation, findx, roundToSignificantDecimals } from '../../components/function'; 
const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });

export default function Secant() {
    const [fx, setInputValue] = useState('x^2 - 7');
    const [x0 , setX0] = useState('');
    const [x1 , setX1] = useState('');
    const [toleranceinput , setTolerance] = useState('0.000001');
    const [iterations, setIterations] = useState([]);
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (fx && x0 && x1 && toleranceinput) {
            const fixedEquation = fixEquation(fx);
            let x0num = parseFloat(x0);
            let x1num = parseFloat(x1);
            const tolerance = parseFloat(toleranceinput);
            secant(fixedEquation, x0num, tolerance, x1num);
        }
    }, [fx, x0, x1, toleranceinput]);

    function secant(fx, x0num, tolerance, x1num) {
        const newIterations = [];
        let x1 = x1num;
        let x2 = 0;
        let x0 = x0num;
        let Error = 1;
        let i = 0;

        if (isNaN(x0num)) {
            alert('กรุณาใส่ค่า x0 และ x1 ที่ถูกต้อง และ fx');
            return;
        }
        if (tolerance <= 0) {
            alert('ค่าความทนทานต้องเป็นค่าที่มากกว่าศูนย์');
            return;
        }

        while (Error > tolerance) {
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
        setIterations(newIterations);
        setGraphData(graphPoints);
    }

    return (
        <div>    
            <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center text-blue-500 text-3xl">Input
                    <input type="text" value={fx} onChange={(e) => setInputValue(e.target.value)} />
                    <div className="pt-4">X0
                        <input type="number" value={x0} onChange={(e) => setX0(e.target.value)} />
                    </div>
                    <div className="pt-4">X1
                        <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} />
                    </div>
                    <div className="pt-4">Tolerance
                        <input type="number" value={toleranceinput} onChange={(e) => setTolerance(e.target.value)} />
                    </div>
                </div>

                <div className="text-center text-blue-500 text-3xl">
                    Secant Method
                    <div>fx = <InlineMath math={fx} /></div>
                    <div>X0 = {x0}</div>
                    <div>X1 = {x1}</div>
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

            <div className='bg-slate-200 m-10 p-8 h-auto'>
                <div className="grid grid-cols-4 gap-4 p-4">
                    <div>iter
                        {iterations.map((iteration, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-4">
                                <div>{index}</div>
                            </div>
                        ))}
                    </div>
                    <div>Xk
                        {iterations.map((iteration, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-4">
                                <div>{iteration.xk.toFixed(6)}</div>
                            </div>
                        ))}
                    </div>
                    <div>yk
                        {iterations.map((iteration, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-4">
                                <div>{roundToSignificantDecimals(iteration.result.toFixed(6))}</div>
                            </div>
                        ))}
                    </div>
                    <div>error
                        {iterations.map((iteration, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-4">
                                <div>{iteration.error.toFixed(6)}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
