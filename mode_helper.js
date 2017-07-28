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






function create_line_chart(options, the_chart_var) {
  //required parameters
  options.var_chart_name
    .dimension(options.var_dimension)   //x-axis variable "dimension"
    .group(options.var_group)           //y-axis variable "group"
    .x(options.x_axis)                  //x-axis domain
    //.useViewBoxResizing(true)
  ;
  //(options.resize) ? options.var_chart_name.useViewBoxResizing(options.resize): options.var_chart_name.useViewBoxResizing(false);
  (options.num_height) ? options.var_chart_name.height(options.num_height) : null;
  (options.num_width) ? options.var_chart_name.width(options.num_width) : null;
  (options.margin_setting) ? options.var_chart_name.margins(options.margin_setting) : null;
  (options.bool_brush_on) ? options.var_chart_name.brushOn(options.bool_brush_on) : options.var_chart_name.brushOn(false);
  (options.var_key_accessor) ? options.var_chart_name.keyAccessor(options.var_key_accessor) : null;
  (options.value_accessor) ? options.var_chart_name.valueAccessor(options.value_accessor) : null;
  (options.tooltip) ? options.var_chart_name.title(options.tooltip) : null; //if you set title then include it in options, otherwise do nothing
  (options.datapoints) ? options.var_chart_name.renderDataPoints(options.datapoints) : null;
  (options.str_x_axis_label) ? options.var_chart_name.xAxisLabel(options.str_x_axis_label) : null; //if you set x axis label then include it in options, otherwise do nothing
  (options.str_y_axis_label) ? options.var_chart_name.yAxisLabel(options.str_y_axis_label) : null; //if you set y axis label then include it in options, otherwise do nothing
  (options.str_x_axis_format) ? options.var_chart_name.xAxis().tickFormat(options.str_x_axis_format) : null; //if you set y axis format then include it in options, otherwise do nothing
  (options.str_y_axis_format) ? options.var_chart_name.yAxis().tickFormat(options.str_y_axis_format) : null; //if you set y axis format then include it in options, otherwise do nothing

  (options.bool_elastic_x) ? options.var_chart_name.elasticX(options.bool_elastic_x) : null; //if you set elastic x then include it in options, otherwise do nothing
  (options.bool_elastic_y) ? options.var_chart_name.elasticY(options.bool_elastic_y) : null; //if you set elastic y then include it in options, otherwise do nothing
  // (options.bool_render_area) ? options.var_chart_name.renderArea(options.bool_render_area) : null; //if you set renderArea then include it in options, otherwise do nothing
  // (options.bool_render_data_points) ? options.var_chart_name.renderDataPoints(options.bool_render_data_points) : null; //if you set renderDataPoints then include it in options, otherwise do nothing
  // (options.bool_render_horizontal_grid_lines) ? options.var_chart_name.renderHorizontalGridLines(options.bool_render_horizontal_grid_lines) : null; //if you set renderHorizontalGridLines then include it in options, otherwise do nothing
  // (options.bool_render_vertical_grid_lines) ? options.var_chart_name.renderVerticalGridLines(options.bool_render_vertical_grid_lines) : null; //if you set renderVerticalGridLines then include it in options, otherwise do nothing
  // (options.bool_mouse_zoomable) ? options.var_chart_name.mouseZoomable(options.bool_mouse_zoomable) : null; //if you set mouseZoomable then include it in options, otherwise do nothing
  // (options.num_clip_padding) ? options.var_chart_name.clipPadding(options.num_clip_padding) : null; //if you set clipPadding then include it in options, otherwise do nothing
  // (options.var_x_ordering) ? options.var_chart_name.ordering(options.var_x_ordering) : null;
  // (options.var_dash_style) ? options.var_chart_name.dashStyle(options.var_dash_style) : null;
  // (options.var_colors) ? options.var_chart_name.colors(options.var_colors) : null; //if you set colors function then include it in options, otherwise do nothing
};
