import { AgChartOptions } from '@ag-grid-community/core'
import * as agCharts from 'ag-charts-community'

const options: AgChartOptions = {
  container: document.getElementById('myChart'),
  autoSize: true,
  data: getData(),
  title: {
    text: 'Changes in Prison Population (2019)',
    fontSize: 18,
  },
  subtitle: {
    text:
      'Source: Ministry of Justice, HM Prison Service, and Her Majesty’s Prison and Probation Service',
  },
  series: [
    {
      type: 'column',
      xKey: 'month',
      yKeys: ['menDelta', 'womenDelta'],
      yNames: ['Male', 'Female'],
      grouped: true,
      fills: ['#19A0AA', '#F15F36'],
      strokes: ['#19A0AA', '#F15F36'],
    },
  ],
  axes: [
    {
      type: 'category',
      position: 'bottom',
    },
    {
      type: 'number',
      position: 'left',
    },
  ],
}

var chart = agCharts.AgChart.create(options)
