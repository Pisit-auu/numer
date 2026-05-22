'use client'
import StationSelect from './components/StationSelect';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from  "./components/header";
import axios from 'axios'
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
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
  const methodsByProblem = {
    root,
    linear,
    inter: Interpolition,
    extrapolation,
    integration,
    differentiation,
  };

  const handleproublem = (value) => {
    setpathproblem(value)
    setsolution(methodsByProblem[value] || [])
    setroot(value === 'root')
    setlinear(value === 'linear')
    setinter(value === 'inter')
    setexter(value === 'extrapolation')
    setintegrate(value === 'integration')
    setdiff(value === 'differentiation')
  };
  const handleSolution = (value) => {
    if (!pathproblem) {
      alert('Please choose a problem first');
      return;
    }
    router.push(`/${pathproblem}/${value}`); 
  };

  const problemOptions = [
    { value: 'root', label: 'Root' },
    { value: 'linear', label: 'Linear' },
    { value: 'inter', label: 'Interpolation' },
    { value: 'extrapolation', label: 'Extrapolation' },
    { value: 'integration', label: 'Integration' },
    { value: 'differentiation', label: 'Differentiation' },
  ];
  const currentProblem = problemOptions.find((item) => item.value === pathproblem);
  const selectedMethods = methodsByProblem[pathproblem] || [];
  const totalMethods = Object.values(methodsByProblem).reduce((sum, rows) => sum + rows.length, 0);
  const toRows = (value) => Array.isArray(value) ? value : [];
  const formatVector = (value) => toRows(value).join(' \\\\ ');
  const formatMatrix = (value) => toRows(value)
    .map((row) => Array.isArray(row) ? row.join(' & ') : row)
    .join(' \\\\ ');
  const countActiveHistory = () => {
    if (checkroot) return equationroot.length;
    if (checklinear) return equationlinear.length;
    if (checkinter) return equationinter.length;
    if (checkintegrate) return equationintegrate.length;
    if (checkdiff) return equationdiff.length;
    if (checkexter) return equationsimple.length + equationmultiple.length;
    return 0;
  };
  const renderHistorySection = (title, resource, rows, renderDetails) => (
    <section className="station-history-section">
      <div className="station-section-title">
        <span>{title}</span>
        <small>{rows.length} REC</small>
      </div>
      {rows.length === 0 ? (
        <div className="station-empty">No saved telemetry in this module.</div>
      ) : rows.map((cat) => (
        <article key={`${resource}-${cat.id}`} className="station-record">
          <div className="station-record__content">
            <div className="station-record__meta">
              <span><i className="status-dot status-dot--blue"></i>{cat.proublem || title}</span>
              <time>{cat.Date || 'No timestamp'}</time>
            </div>
            <div className="station-record__data">{renderDetails(cat)}</div>
          </div>
          <button onClick={() => deleteequation(cat.id, resource)} className="station-delete">
            Delete
          </button>
        </article>
      ))}
    </section>
  );

  return (
    <div className="station-shell station-home">
      <Navbar />
      <main className="station-main station-home-main">
        <div className="station-dashboard">
          <section className="station-hero" id="hero">
            <div className="scan-line"></div>
            <div className="station-hero__panel">
              <div className="station-eyebrow">MODULE::NUMERICAL // STATUS: ACTIVE</div>
              <h1>Numerical <span>Station</span></h1>
              <p>Command-grade calculator for root finding, linear systems, interpolation, regression, integration, and differentiation.</p>
              <div className="station-status-bar">
                <span><i className="status-dot"></i>Systems Online</span>
                <span><i className="status-dot status-dot--blue"></i>{selectedMethods.length || totalMethods} Methods Ready</span>
                <span><i className="status-dot status-dot--amber"></i>{countActiveHistory()} Records</span>
              </div>
            </div>
          </section>

          <aside className="station-dock" aria-label="Mission control dock">
            <section className="station-console" aria-label="Numerical method selector">
              <div className="station-console__header">
                <div>
                  <span className="station-label">Mission Control</span>
                  <h2>Access Systems</h2>
                </div>
                <span className="station-console__state">{currentProblem?.label || 'Awaiting module'}</span>
              </div>

              <div className="station-controls">
                <label>
                  <span>Choose Problem</span>
                  <StationSelect
                    placeholder="Select problem"
                    value={pathproblem || undefined}
                    onChange={handleproublem}
                    options={problemOptions}
                    className="station-select"
                  />
                </label>
                <label>
                  <span>Choose Method</span>
                  <StationSelect
                    placeholder={pathproblem ? 'Select method' : 'Choose problem first'}
                    onChange={handleSolution}
                    disabled={!pathproblem}
                    options={selectedMethods.map(item => ({
                      value: item.value,
                      label: item.label,
                    }))}
                    className="station-select"
                  />
                </label>
              </div>
            </section>

            <section className="station-module-board" aria-label="Problem modules">
              <div className="station-section-title station-section-title--compact">
                <span>Module Grid</span>
                <small>{problemOptions.length} BAY</small>
              </div>
              <div className="station-module-grid">
                {problemOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`station-module-card${pathproblem === item.value ? ' is-active' : ''}`}
                    onClick={() => handleproublem(item.value)}
                    aria-pressed={pathproblem === item.value}
                  >
                    <span>{item.label}</span>
                    <small>{(methodsByProblem[item.value] || []).length} methods</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="station-readout" aria-label="Station summary">
              <div>
                <span className="station-readout__value">{totalMethods}</span>
                <span className="station-readout__label">Methods</span>
              </div>
              <div>
                <span className="station-readout__value">{problemOptions.length}</span>
                <span className="station-readout__label">Systems</span>
              </div>
              <div>
                <span className="station-readout__value">{countActiveHistory()}</span>
                <span className="station-readout__label">Records</span>
              </div>
            </section>
          </aside>
        </div>

        <div className="airlock">
          <span>Airlock B-02 // Telemetry Archive</span>
        </div>

        <section className="station-history">
          <div className="station-console__header">
            <div>
              <span className="station-label">Equation History</span>
              <h2>Saved Telemetry</h2>
            </div>
            <span className="station-console__state">{countActiveHistory()} REC</span>
          </div>

          {!pathproblem && (
            <div className="station-empty station-empty--large">Select a problem module to inspect the latest saved equations.</div>
          )}

          {checkroot && renderHistorySection('Root Equation', 'root', equationroot, (cat) => (
            <>
              <InlineMath math={`f(x)=${cat.name}`} />
              <span>Xl = {cat.xl}</span>
              <span>Xr = {cat.xr}</span>
            </>
          ))}

          {checklinear && renderHistorySection('Linear System', 'linear', equationlinear, (cat) => (
            <>
              <InlineMath math={`A=\\begin{bmatrix} ${formatMatrix(cat.A)} \\end{bmatrix}`} />
              <InlineMath math={`B=\\begin{Bmatrix} ${formatVector(cat.B)} \\end{Bmatrix}`} />
              {toRows(cat.x0).length > 0 && <InlineMath math={`X_0=\\begin{Bmatrix} ${formatVector(cat.x0)} \\end{Bmatrix}`} />}
            </>
          ))}

          {checkinter && renderHistorySection('Interpolation', 'inter', equationinter, (cat) => (
            <>
              <InlineMath math={`X=\\begin{Bmatrix} ${formatVector(cat.X)} \\end{Bmatrix}`} />
              <InlineMath math={`Y=\\begin{Bmatrix} ${formatVector(cat.Y)} \\end{Bmatrix}`} />
              <InlineMath math={`X_0=${cat.x0}`} />
            </>
          ))}

          {checkexter && (
            <>
              {renderHistorySection('Simple Regression', 'simple', equationsimple, (cat) => (
                <>
                  <InlineMath math={`X=\\begin{Bmatrix} ${formatVector(cat.X)} \\end{Bmatrix}`} />
                  <InlineMath math={`Y=\\begin{Bmatrix} ${formatVector(cat.Y)} \\end{Bmatrix}`} />
                  <InlineMath math={`m=${cat.m}`} />
                </>
              ))}
              {renderHistorySection('Multiple Regression', 'multiple', equationmultiple, (cat) => (
                <>
                  <InlineMath math={`X=\\begin{Bmatrix} ${formatVector(cat.X)} \\end{Bmatrix}`} />
                  <InlineMath math={`Y=\\begin{Bmatrix} ${formatVector(cat.Y)} \\end{Bmatrix}`} />
                  <InlineMath math={`X_i=${cat.xi}`} />
                </>
              ))}
            </>
          )}

          {checkintegrate && renderHistorySection('Integration', 'integrate', equationintegrate, (cat) => (
            <>
              <InlineMath math={`f(x)=${cat.fx}`} />
              <span>a = {cat.a}</span>
              <span>b = {cat.b}</span>
              <span>n = {cat.n}</span>
            </>
          ))}

          {checkdiff && renderHistorySection('Differentiation', 'diff', equationdiff, (cat) => (
            <>
              <InlineMath math={`f(x)=${cat.fx}`} />
              <span>x = {cat.x}</span>
              <span>h = {cat.h}</span>
            </>
          ))}
        </section>
      </main>
    </div>
  );
}
