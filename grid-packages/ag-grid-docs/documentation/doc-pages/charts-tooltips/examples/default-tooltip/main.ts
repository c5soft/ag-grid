import { Grid, AgBarSeriesOptions, AgCartesianAxisOptions, AgCartesianChartOptions } from '@ag-grid-community/core'
import * as agCharts from 'ag-charts-community'

const options: AgCartesianChartOptions<AgCartesianAxisOptions[], AgBarSeriesOptions[]> = {
  container: document.getElementById('myChart'),
  data: [
    {
      month: 'Jun',
      value1: 50,
      hats_made: 40,
    },
    {
      month: 'Jul',
      value1: 70,
      hats_made: 50,
    },
    {
      month: 'Aug',
      value1: 60,
      hats_made: 30,
    },
  ],
  series: [
    {
      type: 'column',
      xKey: 'month',
      yKeys: ['value1', 'hats_made'],

    },
  ],
}

var chart = agCharts.AgChart.create(options)

function setYNames() {
  options.series![0].yNames = {
    value1: 'Sweaters Made',
    hats_made: 'Hats Made',
  }
  agCharts.AgChart.update(chart, options)
}

function resetYNames() {
  options.series![0].yNames = {}
  agCharts.AgChart.update(chart, options)
}
