'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import { caldet } from '@/app/components/matrix'
import axios from 'axios'
import {Select,Space} from 'antd'
export default function Jacobi() {
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

    function findX(A, B, newmatrixx0, tolerance) {
      
      let X = Array.from(newmatrixx0);
      let check = false;
      const savexi = [];
      savexi.push({x:newmatrixx0,e:newmatrixx0})
      setResult(savexi)
      console.log(savexi)
      while (!check) {
        let Xnew = new Array(X.length).fill(0);
        let error = new Array(X.length).fill(0);
        check = true;

        for (let i = 0; i < A.length; i++) {
          Xnew[i] = B[i];
          for (let j = 0; j < A[0].length; j++) {
            if (i !== j) {
              Xnew[i] -= A[i][j] * X[j];
            }
          }
          if (A[i][i] === 0) {
            alert(`Error: A[${i}][${i}] == 0`);
            return;
          }
    
          Xnew[i] /= A[i][i];
          error[i] = Math.abs((Xnew[i] - X[i]) / Xnew[i]*100);
          if (error[i] > tolerance*100) {
            check = false;
          }
        }
        savexi.push({x:Xnew,e:error})
        for (let i = 0; i < X.length; i++) {
          X[i] = Xnew[i];
        }
      }
    

    
      return X;
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
          proublem:"jacobi",
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
      findX(matrixA,matrixB,matrixX0,tolerance)
 

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

    

 

    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center text-blue-500 text-3xl"></div>
    
          <div className="text-center text-blue-500 text-3xl">Jacobi Methods
            <div>
              {matrixA.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl mb-4">กรอกข้อมูลใน Matrix</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1">
                    <div>{'[A]'}</div>
                    <div>{'{x}'}</div>
                    <div>{'{B}'}</div>
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                      {matrixA.map((row, rowIndex) =>
                        row.map((value, colIndex) => (
                          <input
                            key={`${rowIndex}-${colIndex}`}
                            type="number"
                            value={matrixA[rowIndex][colIndex]}
                            onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                            className="border p-2 w-full text-center"
                          />
                        ))
                      )}
                    </div>
    
                    <div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                      {matrixX.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="text"
                          value={`x${rowIndex + 1}`}
                          readOnly
                          className="border p-2 w-full text-center"
                        />
                      ))}
                    </div>
    
                    <div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                      {matrixB.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                          className="border p-2 w-full text-center"
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
                Input Matrix Size (NxN)
                <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </form>
              </div>
    
              <div className="mt-4">Linear Equation History</div>
              <div className="flex flex-wrap gap-4">
                <Select
                  defaultValue="size"
                  style={{ width: 200 }}
                  onChange={handlesize}
                  options={size.map(item => ({ value: item.value, label: item.label }))}
                />
                <Select
                  defaultValue="data"
                  style={{ width: 200 }}
                  onChange={handleeuation}
                  options={equation.map(item => ({ value: item.value, label: item.label }))}
                />
              </div>
            </div>
          </div>
    
          <div className="text-center text-blue-500 text-3xl"></div>
        </div>
    
        <div className="bg-slate-200 font-bold m-4 p-4 rounded-lg shadow-md"> 
          <h2 className="text-2xl mb-4">Table</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-100 p-4">
              <div className="font-semibold text-center">Iter</div>
              <div className="font-semibold text-center">Xk</div>
              <div className="font-semibold text-center">Error%</div>
            </div>
            <div className="grid gap-4 p-4">
              {Result.map((iteration, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-b border-slate-300">
                  <div className="text-center"><BlockMath math={`${index + 1}`} /></div>
                  <div className="text-center">
                    {iteration.x.map((x, idx) => (
                      <BlockMath key={idx} math={`X_{${idx + 1}} = ${x.toFixed(6)}`} />
                    ))}
                  </div>
                  <div className="text-center">
                    {iteration.e.map((e, idx) => (
                      <BlockMath key={idx} math={`e_{${idx + 1}} = ${e.toFixed(6)}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}