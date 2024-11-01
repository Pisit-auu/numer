'use client'
import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import {findet } from '../../components/matrix'; 
import axios from 'axios'
import {Select,Space} from 'antd'
import Navbar from  "../../components/header";

export default function Carmer() {
  const [sizematrix, setSizematrix] = useState([]);
  const [toleranceinput , setTolerance] = useState('0.000001');
  const [detAn, setDetAn] = useState([]);  // ค่าDetA1-An
  const [matrixA, setmatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [matrixX, setMatrixX] = useState([]);
  const [xLabels, setxLabels] = useState('');     //  แสดง x1,x2,xn .....
  const [resultXs, setresultXs]  = useState('');  //  แสดง result x1,x2,xn...
  const [detA0, setdetA0] = useState('');
  const [equation,setEquation]= useState([]);
  const [size,setsize] = useState([])
  const [show,setshow] = useState(false)
  
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
    
    const handleSubmit = async(event) => {
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
          proublem:"Cramer",
          size,
          A,
          B,
          x0,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      cramer()
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
    }, [sizematrix]);
    
    
    function cramer() {
      const newX =[]
      const DetAll = []

      if (matrixA.length === 0 || matrixA.flat().length === 0) {
      alert('size > 0.');
      return;
    }
    const allNumbersInMatrix = matrixA.flat().every(item => Number.isFinite(item));//2d
      if(allNumbersInMatrix){
        if(parseFloat(sizematrix)===1){
          if(parseFloat(matrixA[0])===0){
            alert('detต้อง != 0');
            return;
          }
          let findx = parseFloat(matrixB[0])/parseFloat(matrixA[0])
          setdetA0(`\\text{det}(A) = \\begin{bmatrix} ${parseFloat(matrixA[0])} \\end{bmatrix}`)
          newX.push({resultX:findx,detA:parseFloat(matrixA[0])  ,detAi: parseFloat(matrixB[0])})
        }else{
          DetAll.push(...findet(matrixA, matrixB));  
          setdetA0(DetAll[0])
          if(parseFloat(DetAll[0])===0){
            alert('detต้อง != 0');
            return // เลิกทำหาก det =0
          }else{

            let x = [];
            setdetA0(`\\text{det}(A) = \\begin{bmatrix} ${parseFloat(DetAll[0])} \\end{bmatrix}`)

            for(let i=1;i<DetAll.length;i++){
                    x[i-1] = parseFloat(DetAll[i])/parseFloat(DetAll[0]);
                    newX.push({resultX: x[i-1],detA:parseFloat(DetAll[0])  ,detAi: parseFloat(DetAll[i])})
            }

          }
          
        }
        setDetAn(newX); // ค่าDetA1-An
        setxLabels(newX.map((_, index) => `x${index + 1}`).join(', '));
        setresultXs(newX.map(item => item.resultX).join(', ')); 
        setshow(true);
        return
      }else{
        alert('Matrix is empty.');
        return;
      }  
    }
  
    return (
      <div>
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4"> {/* Stacks on small screens, three columns on medium and up */}
          <div className="text-center text-blue-500 text-3xl"> {/* column 1 */}</div>
          <div className="text-center text-blue-500 text-3xl">Cramer {/* column 2 */}
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
                      {/* Matrix A Input */}
                      <div className="grid" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                        {matrixA.map((row, rowIndex) =>
                          row.map((value, colIndex) => (
                            <input
                              key={`${rowIndex}-${colIndex}`}  // รับค่า A
                              type="number"
                              value={matrixA[rowIndex][colIndex]}
                              onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                              className="border p-2 w-full text-center"
                            />
                          ))
                        )}
                      </div>
                      {/* Matrix X ReadOnly */}
                      <div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                        {matrixX.map((_, rowIndex) => (
                          <input
                            key={rowIndex}
                            type="text"
                            value={`x${rowIndex + 1}`} readOnly 
                            className="border p-2 w-full text-center" // เปลี่ยนเป็น w-full
                          />
                        ))}
                      </div>
                      {/* Matrix B Input */}
                      <div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}>
                        {matrixB.map((value, rowIndex) => (
                          <input
                            key={rowIndex}   // รับค่า B
                            type="number"
                            value={value}
                            onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                            className="border p-2 w-full text-center" // เปลี่ยนเป็น w-full
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>


            <div>
              <form onSubmit={handleSubmit}>
                Input Matrix size (NxN) 
                <input type="number" value={sizematrix} onChange={(e) => setSizematrix(e.target.value)} className="border p-2 w-full md:w-auto" />
                <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">Submit</button>
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
          <div className="text-center text-blue-500 text-3xl"></div>  {/* column 3 */}
        </div >
    
        <div className='bg-slate-200 font-bold m-10 p-8 h-auto '> {/* กรอบแสดงผล */}

              { show &&(
                          <div> 
                          <BlockMath math={'From Cramer’s Rule: x_i = \\frac{det(A_i)}{det(A)}'} />
                          <div className="grid grid-cols-1 gap-0 p-4">     
                            Solution
                            <BlockMath math={detA0} /> {/* ค่า det0 */}
                            <div>
                              {/* แสดง x แต่ละตัว */}
                              {detAn.map((detAn, index) => (  
                                <div key={index} className="">    
                                  <BlockMath math={`x_{${index + 1}} = \\frac{det(A_${index + 1})}{det(A)} = \\frac{${detAn.detAi}}{${detAn.detA}} = ${detAn.resultX}`} />
                                </div>
                              ))}          
                              {/* Result */}
                              <div className="mt-4 font-bold"> 
                                ∴ ({xLabels}) = ({resultXs})
                              </div>
                            </div>
                          </div>
                        </div>
              )
                
              }


        </div>
      </div>
    );
    
  
}
