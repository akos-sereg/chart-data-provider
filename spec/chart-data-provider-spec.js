// ---------------------------------------------------------------
// Checking Range
// ---------------------------------------------------------------
describe("Range", function() {

   it('should throw error if start date exceeds end date', function() {

    var chartDataProvider = require('../index');

    var errorObj = null;

    try {
      var data = chartDataProvider
        .range('2016-08-20', '2016-08-01')
        .axis({ 
            x: { 
                input: { fieldName: 'commit_date' },
                output: { fieldName: 'x', type: 'YYYY-MM-DD', index: true }
            }, 
            y: { 
                input: { fieldName: 'lines_added' },
                output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
            } 
        })
        .data([], { 
            itemRenderer: function(recordsOnDate, chartItem) { }
        });
    }
    catch (error) {
      errorObj = error;
    }
    
    expect(errorObj).not.toEqual(null);
  });
 
  it('should fit in YYYY-MM-DD mode', function() {

    var chartDataProvider = require('../index');

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data([], { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].x).toBe('2016-08-01');
    expect(data[1].x).toBe('2016-08-02');
    expect(data[2].x).toBe('2016-08-03');
    expect(data[3].x).toBe('2016-08-04');
    expect(data[19].x).toBe('2016-08-20');

  });

  it('should fit in EPOCH mode', function() {

    var chartDataProvider = require('../index');

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'EPOCH', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data([], { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].x).toBe(1470009600);
    expect(data[1].x).toBe(1470096000);
    expect(data[2].x).toBe(1470182400);
    expect(data[3].x).toBe(1470268800);
    expect(data[19].x).toBe(1471651200);

  });

  it('should fit in EPOCH_IN_MS mode', function() {

    var chartDataProvider = require('../index');

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'EPOCH_IN_MS', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data([], { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].x).toBe(1470009600000);
    expect(data[1].x).toBe(1470096000000);
    expect(data[2].x).toBe(1470182400000);
    expect(data[3].x).toBe(1470268800000);
    expect(data[19].x).toBe(1471651200000);

  });

  it('can be defined with Date instances', function() {

    var chartDataProvider = require('../index');

    var data = chartDataProvider
      .range(new Date(Date.UTC(2016, 7, 1)), new Date(Date.UTC(2016, 7, 20)))
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data([], { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });
    
    expect(data.length).toBe(20);
    expect(data[0].x).toBe('2016-08-01');
    expect(data[1].x).toBe('2016-08-02');
    expect(data[2].x).toBe('2016-08-03');
    expect(data[3].x).toBe('2016-08-04');
    expect(data[19].x).toBe('2016-08-20');
  });

});

// ---------------------------------------------------------------
// Checking Axis
// ---------------------------------------------------------------
describe("Axis", function() {
 
  it('should take input field name from user data', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: -2 },
      { commit_date: '2016-08-03', lines_added: 3 },
      { commit_date: '2016-08-04', lines_added: -4 },
      { commit_date: '2016-08-05', lines_added: 5 },
      { commit_date: '2016-08-06', lines_added: -6 },
      { commit_date: '2016-08-07', lines_added: 7 },
      { commit_date: '2016-08-08', lines_added: -8 },
      { commit_date: '2016-08-09', lines_added: 9 },
      { commit_date: '2016-08-19', lines_added: -10 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].y).toBe(1);
    expect(data[1].y).toBe(-1);
    expect(data[2].y).toBe(2);
    expect(data[3].y).toBe(-2);
    expect(data[19].y).toBe(-5);

  });

  it('index should be added if required', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: 2 },
      { commit_date: '2016-08-03', lines_added: 3 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD', index: true }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].index).toBe(0);
    expect(data[1].index).toBe(1);
    expect(data[2].index).toBe(2);
    expect(data[3].index).toBe(3);
    expect(data[19].index).toBe(19);

  });

  it('index should not be added if not required', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: 2 },
      { commit_date: '2016-08-03', lines_added: 3 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD', index: false }
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].index).toBe(undefined);
    expect(data[1].index).toBe(undefined);
    expect(data[2].index).toBe(undefined);
    expect(data[3].index).toBe(undefined);
    expect(data[19].index).toBe(undefined);

  });

  it('index should not be added if not defined', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: 2 },
      { commit_date: '2016-08-03', lines_added: 3 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD'}
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].index).toBe(undefined);
    expect(data[1].index).toBe(undefined);
    expect(data[2].index).toBe(undefined);
    expect(data[3].index).toBe(undefined);
    expect(data[19].index).toBe(undefined);

  });


});

// ---------------------------------------------------------------
// Checking Calculation
// ---------------------------------------------------------------
describe("Calculation", function() {
 
  it('SUM_UP_TO_CURRENT_DATE, considering multiple items on same date', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: -2 },
      { commit_date: '2016-08-03', lines_added: 3 },
      { commit_date: '2016-08-04', lines_added: -4 }, { commit_date: '2016-08-04', lines_added: -2 },
      { commit_date: '2016-08-05', lines_added: 5 },
      { commit_date: '2016-08-06', lines_added: -6 }, { commit_date: '2016-08-06', lines_added: 2 }, { commit_date: '2016-08-06', lines_added: 1 },
      { commit_date: '2016-08-07', lines_added: 7 },
      { commit_date: '2016-08-08', lines_added: -8 },
      { commit_date: '2016-08-09', lines_added: 9 },
      { commit_date: '2016-08-10', lines_added: -10 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD'}
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_UP_TO_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].y).toBe(1);
    expect(data[1].y).toBe(-1);
    expect(data[2].y).toBe(2);
    expect(data[3].y).toBe(-4);
    expect(data[4].y).toBe(1);
    expect(data[5].y).toBe(-2);
    expect(data[6].y).toBe(5);
    expect(data[7].y).toBe(-3);
    expect(data[8].y).toBe(6);
    expect(data[9].y).toBe(-4);
    expect(data[10].y).toBe(-4);
    expect(data[19].y).toBe(-4);

  });

  it('SUM_ON_CURRENT_DATE, considering multiple items on same date', function() {

    var chartDataProvider = require('../index');

    var sampleData = [
      { commit_date: '2016-08-01', lines_added: 1 },
      { commit_date: '2016-08-02', lines_added: -2 },
      { commit_date: '2016-08-03', lines_added: 3 },
      { commit_date: '2016-08-04', lines_added: -4 }, { commit_date: '2016-08-04', lines_added: -2 },
      { commit_date: '2016-08-05', lines_added: 5 },
      { commit_date: '2016-08-06', lines_added: -6 }, { commit_date: '2016-08-06', lines_added: 2 }, { commit_date: '2016-08-06', lines_added: 1 },
      { commit_date: '2016-08-07', lines_added: 7 },
      { commit_date: '2016-08-08', lines_added: -8 },
      { commit_date: '2016-08-09', lines_added: 9 },
      { commit_date: '2016-08-10', lines_added: -10 },
    ];

    var data = chartDataProvider
      .range('2016-08-01', '2016-08-20')
      .axis({ 
          x: { 
              input: { fieldName: 'commit_date' },
              output: { fieldName: 'x', type: 'YYYY-MM-DD'}
          }, 
          y: { 
              input: { fieldName: 'lines_added' },
              output: { fieldName: 'y', calculation: chartDataProvider.SUM_ON_CURRENT_DATE }
          } 
      })
      .data(sampleData, { 
          itemRenderer: function(recordsOnDate, chartItem) { }
      });

    expect(data.length).toBe(20);
    expect(data[0].y).toBe(1);
    expect(data[1].y).toBe(-2);
    expect(data[2].y).toBe(3);
    expect(data[3].y).toBe(-6);
    expect(data[4].y).toBe(5);
    expect(data[5].y).toBe(-3);
    expect(data[6].y).toBe(7);
    expect(data[7].y).toBe(-8);
    expect(data[8].y).toBe(9);
    expect(data[9].y).toBe(-10);
    expect(data[19].y).toBe(0);

  });
});

