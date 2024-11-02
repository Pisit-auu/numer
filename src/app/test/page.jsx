
'use client'
import { useState, useEffect } from 'react';
export default function  test(){
    const [rowIndex,setrowindex] = useState(1)
    

    return(
        <div>
                    <input key={rowIndex} type="number" />

        </div>
    )



}