'use client'
import Link from "next/link";
import { Select, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from  "./components/header";
import axios from 'axios'
export default function Home() {
  const [pathproblem,setpathproblem] = useState('')
  const [solution,setsolution] = useState([])
  const router = useRouter()
  const [equationroot,setEquationroot]= useState([]);
  const [equationlinear,setEquationlinear]= useState([]);
  const [equationinter,setEquationinter]= useState([]);
  const [equationdiff,setEquationdiff]= useState([]);
  const [equationintegrate,setEquationintegrate]= useState([]);
  const [equationmultiple,setEquationmultiple]= useState([]);
  const [equationsimple,setEquationsimple]= useState([]);
  const [checkroot,setroot] = useState(false)
  const [checklinear,setlinear] = useState(false)
  const [checkinter,setinter] = useState(false)
  const [checkdiff,setdiff ]= useState(false)
  const [checkintegrate,setintegrate] = useState(false)
  const [checkexter,setexter] = useState(false)

  const fetchequation = async () => {
    try{
      const [root, linear, inter, diff, integrate, simple, multiple] = await Promise.all([
        axios.get('/api/root'),
        axios.get('/api/linear'),
        axios.get('/api/inter'),
        axios.get('/api/diff'),
        axios.get('/api/integrate'),
        axios.get('/api/simple'),
        axios.get('/api/multiple'),
      ]);
      setEquationroot(root.data.slice(-5));  
      setEquationlinear(linear.data.slice(-5));
      setEquationinter(inter.data.slice(-5));
      setEquationdiff(diff.data.slice(-5));
      setEquationintegrate(integrate.data.slice(-5));
      setEquationsimple(simple.data.slice(-5));
      setEquationmultiple(multiple.data.slice(-5));
    }catch(error){
      console.log('error',error)
    }
  }

  useEffect(()=>{
    fetchequation()
  },[])

  const deleteequation = async (id,name) => {
    try {
      await axios.delete(`/api/${name}/${id}`);
      alert('Delete Successful!');
      fetchequation();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Something went wrong');
    }
  };
  const root =  [
    { value: 'graphical',label: 'graphical',},     
    { value: 'bisection',label: 'bisection',},     
    { value: 'falseposition',label: 'falseposition',},     
    { value: 'onepoint',label: 'One point',}, 
    { value: 'newton',label: 'newton Rapson',},     
    { value: 'secant',label: 'secant method',},     
  ]
  const linear =  [
    { value: 'cramer',label: 'Cramers Rule',},     
    { value: 'eliminate',label: 'Eliminate',},     
    { value: 'jordan',label: 'Jordan',},     
    { value: 'inverse',label: 'inverse',},     
    { value: 'lu',label: 'LU',},    
    { value: 'cholesky',label: 'cholesky Decomposition',},    
    { value: 'jacobi',label: 'jacobi',},    
    { value: 'seidel',label: 'guass seidel',},    
    { value: 'conjugate',label: 'conjugate',},    
  ]
  const Interpolition =  [
    { value: 'newton',label: 'Newton',},     
    { value: 'lagrange',label: 'lagrange',},     
    { value: 'spline',label: 'Spline',}, 

  ]
  const extrapolation =  [
    { value: 'simple',label: 'Simple Regression',},     
    { value: 'multiple',label: 'Multiple Regression',},     

  ]
  const integration =  [
    { value: 'trapezoidal',label: 'Trapezoidal Rule',},     
    { value: 'composite',label: 'Composite Trapezoidal Rule',},     
    { value: 'simpson',label: 'Simpson Rule',},     
    { value: 'compositesimpson',label: 'Conposite Simpson Rule',},     
    

  ]
  const differentiation =  [
    { value: 'divided',label: 'Differentiation'},     
    

  ]

  const handleproublem = (value) => {
    setpathproblem(value)
    if(value =='root'){
      setsolution(root)
      setroot(true)
      setlinear(false)
      setinter(false)
      setexter(false)
      setintegrate(false)
      setdiff(false)
    }else if(value =='linear'){
      setsolution(linear)
      setlinear(true)
      setinter(false)
      setexter(false)
      setintegrate(false)
      setdiff(false)
      setroot(false)
    }else if(value =='inter'){
      setsolution(Interpolition)
      setinter(true)
      setexter(false)
      setintegrate(false)
      setdiff(false)
      setlinear(false)
      setroot(false)
    }else if(value == 'extrapolation'){
      setsolution(extrapolation)
      setexter(true)
      setintegrate(false)
      setdiff(false)
      setlinear(false)
      setinter(false)
      setroot(false)
    }else if(value == 'integration'){
      setsolution(integration)
      setintegrate(true)
      setdiff(false)
      setroot(false)
      setlinear(false)
      setinter(false)
      setexter(false)
    }else if(value == 'differentiation'){
      setsolution(differentiation)
      setdiff(true)
      setroot(false)
      setlinear(false)
      setinter(false)
      setintegrate(false)
      setexter(false)
    }
  };
  const handleSolution = (value) => {
    router.push(`/${pathproblem}/${value}`); 
  };
  return (
        <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <h1 className="text-4xl font-bold text-center text-blue-500 mt-16">
            Numerical Methods
          </h1>

          <div className="m-8 text-center text-2xl font-bold text-blue-500">
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center m-4">
              <span className="mr-4">Choose Problem</span>
                <Select
                  defaultValue="-"
                  style={{ width: 200 }}
                  onChange={handleproublem}
                  options={[
                    { value: 'root', label: 'Root' },
                    { value: 'linear', label: 'Linear' },
                    { value: 'inter', label: 'Inter' },
                    { value: 'extrapolation', label: 'Extrapolation' },
                    { value: 'integration', label: 'Integration' },
                    { value: 'differentiation', label: 'Differentiation' },
                  ]}
                />
                
                <span className="ml-4">Choose Method</span>
                <Select
                  defaultValue="-"
                  style={{ width: 200 }}
                  onChange={handleSolution}
                  options={solution.map(item => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  className="ml-4"
                />
              </div>
            </div>
            
            <div className="max-w-5xl mt-4 mx-auto bg-white shadow-md rounded-lg p-8">
          <div className="grid grid-cols-1 border-b-2 border-gray-300 pb-4">
          <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Equation History</h2>
            </header>
           {checkroot &&(
             <div className="grid grid-cols-1 gap-4"> Root Equation
             {equationroot.map((cat) => (
               <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                 <button className="font-bold">{cat.name}</button>
                 <div className="space-x-4">
                   <button onClick={() => deleteequation(cat.id,'root')} className="text-red-600 hover:text-red-900">
                     Delete
                   </button>
                 </div>
               </div>
             ))}
           </div>
           )}
            {checklinear&&(
              <div className="grid grid-cols-1 gap-4 mt-4"> Linear
              {equationlinear.map((cat) => (
                <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                  <button className="font-bold">{cat.A}</button>
                  <div className="space-x-4">
                    <button onClick={() => deleteequation(cat.id,'linear')} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
           {checkinter &&(
            <div className="grid grid-cols-1 gap-4 mt-4"> Interpolation
            {equationinter.map((cat) => (
              <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                <button className="font-bold">{cat.X}</button>
                <div className="space-x-4">
                  <button onClick={() => deleteequation(cat.id,'inter')} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
           )}
            {checkexter&&(
                          <div className="grid grid-cols-1 gap-4 mt-4"> Extrapolation
                          {equationsimple.map((cat) => (
                            <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                              <button className="font-bold">{cat.X}</button>
                              <div className="space-x-4">
                                <button onClick={() => deleteequation(cat.id,'simple')} className="text-red-600 hover:text-red-900">
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                           {equationmultiple.map((cat) => (
                            <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                              <button className="font-bold">{cat.X}</button>
                              <div className="space-x-4">
                                <button onClick={() => deleteequation(cat.id,'multiple')} className="text-red-600 hover:text-red-900">
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
            )}

           {checkintegrate && (
             <div className="grid grid-cols-1 gap-4 mt-4"> Integration
             {equationintegrate.map((cat) => (
               <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                 <button className="font-bold">{cat.fx}</button>
                 <div className="space-x-4">
                   <button onClick={() => deleteequation(cat.id,'integration')} className="text-red-600 hover:text-red-900">
                     Delete
                   </button>
                 </div>
               </div>
             ))}
           </div>
           )}


            {checkdiff && (
              <div className="grid grid-cols-1 gap-4 mt-4"> Differentiation
              {equationdiff.map((cat) => (
                <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                  <button className="font-bold">{cat.fx}</button>
                  <div className="space-x-4">
                    <button onClick={() => deleteequation(cat.id,'diff')} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}


          </div>
          </div>


          
          </div>
        </div>

  );
}
