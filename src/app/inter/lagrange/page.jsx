'use client'
import { useState, useEffect } from 'react';
import { evaluate} from 'mathjs';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import axios from 'axios'
import {Select,Space} from 'antd'
export default function Lagrange() {
  const [pointValue, setpointValue] = useState([]);
  const [Xinput , setXinput] = useState('');
  const [matrixX, setmatrixX] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [equtionli,setequtionli] =useState([]);  
  const [eqution,seteqution]=useState('')
  const [Li,setLi]=useState([]) 
  const [result,setresult]= useState('');  //เก็บ result
  const [equationapi,setEquationapi]= useState([]);
  const [point,setpoint] = useState([])
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
    
    const handleSubmit = async(event) => {  
      event.preventDefault();
      if(Xinput ===''||pointValue<2){
        alert('โปรดกรอกค่า x หรือ point > 1')
        return
      }
      const X = matrixX;
      const point = parseInt(pointValue);
      const Y = matrixY
      const x0 = parseFloat(Xinput)
      try{
        await axios.post('/api/inter',{
          point,
          X,
          Y,
          x0
        })
        }catch(error){
          console.log('error',error)
        }
      lagrange(X,Y,x0)
      
    };
    const fetchpoint = async () => {
      try{
          const Response= await axios.get('/api/inter')
          let test = Response.data
          let keeppoint =[]
          for(let i=0;i< test.length;i++){
            if(!keeppoint.some(item=>item.label===test[i].point)){
              keeppoint.push({ value: test[i].point, label: test[i].point});
            }
          }
          setpoint(keeppoint)
      }catch(error){
        console.log('error',error)
      }
    }
    const fetchequation = async (value) => {
      try{
          const Response= await axios.get('/api/inter')
          let test = Response.data
          let keepequation = []
          for(let i=0;i< test.length;i++){
            if(test[i].point === value){
              keepequation.push({value:test[i].id, label:test[i].X})
            }
          }
          setEquationapi(keepequation)
      }catch(error){
        console.log('error',error)
      }
    }
    useEffect(()=>{
      fetchpoint()
    },[])

    const handlepoint = (value)=>{
      setpointValue(value)
      fetchequation(value)
    }
    const handleeuation = async (value)=>{
      const Response = await axios.get(`/api/inter/${value}`)
      const X = Response.data.X
      const Y = Response.data.Y
      const x0 = Response.data.x0
      setmatrixX(X)
      setMatrixY(Y)
      setXinput(x0)
    }

    
    function lagrange(xi, yi, x) {
      let Li =[];
      let newIterations =[];
      for(let i=0;i<pointValue;i++){
        let sumon = 1;
        let sumunder = 1;
        for( let j=0;j<pointValue;j++){
          if(i!==j){
            sumon *= xi[j]-x;
            sumunder *= xi[j]-xi[i];
          }
        }
        let calLi = sumon/sumunder;
        Li.push(calLi);
      }
      console.log(Li)
      setLi(Li)
      let result=0;
      for(let i=0;i<pointValue;i++){
        result +=  Li[i]*yi[i];
      }
      console.log(result)
      for(let i=0;i<pointValue;i++){
        if(i==pointValue-1){
          newIterations.push({ iter: i, li: Li[i], yi: yi[i],plus:"",equa:""  });
          break
        }
        if(i==0){
          newIterations.push({ iter: i, li: Li[i], yi: yi[i],plus:"+",equa:"="  });
        }
        newIterations.push({ iter: i, li: Li[i], yi: yi[i],plus:"+",equa:"" });
      }
      let equation = ''; // เริ่มต้นเป็น string ว่าง
      for(let i = 0; i < pointValue; i++) {
        equation += `L_{${i}}f(x_{${i}}) + `;
      }
      // ลบ "+" ตัวสุดท้ายออก
      equation = equation.slice(0, -3);
      console.log(equation)
      seteqution(equation)
      console.log(newIterations)
      setequtionli(newIterations)
      setresult(result.toString())
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

                      <div className="text-center text-blue-500 text-3xl"> Lagrange Interpolation  {/*column2*/}

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
                              <div className='mt-4'>Inter Equation History</div>
                                      <Select
                                defaultValue="size"
                                style={{ width: 200 }}
                                onChange={handlepoint}
                                options={point.map(item => ({
                                  value: item.value,
                                  label: item.label,
                                }))}
                                className="ml-4"
                              /><Select
                              defaultValue="data"
                              style={{ width: 200 }}
                              onChange={handleeuation}
                              options={equationapi.map(item => ({
                                value: item.value,
                                label: item.label,
                              }))}
                              className="ml-4"
                            />           

                        </div>

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3*/}
              </div >


              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
                    

                          <div className="grid grid-cols-1 gap-0 p-4">     solution
                                      <div>
                                      {Li.map((iteration, index) => (
                                          <div key={index}>
                                            <BlockMath math={`L_{${index}} = ${iteration}`} />
                                          </div>
                                        ))}
                                    <div className='text-center'>  <InlineMath math =  {`f(${Xinput})=`}/> <InlineMath math =  {`${eqution}`}/> 
                                    {equtionli.map((iteration, index) => (
                                          <div key={index}>
                                             <InlineMath math={`${iteration.equa}(${iteration.li})(${iteration.yi})${iteration.plus}`} />
                                          </div>
                                        ))}
                                     <InlineMath math =  {"="}/>  <InlineMath math =  {result}/> </div>
                                      
                                  </div>
                        
                       



                          </div>
                </div>
    </div>
  );
}

//<BlockMath math={`C_{${index}}*X_{${index}}= ${iteration.cn.toExponential(4)}*${iteration.xi}`} />