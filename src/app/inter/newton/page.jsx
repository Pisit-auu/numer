'use client'
import { useState, useEffect } from 'react';
import { evaluate, re } from 'mathjs';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
export default function Newton() {
  const [pointValue, setpointValue] = useState([]);
  const [Xinput , setXinput] = useState('');
  const [matrixX, setmatrixX] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [arrayCn,setarrayCn] =useState([]);   //เก็บค่า cn , xn
  const [result,setresult]= useState('');  //เก็บ result

    const handleMatrixChange = (rowIndex, value) => {  
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; //update matrix X
      const newMatrix = [...matrixX];
      newMatrix[rowIndex] = validValue;
      setmatrixX(newMatrix);
      
    };
    const handleMatrixChangeB = (rowIndex, value) => {   
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; //update matrix Y
      const newMatrix = [...matrixY];
      newMatrix[rowIndex] = validValue;
      setMatrixY(newMatrix);
      
    };
    
    useEffect(() => {    
      const newmatrixX = Array.from({ length: pointValue }, () => "" );
      setmatrixX(newmatrixX);
      const newMatrixY = Array.from({ length: pointValue }, () => "");
      setMatrixY(newMatrixY);
    }, [pointValue]);  //กำหนดขนาดของ matrix
    
    const handleSubmit = (event) => {  
      event.preventDefault();
      if(Xinput ===''){
        alert('โปรดกรอกค่า x')
        return
      }
      const newmetrixX =matrixX
      const newmetrixY =matrixY
      newton(newmetrixX,newmetrixY,parseFloat(Xinput))
    };
    
    function findCn(x, y, i, j) {  
      if (i === j) {
        return y[i]; 
      }
      return (findCn(x, y, i + 1, j) - findCn(x, y, i, j - 1)) / (x[j] - x[i]);
    }
    
    function newton(x, y, Xinput) {
      let n = x.length;
      let xi = [];
      let cn = new Array(n).fill(0).map(() => new Array(n).fill(0));
      let newcn = [];
      
      for (let i = 0; i < n; i++) {
        cn[i][0] = y[i]; // ตั้ง cn เริ่ม
      }
      
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < n - i; j++) {
          cn[j][i] = findCn(x, y, j, j + i);       // คำนวณค่า cn ที่เหลือ
        }
      }
      // คำนวณ xi
      for (let i = 0; i < n; i++) {
        xi[i] = parseFloat(Xinput)-x[0];
        for (let j = 1; j < i; j++) { 
          xi[i] *= (parseFloat(Xinput) - x[j]);
        }
      }
      
      // หาค่า result
      let result = 0;
      result += cn[0][0];
      for (let i = 1; i < n; i++) {
        result += xi[i] * cn[0][i]; 
      }
      
      // สร้าง newcn เพื่อนำไปใช้
      for (let i = 0; i < n; i++) {
        if (i === 0) {
          newcn.push({ cn: cn[0][i], xi: 1 });
        } else {
          newcn.push({ cn: cn[0][i], xi: xi[i] }); 
        }
      }
      
      console.log(cn);
      console.log(xi);
      setarrayCn(newcn);
      setresult(`\\therefore f(${Xinput}) = ${result}`);
      return cn;
    }
    
    
  
  return (
    <div>
              <div className="grid grid-cols-3 gap-4 p-4">

                      <div className="text-center text-blue-500 text-3xl">input   {/*column1*/}
                                  <form onSubmit={handleSubmit}>Number of points 
                                        <input type="number" value={pointValue} onChange={(e) => setpointValue(e.target.value)}/>
                                        <div className="pt-4">X value
                                            <input type="number"  value={Xinput}  onChange={(e) => setXinput(e.target.value)}  ></input>
                                        </div>

                                        <button type="submit">Submit</button>

                                  </form>
                        </div>

                      <div className="text-center text-blue-500 text-3xl"> Newton  {/*column2*/}

                              <div> points=  {pointValue}
                                  {matrixX.length > 0 && (  //แสดงเมื่อ matrix >0
                                          <div className="mt-4">
                                                  <h2 className="text-xl mb-4">กรอกข้อมูลในช่องให้ครบถ้วน</h2>
                                                      <div className='grid grid-cols-3 gap-4 p-4'>
                                                        <div>  </div>

                                                        <div>  {'X'}   </div>
                                                        <div> {'Y'}  </div>
                                                      </div>

                                                  <div className='grid grid-cols-3 gap-4 p-4'>
                                                  <div>  </div>
                                                        <div className="grid" style={{ gridTemplateRows: `repeat(${pointValue}, minmax(0, 1fr))`, gap: '2px' }}> 
                                                                        {matrixX.map((value, rowIndex) => (  // รับค่าmatrix x
                                                                          <input
                                                                            key={rowIndex}
                                                                            type="number"
                                                                            value={value}
                                                                            onChange={(e) => handleMatrixChange(rowIndex, e.target.value)}
                                                                            className="border p-2 w-full text-center"
                                                                          />
                                                                        ))}
                                                                    </div>

                                                              <div className="grid" style={{ gridTemplateRows: `repeat(${pointValue}, minmax(0, 1fr))`, gap: '2px' }}> 
                                                                  {matrixY.map((value, rowIndex) => (  // รับค่าmatrix y
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

                        </div>

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3*/}
              </div >


              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
                    

                          <div className="grid grid-cols-1 gap-0 p-4">     solution
                                      <div>
                                      {arrayCn.map((iteration, index) => (
                                          <div key={index}>
                                            <BlockMath math={`C_{${index}} = ${Number(iteration.cn).toExponential(4)}`} />
                                            <BlockMath math={`X_{${index}} = ${iteration.xi}`} />
                                          </div>
                                        ))}
                                     <BlockMath math =  {result}/> 
                                      
                                  </div>
                        
                       



                          </div>
                </div>
    </div>
  );
}

//<BlockMath math={`C_{${index}}*X_{${index}}= ${iteration.cn.toExponential(4)}*${iteration.xi}`} />