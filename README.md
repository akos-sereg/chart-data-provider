# chart-data-provider

Prepares chart-friendly data from user data

# Usage

Using sample data ...

```javascript
var sampleData = [
  { commit_date: '2016-08-01', lines_added: 1 },
  { commit_date: '2016-08-02', lines_added: -2 },
  { commit_date: '2016-08-03', lines_added: 3 },
  { commit_date: '2016-08-04', lines_added: -4 }, { commit_date: '2016-08-04', lines_added: -2 },
  { commit_date: '2016-08-05', lines_added: 5 },
  { commit_date: '2016-08-06', lines_added: -6 }, { commit_date: '2016-08-06', lines_added: 2 }, { commit_date: '2016-08-06', lines_added: 1 },
  { commit_date: '2016-08-07', lines_added: 7 },
  //{ commit_date: '2016-08-08', lines_added: -8 },
  //{ commit_date: '2016-08-09', lines_added: 9 },
  { commit_date: '2016-08-10', lines_added: -10 },
];
```

... by calling chart data provider

```javascript
var chartDataProvider = require('chart-data-provider');
var data = chartDataProvider
  .range('2016-08-01', '2016-08-20')
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
  .data(sampleData, { 
      itemRenderer: function(recordsOnDate, chartItem) { 
      	// here you can define extra properties for each array element before getting the result
  	  }
  });

```

The result would be an array with continous dates between the defined date range

```javascript
[
	{ x: '2016-08-01', y: 1 },
	{ x: '2016-08-02', y: -2 },
	{ x: '2016-08-03', y: 3 },
	{ x: '2016-08-04', y: -6 }, // <-- aggregated from user data
	{ x: '2016-08-05', y: 5 },
	{ x: '2016-08-06', y: -3 },
	{ x: '2016-08-07', y: 7 },
	{ x: '2016-08-08', y: 0 }, // <-- filling gaps
	{ x: '2016-08-09', y: 0 },
	{ x: '2016-08-10', y: -10 },
]

```