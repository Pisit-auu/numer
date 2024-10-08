'use client'
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { eliminate ,findXeliminate,insertB} from '@/app/components/matrix';
import ArrayDisplay from '@/app/components/showmatrixnxn'

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
  const [metexta,setmatrixa] = useState([])
  const [matrixnewB, setMatrixnewB] = useState([]);  
  const [matrixnewA, setMatrixnewA] = useState([]);  
  const [keepm,setkeepm] = useState();
  const [showfxresult , setshowfxresult] = useState([]);
  const [fx, setfx] = useState([])
  const [fxresult, setfxresult] = useState([])
  const [showlinear,setlinear] = useState(false);
  const [showqua,setqua] = useState(false);
  const [showcubic,setcubic] = useState(false);
  const clickchoosespline =(message) =>{
    if(message==='linear'){
      setcolorbuttonl('bg-green-200')
      setcolorbuttonq('bg-slate-200')
      setcolorbuttonc('bg-slate-200')
      setspline(message);
      setcubic(false)
      setqua(false)
      setlinear(false);
    }else if(message==='quadratic'){
      setcolorbuttonq('bg-green-200')
      setcolorbuttonc('bg-slate-200')
      setcolorbuttonl('bg-slate-200')
      setspline(message);
      setcubic(false)
      setlinear(false);
      setqua(false)
    }else if(message==='cubic'){
      setcolorbuttonc('bg-green-200')
      setcolorbuttonl('bg-slate-200')
      setcolorbuttonq('bg-slate-200')
      setspline(message);
      setqua(false)
      setcubic(false)
      setlinear(false);
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
      setkeepm(findm(newmetrixX,newmetrixY))
      if(spline==='linear'){
        linear(newmetrixX,newmetrixY,parseFloat(Xinput))
      }else if(spline==='quadratic'){
        qua(newmetrixX,newmetrixY,parseFloat(Xinput));
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
    function qua(x,y,xinput){
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
      const newmatrix = Array.from({ length: (pointValue-1)*3 }, () => Array((pointValue-1)*3).fill(0));
      
      let count =0
      let index=1;
      let start=0;

      let an= []
      for(let i = 1; i <= newmatrix.length/3; i++) {
        an.push(`a${i}`);
        an.push(`b${i}`);
        an.push(`c${i}`);
      }
      setmatrixa(an)


      for(let i=0;i<(pointValue-2)*2;i+=2){
          for(let k=count;k<count+3;k++){
            if(k==count){
              newmatrix[i][k] = Math.pow(x[index], 2);
              newmatrix[i+1][k+3] = Math.pow(x[index], 2);
            }else if(Math.abs(k-count)==2){
              newmatrix[i][k] =1
              newmatrix[i+1][k+3] =1
            }else{
              newmatrix[i][k] = x[index]
              newmatrix[i+1][k+3] = x[index]
            }
        }
        start+=2;
        count+=3;
        index++
      }

          newmatrix[start][0] = Math.pow(x[0], 2);
          newmatrix[start][2] = 1
          newmatrix[start][1] = x[0];

          newmatrix[(start+1)][newmatrix.length-1] = 1
          newmatrix[(start+1)][newmatrix.length-2] = x[(parseInt(pointValue)-1)];
          newmatrix[(start+1)][newmatrix.length-3] =  Math.pow(x[(parseInt(pointValue)-1)], 2);

          newmatrix[(newmatrix.length)-1][0] =  1;
          setMatrixnewA(newmatrix)
          count =0
          for(let i=0;i<parseInt(pointValue)-2;i++){
              for(let j=count;j<5+count;j++){
                  if(j==count){
                    newmatrix[start+2+i][j] = x[i+1]*2
                  }else if(j-count ==1){
                    newmatrix[start+2+i][j] = 1
                  }else if(j-count ==2){
                    newmatrix[start+2+i][j] = 0
                  }else if(j-count ==3){
                    newmatrix[start+2+i][j] = x[i+1]*(-2)
                  }else if(j-count ==4){
                    newmatrix[start+2+i][j] = -1
                  }
              }
              count+=3
          }
          index=1
          const newmatrixsumy = new Array(newmatrix.length).fill(0);
          
          for(let i=0;i<=start;i+=2){
                newmatrixsumy[i] =y[index];
                newmatrixsumy[i+1] =y[index];
            index++
          }

          
          const newmatrixcal = Array.from({ length: (newmatrix.length-1) }, () => Array((newmatrix.length-1)).fill(0));
          for(let i=0;i<newmatrixcal.length;i++){
            for(let j=0;j<newmatrixcal.length;j++){
              newmatrixcal[i][j] = newmatrix[i][j+1]
              
            }
          }

          newmatrixsumy[start] =y[0];
          newmatrixsumy[start+1] =y[parseInt(pointValue)-1];
          

          const newmatrixcaly =new Array((newmatrixsumy.length-1)).fill(0);
          for(let i=0;i<newmatrixcaly.length;i++){
              newmatrixcaly[i] =newmatrixsumy[i]; 
              
          }
          setMatrixnewB(newmatrixsumy)

          let ab = insertB(newmatrixcal,newmatrixsumy)
          let eliminateab = eliminate(ab)
          let findxab = findXeliminate(eliminateab)
          
          let arraykeepabc =[]


          
          let keepindex= 0
          for(let i = 0; i < newmatrix.length/3; i++) {
            if(i==0){
              arraykeepabc[i] = {a: 0,b:findxab[keepindex].result,c: findxab[keepindex+1].result}
              keepindex+=2;
            }else{
              arraykeepabc[i] = {a: findxab[keepindex].result,b:findxab[keepindex+1].result,c: findxab[keepindex+2].result}
              keepindex+=3;
            }
    
          }
          console.log(arraykeepabc)


          let equationarray =[]
          let equation= 'a_1 = 0'
          keepindex= 0
          for(let i = 1; i <= newmatrix.length/3; i++) {
           
              if(i==1){
                equation += `, b_{${i}} = {${findxab[keepindex].result}}`;
              equation += `, c_{${i}} = {${findxab[keepindex+1].result}}`;
              keepindex+=2
              equationarray.push(equation)
              }else{
                equation += ` a_{${i}} = {${findxab[keepindex].result}}`;
                equation += `, b_{${i}} = {${findxab[keepindex+1].result}}`;
              equation += `, c_{${i}} = {${findxab[keepindex+2].result}}`;
              equationarray.push(equation)
              keepindex+=3
            }
            equation=''
          }
          setshowfxresult(equationarray)



          let arrayfx =[]
          let fx = ''
          keepindex= 0
          for(let i = 1; i <= newmatrix.length/3; i++) {
           
              if(i==1){
                fx += `f${i}(x) = {${findxab[keepindex].result}}x`;
                fx += `+ {${findxab[keepindex+1].result}}\\quad \\quad ${x[i-1]}<=x<=${x[i]}`;
              keepindex+=2
              arrayfx.push(fx);
              }else{
                fx += `f${i}(x) = {${findxab[keepindex].result}}x^2`;
                fx += `+ {${findxab[keepindex+1].result}}x`;
                fx += `+ {${findxab[keepindex+2].result}} \\quad \\quad ${x[i-1]}<=x<=${x[i]}`;
                arrayfx.push(fx);
              keepindex+=3 
            }
          fx=''
          }
          console.log(arrayfx[0])
          setfx(arrayfx)

          let fxreult;
          let arrayfxresult =[]

            fxreult = `f_${keepi+1}(${Xinput}) = ${(arraykeepabc[keepi].a*xinput*xinput)+(arraykeepabc[keepi].b*xinput)+arraykeepabc[keepi].c}`

          arrayfxresult.push(fxreult)
          keepindex= 0
          
          setfxresult(arrayfxresult)
          setqua(true)

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


      setlinear(true)
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
                                     
                                  {showlinear && (
                                                    <div>
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
                                          )}
                                {showqua && (
                                                    <div>
                                                      <div className='flex justify-center items-center'><ArrayDisplay matrix={matrixnewA} /> 
                                                            <ArrayDisplay matrix={metexta} /> 
                                                            <BlockMath math={`=`} /> <ArrayDisplay matrix={matrixnewB} /> 
                                                            
                                                    </div>
                                                    <div>
                                                        {showfxresult.map((showfxresult,index)=> (
                                                                <BlockMath key={index} math={showfxresult} />
                                                            ))}
                                                        <BlockMath math={'f_i(x) = a_ix^2+b_ix+c_i'} />
                                                        {fx.map((fx,index)=> (
                                                            <BlockMath key={index} math={fx} />
                                                        ))}
                                                        {fxresult.map((fxresult,index)=> (
                                                            <BlockMath key={index} math={fxresult} />
                                                        ))}
                                                    </div>
                                                    </div>
                                          )}  

                                        {showcubic && (
                                                    <div>
                                                      <div className='flex justify-center items-center'><ArrayDisplay matrix={matrixnewA} /> 
                                                            <ArrayDisplay matrix={metexta} /> 
                                                            <BlockMath math={`=`} /> <ArrayDisplay matrix={matrixnewB} /> 
                                                            fx
                                                            showfxresult fxresult
                                                            'f(x) = a0+b1x+cx^2'
                                                    </div>
                                                    </div>
                                          )}  
                        
                       



                          </div>
                </div>
    </div>
  );
}

//<BlockMath math={`C_{${index}}*X_{${index}}= ${iteration.cn.toExponential(4)}*${iteration.xi}`} />