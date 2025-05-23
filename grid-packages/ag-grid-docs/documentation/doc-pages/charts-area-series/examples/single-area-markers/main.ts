import { AgChartOptions } from '@ag-grid-community/core'
import * as agCharts from 'ag-charts-community'

const options: AgChartOptions = {
  container: document.getElementById('myChart'),
  title: {
    text: 'Internet Explorer Market Share',
  },
  subtitle: {
    text: '2009-2019 (aka "good times")',
  },
  data: getData(),
  series: [
    {
      type: 'area',
      xKey: 'year',
      yKeys: ['ie'],
      yNames: ['IE'],
      marker: {
        enabled: true,
      },
      tooltip: {
        renderer: function (params) {
          return {
            content:
              params.yName + ' - ' + params.yValue + '% - Jan ' + params.xValue,
          }
        },
      },
    },
  ],
  legend: {
    enabled: false,
  },
}

agCharts.AgChart.create(options)
