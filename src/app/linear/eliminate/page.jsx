'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { findx } from '@/app/components/matrix';
import axios from 'axios'
import {Select,Space} from 'antd'
import Navbar from  "../../components/header";

export default function Eliminate() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [Result, setResult] = useState([]);  // ค่าDetA1-An
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [show,setshow]= useState(false);
  const [equation,setEquation]= useState([]);
  const [size,setsize] = useState([])
  const [Step , setStep] = useState('')

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

    const matrixToLaTeX = (matrix) => {
        const formatMatrix = (m) => {
          // ใช้ array สำหรับจัดเรียง matrix
          return `\\begin{array}{${'c'.repeat(m[0].length)}}\n` +
                 m.map(row => row.join(' & ')).join(' \\\\\n') + 
                 '\n\\end{array}';
        };

        const latexChunks = matrix.map((slice, index) => (
          `\\text{Step ${index + 1}}: \n` +
          `\\begin{bmatrix} \n` + 
          formatMatrix(slice) + 
          `\n\\end{bmatrix}`
        ));
        
        return latexChunks.join(' \\\\\n');
      };

    const handleSubmit = async(event) => {
      event.preventDefault();
      const updatedMatrixAB = insertB(matrixA, matrixB);
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
          proublem:"Eliminate",
          size,
          A,
          B,
          x0,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      guass(updatedMatrixAB)
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
    
    function findX(A){
      let n = A.length;
      let X = [];
      const newx = [];
      const checkresult = [];
      for(let i=n-1;i>=0;i--){
              X[i] = A[i][n];
              if(A[i][i]===0){
                  alert('มีdivision error')
                  return
              }
          for(let k=i+1;k<n;k++){
              X[i]-=A[i][k]*X[k];
          }
          X[i]/=A[i][i];
          newx.push({iteration: i,result:X[i]})
      }
      
      for(let i=0;i<n;i++){
        let sum =0;
        for(let j=0;j<n;j++){
          sum += newx[n-1-j].result*matrixA[i][j]
          
        }
        checkresult.push("b",{i},"= ",sum)
      }
      setResult(newx)      
      return X;
  }
  
    function insertB(A, B) {
        let newarray = Array.from({ length: A.length }, () => Array(A[0].length + 1));
        

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[0].length; j++) {
                newarray[i][j] = A[i][j];
            }

            newarray[i][A[0].length] = B[i]; 
        } 
        return newarray;
    }
    
    function eliminate(A) { 
        let steps = []; 
        let n = A.length;
        steps.push(A.map(row => [...row])); 
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (A[i][i] !== 0) {
                    let r = A[j][i] / A[i][i];
                    for (let k = i; k < n + 1; k++) {
                        A[j][k] -= r * A[i][k];     
                    }
                }
                steps.push(A.map(row => [...row])); 
            }
            
        }
        findX(A)
        return steps;
    }

    function guass(updatedMatrixAB) {
        let newStep = [] 
        // ตรวจสอบขนาดของ AB ก่อน
        if (updatedMatrixAB.length === 0 || updatedMatrixAB[0].length === 0) {
            alert('Size > 0.');
            return;
        }
        // ตรวจสอบว่าเป็นตัวเลขทั้งหมด
        const checkmatrixisnumber = updatedMatrixAB.flat().every(item => Number.isFinite(item));
    
        if (checkmatrixisnumber) {
            newStep = eliminate(updatedMatrixAB); 
            console.log(newStep)
            setStep(matrixToLaTeX(newStep))
            setshow(true)
        } else {
            alert('ต้องเป็นตัวเลข.');
        }
    }

    return (
      <div>
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="text-center text-blue-500 text-3xl"></div>
          <div className="text-center text-blue-500 text-3xl">
            Gaussian Elimination Methods
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
                          value={`x${rowIndex + 1}`} readOnly
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
            <div className='mt-4'>
              <form onSubmit={handleSubmit}>
                Matrix size (NxN)
                <input
                  type="number"
                  value={sizematrix}
                  onChange={(e) => setSizematrix(e.target.value)}
                  className="border p-2 ml-2"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white ml-2">Submit</button>
              </form>
            </div>
            <div className='mt-4'>Linear Equation History</div>
            <Select
              defaultValue="size"
              style={{ width: '100%' }}
              onChange={handlesize}
              options={size.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              className="ml-4"
            />
            <Select
              defaultValue="data"
              style={{ width: '100%' }}
              onChange={handleeuation}
              options={equation.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              className="ml-4"
            />
          </div>
          <div className="text-center text-blue-500 text-3xl"></div>
        </div>
        <div className='bg-slate-200 font-bold m-10 p-8 h-auto'>
          Solution
          {show && (
            <div className='text-center'>
              Forward Elimination
              <div className="grid grid-cols-1 gap-0 p-4">
                <div>
                  <BlockMath math={Step} />
                </div>
                <div>Back Substitution
                  <div className="text-xl" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                    {Result.map((result, index) => (
                      <div key={index}>
                        <div>X{result.iteration + 1} = {result.result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };