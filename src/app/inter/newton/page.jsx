'use client'
import { useState, useEffect } from 'react';
import { evaluate, re } from 'mathjs';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import axios from 'axios'
import {Select,Space} from 'antd'
export default function Newton() {
  const [pointValue, setpointValue] = useState([]);
  const [Xinput , setXinput] = useState('');
  const [matrixX, setmatrixX] = useState([]);  
  const [matrixY, setMatrixY] = useState([]);  
  const [arrayCn,setarrayCn] =useState([]);   //เก็บค่า cn , xn
  const [result,setresult]= useState('');  //เก็บ result
  const [equation,setEquation]= useState([]);
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
      if(Xinput ===''){
        alert('โปรดกรอกค่า x')
        return
      }
      const X = matrixX;
      const point = parseInt(pointValue);
      const Y = matrixY
      const x0 = parseFloat(Xinput)
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
        await axios.post('/api/inter',{
          proublem:"Newton",
          point,
          X,
          Y,
          x0,
          Date:formattedDateTime 
        })
        }catch(error){
          console.log('error',error)
        }
      newton(X,Y,parseFloat(Xinput))
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
          setEquation(keepequation)
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
      
      // หาresult
      let result = 0;
      result += cn[0][0];
      for (let i = 1; i < n; i++) {
        result += xi[i] * cn[0][i]; 
      }
      
      //newcn 
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
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="text-center text-blue-500 text-3xl"></div>
    
          {/* Column 2 */}
          <div className="text-center text-blue-500 text-3xl">
            Newton
            <div>
              <span>Points = {pointValue}</span>
              {matrixX.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xl mb-4">กรอกข้อมูลในช่องให้ครบถ้วน</h2>
                  <div className="grid grid-cols-3 gap-4 p-4">
                  <div>{'X'}</div>
                    <div></div>
                    
                    <div>{'Y'}</div>
                  </div>
    
                  <div className="grid grid-cols-3 gap-4 p-4">
                  <div className="grid" style={{ gridTemplateRows: `repeat(${pointValue}, minmax(0, 1fr))`, gap: '2px' }}>
                      {matrixX.map((value, rowIndex) => (
                        <input
                          key={rowIndex}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChange(rowIndex, e.target.value)}
                          className="border p-2 w-full text-center"
                        />
                      ))}
                    </div>
                    <div></div>
                   
    
                    <div className="grid" style={{ gridTemplateRows: `repeat(${pointValue}, minmax(0, 1fr))`, gap: '2px' }}>
                      {matrixY.map((value, rowIndex) => (
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
    
            <div>
              <span>Input Number of Points</span>
              <form onSubmit={handleSubmit} className="mt-4">
                <input type="number" value={pointValue} onChange={(e) => setpointValue(e.target.value)} />
                <div className="pt-4">
                  X value
                  <input type="number" value={Xinput} onChange={(e) => setXinput(e.target.value)} />
                </div>
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
              </form>
            </div>
    
            <div className="mt-4">Inter Equation History</div>
            <div className="flex justify-center gap-4 mt-4">
              <Select
                defaultValue="size"
                style={{ width: 200 }}
                onChange={handlepoint}
                options={point.map(item => ({
                  value: item.value,
                  label: item.label,
                }))}
                className="ml-4"
              />
              <Select
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
          </div>
    
          {/* Column 3 */}
          <div className="text-center text-blue-500 text-3xl"></div>
        </div>
    
        {/* Solution Box */}
        <div className="bg-slate-200 font-bold m-10 p-8 h-auto">
          <div className="grid grid-cols-1 gap-0 p-4">
            <div>Solution</div>
            <div>
              {arrayCn.map((iteration, index) => (
                <div key={index}>
                  <BlockMath math={`C_{${index}} = ${Number(iteration.cn).toExponential(4)}`} />
                  <BlockMath math={`X_{${index}} = ${iteration.xi}`} />
                </div>
              ))}
              <BlockMath math={result} />
            </div>
          </div>
        </div>
      </div>
    );
}
