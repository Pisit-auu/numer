'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { findx } from '@/app/components/matrix';
export default function Eliminate() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [Result, setResult] = useState([]);  // ค่าDetA1-An
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [check,setCheck]= useState([]);

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

    const handleSubmit = (event) => {
      event.preventDefault();
      const updatedMatrixAB = insertB(matrixA, matrixB);
      guass(updatedMatrixAB)
    };

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
            
        } else {
            alert('ต้องเป็นตัวเลข.');
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

                      <div className="text-center text-blue-500 text-3xl"> Guass Elimination Methods  {/*column2*/}

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

                        </div>

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3*/}
              </div >


              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
              solution  <div className='text-center	'> Forward Elimination

                          <div className="grid grid-cols-1 gap-0 p-4">      
                          <div>
                          <BlockMath math={Step} />
  
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