'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import { findLU,findL,findU,pushB,findY,findX } from '@/app/components/matrix'
import axios from 'axios'
import {Select,Space} from 'antd'
import Navbar from  "../../components/header";

export default function Inversion() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [Result, setResult] = useState([]);  // ค่าDetA1-An
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [matrixY, setMatrixY] = useState([]);
  const [ResultYshowmatrix ,setResultYshowmatrix ]= useState([]);
  const [matrixL,setMatrixL]= useState([]);
  const [matrixU,setMatrixU]= useState([]);
  const [ResultY ,setResultY]= useState([]);
  const [showsolution ,setsolution]= useState(false);
  const [equation,setEquation]= useState([]);
  const [size,setsize] = useState([])
    const handleMatrixChange = (rowIndex, colIndex, value) => {  //อัพเดตค่าA
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; // Default to 0 if NaN
      const newMatrix = [...matrixA];
      newMatrix[rowIndex][colIndex] = validValue;
      setmatrixA(newMatrix);
    };
    const handleMatrixChangeB = (rowIndex, value) => {   //อัพเดตค่าB
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; // Default to 0 if NaN
      const newMatrix = [...matrixB];
      newMatrix[rowIndex] = validValue;
      setMatrixB(newMatrix);

    };

    const handleSubmit = async(event) => {
      if(sizematrix <1){
        return
      }
      event.preventDefault();
      const A = matrixA;
      const size = parseInt(sizematrix);
      const B = matrixB
      const x0 = new Array(size).fill(0)
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
          proublem:"LU",
          size,
          A,
          B,
          x0,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      LU(A)
      
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
      setmatrixA(A)
      setMatrixB(B)
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
    }, [sizematrix],);

    function LU(A) { 
      let matrixy = []
      let newx=[]
      let newy=[]
      let matrixx = []
      for(let i=0;i<A.length;i++){
        matrixy[i] = `y${i+1}`
      }
      for(let i=0;i<A.length;i++){
        matrixx[i] = `x${i+1}`
      }
      setMatrixX(matrixx)
      setMatrixY(matrixy)
       let LU = findLU(A)
       let L = findL(LU)
       setMatrixL(L)
       let U =  findU(LU);
       setMatrixU(U)
       let LB = pushB(L,matrixB)
       let Y = findY(LB)
       let UY = pushB(U,Y)
      let X = findX(UY)
      setResultYshowmatrix(Y)
      for(let i=0;i<Y.length-1;i++){
        newy.push({iteration: i,result:Y[i]})
      }
      for(let i=0;i<X.length-1;i++){
        newx.push({iteration: i,result:X[i]})
      }
      setResultY(newy)
      setResult(newx)
      const hasEmptyValues = matrixA.some(value => value === null || value === undefined || value === '');
      const hasEmptyValuesB = matrixB.some(value => value === null || value === undefined || value === '');
      if (hasEmptyValues||hasEmptyValuesB) {
          console.log('Array contains empty values');
      }else{
        setsolution(true)
      }
      
    }

 

    return (
      <div>
        <Navbar/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="text-center text-blue-500 text-3xl"></div>
    
          <div className="text-center text-blue-500 text-3xl">
            LU Decomposition
            <div>
              {matrixA.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl mb-4">กรอกข้อมูลใน Matrix</h2>
                  <div className="grid grid-cols-3 gap-4 p-4 text-center">
                    <div>{'[A]'}</div>
                    <div>{'{x}'}</div>
                    <div>{'{B}'}</div>
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1">
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
                      {matrixX.map((_, rowIndex) => (
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
            </div>
    
            <div className="mt-4">Input Matrix size (NxN)
            <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  value={sizematrix}
                  onChange={(e) => setSizematrix(e.target.value)}
                  className="border p-2 w-full"
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Set Size</button> {/* Add a button for submitting size */}
              </form>
            </div>
    
            <div className="mt-4">Linear Equation History</div>
            <Select
              defaultValue="size"
              style={{ width: '100%' }}
              onChange={handlesize}
              options={size.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              className="mt-2"
            />
            <Select
              defaultValue="data"
              style={{ width: '100%' }}
              onChange={handleeuation}
              options={equation.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              className="mt-2"
            />
          </div>
    
          <div className="text-center text-blue-500 text-3xl"></div>
        </div>
    
        <div className="bg-slate-200 font-bold m-10 p-8 h-auto">
          Solution
          {showsolution && (
            <>
              <div className="text-center">LU Decomposition
                <div className="grid grid-cols-1 gap-0 p-4">
                  <div>
                    <BlockMath math="LU = A" />
                    <div className="flex justify-center items-center gap-4">
                      <ArrayDisplay matrix={matrixL} />
                      <BlockMath math="*" />
                      <ArrayDisplay matrix={matrixU} />
                      <BlockMath math="=" />
                      <ArrayDisplay matrix={matrixA} />
                    </div>
                    <div className="text-xl mt-4">Back Substitution Y
                      {ResultY.map((result, index) => (
                        <div key={index} className="mt-1">
                          y{result.iteration + 1} = {result.result}
                        </div>
                      ))}
                    </div>
                  </div>
    
                  <div className="mt-4">
                    <BlockMath math="[U]{x} = {Y}" />
                    <div className="flex justify-center items-center gap-4">
                      <ArrayDisplay matrix={matrixU} />
                      <BlockMath math="*" />
                      <ArrayDisplay matrix={matrixX} />
                      <BlockMath math="=" />
                      <ArrayDisplay matrix={ResultYshowmatrix} />
                    </div>
                    <div className="text-xl mt-4">Back Substitution X
                      {Result.map((result, index) => (
                        <div key={index} className="mt-1">
                          X{result.iteration + 1} = {result.result}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
    
}
