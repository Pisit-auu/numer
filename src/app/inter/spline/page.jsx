'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
export default function Spline() {
  const [pointValue, setpointValue] = useState([]);
  const [Xinput , setXinput] = useState('');
  const [matrixX, setmatrixX] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [result,setresult]= useState('');  //เก็บ result
  const [colorbuttonl,setcolorbuttonl] = useState('bg-green-200');
  const [colorbuttonq,setcolorbuttonq] = useState('bg-slate-200');
  const [colorbuttonc,setcolorbuttonc] = useState('bg-slate-200');
  const [spline,setspline]= useState('linear');
  const [equationcalresult,setequationcalresult]= useState('');
  const [equationfn,setequationfn]= useState([]);
  const clickchoosespline =(message) =>{
    if(message==='linear'){
      setcolorbuttonl('bg-green-200')
      setcolorbuttonq('bg-slate-200')
      setcolorbuttonc('bg-slate-200')
      setspline(message);
    }else if(message==='quadratic'){
      setcolorbuttonq('bg-green-200')
      setcolorbuttonc('bg-slate-200')
      setcolorbuttonl('bg-slate-200')
      setspline(message);
    }else if(message==='cubic'){
      setcolorbuttonc('bg-green-200')
      setcolorbuttonl('bg-slate-200')
      setcolorbuttonq('bg-slate-200')
      setspline(message);
    }
  }

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
      if(spline==='linear'){
        linear(newmetrixX,newmetrixY,parseFloat(Xinput))
      }else if(spline==='quadratic'){
        alert('ยังไม่ทำ')
      }else if(spline==='cubic'){
        alert('ยังไม่ทำ')
      }
      
    };
    function findm(x,y){
          let m = new Array(pointValue).fill(0);
          for(let i=1;i<pointValue;i++){
            if(x[i]-x[i-1]==0){
              alert('x[i]-x[i-1] ==0')
              return
            }
            m[i-1] = (y[i]-y[i-1])/(x[i]-x[i-1]);
          }
          return m
    }
    
    function linear(x, y, Xinput) {
      let m =findm(x,y)
      let r
      let keepi
      let check =true;
      for(let i=0;i<pointValue-1;i++){
          if(Xinput >= x[i]&& Xinput<=x[i+1]){
            keepi = i;
            check=false;
          }
      }
      if(check){
        alert("x not found")
        return
      }
      let fn= [];
      for(let i=1;i<pointValue;i++){
        fn.push(`f_${i}(x) = ${y[i-1]}+(${m[i-1]})(x-${x[i-1]});\\quad  ${x[i-1]}<=x<=${x[i]}`)
      }
      setequationfn(fn)
      r = y[keepi] + m[keepi]*(Xinput-x[keepi])
      setequationcalresult(`f(${Xinput}) = ${y[keepi]}+ (${m[keepi]})(${Xinput}-${x[keepi]})`)
      setresult(`f(${Xinput}) = ${r}`)
    
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

                      <div className="text-center text-blue-500 text-3xl"> Spline  {/*column2*/}
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

                <div className="text-center text-blue-500 text-3xl"> {/*column3 bg-green-400*/}
                 <div>
                 <button  className={`p-2 ${colorbuttonl}`}onClick={() => clickchoosespline('linear')}>Linear</button>
                  <button className={`p-2 ${colorbuttonq} `}onClick={() => clickchoosespline('quadratic')}>Quadratic</button>
                  <button  className={`p-2 ${colorbuttonc} `}onClick={() => clickchoosespline('cubic')}>Cubic</button>
                  </div>
                  
                  
                  </div> 
                
              </div >


              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
                    

                          <div className="grid grid-cols-1 gap-0 p-4">     solution
                                      <div>
                                      {equationfn.map((iteration, index) => (
                                          <div key={index}>
                                              <BlockMath math =  {`${iteration}`}/> 
                                          </div>
                                        ))}
                                        <BlockMath math =  {`${equationcalresult}`}/> 
                                        <BlockMath math =  {`${result}`}/> 
                                      
                                  </div>
                        
                       



                          </div>
                </div>
    </div>
  );
}

//<BlockMath math={`C_{${index}}*X_{${index}}= ${iteration.cn.toExponential(4)}*${iteration.xi}`} />