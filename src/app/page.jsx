'use client'
import Link from "next/link";
import { Select, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from  "./components/header";
export default function Home() {
  const [pathproblem,setpathproblem] = useState('')
  const [solution,setsolution] = useState([])
  const router = useRouter()
  
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
        <div className="flex m-4 items-center justify-center">
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
    </div>
  </div>
  );
}
