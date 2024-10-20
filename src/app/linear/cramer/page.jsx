'use client'
import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import {findet } from '../../components/matrix'; 
import axios from 'axios'
import {Select,Space} from 'antd'
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
        return
      }else{
        alert('Matrix is empty.');
        return;
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

                      <div className="text-center text-blue-500 text-3xl"> Cramer  {/*column2*/}

                              <div> [A]=  {sizematrix}
                                  {matrixA.length > 0 && (   //แสดงเมื่อ length>0
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
                                                                                key={`${rowIndex}-${colIndex}`}  //รับค่าA
                                                                                type="number"
                                                                                value={matrixA[rowIndex][colIndex]}
                                                                                onChange={(e) =>
                                                                                  handleMatrixChange(rowIndex, colIndex, e.target.value)
                                                                                }
                                                                                className="border p-2 w-full text-center"
                                                                              />
                                                                            )))}
                                                                </div>

                                                                <div div className="grid" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}> 
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
                                                                      key={rowIndex}   //รับค่าB
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
                    <div> <BlockMath math={' From Cramer’s Rule:x_i = \\frac{det(A_i)}{det(A)}'} />

                          <div className="grid grid-cols-1 gap-0 p-4">     solution
                                <BlockMath math =  {detA0} /> {/*ค่าdet0*/}
                          <div>
                                                          {/*แสดง x แต่ละตัว*/}
                                                          {detAn.map((detAn, index) => (  
                                                          <div key={index} className="">    
                                                            <BlockMath math={`x_{${index + 1}} = \\frac{det(A_${index + 1})}{det(A)} = \\frac{${detAn.detAi}}{${detAn.detA}}= ${detAn.resultX}`} />
                                                          </div>
                                                          
                                                          ))}          
                                                          {/* result */}
                                                          <div className="mt-4 font-bold"> 
                                                          ∴ ({xLabels}) = ({resultXs})
                                                          </div>
                            </div>
                           </div>
                     </div>
                </div>
    </div>
  );
}
