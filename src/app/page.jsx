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
  const [equation,setEquation]= useState([]);
  
  const fetchequation = async () => {
    try{
        const Response= await axios.get('/api/equation')
        setEquation(Response.data)
        console.log(Response)
    }catch(error){
      console.log('error',error)
    }
  }

  useEffect(()=>{
    fetchequation()
  },[])

  const deleteequation = async (id) => {
    try {
      await axios.delete(`/api/equation/${id}`);
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

  const handleproublem = (value) => {
    setpathproblem(value)
    if(value =='root'){
      setsolution(root)
    }else if(value =='linear'){
      setsolution(linear)
    }else if(value =='inter'){
      setsolution(Interpolition)
    }else if(value == 'extrapolation'){
      setsolution(extrapolation)
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
              <span>Type Problem</span>
              <div className="flex flex-col md:flex-row items-center justify-center m-4">
                <Select
                  defaultValue="-"
                  style={{ width: 200 }}
                  onChange={handleproublem}
                  options={[
                    { value: 'root', label: 'Root' },
                    { value: 'linear', label: 'Linear' },
                    { value: 'inter', label: 'Inter' },
                    { value: 'extrapolation', label: 'Extrapolation' },
                  ]}
                />
                <span className="ml-4">Solution</span>
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
            <div className="grid grid-cols-1 gap-4">
              {equation.map((cat) => (
                <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                  <button className="font-bold">{cat.name}</button>
                  <div className="space-x-4">
                    <button onClick={() => deleteequation(cat.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
          </div>


          
          </div>
        </div>

  );
}
