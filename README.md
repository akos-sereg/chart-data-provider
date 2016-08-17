# chart-data-provider
[![npm](https://img.shields.io/npm/v/chart-data-provider.svg?style=flat)](https://npmjs.com/package/chart-data-provider)
[![Build Status](https://travis-ci.org/akos-sereg/chart-data-provider.png)](https://travis-ci.org/akos-sereg/chart-data-provider) 

Prepares chart-friendly data from user data

# Why?

This tool might be useful for you if you are working with charts, and the input of the chart engine should be an array with continuous dates in it, but ...
- your data is not continuous
- there might be duplicate entries for the same date in your data

# Install

```
npm install chart-data-provider --save
```

# Usage

Using sample data ...

```javascript
var sample = [
  { commit_date: '2016-08-01', lines_added: 1 },
  { commit_date: '2016-08-02', lines_added: -4 }, 
  { commit_date: '2016-08-02', lines_added: -2 },
  { commit_date: '2016-08-05', lines_added: -10 },
];
```

... by calling chart data provider

```javascript
var chartDataProvider = require('chart-data-provider');
var data = chartDataProvider
  .range('2016-08-01', '2016-08-06')
  .axis({ 
      x: { 
          input: { fieldName: 'commit_date' },            // Name of date field in user data
          output: { fieldName: 'x', type: 'YYYY-MM-DD'}   // Name of x axis in result, and the format
      }, 
      y: { 
          input: { fieldName: 'lines_added' },            // Name of the property we want to aggregate
          output: { fieldName: 'y', calculation: chartDataProvider.SUM_ON_CURRENT_DATE } // The way we aggregate
      } 
  })
  .data(sample, { 
      itemRenderer: function(recordsOnDate, chartItem) { 
      	// here you can define extra properties for each array element before getting the result
  	  }
  });

```

The result would be an array with continuous dates between the defined date range

```javascript
// content of 'data' array
[
  { x: '2016-08-01', y: 1 },
  { x: '2016-08-02', y: -6 }, // duplicate entries got aggregated
  { x: '2016-08-03', y: 0 },  // filling the gaps
  { x: '2016-08-04', y: 0 },
  { x: '2016-08-05', y: -10 },
  { x: '2016-08-06', y: 0 },  // filling the gaps (to the end of defined date range)
]

```