import React from 'react'
import { useEffect, useRef, useState } from 'react'
// import rd3 from 'react-d3-library'

import logo from './logo.svg'
import './App.css'
const API_BASE = 'http://localhost:50302'
const bil = API_BASE + '/dist/tag_yoland_billing.yaml'
import { drawChart } from './charts/drawChart.js'
import { PomoProgress } from './charts/drawChart3'

function MyCalendar() {
  const chartRef: any = useRef(null)
  useEffect(() => {
    // if (!!chartRef?.current?.innerText) {
    //   chartRef.current.innerText = 'asdfzxcv'
    // }
    drawChart(chartRef.current)
  }, [])
  return <>
    <div ref={chartRef} id="chart">
    //D3 Charts
    </div>
  </>
}


function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <MyCalendar /> */}
        <div><PomoProgress /></div>
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
