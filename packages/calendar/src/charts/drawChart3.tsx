import { useState } from 'react'
import useInterval from 'use-interval';
import { VictoryPie } from 'victory';


export const PomoProgress = ({ pomoState }) => {
  const stateInit = (ing = 0) => {
    const focusLen = 25 * 60e3
    const relaxLen = 5 * 60e3
    const pomoLen = focusLen + relaxLen
    const sectData = (min, max, val) => [Math.max(min, Math.min(max, val)), Math.max(min, Math.min(max, max - val))]
    ing = ing % pomoLen
    const pieData = [...sectData(0, focusLen, ing), ...sectData(0, relaxLen, ing - focusLen)]
    return { focusLen, relaxLen, pomoLen, ing, pieData }
  }

  const [state, setState] = useState(stateInit())
  useInterval(() => setState(stateInit(state.ing + 10e3)), 100)
  const colors = {
    fg1: '#ffbb91',
    fg2: '#ffbb91',
    bg1: '#23292f',
    empty: '#eee'
  }

  const themeColor = '#ffbb91'
  const radius = 120
  return <>
    <VictoryPie
      data={state.pieData}
      innerRadius={radius * 0.9}
      radius={radius}
      cornerRadius={10}
      colorScale={[colors.fg1, colors.empty, colors.fg2, colors.empty]}
      labels={[]}
    // theme={VictoryTheme.material}
    />
    {/* 25% */}
  </>;
}