'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import axios from 'axios'
import {Select,Space} from 'antd'
export default function Inversion() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [Result, setResult] = useState([]);  // ค่าDetA1-An
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [AI ,setAI] = useState([])
  const [Step , setStep] = useState('')
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

    const matrixToLaTeX = (matrix) => {
        const formatMatrix = (m) => {
          // ใช้ array สำหรับจัดเรียง matrix
          return `\\begin{array}{${'c'.repeat(m[0].length)}}\n` +
                 m.map(row => row.join(' & ')).join(' \\\\\n') + 
                 '\n\\end{array}';
        };

        const latexChunks = matrix.map((slice, index) => (
          `\\text{Slice ${index + 1}}: \n` +
          `\\begin{bmatrix} \n` + 
          formatMatrix(slice) + 
          `\n\\end{bmatrix}`
        ));
        
        return latexChunks.join(' \\\\\n');
      };

    const handleSubmit = async(event) => {
      event.preventDefault();
      const updatedMatrixAI = putAI(matrixA);
      const A = matrixA;
      const size = parseInt(sizematrix);
      const B = matrixB
      const x0 = new Array(size).fill(0)
      
      try{
        await axios.post('/api/linear',{
          size,
          A,
          B,
          x0
        })
        }catch(error){
          console.log('error',error)
        }
      inverse(updatedMatrixAI)
      
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
    
    function putAI(A) {
      const AB = new Array(A.length).fill(0).map(() => new Array(A[0].length + A[0].length).fill(0));
      const n = A.length;
    
      for (let i = 0; i < n; i++) {
          for (let j = 0; j < AB[0].length; j++) {
              if (j < A[0].length) {
                  AB[i][j] = A[i][j]; 
              } else if (j === A[0].length + i) {
                  AB[i][j] = 1; 
              } else {
                  AB[i][j] = 0; 
              }
          }
      }
      return AB; 
  }

  function findAI(A) {
    const X = new Array(A.length).fill(0).map(() => new Array(A.length).fill(0)); 

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[0].length; j++) { 
            if (j >= A.length) { //คอลัมน์ที่ต้องการ
                X[i][j % A.length] = A[i][j]; 
            }
        }
    }

    return X; 
}

function AXB(FAI, B) {
  const newx = []
  const X = new Array(FAI.length).fill(0); 

  for (let i = 0; i < FAI.length; i++) {
      let sum = 0;
      for (let j = 0; j < FAI[i].length; j++) {
          sum += FAI[i][j] * B[j]; 
      }
      X[i] = sum;
      newx.push({iteration: i,result:X[i]})
  }
  setResult(newx)
}  
    
    function eliminate(updatedMatrixAI) { 
        let steps = []; 
        let A = updatedMatrixAI;
        let n = A[0].length;
        steps.push(A.map(row => [...row])); 
        for (let i = 0; i < A.length; i++) {
            for (let j = i + 1; j < A.length; j++) {
                if (A[i][i] !== 0) {
                    let r = A[j][i] / A[i][i];
                    for (let k = i; k < n; k++) {
                        A[j][k] -= r * A[i][k];     
                    }
                }
                steps.push(A.map(row => [...row])); 
            }
            
        }
        for(let i=A.length-1;i>0;i--){
          for(let j=i-1;j>=0;j--){
            let r = A[j][i]/A[i][i];
              for(let k=i;k<n;k++){
                A[j][k]-=r*A[i][k];
              }
              steps.push(A.map(row => [...row])); 
          }
       }

      for(let i=0;i<A.length;i++){
        let r = A[i][i];
           for(let j=0;j<n;j++){
            A[i][j]/=r;
           }
           if(i>0){
            steps.push(A.map(row => [...row])); 
           }
    }
        let beforeFindAI = findAI(A)
        setAI(beforeFindAI)
        AXB(beforeFindAI,matrixB)
        
        return steps;
    }

    function inverse(updatedMatrixAI) {
        let newStep = [] 

        if (updatedMatrixAI.length === 0 || updatedMatrixAI[0].length === 0) {
            alert('Size > 0.');
            return;
        }
     
        const allNumbersInMatrix = updatedMatrixAI.flat().every(item => Number.isFinite(item));
    
        if (allNumbersInMatrix) {
            newStep =eliminate(updatedMatrixAI); 
            setStep(matrixToLaTeX(newStep))
            console.log(newStep)
            
        } else {
            alert('Matrix contains non-numeric values.');
        }
    }

    return (
    <div>
              <div className="grid grid-cols-3 gap-4 p-4">

                      <div className="text-center text-blue-500 text-3xl">input   {/*column1*/}
                                  <form onSubmit={handleSubmit}>Matrix size (NxN) 
                                        <input type="number" value={sizematrix} onChange={(e) => setSizematrix(e.target.value)}/>

                                        <div className="pt-4">tolerance
                                            <input type="number"  value={toleranceinput}  onChange={(e) => setTolerance(e.target.value)}  ></input>
                                        </div>

                                        <button type="submit">Submit</button>

                                  </form>
                        </div>

                      <div className="text-center text-blue-500 text-3xl"> Inversion Methods  {/*column2*/}

                              <div> [A]=  {sizematrix}
                                  {matrixA.length > 0 && (
                                          <div className="mt-4">
                                                  <h2 className="text-xl mb-4">กรอกข้อมูลใน Matrix</h2>
                                                      <div className='grid grid-cols-3 gap-4 p-4'>
                                                        <div>  {'{A}'}   </div>
                                                        <div> {'{X}'} </div>
                                                        <div> {'{B}'}  </div>
                                                      </div>

                                                  <div className='grid grid-cols-3 gap-4 p-4'>
                                                  
                                                                <div className="grid" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
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
                                                                            )))}
                                                                </div>

                                                                <div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}> 
                                                                  {matrixX.map((value, rowIndex) => (
                                                                    <input
                                                                      key={rowIndex}
                                                                      type="text"
                                                                      value={`x${rowIndex+1}`}readOnly 
                                                                      onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                                                                      className="border p-2 w-20 text-center"
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
                                                                      className="border p-2 w-20 text-center"
                                                                    />
                                                                  ))}
                                                              </div>
                                                  </div>
                                          </div>
                                    )}
                              </div>
                              <div className='mt-4'>Linear Equation History</div>
                                      <Select
                                defaultValue="size"
                                style={{ width: 200 }}
                                onChange={handlesize}
                                options={size.map(item => ({
                                  value: item.value,
                                  label: item.label,
                                }))}
                                className="ml-4"
                              /><Select
                              defaultValue="data"
                              style={{ width: 200 }}
                              onChange={handleeuation}
                              options={equation.map(item => ({
                                value: item.value,
                                label: item.label,
                              }))}
                              className="ml-4"
                            />        
           

                        </div>

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3*/}
              </div >


              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
              solution  
                       <BlockMath math="From  Ax = B" />
                      <BlockMath math="A^{-1} B = x" />      

                            <div className='text-center	'> Forward Elimination
                                        <div className="grid grid-cols-1 gap-0 p-4">      
                                        <div>
                                        <BlockMath math={Step} />
                                          </div> 

                                          <div>AI
                                          <div>
                                              <ArrayDisplay matrix={AI} />
                                            </div>
                            </div>

                            <div>Back Subtiution
                            
                                                          {/*แสดง x แต่ละตัว*/}
                                                          <div className="text-xl" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                                                                {Result.map((Result, index) => (
                                                                <div key={index} className="">
                                                                    <div>X{Result.iteration+1}={Result.result }</div>
                                                                </div>
                                                                ))}
                                                                </div>    
                                
  
                            </div> 
                           
                           </div>
                     </div>
                </div>
    </div>
  );
}
// <BlockMath math={`x_{1} = \\frac{b_{1} - a_{11} x_{1}}{a_{11}} = \\frac{1 - a_{11} x_{1}}{a_{11}} = 1`} />
// <BlockMath math={' From Cramer’s Rule:x_i = \\frac{det(A_i)}{det(A)}'} />
    
    
        // setdetA0(`\\text{det}(A) = \\begin{bmatrix} ${parseFloat(DetAll[0])} \\end{bmatrix}`)
       // setResult(newX);
       // setEquation(mewequation);
        //newX.push(...findX(matrixA)); 
        //          DetAll.push(...findet(matrixA, matrixB));  
      //newX.push({resultX: x[i-1],detA:parseFloat(DetAll[0])  ,detAi: parseFloat(DetAll[i])})
       // setDetAn(newX); // ค่าDetA1-An