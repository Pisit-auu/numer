'use client'
import { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { eliminate ,findXeliminate,insertB} from '@/app/components/matrix';
import ArrayDisplay from '@/app/components/showmatrixnxn'
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import axios from 'axios'
import {Select,Space} from 'antd'

export default function Multiple() {
  const [pointValue, setpointValue] = useState(2);
  const [Xnumber , setXnumber] = useState(1);
  const [matrixX, setMatrixX ] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [showfx , setshowfx] = useState('');
  const [showfxresult , setshowfxresult] = useState('');
  const [metexta,setmatrixa] = useState([])
  const [matrixnewB, setMatrixnewB] = useState([]);  
  const [matrixnewA, setMatrixnewA] = useState([]);  
  const [matrixsetvaluefx,setmatrixvaluefx] = useState('');
  const [keepshow,setkeepshow] = useState(false);
  const [matrixX0, setMatrixX0] = useState([]);
  const [equationapi,setEquationapi]= useState([]);
  const [point,setpoint] = useState([])
  const [number,setnumber] = useState([])
  const handleMatrixChange = (rowIndex, colIndex, value) => {
    const numericValue = parseFloat(value);
    const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
    const newMatrix = [...matrixX];
    newMatrix[rowIndex][colIndex] = validValue;
    setMatrixX(newMatrix);
  };

    const handleMatrixChangeB = (rowIndex, value) => {   
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; //update matrix Y
      const newMatrix = [...matrixY];
      newMatrix[rowIndex] = validValue;
      setMatrixY(newMatrix);
      
    };
    const handleMatrixChangeX0 = (rowIndex, value) => {   //อัพเดตค่าx0
      const numericValue = parseFloat(value);
      const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
      const newMatrix = [...matrixX0];
      newMatrix[rowIndex] = validValue;
      setMatrixX0(newMatrix);
    };
    useEffect(() => {    
      const newMatrixX = Array.from({ length: pointValue }, () =>
        Array.from({ length: Xnumber }, () => "")
      );
      setMatrixX(newMatrixX);
      
      const newMatrixY = Array.from({ length: pointValue }, () => "");
      setMatrixY(newMatrixY);
      const newMatrixX0 = Array.from({ length: Xnumber }, () => "");
      setMatrixX0(newMatrixX0);
    }, [pointValue, Xnumber]);
    
    const handleSubmit = async(event) => {  
      event.preventDefault();
      if( pointValue<2){
        alert('point > 1')
        return
      }
      if( Xnumber<1){
        alert('number x >0')
        return
      }
      if(!matrixX||!matrixY||!matrixX0){
        alert('โปรดกรอกค่า X,Y,x0')
        return
      }
      const xvalue = parseFloat(Xnumber)
      const xi = matrixX0
      const X = matrixX;
      const point = parseInt(pointValue);
      const Y = matrixY
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
        await axios.post('/api/multiple',{
          proublem:"Multiplle",
          point,
          xvalue,
          X,
          Y,
          xi,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      console.log(X)
      console.log(Y)
      console.log(xi)
      multiple(X,Y,xi,xvalue)
    };

    const fetchpoint = async () => {
      try{
          const Response= await axios.get('/api/multiple')
          let test = Response.data
          let keeppoint =[]
          let number=[]
          for(let i=0;i< test.length;i++){
            if(!keeppoint.some(item=>item.label===test[i].point)){
              keeppoint.push({ value: test[i].point, label: test[i].point});
              number.push({ value: test[i].xvalue, label: test[i].xvalue});
            }
          }
          setpoint(keeppoint)
      }catch(error){
        console.log('error',error)
      }
    }
    const fetchenumber = async (value) => {
      try{
          const Response= await axios.get('/api/multiple')
          let test = Response.data
          let number=[]
          for(let i=0;i< test.length;i++){
            if(test[i].point === value){
              number.push({value:test[i].xvalue, label:test[i].xvalue})
            }
          }
          setnumber(number)
      }catch(error){
        console.log('error',error)
      }
    }
    const fetchequation = async (xcheck,pointcheck) => {
      try{
          const Response= await axios.get('/api/multiple')
          let test = Response.data
          let eqution=[]
          for(let i=0;i< test.length;i++){
            if(test[i].xvalue === xcheck && test[i].point === pointcheck){
              eqution.push({value:test[i].id, label:test[i].X})
            }
          }
          setEquationapi(eqution)
      }catch(error){
        console.log('error',error)
      }
    }
    useEffect(()=>{
      fetchpoint()
    },[])

    const handlepoint = (value)=>{
      setpointValue(value)
      fetchenumber(value)
    }
    const handlenumber = (value)=>{
      setXnumber(value)
      fetchequation(value,pointValue)
    }
    const handleequation = async(value)=>{
      const Response = await axios.get(`/api/multiple/${value}`)
      const X = Response.data.X
      const Y = Response.data.Y
      const xi = Response.data.xi
      setMatrixX(X)
      setMatrixY(Y)
      setMatrixX0(xi)
    }
    

    function findsumx(matrix,numx0,numx1){
      let sum=0;
      if(numx0==0&&numx1==1){
        for(let i=0;i<pointValue;i++){
          sum+=matrix[i][numx0]
        }
      }else if(numx0==0){
        for(let i=0;i<pointValue;i++){
          sum+=matrix[i][numx1-1]
        }
      }else if(numx0==numx1){
          for(let i=0;i<pointValue;i++){
            sum+=Math.pow(matrix[i][numx0-1],2)
          }
      }
      else{
        for(let i=0;i<pointValue;i++){
          sum+= matrix[i][numx1-1]*matrix[i][numx0-1]
        }
      }
      return sum;
  }
  function findsumy(matrix,matrixy,n){
    let sum=0;
    if(n==0){
      for(let i=0;i<pointValue;i++){
        sum+= matrixy[i]
      }
    }else{
      for(let i=0;i<pointValue;i++){
        sum+= matrixy[i]*matrix[i][n-1]
      }
    }
    return sum;
}
    function multiple(matrixX,matrixY,x,numx){
      const newmatrix = Array.from({ length: numx+1 }, () => Array(numx+1).fill(0));
  
      for(let i=0;i<numx;i++){
        for(let j=i;j<numx;j++){
          newmatrix[i][j+1] = findsumx(matrixX,i,j+1)
          newmatrix[j+1][i] = findsumx(matrixX,i,j+1)
        }
        }

        
        for(let i=0;i<=numx;i++){
          if(i==0){
            newmatrix[i][i]  = parseInt(pointValue);
          }else{
            newmatrix[i][i]  = findsumx(matrixX,i,i);
          }
        }

        const newmatrixsumy = []
        for(let i=0;i<=numx;i++){
            newmatrixsumy[i] = findsumy(matrixX,matrixY,i);
        }

        let ab = insertB(newmatrix,newmatrixsumy)
        let eliminateab = eliminate(ab)
        
        let findxab = findXeliminate(eliminateab)

        let equation= 'a_0'
        for(let i = 1; i <= numx; i++) {
          if(i==1){
            equation += `+ a_{${i}}x`;
          }else{
            equation += `+ a_{${i}}x_{${i}}`;
          }
        }
        setshowfx(equation)
        setMatrixnewA(newmatrix)
        setMatrixnewB(newmatrixsumy)
        let an= []
        for(let i = 0; i <= numx; i++) {
          an.push(`a${i}`);
        }
        setmatrixa(an)
        let result ='f(X1'
        for(let i = 2; i <= numx; i++) {
          result +=`,X_{${i}}`
        }
          result +=') = '
        result += `${findxab[0].result}`
        for(let i = 1; i <= numx; i++) {
            result += `+${findxab[i].result}*X_${i}`;
        }
        setshowfxresult(result)


        let findvalue=findxab[0].result;
        for(let i=1;i<=numx;i++){
            findvalue+= findxab[i].result*x[i-1]  
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
                                        <div className="pt-4">number x
                                            <input type="number"  value={Xnumber}  onChange={(e) => setXnumber(e.target.value)}  ></input>
                                        </div>

                                        <button type="submit">Submit</button>

                                  </form>
                        </div>

                      <div className="text-center text-blue-500 text-3xl"> Multiple {/*column2*/}

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
                                                  <div className="grid" style={{ gridTemplateColumns: `repeat(${Xnumber}, minmax(0, 1fr))`, gap: '2px' }}>
                                                              {matrixX.map((row, rowIndex) =>
                                                                row.map((value, colIndex) => (
                                                                  <input
                                                                    key={`${rowIndex}-${colIndex}`}
                                                                    type="number"
                                                                    value={matrixX[rowIndex][colIndex]}
                                                                    onChange={(e) =>
                                                                      handleMatrixChange(rowIndex, colIndex, e.target.value)
                                                                    }
                                                                    className="border p-2 w-full text-center"
                                                                  />
                                                                )))}
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
                                                            
                                                                    <div className='flex'>{matrixX0.map((value, rowIndex) => (
                                                                    <input
                                                                      key={rowIndex}
                                                                      type="number"
                                                                      value={value}
                                                                      onChange={(e) => handleMatrixChangeX0(rowIndex, e.target.value)}
                                                                      className="border p-2 w-20 text-center"
                                                                    />
                                                                  ))}</div>
                                                  </div>
                                          </div>
                                    )}
                              </div>  
                              <div className='mt-4'>Multiple Equation History</div>
                                      <Select
                                defaultValue="Size"
                                style={{ width: 200 }}
                                onChange={handlepoint}
                                options={point.map(item => ({
                                  value: item.value,
                                  label: item.label,
                                }))}
                                className="ml-4"
                              />  <Select
                              defaultValue="Number"
                              style={{ width: 200 }}
                              onChange={handlenumber}
                              options={number.map(item => ({
                                value: item.value,
                                label: item.label,
                              }))}
                              className="ml-4"
                            />   <Select
                            defaultValue="Xi value"
                            style={{ width: 200 }}
                            onChange={handleequation}
                            options={equationapi.map(item => ({
                              value: item.value,
                              label: item.label,
                            }))}
                            className="ml-4"
                          />         

                        </div>

                <div className="text-center text-blue-500 text-3xl"></div>  {/*column3  */}
              </div >


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
                                                    <BlockMath math={`${showfxresult}`} />
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

