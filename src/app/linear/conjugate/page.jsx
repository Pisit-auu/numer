'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import { findr,findd0,findlamda,findxconju,finda0,finderror,findd,caldet } from '@/app/components/matrix'
import axios from 'axios'
import {Select,Space} from 'antd'
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
export default function Seidel() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [Result, setResult] = useState([]); 
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX0, setMatrixX0] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [showsolution ,setsolution]= useState(false);
  const [equation,setEquation]= useState([]);
  const [size,setsize] = useState([])

    const handleMatrixChange = (rowIndex, colIndex, value) => {  //อัพเดตค่าA
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
      const newMatrix = [...matrixA];
      newMatrix[rowIndex][colIndex] = validValue;
      setmatrixA(newMatrix);
    };
    const handleMatrixChangeB = (rowIndex, value) => {   //อัพเดตค่าB
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
      const newMatrix = [...matrixB];
      newMatrix[rowIndex] = validValue;
      setMatrixB(newMatrix);

    };
    const handleMatrixChangeX0 = (rowIndex, value) => {   //อัพเดตค่าx0
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
      const newMatrix = [...matrixX0];
      newMatrix[rowIndex] = validValue;
      setMatrixX0(newMatrix);
    };

    function findX(r,d,matrixA,matrixX0,matrixB,tolerance) {
      let x = Array.from(matrixX0);
      let lamda
      let a0
      let error=1
      const savexi = [];
      setResult(savexi)

      while(error>tolerance){
        lamda = findlamda(d,r,matrixA);
        x = findxconju(x,lamda,d);
         r = findr(matrixA,matrixB,x);
         error = finderror(r);
         savexi.push({yk:lamda,Dk:d,Xk:x,Rk:r,er:error})
          a0 = finda0(r,matrixA,d);
         d = findd(r,a0,d);
        }

    

    
      return x;
    }
    const hasEmptyValue = array => array.some(value => value === "" || value === " " || value === null || value === undefined);
    const hasEmptyValueInMatrix = matrix =>   matrix.some(row => row.some(value => value === "" || value === " " || value === null || value === undefined));



    const handleSubmit = async(event) => {
      event.preventDefault(); // ย้ายการเรียกใช้ preventDefault ไปไว้ด้านบนสุด
    
      if (sizematrix < 1 || hasEmptyValueInMatrix(matrixA) || hasEmptyValue(matrixB) || hasEmptyValue(matrixX0)) {
        console.log("matrixA, matrixB, หรือ matrixX0 มีค่าว่างอย่างน้อย 1 index");
        return;
      }
      const size = parseInt(sizematrix);
      const A = matrixA
      const B = matrixB
      const x0 = matrixX0
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
        await axios.post('/api/linear',{
          proublem:"Conjugate",
          size,
          A,
          B,
          x0,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      const tolerance = parseFloat(toleranceinput);
      let r = findr(matrixA,matrixB,matrixX0);
      let d = findd0(r);
      findX(r,d,matrixA,matrixX0,matrixB,tolerance)
    };
    
    const fetchsize = async () => {
      try{
          const Response= await axios.get('/api/linear')
          let test = Response.data
          let keepsize =[]
          for(let i=0;i< test.length;i++){
            if(!keepsize.some(item=>item.label===test[i].size)){
              keepsize.push({ value: test[i].size, label: test[i].size});
            }
          }
          setsize(keepsize)
      }catch(error){
        console.log('error',error)
      }
    }
    const fetchequation = async (value) => {
      try{
          const Response= await axios.get('/api/linear')
          let test = Response.data
          let keepequation = []
          for(let i=0;i< test.length;i++){
            if(test[i].size === value){
              keepequation.push({value:test[i].id, label:test[i].A})
            }
          }
          setEquation(keepequation)
      }catch(error){
        console.log('error',error)
      }
    }
    useEffect(()=>{
      fetchsize()
    },[])

    const handlesize = (value)=>{
      setSizematrix(value)
      fetchequation(value)
    }
    const handleeuation = async (value)=>{
      const Response = await axios.get(`/api/linear/${value}`)
      const A = Response.data.A
      const B = Response.data.B
      const x0 = Response.data.x0
      setmatrixA(A)
      setMatrixB(B)
      setMatrixX0(x0)
    }
    useEffect(() => {
      const newMatrixA = Array.from({ length: sizematrix }, () =>
        Array.from({ length: sizematrix }, () => "")
      );
      setmatrixA(newMatrixA);
      const newMatrixB = Array.from({ length: sizematrix }, () => "");
      setMatrixB(newMatrixB);
      const newMatrixX = Array.from({ length: sizematrix }, () => "");
      setMatrixX(newMatrixX);
      const newMatrixX0 = Array.from({ length: sizematrix }, () => "");
      setMatrixX0(newMatrixX0);
    }, [sizematrix],);

    
    
      const data = [{
        z: matrixA,
        type: 'contour',
        colorscale: 'Jet',
        contours: {
          start: 0,
          end: 10,
          size: 0.5
        }
      }];
      const layout = {
        title: 'Contour Plot',
        xaxis: { title: 'X Axis' },
        yaxis: { title: 'Y Axis' },
        height: 600,
        width: '100%', 
      }
      
    

      return (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1 */}
            <div className="text-center text-blue-500 text-3xl md:col-span-1"></div>
      
            {/* Column 2 */}
            <div className="text-center text-blue-500 text-3xl col-span-1">
              Conjugate Methods
              {matrixA.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl mb-4">กรอกข้อมูลใน Matrix</h2>
                  <div className="grid grid-cols-3 gap-4 p-4">
                    <div>{'{A}'}</div>
                    <div>{'{X}'}</div>
                    <div>{'{B}'}</div>
                  </div>
      
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`,
                        gap: '2px',
                      }}
                    >
                      {matrixA.map((row, rowIndex) =>
                        row.map((value, colIndex) => (
                          <input
                            key={`${rowIndex}-${colIndex}`}
                            type="number"
                            value={matrixA[rowIndex][colIndex]}
                            onChange={(e) =>
                              handleMatrixChange(rowIndex, colIndex, e.target.value)
                            }
                            className="border p-2 w-full text-center"
                          />
                        ))
                      )}
                    </div>
      
                    <div
                      className="grid"
                      style={{
                        gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`,
                        gap: '2px',
                      }}
                    >
                      {matrixX.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="text"
                          value={`x${rowIndex + 1}`}
                          readOnly
                          onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                          className="border p-2 w-full md:w-20 text-center"
                        />
                      ))}
                    </div>
      
                    <div
                      className="grid"
                      style={{
                        gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`,
                        gap: '2px',
                      }}
                    >
                      {matrixB.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                          className="border p-2 w-full md:w-20 text-center"
                        />
                      ))}
                    </div>
      
                    
                  </div>
                </div>
              )}
      
              <div className="mt-4">
              {matrixA.length > 0 && (
                <div className="mt-4">
                    <div className="text-center">Initial Values (X0)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {matrixX0.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChangeX0(rowIndex, e.target.value)}
                          className="border p-2 w-full text-center"
                        />
                      ))}
                    </div>
           
                </div>
              )}
                Input Matrix size (NxN)
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="number"
                    value={sizematrix}
                    onChange={(e) => setSizematrix(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <div className="pt-4">
                    Tolerance
                    <input
                      type="number"
                      value={toleranceinput}
                      onChange={(e) => setTolerance(e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Submit
                  </button>
                </form>
              </div>
      
              <div className="mt-4">
                Linear Equation History
                <Select
                  defaultValue="size"
                  style={{ width: '100%' }}
                  onChange={handlesize}
                  options={size.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  className="mt-2"
                />
                <Select
                  defaultValue="data"
                  style={{ width: '100%' }}
                  onChange={handleeuation}
                  options={equation.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  className="mt-2"
                />
              </div>
            </div>
      
            {/* Column 3 */}
            <div className="text-center text-blue-500 text-3xl md:col-span-1"></div>
          </div>
      
          {/* Contour Graph Section */}
          <div className="bg-slate-200 font-bold m-4 p-8 rounded-lg">
            <div className="text-blue-500 text-3xl p-4 text-center">Contour Graph</div>
            <div className="flex justify-center">
              <div className="max-w-full m-4">
                <Plot data={data} layout={layout} config={{ scrollZoom: true }} />
              </div>
            </div>
          </div>
      
          {/* Table Section */}
          <div className="bg-slate-200 font-bold m-4 p-8 rounded-lg">
            <h2 className="text-2xl mb-4">Table</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="grid grid-cols-6 gap-4 p-4 bg-blue-100">
                <div className="font-semibold text-center">iter</div>
                <div className="font-semibold text-center">λk-1</div>
                <div className="font-semibold text-center">Dk−1</div>
                <div className="font-semibold text-center">Xk</div>
                <div className="font-semibold text-center">Rk</div>
                <div className="font-semibold text-center">error%</div>
              </div>
              <div className="grid gap-4 p-4">
                {Result.map((iteration, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-slate-300"
                  >
                    <div className="text-center">
                      <BlockMath math={`${index + 1}`} />
                    </div>
                    <div className="text-center">
                      <BlockMath math={`${iteration.yk}`} />
                    </div>
                    <div className="text-center">
                      <ArrayDisplay matrix={iteration.Dk} />
                    </div>
                    <div className="text-center">
                      <ArrayDisplay matrix={iteration.Xk} />
                    </div>
                    <div className="text-center">
                      <ArrayDisplay matrix={iteration.Rk} />
                    </div>
                    <div className="text-center">
                      <BlockMath math={`${iteration.er.toFixed(6)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      
}