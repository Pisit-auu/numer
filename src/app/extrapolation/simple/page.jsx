'use client'
import { useState, useEffect } from 'react';
import { evaluate, re } from 'mathjs';
import { eliminate ,findXeliminate,insertB} from '@/app/components/matrix';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import axios from 'axios'
import {Select,Space} from 'antd'
import dynamic from 'next/dynamic';

export default function Simple() {
  const Mathsimple = dynamic(() => import('../../components/mathsimple'), { ssr: false });

  
  const [pointValue, setpointValue] = useState([]);
  const [Xinput , setXinput] = useState('');
  const [minput , setMinput] = useState('1');
  const [matrixX, setmatrixX] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [showfx , setshowfx] = useState('');
  const [showfxresult , setshowfxresult] = useState('');
  const [metexta,setmatrixa] = useState([])
  const [matrixnewB, setMatrixnewB] = useState([]);  
  const [matrixnewA, setMatrixnewA] = useState([]);  
  const [matrixsetvaluefx,setmatrixvaluefx] = useState('');
  const [keepshow,setkeepshow] = useState(false);
  const [equationapi,setEquationapi]= useState([]);
  const [point,setpoint] = useState([])
  const [graph,setgraph] = useState([])
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
      const m = parseInt(minput);
      const X = matrixX;
      const point = parseInt(pointValue);
      const Y = matrixY
      const xvalue = parseFloat(Xinput)
      try{
        await axios.post('/api/simple',{
          point,
          xvalue,
          m,
          X,
          Y,
        })
        }catch(error){
          console.log('error',error)
        }
      if(m>=2 &&pointValue==2){
        alert('m>1 pointต้อง >2')
        return
      }
      const graphPoints=[]
      for(let i=0;i<X.length;i++){
        graphPoints.push({x:X[i],y:Y[i]})
      }

      setgraph(graphPoints);
      simple(X,Y,xvalue,m)
    };
    const fetchpoint = async () => {
      try{
          const Response= await axios.get('/api/simple')
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
          const Response= await axios.get('/api/simple')
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
      const Response = await axios.get(`/api/simple/${value}`)
      const X = Response.data.X
      const Y = Response.data.Y
      const xvalue = Response.data.xvalue
      const m = Response.data.m
      setmatrixX(X)
      setMatrixY(Y)
      setXinput(xvalue)
      setMinput(m)
    }


    function findsumx(matrix,n){
        let sum=0;
        for(let i=0;i<pointValue;i++){
          sum+= Math.pow(matrix[i],n)
        }
        return sum;
    }
    function findsumy(matrix,matriy,n){
      let sum=0;
      for(let i=0;i<pointValue;i++){
        sum+= Math.pow(matrix[i],n)*Math.pow(matriy[i],1)
      }
      return sum;
  }
    function simple(matrixX,matrixY,x,m){

      const newmatrix = Array.from({ length: m+1 }, () => Array(m+1).fill(0));
  
      for(let i=0;i<m;i++){
        for(let j=i;j<m;j++){
          newmatrix[i][j+1] = findsumx(matrixX,j+i+1)
          newmatrix[j+1][i] = findsumx(matrixX,j+i+1)
        }
        }
        for(let i=0;i<=m;i++){
          if(i==0){
            newmatrix[i][i] = parseInt(pointValue);
            
          }else{
            newmatrix[i][i] = findsumx(matrixX,i*2)
          }
          
        }
        console.log(newmatrix)
        
        const newmatrixsumy = []
        for(let i=0;i<=m;i++){
            newmatrixsumy[i] = findsumy(matrixX,matrixY,i);
        }
        setMatrixnewA(newmatrix)
        setMatrixnewB(newmatrixsumy)
        console.log(newmatrix)
        let ab = insertB(newmatrix,newmatrixsumy)
        let eliminateab = eliminate(ab)
        let findxab = findXeliminate(eliminateab)
        console.log(findxab)
        
        let equation= 'a_0'
        for(let i = 1; i <= m; i++) {
          if(i==1){
            equation += `+ a_{${i}}x`;
          }else{
            equation += `+ a_{${i}}x^{${i}}`;
          }
        }
         let an= []
        for(let i = 0; i <= m; i++) {
          an.push(`a${i}`);
        }
        let result = `${findxab[0].result}`
        for(let i = 1; i <= m; i++) {
          if(i==1){
            result += `+${findxab[i].result}*x`;
          }else{
            result += `+${findxab[i].result}*x^{${i}}`;
          }
        }
        setshowfxresult(result)
        setmatrixa(an)
        setshowfx(equation)
        console.log(equation)

        let findvalue=0;
        for(let i=0;i<=m;i++){
            findvalue+= findxab[i].result*Math.pow(x,i)  
        }
        setmatrixvaluefx(`f(${x})= ${findvalue}`)
        setkeepshow(true);
        
    }

  return (
    <div>
              <div className="grid grid-cols-3 gap-4 p-4">
              
                      <div className="text-center text-blue-500 text-3xl">input   {/*column1*/}
                                  <form onSubmit={handleSubmit}>Number of points 
                                        <input type="number"  value={pointValue}  onChange={(e) => {setpointValue(e.target.value)}}/>
                                        <div className="pt-4">X value
                                            <input type="number"  value={Xinput}  onChange={(e) => setXinput(e.target.value)}  ></input>
                                        </div>
                                        <div className="pt-4">order m
                                            <input type="number"  min='1' value={minput}  onChange={(e) => setMinput(e.target.value)}  ></input>
                                        </div>

                                        <button type="submit">Submit</button>

                                  </form>
                        </div>

                      <div className="text-center text-blue-500 text-3xl"> simple {/*column2*/}

                              <div>
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
                              <div className='mt-4'>Simple Equation History</div>
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

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3  */}
              </div >
              <div className='bg-slate-200 font-bold m-10 p-8 h-auto'>

                <div className="text-blue-500 text-3xl p-4 "> graph</div>
                  <div className="flex justify-center">
                      <div className="max-w-full  m-4">
                      <Mathsimple dataPoints={graph} />
                      </div>
                  </div>
                  </div>

              <div className='bg-slate-200 font-bold	m-10 p-8 h-auto '> {/*กรอบแสดงผล*/}
                    

                          <div className="grid grid-cols-1 gap-0 p-4">     solution
                  

                                          {keepshow && (
                                                    <div>

                                                      <div>
                                                    <BlockMath math={`f(x) = ${showfx}`} />
                                                    </div>

                                                    <div className='flex justify-center items-center'><ArrayDisplay matrix={matrixnewA} /> 
                                                    <ArrayDisplay matrix={metexta} /> 
                                                    <BlockMath math={`=`} /> <ArrayDisplay matrix={matrixnewB} /> 
                                                    </div>
                                                    <div>
                                                    <BlockMath math={`f(x) = ${showfxresult}`} />
                                                    </div>
                                                    <div>
                                                    <BlockMath math={`${matrixsetvaluefx}`} />
                                                    </div>
                                                    </div>
                                          )}
                          </div>
                </div>
    </div>
  );
}

//<BlockMath math={`C_{${index}}*X_{${index}}= ${iteration.cn.toExponential(4)}*${iteration.xi} matrixnewB  showfxresult` matrixsetvaluefx } <ArrayDisplay matrix={metexta} />/> 

