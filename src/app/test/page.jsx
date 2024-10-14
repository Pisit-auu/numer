'use client'
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useEffect, useState } from "react"


export default function Test(){
    const [sizematrix,setSizematrix]  = useState(0)
    const [matrixa, setmatrixa] = useState([])
    const [matrixb, setmatrixb] = useState([])
    const [text,settext] = useState()

    useEffect(()=>{
        const newmatrix =  Array.from({length: sizematrix},()=> Array.from({length: sizematrix},()=>""))
        setmatrixa(newmatrix)
        const newmatrixb = Array.from({length: sizematrix},()=>"")
        setmatrixb(newmatrixb)
        console.log(newmatrixb)
    },[sizematrix])

    const handlematrixa = (rowindex,colindex,value) =>{
        const num = parseFloat(value)
        const newmatrix = [...matrixa];
        newmatrix[rowindex][colindex] = num
        setmatrixa(newmatrix)
    }
    const handlematrixb = (rowindex,value) =>{
        const num = parseFloat(value)
        const newmatrx = [...matrixb];
        newmatrx[rowindex] = num
        setmatrixb(newmatrx)
    }

    function axb(a,b){
        const matrixab = Array.from({length:sizematrix},()=>0)
        let sum =0;
        for(let i=0;i<sizematrix;i++){
            for(let j=0;j<sizematrix;j++){
                sum += a[i][j]*b[j];
            }
            matrixab[i] = sum
            sum=0
        }
        console.log(matrixab)
        let text =`\\begin{bmatrix*}[r]`
        text += `${matrixab[0]} `
        for(let i=1;i<matrixab.length;i++){
            text += `\\\\${matrixab[i]} `
        }
        text += '\\end{bmatrix*}'
        settext(text)
    }
    const handleclick = (e) =>{
        axb(matrixa,matrixb)
    }
    return(
            <div>
                <input type="number" value={sizematrix} onChange={(e)=> setSizematrix(e.target.value)}/>

                <div className="grid" style={{gridTemplateColumns: `repeat(${sizematrix}, minmax(0,1fr))`,gap:'2px'}}> 
                        {matrixa.map((row,rowIndex)=>
                        row.map((value,colIndex) =>(
                        <input className="border p-2 w-16 text-center" key={`${rowIndex}-${colIndex}`} type="number" value={matrixa[rowIndex][colIndex]} onChange={(e)=> handlematrixa(rowIndex,colIndex,e.target.value)}/>

                        )))}
                        <button onClick={handleclick}>print array</button>

                        
                </div>

                <div className="grid" style={{gridTemplateRows: `repeat(${sizematrix}, minmax(0,1fr))`,gap:'2px'}}> 
                        {matrixb.map((row,rowIndex)=>
                         <input className="border p-2 w-16 text-center" key={`${rowIndex}`} type="number" value={matrixb[rowIndex]} onChange={(e)=> handlematrixb(rowIndex,e.target.value)}/>
                        )}
                        <button onClick={handleclick}>print array</button>

      

                        
                </div>


                    







                <BlockMath math={text} />
            </div>
    )
}