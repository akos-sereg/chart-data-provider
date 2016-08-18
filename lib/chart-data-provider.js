var _           = require('underscore');
var moment      = require('moment');

module.exports = {

	DATE_FORMAT: 'YYYY-MM-DD',
	EPOCH_DAY: 86400,

	range: function(startDate, endDate) {

	    if (_.isString(startDate)) this.startDate = moment.utc(startDate, this.DATE_FORMAT, true);
	    else if (_.isDate(startDate)) this.startDate = moment.utc(startDate);
	    else throw new Error('startDate should be either a date string in format '+this.DATE_FORMAT+' or a Date instance.');
	    
	    if (_.isString(endDate)) this.endDate = moment.utc(endDate, this.DATE_FORMAT, true);
	    else if (_.isDate(endDate)) this.endDate = moment.utc(endDate);
	    else throw new Error('endDate should be either a date string in format '+this.DATE_FORMAT+' or a Date instance.');

	    if (endDate < startDate) {
	    	throw new Error('Start Date exceeds End Date');
	    }

	    return this;
	},

	axis: function(options) {

		this.xConfig = options.x;
		this.yConfig = options.y;

		return this;
	},

	data: function(data, options) {

		if (!options) 
			options = { itemRenderer: function() {} };
		
		var result = [], index = 0;
		this.total = 0;

		var start = this.startDate.unix();
		var end = this.endDate.unix();

	    for (var currentEpoch = start; currentEpoch <= end; currentEpoch += this.EPOCH_DAY) {

	    	var currentEpochInMs = currentEpoch * 1000;
	    	var item = { };

	    	// Set output date
	    	var outputDate = null;
	    	switch(this.xConfig.output.type) {

	    		case 'EPOCH':
	    			outputDate = currentEpoch;
	    			break;

	    		case 'EPOCH_IN_MS':
	    			outputDate = currentEpochInMs;
	    			break;

	    		case 'YYYY-MM-DD':
	    		default:
					outputDate = moment(currentEpochInMs).utc().format(this.DATE_FORMAT);
	    	}

	    	item[this.xConfig.output.fieldName] = outputDate;

	    	// Set index, if required
	    	if (this.xConfig.output.index) {
	    		item.index = index++;
	    	}

	    	// Aggregate
	    	var recordsOnDate = this.getRecordsOnDate(data, moment.utc(currentEpochInMs).format(this.DATE_FORMAT));
	    	this.yConfig.output.calculation(recordsOnDate, item, this.yConfig.input.fieldName, this.yConfig.output.fieldName);

	    	// Run user-defined renderer
	        if (options.itemRenderer != null && typeof(options.itemRenderer) === 'function') {
	        	options.itemRenderer(recordsOnDate, item);
	        }

	        result.push(item);
	    }
	    

	    return result;
	},

	SUM_UP_TO_CURRENT_DATE: function(recordsOnDate, item, inputFieldName, outputFieldName) {
		var self = this;

		if (self.total == undefined) 
			self.total = 0;

		recordsOnDate.forEach(function(item) {
			self.total += item[inputFieldName];
		});

		item[outputFieldName] = this.total;
	},

	SUM_ON_CURRENT_DATE: function(recordsOnDate, item, inputFieldName, outputFieldName) {
		var self = this;
		this.total = 0;

		recordsOnDate.forEach(function(item) {
			self.total += item[inputFieldName];
		});

		item[outputFieldName] = this.total;
	},

	ENTRY_COUNT_ON_CURRENT_DATE: function(recordsOnDate, item, inputFieldName, outputFieldName) {
		item[outputFieldName] = recordsOnDate.length;
	},

	getRecordsOnDate: function(data, date) {

		var recordsOnDate = [];
		var self = this;

		data.forEach(function(item) {
			itemDate = moment.utc(item[self.xConfig.input.fieldName], self.DATE_FORMAT, true);

			if (itemDate.format(self.DATE_FORMAT) == date) {
				recordsOnDate.push(item);
			}
		});

		return recordsOnDate;
	}
}
