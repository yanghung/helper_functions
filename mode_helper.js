/*
Helper functions to use in mode dataviz proof of concept
*/




/**
Description:
Various Number Formats
*/
let dateFormat_mm_dd_yyyy = d3.time.format('%m/%d/%y');
let dateFormat_mm_dd = d3.time.format('%m/%d');
let dateFormat_mmm_yyyy = d3.time.format('%b %Y');
let dateFormat_yyyy_mm_dd = d3.time.format('%Y-%m-%d');
let numberFormat = d3.format('.2f');
let numberFormat_0_decimal = d3.format(",.0f");
let numberFormat_no_decimal = d3.format(',');
let numberFormat_no_decimal_axis = d3.format('d');
let fullDateFormat = d3.time.format('%m/%x/%y');
let yearFormat = d3.time.format('%Y');
let monthFormat = d3.time.format('%b');
let dayFormat = d3.time.format('%d');
let dayOfWeekFormat = d3.time.format('%a');
let currencyFormat = d3.format('$,.2f');
let currencyFormat_no_decimal = d3.format('$,.0f');
let percentFormat = d3.format(',.2%');
let percentFormat_no_decimal = d3.format('%');
function currencyFormat_smart(d) {
  var abs_d = Math.abs(d);
  if (abs_d>=1e9) {  return "$" + numberFormat_no_decimal(d / 1e9) + " B";  }
  else if (abs_d>=1e6) {  return "$" + numberFormat_no_decimal(d / 1e6) + " M";  }
  else if (abs_d>=1e5) {  return "$" + numberFormat_no_decimal(d / 1e3) + " K";  }
  else if (abs_d>=1e4) {  return "$" + numberFormat_no_decimal(d / 1e3) + " K";  }
  else if (abs_d>=1e3) {  return currencyFormat_no_decimal(d);  }
  else {  return currencyFormat(d);  }
}
function numberFormat_smart(d) {
  var abs_d = Math.abs(d);
  if (abs_d>=1e9) {  return numberFormat_no_decimal(d / 1e9) + " B";  }
  else if (abs_d>=1e6) {  return numberFormat_no_decimal(d / 1e6) + " M";  }
  else if (abs_d>=1e5) {  return numberFormat_no_decimal(d / 1e3) + " K";  }
  else if (abs_d>=1e4) {  return numberFormat_no_decimal(d / 1e3) + " K";  }
  else if (abs_d>=1e3) {  return numberFormat_0_decimal(d);  }
  else {  return numberFormat(d);  }
}
function percentFormat_smart(d) {
  var abs_d = Math.abs(d);
  if (abs_d>=10) {  return percentFormat_no_decimal(Math.round(d));  }
  else {  return percentFormat(d);  }
}






/**
Description:
Given the "queryName" from mode as the parameter, gets the data (in JSON form)

Example:
const released_extensions_list = getDataFromQuery('00_check_released_extensions','data');
*/
function getDataFromQuery(queryName, parameter) {
  var data = datasets.filter(function(d) { if (d) { return d.queryName == queryName };  })[0]; //filter to only get the data from your queryName
  if (!data) {
    console.log("No such query: '" + queryName + "'");
    return [];
  }
  if (parameter == 'mode_id') {
    return data.id;
  } else if (parameter == 'data') {
    return data.content;
  } else if (parameter == 'columns') {
    return data.columns; //columns[i].name && columns[i].type
  } else {
    return data;
  }
};



/**
Description:
Given an array of values, add them one element at a time to a "dropdown" list

Example:
let unique_extension_name = [...new Set(released_extensions_list.map(item => item.extension_name))];
addToDropdown(unique_extension_name, 'dropdown_extension_list');

Note: Used as a "hack" to update the dropdown with results from a mode query
*/
function addToDropdown(the_list, dropdown_html_id) {
  for (var i=0; i<the_list.length; i++) {
    var opt = document.createElement('option');
    var the_value=the_list[i];
    opt.value = the_value;
    opt.innerHTML = the_value;
    document.getElementById(dropdown_html_id).appendChild(opt);
  }
};

/**
Description:
Given a metric group (crossfiltered data after reduce function) of values, filter to return only records where key[key_index]==match_value

Example:
var metricsPanel=filterByOneKey(metricsExtensionTypeTheDate, 0, 'panel');

Note: Used in multi data series charts when you first need to declare a dimension with multiple keys
*/
function filterByOneKey(metrics_group, key_index, match_value) {
  return {
      all: function () {
      return metrics_group.all().filter(function (d) {   return d.key[key_index]==match_value;   });
    }
    , top: function () {
      return metrics_group.top(Infinity).filter(function (d) {   return d.key[key_index]==match_value;   });
    }
  };
}


/**
Description:
Given a metric group (crossfiltered data after reduce function) of values and a key_index, create separate metric group of values based on the unique values in the key_index

Example:
createUniqueDataSeriesOneKey(metricsExtensionTypeTheDate, 'extensionTypeSeries', 0);

Note: Used in multi data series charts so that you don't need to create each filtered metric group
      key_index is the numeric index of the variable when you created the dimension
      prefix_name is what you would like to prepend as the name of the variable that stores the separate metric group of values
*/
function createUniqueDataSeriesOneKey(metric_group, prefix_name, key_index) {
  var key_unique_vals=[...new Set(metric_group.all().map(item => item['key'][key_index]))];
  for (var i=0; i<key_unique_vals.length; i++) {
    window[prefix_name+(i+1)] = filterByOneKey(metric_group, key_index, key_unique_vals[i]);
    window[prefix_name+(i+1)].series_name = key_unique_vals[i];
  }
}


/**
Descroption:
Given a "the_data" object and "the_column" field in the data, return an array of the unique values in "the_column" field

Example:
var unique_extension_name = createUniqueArray(released_extensions_data, 'extension_name', false)

Note: see here for javascript Set documentation: https://stackoverflow.com/questions/8363564/ways-to-create-a-set-in-javascript
*/
function createUniqueArray(the_data, the_column, bool_sort) {
  if (bool_sort) {
    return [...new Set(the_data.map(item => item[the_column]))].sort();
  } else {
    return [...new Set(the_data.map(item => item[the_column]))];
  }
}


/**
Description:
Given an an object with settings for a chart, create composite chart that can hold lots of other different 'charts'

Example:
createChart(settings_row2_chart);
*/
function createChart(chart_settings) {
  var series_array=[];
  const chart_id=chart_settings['chart_id'];
  window[chart_id] = dc.compositeChart('#'+chart_id); // declare variables to map to html_div_id
  chart_settings['setting_series'].forEach( function(series_setting) {
    const chart_type = series_setting['chart_type'];
    const series_id = series_setting['series_id'];
    if (chart_type=='line_chart') {
      window[series_id] = dc.lineChart(window[chart_id]);
      series_array.push(  createLineChart(window[series_id], series_setting)  );
    } else {
      console.log('dont recognize the chart_type: '+chart_type+' for the series_id='+series_id);
    }
  })
  createCompositeChart(window[chart_id], chart_settings, series_array);
}


/**
Description:
Helper function to create composite chart, used in createChart function

Example:
createCompositeChart(window[chart_id], settings_row2_chart, series_array);
*/
function createCompositeChart(the_chart, options, data_series_array) {
  /** Required Parameters */
  the_chart
    .width(options.width)
    .height(options.height)
    .margins(options.margins)
    .compose(data_series_array)
  ;
  /** Optional Parameters */
  (options.x_axis) ? the_chart.x(options.x_axis) : null; //x-axis start and end points
  (options.legend) ? the_chart.legend(options.legend) : null;
  (options.x_axis_label) ? the_chart.xAxisLabel(options.x_axis_label): null; //if you set x axis label then include it in options, otherwise do nothing
  (options.y_axis_label) ? the_chart.yAxisLabel(options.y_axis_label): null; //if you set y axis label then include it in options, otherwise do nothing
  (options.x_axis_format) ? the_chart.xAxis().tickFormat(options.x_axis_format): null; //if you set y axis format then include it in options, otherwise do nothing
  (options.y_axis_format) ? the_chart.yAxis().tickFormat(options.y_axis_format): null; //if you set y axis format then include it in options, otherwise do nothing
  (options.bool_is_x_ordinal) ? the_chart.xUnits(dc.units.ordinal): null;
  (options.bool_brush_on) ? the_chart.brushOn(options.bool_brush_on): the_chart.brushOn(false);
  (options.bool_elastic_x) ? the_chart.elasticX(options.bool_elastic_x): null; //if you set elastic x then include it in options, otherwise do nothing
  (options.bool_elastic_y) ? the_chart.elasticY(options.bool_elastic_y): null; //if you set elastic y then include it in options, otherwise do nothing
  (options.bool_render_horizontal_grid_lines) ? the_chart.renderHorizontalGridLines(options.bool_render_horizontal_grid_lines) : null; //if you set renderHorizontalGridLines then include it in options, otherwise do nothing
  (options.bool_render_vertical_grid_lines) ? the_chart.renderVerticalGridLines(options.bool_render_vertical_grid_lines) : null; //if you set renderVerticalGridLines then include it in options, otherwise do nothing
  (options.bool_mouse_zoomable) ? the_chart.mouseZoomable(options.bool_mouse_zoomable) : null; //if you set mouseZoomable then include it in options, otherwise do nothing
  // (options.resize) ? the_chart.useViewBoxResizing(options.resize): the_chart.useViewBoxResizing(false);
  // (options.num_clip_padding) ? the_chart.clipPadding(options.num_clip_padding) : null; //if you set clipPadding then include it in options, otherwise do nothing
  // (options.x_ordering) ? the_chart.ordering(options.x_ordering) : null;
  (options.tooltip) ? the_chart_obj.title(options.tooltip): null; //if you set title then include it in options, otherwise do nothing
};


/**
Description:
Helper function to create line chart, used in createChart function

Example:
createLineChart(window[chart_name], chart_opts);
*/
function createLineChart(the_chart, options) {
  /** Required Parameters */
  var the_chart_obj = the_chart;
  the_chart_obj
    .dimension(options.dimension)                       //x-axis variable "dimension"
    .group(options.group[0], options.group[1])          //y-axis variable "group" [0]: the crossfilter group var, [1]: the optional legend label
  ;
  /** Optional Parameters */
  (options.key_accessor) ? the_chart_obj.keyAccessor(options.key_accessor): null;
  (options.value_accessor) ? the_chart_obj.valueAccessor(options.value_accessor): null;
  (options.tooltip) ? the_chart_obj.title(options.tooltip): null; //if you set title then include it in options, otherwise do nothing
  (options.datapoints) ? the_chart_obj.renderDataPoints(options.datapoints): null;
  (options.dash_style) ? the_chart_obj.dashStyle(options.dash_style) : null;
  (options.colors) ? the_chart_obj.colors(options.colors) : null; //if you set colors function then include it in options, otherwise do nothing
  (options.bool_use_default_filters)? the_chart.controlsUseVisibility(true) : null;
  // (options.bool_is_x_ordinal) ? the_chart.xUnits(dc.units.ordinal): null;
  // (options.bool_render_area) ? the_chart.renderArea(options.bool_render_area) : null; //if you set renderArea then include it in options, otherwise do nothing
  // (options.bool_mouse_zoomable) ? the_chart.mouseZoomable(options.bool_mouse_zoomable) : null; //if you set mouseZoomable then include it in options, otherwise do nothing
  // (options.resize) ? the_chart.useViewBoxResizing(options.resize): the_chart.useViewBoxResizing(false);
  // (options.num_clip_padding) ? the_chart.clipPadding(options.num_clip_padding) : null; //if you set clipPadding then include it in options, otherwise do nothing
  // (options.x_ordering) ? the_chart.ordering(options.x_ordering) : null;
  return the_chart_obj;
};
