import Link from "next/link";
export default function Home() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-500">Numer</h1>
      <div className="text-4xl font-bold  text-blue-500"> Root
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/graphical">  <h1 className="text-blue-600 hover:underline">Go graphical</h1> </Link></button></div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/bisection">  <h1 className="text-blue-600 hover:underline">Go bisection</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/falseposition">  <h1 className="text-blue-600 hover:underline">Go falseposition</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/onepoint">  <h1 className="text-blue-600 hover:underline">Go onepoint</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/newton">  <h1 className="text-blue-600 hover:underline">Go newton Rapson</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/root/secant">  <h1 className="text-blue-600 hover:underline">Go secant method</h1> </Link></button> </div>

      </div>

      <div className="text-4xl font-bold  text-blue-500 mt-4"> Linear
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/cramer">  <h1 className="text-blue-600 hover:underline">Go Cramer's Rule</h1> </Link></button></div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/eliminate">  <h1 className="text-blue-600 hover:underline">Go Eliminate</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/jordan">  <h1 className="text-blue-600 hover:underline">Go  Jordan</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/inverse">  <h1 className="text-blue-600 hover:underline">Go inverse</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/lu">  <h1 className="text-blue-600 hover:underline">Go LU</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/cholesky">  <h1 className="text-blue-600 hover:underline">Go cholesky Decomposition</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/jacobi">  <h1 className="text-blue-600 hover:underline">Go jacobi</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/seidel">  <h1 className="text-blue-600 hover:underline">Go guass seidel</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/conjugate">  <h1 className="text-blue-600 hover:underline">Go conjugate</h1> </Link></button> </div>
      </div>

      <div className="text-4xl font-bold  text-blue-500 mt-4"> Interpolition
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/inter/newton">  <h1 className="text-blue-600 hover:underline">Go Newton</h1> </Link></button></div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/inter/lagrange">  <h1 className="text-blue-600 hover:underline">Go lagrange</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/falseposition">  <h1 className="text-blue-600 hover:underline">Go falseposition</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/onepoint">  <h1 className="text-blue-600 hover:underline">Go onepoint</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/newton">  <h1 className="text-blue-600 hover:underline">Go newton Rapson</h1> </Link></button> </div>
      <div><button className="text-2xl font-bold  text-blue-500" >  <Link href="/linear/cholesky">  <h1 className="text-blue-600 hover:underline">Go cholesky Decomposition</h1> </Link></button> </div>

      </div>

    </div>
  );
}
