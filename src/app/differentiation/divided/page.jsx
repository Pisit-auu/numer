'use client'
import { Select, Space } from 'antd';
import { useEffect,useState } from 'react';
import { InlineMath,BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { evaluate,derivative  } from 'mathjs';

export default function Divided(){
    const [x,setx] = useState(2)
    const [h,seth] = useState(0.25)
    const [fx,setfx] = useState('e^x')
    const [fdiff,setfdiff] = useState()
    const [showfx,setshowfx] = useState()
    const [pushxfx,setpushxfx] = useState()
    const [O,setO] = useState([])
    const [dx,setdx] = useState('')
    const [selectoperation,setselectoperation] = useState()
    const [derivativenumer,setderivativenumer] = useState()
    const [selectO ,setselectO] = useState()
    const [show,setshow] = useState(false)
    const [result,setresult] = useState()

    
    function backwardoh(n,x,h,fx){
        let xi = [n]
        const keepx = x
        for(let i=n;i>=0;i--){
            xi[i] = parseFloat(x)
            x-=h
        }

        let fxi = []
        for(let i=n;i>=0;i--){
            fxi[i] = evaluate(fx,{x:xi[i]})
        }
        let start = 1
        let sum =0;
        let fxical =[]
        for(let i=n;i>=0;i--){
            if(i==2&&n==4){
                sum+=(fxi[i]*start)*(6)
                fxical[i] = (fxi[i]*start)*(6)
            }else if(i>0 && i<n){
                sum+=(fxi[i]*start)*n
                fxical[i] = (fxi[i]*start)*n
            }else{
                sum+=(fxi[i]*start)
                fxical[i] = (fxi[i]*start)
            }
            start *= -1
        }
        sum= sum*(1/Math.pow(h,n))
        let textfx = `f^{${"'".repeat(n)}}`
        let setoperator
        setfdiff(textfx)

        let showfx = `${textfx}(x_i) = \\frac{f(x_{i}) `
        let pushxfx = `${textfx}(${keepx}) = \\frac{${fxical[n].toFixed(6)}`
        for(let i=n-1;i>=0;i--){
            if(n%2!==0){
                if(i%2===0){
                    setoperator= '-'
            }else if(i%2!==0){
                    setoperator= '+'
            }
            }else{
                if(i%2===0){
                    setoperator= '+'
                }else if(i%2!==0){
                    setoperator= '-'
            }
            }
            if(i==2&&n==4){
                showfx +=`${setoperator}(6)(f(x_{i-${i}}))`
                if(fxical[i]<0){
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else{
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }
            }else if(i>0 && i<n){
                showfx +=`${setoperator}(${n})(f(x_{i${(i-n)%n}}))`
                if(fxical[i]<0){
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else{
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }
            }else{
                showfx +=`${setoperator}(f(x_{i${i-n}}))`
                if(fxical[i]<0){
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else{
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }
            }
        }
        if(n>1){
            showfx+=`}{h^${n}}`
        }else{
            showfx+=`}{h}`
        }
        pushxfx+=`}{${Math.pow(h,n)}}`
        setshowfx(showfx)
        setpushxfx(pushxfx)
        setresult(sum)
        let setdxx = fx;
        for (let i = 0; i < n; i++) {
            setdxx = derivative(setdxx, 'x').toString();
        }
        setdx(setdxx);
        
        setshow(true)

    }
    function forwardOh2(n,x,h,fx){
        let xi = []
        const keepx = x
        for(let i=0;i<=n+1;i++){
            xi[i] = parseFloat(x)
            x+=h
        }


        let fxi = []
        for(let i=0;i<=n+1;i++){
            fxi[i] = evaluate(fx,{x:xi[i]})
        }
        console.log(xi)
        let textfx = `f^{${"'".repeat(n)}}`
        setfdiff(textfx)
        let sum =0
        let start =-1
        let fxical =[]
        let showfx = `${textfx}(x_i) = \\frac{`
        let pushxfx = `${textfx}(${keepx}) = \\frac{`
        if(derivativenumer =='first'){
            for(let i=n+1;i>=0;i--){
                if(i==2){
                    sum+= fxi[i]*start
                    fxical[i] = fxi[i]*start
                    showfx +=`-f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*4
                    fxical[i] = fxi[i]*start*4
                    showfx +=`+(4)f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`-(3)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{2h}`
            pushxfx+=`}{${2*h}}`
            sum =sum*(1/(2*h))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='second'){
            for(let i=n+1;i>=0;i--){
                if(i==3){
                    sum+= fxi[i]*start
                    fxical[i] = fxi[i]*start
                    showfx +=`-f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*4
                    fxical[i] = fxi[i]*start*4
                    showfx +=`+(4)f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*5
                    fxical[i] = fxi[i]*start*5
                    showfx +=`-(5)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*2
                    fxical[i] = fxi[i]*start*2
                    showfx +=`+(2)f(x_{i})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{h^2}`
            pushxfx+=`}{${Math.pow(h,2)}}`
            sum =sum*(1/(Math.pow(h,2)))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='third'){
            for(let i=n+1;i>=0;i--){
                if(i==4){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`-(3)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                } else if(i==3){
                    sum+= fxi[i]*start*14
                    fxical[i] = fxi[i]*start*14
                    showfx +=`+(14)f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*24
                    fxical[i] = fxi[i]*start*24
                    showfx +=`-(24)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*18
                    fxical[i] = fxi[i]*start*18
                    showfx +=`+(18))f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*5
                    fxical[i] = fxi[i]*start*5
                    showfx +=`-(5)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{2h^3}`
            pushxfx+=`}{${Math.pow(h,3)*2}}`
            sum =sum*(1/(Math.pow(h,3)*2))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='fourth'){
            for(let i=n+1;i>=0;i--){
                if(i==5){
                    sum+= fxi[i]*start*2
                    fxical[i] = fxi[i]*start*2
                    showfx +=`-(2)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==4){
                    sum+= fxi[i]*start*11
                    fxical[i] = fxi[i]*start*11
                    showfx +=`+(11)f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                } else if(i==3){
                    sum+= fxi[i]*start*24
                    fxical[i] = fxi[i]*start*24
                    showfx +=`-(24)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*26
                    fxical[i] = fxi[i]*start*26
                    showfx +=`+(26)f(x_{i+${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*14
                    fxical[i] = fxi[i]*start*14
                    showfx +=`-(14)f(x_{i+${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`+(3)f(x_{i})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{h^4}`
            pushxfx+=`}{${Math.pow(h,4)}}`
            sum =sum*(1/(Math.pow(h,4)))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }


        let setdxx = fx;
        for (let i = 0; i < n; i++) {
            setdxx = derivative(setdxx, 'x').toString();
        }
        setdx(setdxx);
        setshow(true)
    }
    function backwardOh2(n,x,h,fx){
        let xi = []
        const keepx = x
        for(let i=0;i<=n+1;i++){
            xi[i] = parseFloat(x)
            x-=h
        }


        let fxi = []
        for(let i=0;i<=n+1;i++){
            fxi[i] = evaluate(fx,{x:xi[i]})
        }
        
        let textfx = `f^{${"'".repeat(n)}}`
        setfdiff(textfx)
        let sum =0
        let start =1
        let fxical =[]
        let showfx = `${textfx}(x_i) = \\frac{`
        let pushxfx = `${textfx}(${keepx}) = \\frac{`
        if(derivativenumer =='first'){
            for(let i=0;i<=n+1;i++){
                if(i==2){
                    sum+= fxi[i]*start
                    fxical[i] = fxi[i]*start
                    showfx +=`+f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*4
                    fxical[i] = fxi[i]*start*4
                    showfx +=`-(4)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`(3)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{2h}`
            pushxfx+=`}{${2*h}}`
            sum =sum*(1/(2*h))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='second'){
            for(let i=0;i<=n+1;i++){
                if(i==3){
                    sum+= fxi[i]*start
                    fxical[i] = fxi[i]*start
                    showfx +=`-f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*4
                    fxical[i] = fxi[i]*start*4
                    showfx +=`+(4)f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*5
                    fxical[i] = fxi[i]*start*5
                    showfx +=`-(5)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*2
                    fxical[i] = fxi[i]*start*2
                    showfx +=`(2)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{h^2}`
            pushxfx+=`}{${Math.pow(h,2)}}`
            sum =sum*(1/(Math.pow(h,2)))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='third'){
            for(let i=0;i<=n+1;i++){
                if(i==4){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`+(3)f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                } else if(i==3){
                    sum+= fxi[i]*start*14
                    fxical[i] = fxi[i]*start*14
                    showfx +=`-(14)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*24
                    fxical[i] = fxi[i]*start*24
                    showfx +=`+(24)f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*18
                    fxical[i] = fxi[i]*start*18
                    showfx +=`-(18))f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*5
                    fxical[i] = fxi[i]*start*5
                    showfx +=`(5)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{2h^3}`
            pushxfx+=`}{${Math.pow(h,3)*2}}`
            sum =sum*(1/(Math.pow(h,3)*2))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }else if(derivativenumer =='fourth'){
            for(let i=0;i<=n+1;i++){
                if(i==5){
                    sum+= fxi[i]*start*2
                    fxical[i] = fxi[i]*start*2
                    showfx +=`-(2)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==4){
                    sum+= fxi[i]*start*11
                    fxical[i] = fxi[i]*start*11
                    showfx +=`+(11)f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                } else if(i==3){
                    sum+= fxi[i]*start*24
                    fxical[i] = fxi[i]*start*24
                    showfx +=`-(24)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==2){
                    sum+= fxi[i]*start*26
                    fxical[i] = fxi[i]*start*26
                    showfx +=`+(26)f(x_{i-${i}})`
                    pushxfx +=`+${fxical[i].toFixed(6)}`
                }else if(i==1){
                    sum+= fxi[i]*start*14
                    fxical[i] = fxi[i]*start*14
                    showfx +=`-(14)f(x_{i-${i}})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }else if(i==0){
                    sum+= fxi[i]*start*3
                    fxical[i] = fxi[i]*start*3
                    showfx +=`(3)f(x_{i})`
                    pushxfx +=`${fxical[i].toFixed(6)}`
                }
                start*=-1;
            }
            showfx+=`}{h^4}`
            pushxfx+=`}{${Math.pow(h,4)}}`
            sum =sum*(1/(Math.pow(h,4)))
            console.log(sum)
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
        }


        let setdxx = fx;
        for (let i = 0; i < n; i++) {
            setdxx = derivative(setdxx, 'x').toString();
        }
        setdx(setdxx);
        setshow(true)
    }

    function forwardOh(n,x,h,fx){
            let xi = []
            const keepx = x
            for(let i=0;i<=n;i++){
                xi[i] = parseFloat(x)
                x+=h
            }
            let fxi = []
            for(let i=0;i<=n;i++){
                fxi[i] = evaluate(fx, {x: xi[i]});
            }
            console.log(xi)
            let start = 1
            let sum =0;
            let fxical =[]
            for(let i=n;i>=0;i--){
                if(i==2&&n==4){
                    sum+=(fxi[i]*start)*(6)
                    fxical[i] = (fxi[i]*start)*(6)
                }else if(i>0 && i<n){
                    sum+=(fxi[i]*start)*n
                    fxical[i] = (fxi[i]*start)*n
                }else{
                    sum+=(fxi[i]*start)
                    fxical[i] = (fxi[i]*start)
                }
                start *= -1
            }
            sum= sum*(1/Math.pow(h,n))
            let textfx = `f^{${"'".repeat(n)}}`
            let setoperator
            setfdiff(textfx)
            
            let showfx = `${textfx}(x_i) = \\frac{f(x_{i+${n}}) `
            let pushxfx = `${textfx}(${keepx}) = \\frac{${fxical[n].toFixed(6)}`
            for(let i=n-1;i>=0;i--){
                if(n%2!==0){
                    if(i%2===0){
                        setoperator= '-'
                }else if(i%2!==0){
                        setoperator= '+'
                }
                }else{
                    if(i%2===0){
                        setoperator= '+'
                    }else if(i%2!==0){
                        setoperator= '-'
                }
                }
                if(i==2&&n==4){
                    showfx +=`${setoperator}(6)(f(x_{i+${i}}))`
                    if(fxical[i]<0){
                        pushxfx +=`${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx +=`+${fxical[i].toFixed(6)}`
                    }
                }else if(i>0 && i<n){
                    showfx +=`${setoperator}(${n})(f(x_{i+${i}}))`
                    if(fxical[i]<0){
                        pushxfx +=`${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx +=`+${fxical[i].toFixed(6)}`
                    }
                }else{
                    showfx +=`${setoperator}(f(x_{i}))`
                    if(fxical[i]<0){
                        pushxfx +=`${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx +=`+${fxical[i].toFixed(6)}`
                    }
                }
            }
            if(n>1){
                showfx+=`}{h^${n}}`
            }else{
                showfx+=`}{h}`
            }
            pushxfx+=`}{${Math.pow(h,n)}}`
            setshowfx(showfx)
            setpushxfx(pushxfx)
            setresult(sum)
            let setdxx = fx;
            for (let i = 0; i < n; i++) {
                setdxx = derivative(setdxx, 'x').toString();
            }
            setdx(setdxx);
            setshow(true)

    }
    function Centeredoh2(n,x,h,fx){
        let xi = []
        const keepx = x
            let count=0
            let textfx = `f^{${"'".repeat(n)}}`
            let setoperator
            setfdiff(textfx)
            
            let showfx = `${textfx}(x_i) = \\frac{ `
            if(n%2==0){
                for(let i=(n/2);i>=(n/2*-1);i--){
                    if(count%2!==0){
                        setoperator= '-'
                     }else{
                         setoperator= '+'
                     }
                    xi[count] = parseFloat(x+(h*i))
                    showfx += ''

                    if(i>0){
                        if(i==(n/2)){
                            showfx += `f(x_{i+${i}})`
                        }else{
                            if(i==1){
                                showfx += `${setoperator}(${n})f(x_{i+${i}})`
                            }else{
                                showfx += `${setoperator}f(x_{i+${i}})`
                            }
                           
                        }
                    }else if(i==0){
                        if(n==2){
                            showfx += `${setoperator}(2)f(x_{i})`
                        }else{
                            showfx += `${setoperator}(6)f(x_{i})`
                        }

                    }else{
                        if(i==-1&&n==4){
                            showfx += `${setoperator}(${n})f(x_{i${i}})`
                        }else{
                            showfx += `${setoperator}f(x_{i${i}})`
                        }
                    }
                    count++
                }

            }else{
                for(let i=n;i>=n*-1;i--){
                    if(count%2!==0){
                       setoperator= '-'
                    }else{
                        setoperator= '+'
                    }
                    
                    if(i==0){

                    }else{
                        if(i==3||i==-3){
                            continue
                        }else{
                            xi[count] = parseFloat(x+(h*i))
                            if(i>0){
                                if(i==n || (i==2&&n==3)){
                                    showfx += `f(x_{i+${i}})`
                                }else{
                                    if(i== 1&& n==3){
                                        showfx += `${setoperator}(2)f(x_{i+${i}})`
                                    }else{showfx += `${setoperator}f(x_{i+${i}})`}
                                }
                            }else{
                                if(i== -1&& n==3){
                                    showfx += `${setoperator}(2)f(x_{i${i}})`
                                }else{showfx += `${setoperator}f(x_{i${i}})`}
                            }
                            count++  
                        }
                    }
                    
                }
            }
            if(n%2!==0){
                if(n==1){
                    showfx+=`}{(2)h}`
                }else{
                    showfx+=`}{(2)h^${n}}`
                }
            }else{
                showfx+=`}{h^${n}}`
            }

            setshowfx(showfx)
        let fxi = []
        for(let i=0;i<=n;i++){
            fxi[i] = evaluate(fx,{x:xi[i]})
        }

        let sum =0
        let start =1
        let fxical =[]
        let pushxfx = `${textfx}(${keepx}) = \\frac{`
        for(let i=0;i<=n;i++){
            if(i==2&&n==4){
                sum+=(fxi[i]*start)*(6)
                fxical[i] = (fxi[i]*start)*(6)
                    if(fxical[i] < 0){
                        pushxfx += `${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx += `+${fxical[i].toFixed(6)}`
                    }

            }else if(i>0 && i<n){
                if(n==4){
                    sum+=(fxi[i]*start)*n
                    fxical[i] = (fxi[i]*start)*n
                    if(fxical[i] < 0){
                        pushxfx += `${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx += `+${fxical[i].toFixed(6)}`
                    }
                }else{
                    sum+=(fxi[i]*start)*2
                    fxical[i] = (fxi[i]*start)*2
                    if(fxical[i] < 0){
                        pushxfx += `${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx += `+${fxical[i].toFixed(6)}`
                    }
                }
            }else{
                sum+=(fxi[i]*start)
                fxical[i] = (fxi[i]*start)
                if(fxical[i] < 0){
                    pushxfx += `${fxical[i].toFixed(6)}`
                }else{
                    if(i==0){
                        pushxfx += `${fxical[i].toFixed(6)}`
                    }else{
                        pushxfx += `+${fxical[i].toFixed(6)}`
                    }
                }
            }
            start *= -1
        }
        console.log(fxical)
        if(n%2!==0){
            sum= sum*(1/(2*Math.pow(h,n)))
            pushxfx+=`}{${2*Math.pow(h,n)}}`
        }else{
            sum= sum*(1/(Math.pow(h,n)))
            pushxfx+=`}{${Math.pow(h,n)}}`
        }
        setpushxfx(pushxfx)


        setresult(sum)
        let setdxx = fx;
        for (let i = 0; i < n; i++) {
            setdxx = derivative(setdxx, 'x').toString();
        }
        setdx(setdxx);
        setshow(true)
    }
    function Centeredoh4(n,x,h,fx){
        let xi = []
        const keepx = x
            let count=0
            if(n%2==0){
                for(let i=(n/2)+1;i>=(n/2*-1)-1;i--){ 
                    xi[count] = parseFloat(x+(h*i))
                    count++
                }

            }else{
                for(let i=n+1;i>=(n*-1)-1;i--){
                    if(i==0){

                    }else{
                        if(i==4||i==-4){
                            continue
                        }else{
                            xi[count] = parseFloat(x+(h*i))
                            count++  
                        }
                    }
                    
                }
            }
            let fxi = []
            for(let i=0;i<=n+2;i++){
                fxi[i] = evaluate(fx,{x:xi[i]})
            }
            console.log(xi)
            console.log(fxi)

            let textfx = `f^{${"'".repeat(n)}}`
            setfdiff(textfx)
            let sum =0
            let start =-1
            let fxical =[]
            let showfx = `${textfx}(x_i) = \\frac{`
            let pushxfx = `${textfx}(${keepx}) = \\frac{`
            count =0
            if(derivativenumer =='first'  ){
                for(let i=n+1;i>=(n*-1)-1;i--){
                    if(i==0){

                    }else{
                        if(i==4||i==-4){
                            continue
                        }else{
                        if(i==n+1||i==(n*-1)-1){
                            sum+= fxi[count]*start
                            fxical[count] = fxi[count]*start
                            if(i==n+1){
                                showfx +=`-f(x_{i+${i}})`
                                pushxfx +=`${fxical[count].toFixed(6)}`
                            }else{
                                showfx +=`+f(x_{i${i}})`
                                pushxfx +=`+${fxical[count].toFixed(6)}`
                            }
                        }else{
                            sum+= fxi[count]*start*8
                            fxical[count] = fxi[count]*start*8
                            if(i>0){
                                showfx +=`+(8)f(x_{i-${i}})`
                                pushxfx +=`+${fxical[count].toFixed(6)}`
                            }else{
                                showfx +=`-(8)f(x_{i-${i}})`
                                pushxfx +=`${fxical[count].toFixed(6)}`
                            }                   
                        }
                        }
                        start*=-1
                        count++
                    }
                    
                }
                showfx+=`}{12h}`
                pushxfx+=`}{${12*h}}`
                sum =sum*(1/(12*h))
                console.log(sum)
                setshowfx(showfx)
                setpushxfx(pushxfx)
                setresult(sum)
            }else if(derivativenumer =='second'){
                for(let i=(n/2)+1;i>=(n/2*-1)-1;i--){ 
                    if(i==(n/2)+1){
                        sum+= fxi[count]*start
                        fxical[count] = fxi[count]*start
                        showfx +=`-f(x_{i+${i}})`
                        pushxfx +=`${fxical[count].toFixed(6)}`
                    }else if(i== (n/2*-1)-1){
                        sum+= fxi[count]*start
                        fxical[count] = fxi[count]*start
                        showfx +=`-f(x_{i${i}})`
                        pushxfx +=`${fxical[count].toFixed(6)}`
                    }else{
                        if(i==0){
                            sum+= fxi[count]*start*30
                            fxical[count] = fxi[count]*start*30
                            showfx +=`-(30)f(x_{i})`
                            pushxfx +=`${fxical[count].toFixed(6)}`
                        }else{
                            sum+= fxi[count]*start*16
                            fxical[count] = fxi[count]*start*16
                            pushxfx +=`+${fxical[count].toFixed(6)}`
                            if(i>0){
                                showfx +=`+(16)f(x_{i+${i}})`
                            }else{
                                showfx +=`+(16)f(x_{i${i}})`

                            }

                        }
                    }
                    count++
                    start*=-1
                }
                showfx+=`}{12h^2}`
                pushxfx+=`}{${12*(Math.pow(h,2))}}`
                sum =sum*(1/(12*(Math.pow(h,2))))
                console.log(sum)
                setshowfx(showfx)
                setpushxfx(pushxfx)
                setresult(sum)
            }else if(derivativenumer =='third'){
                for(let i=n;i>=(n*-1);i--){
                    if(i==0){

                    }else{
                        if(i==4||i==-4){
                            continue
                        }else{
                            if(i==3||i==(n*-1)){
                                sum+= fxi[count]*start
                                fxical[count] = fxi[count]*start
                                if(i==3){
                                    showfx +=`-f(x_{i+${i}})`
                                    pushxfx +=`${fxical[count].toFixed(6)}`
                                }else{
                                    showfx +=`+f(x_{i${i}})`
                                    pushxfx +=`+${fxical[count].toFixed(6)}`
                                }
                            }else if(i==2||i==-2){
                                sum+= fxi[count]*start*8
                                fxical[count] = fxi[count]*start*8
                                if(i>0){
                                    showfx +=`+(8)f(x_{i-${i}})`
                                    pushxfx +=`+${fxical[count].toFixed(6)}`
                                }else{
                                    showfx +=`-(8)f(x_{i-${i}})`
                                    pushxfx +=`+${fxical[count].toFixed(6)}`
                                }                   
                            }else{
                                sum+= fxi[count]*start*13
                                fxical[count] = fxi[count]*start*13
                                if(i>0){
                                    showfx +=`+(13)f(x_{i-${i}})`
                                    pushxfx +=`+${fxical[count].toFixed(6)}`
                                }else{
                                    showfx +=`-(13)f(x_{i-${i}})`
                                    pushxfx +=`+${fxical[count].toFixed(6)}`
                                }                   
                            }

                        
                        }
                        start*=-1
                        count++
                    }
                    
                }
                showfx+=`}{8h^3}`
                pushxfx+=`}{${8*(Math.pow(h,3))}}`
                sum =sum*(1/(8*(Math.pow(h,3))))
                console.log(sum)
                setshowfx(showfx)
                setpushxfx(pushxfx)
                setresult(sum)
            }else if(derivativenumer =='fourth'){
                for(let i=(n/2)+1;i>=(n/2*-1)-1;i--){ 
                    if(i==(n/2)+1){
                        sum+= fxi[count]*start
                        fxical[count] = fxi[count]*start
                        showfx +=`-f(x_{i+${i}})`
                        pushxfx +=`${fxical[count].toFixed(6)}`
                    }else if(i== (n/2*-1)-1){
                        sum+= fxi[count]*start
                        fxical[count] = fxi[count]*start
                        showfx +=`-f(x_{i${i}})`
                        pushxfx +=`${fxical[count].toFixed(6)}`
                    }else{
                        if(i==0){
                            sum+= fxi[count]*start*56
                            fxical[count] = fxi[count]*start*56
                            showfx +=`-(56)f(x_{i})`
                            pushxfx +=`${fxical[count].toFixed(6)}`
                        }else{
                            if(i==2||i==-2){
                                sum+= fxi[count]*start*12
                                fxical[count] = fxi[count]*start*12
                                pushxfx +=`+${fxical[count].toFixed(6)}`
                                if(i>0){
                                    showfx +=`+(12)f(x_{i+${i}})`
                                }else{
                                    showfx +=`+(12)f(x_{i${i}})`
    
                                }
                            }else{
                                sum+= fxi[count]*start*39
                            fxical[count] = fxi[count]*start*39
                            pushxfx +=`+${fxical[count].toFixed(6)}`
                            if(i>0){
                                showfx +=`+(39)f(x_{i+${i}})`
                            }else{
                                showfx +=`+(39)f(x_{i${i}})`

                            }
                            }

                        }
                    }
                    count++
                    start*=-1
                }
                showfx+=`}{6h^4}`
                pushxfx+=`}{${6*(Math.pow(h,4))}}`
                sum =sum*(1/(6*(Math.pow(h,4))))
                console.log(sum)
                setshowfx(showfx)
                setpushxfx(pushxfx)
                setresult(sum)
            }
    
    
            let setdxx = fx;
            for (let i = 0; i < n; i++) {
                setdxx = derivative(setdxx, 'x').toString();
            }
            setdx(setdxx);
            setshow(true)

    }

    const handlesubmit = (event)=>{
        event.preventDefault();
        if(!selectoperation||!derivativenumer||!selectO){
            alert('please select')
            return
        }
        let n
        if( derivativenumer =='first'){
            n = 1;
        }else  if( derivativenumer =='second'){
            n = 2;
        }else  if( derivativenumer =='third'){
            n = 3;
        }else  if( derivativenumer =='fourth'){
            n = 4;
        }
        
        const newx = parseFloat(x)
        const newh = parseFloat(h)
        if(selectO =='O(h)'&& selectoperation =='Forward'){
            forwardOh(n,newx,newh,fx)
        }else if(selectO =='O(h^2)'&& selectoperation =='Forward'){
            forwardOh2(n,newx,newh,fx)
        }else if(selectO =='O(h)'&& selectoperation =='Backward'){
            backwardoh(n,newx,newh,fx)
        }else if(selectO =='O(h^2)'&& selectoperation =='Backward'){
            backwardOh2(n,newx,newh,fx)
        }else if(selectO =='O(h^2)'&& selectoperation =='Centered'){
            Centeredoh2(n,newx,newh,fx)
         }else if(selectO =='O(h^4)'&& selectoperation =='Centered'){
            Centeredoh4(n,newx,newh,fx)
         }
    }
    const handlecount = (value) =>{
        setderivativenumer(value)
    }
    const handleo = (value) =>{
        setselectO(value)
    }
    const handleoperation = (value) =>{
        if(value ==  "Centered"){
            setO(chooscentral)
            setselectoperation(value)
        }else{
            setO(choosforwardbackward)
            setselectoperation(value)
        }
        
    }
    const choosforwardbackward =  [
        { value: 'O(h)', label: 'O(h)' },
        { value: 'O(h^2)', label: 'O(h^2)' },
      ]
      const chooscentral =  [
        { value: 'O(h^2)', label: 'O(h^2)' },
        { value: 'O(h^4)', label: 'O(h^4)' },
      ]

    return(

        <div>
         <div className="text-2xl text-blue-500 text-center pt-4">Differentiation
                            <div>
                                    
                                <form onSubmit={handlesubmit}>

                                <div className=""> <InlineMath math={`\\frac{d}{dx} ${fx}`}/></div>
                                    <div>
                                        <BlockMath math="f(x)" />
                                        <input type='text' className='' value={fx} onChange={(e)=>setfx(e.target.value)} />
                                        <div className='grid grid-cols-2'>
                                        <div><BlockMath math='x'/><input type='number' value={x} onChange={(e)=> setx(e.target.value)} /></div>
                                        <div><BlockMath math='h'/><input type='number' value={h} onChange={(e)=> seth(e.target.value)} /></div>

                                        </div>
                                        <div className=""> 
                                                          <div className="flex flex-col md:flex-row items-center justify-center m-4">
                                                            <Select
                                                            defaultValue="-"
                                                            style={{ width: 200 }}
                                                            onChange={handlecount}
                                                            options={[
                                                                { value: 'first', label: 'first' },
                                                                { value: 'second', label: 'second' },
                                                                { value: 'third', label: 'third' },
                                                                { value: 'fourth', label: 'fourth' },
                                                            ]}
                                                            />
                                                            <Select
                                                            defaultValue="-"
                                                            style={{ width: 200 }}
                                                            onChange={handleoperation}
                                                            options={[
                                                                { value: 'Forward', label: 'Forward' },
                                                                { value: 'Backward', label: 'Backward' },
                                                                { value: 'Centered', label: 'Centered' },
                                                            ]}
                                                            />
                                                             <Select
                                                            defaultValue="-"
                                                            style={{ width: 200 }}
                                                            onChange={handleo}
                                                            options={O.map(item =>({
                                                                value: item.value,
                                                                lebel: item.label,
                                                            }))}
                                                            />
   

                                                        </div>
                                        </div>
                                        <div><button className='bg-blue-500 text-white px-4 py-2 rounded my-5'>submit</button></div>
                                    </div>
                                </form>



                            </div>
                        </div>
                        <div className='bg-slate-200 m-10 p-8 h-auto'> solution
                {show && (
                        <div>
                                    <BlockMath math={`${derivativenumer} \\, ${selectoperation}\\, divided \\,(error ${selectO})`}/>
                                    <BlockMath math={`${showfx}`} />
                                    <BlockMath math={`${pushxfx}`} />
                                    
                                    <BlockMath math={`= ${result}`}/>
                                    <BlockMath math={`f(x) = ${fx}`}/>
                                    <BlockMath math={`${fdiff}(x) = ${dx}`}/>
                                    <BlockMath math={`${fdiff}(${x}) = ${evaluate(dx,{x:x})}`}/>
                                    <BlockMath math={` error = \\left| \\frac{${evaluate(dx,{x:x})}-${result}}{${evaluate(dx,{x:x})}} \\right|×100 = ${Math.abs((evaluate(dx,{x:x})-result)/evaluate(dx,{x:x})*100).toFixed(6)}\\%`}/>


                            </div>
                )}
        </div>
        
        </div>
    )
}