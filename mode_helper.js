/*
Helper functions to use in mode dataviz proof of concept
*/



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
Generate a line chart given a

Example:

*/
function create_line_chart(options, html_id_chart) {
  window["options.var_chart_name"]= dc.lineChart(html_id_chart);
  options.var_chart_name
    .width(options.num_width)
    .height(options.num_height)
    .dimension(options.var_dimension)
    .group(options.var_group)
    .brushOn(options.bool_brush_on)
    .margins({top: options.num_top, right: options.num_right, bottom: options.num_bottom, left: options.num_left});
  (options.var_title) ? options.var_chart_name.title(options.var_title) : null; //if you set title then include it in options, otherwise do nothing
  (options.var_x_axis) ? options.var_chart_name.x(options.var_x_axis) : null; //if you set x axis domain then include it in options, otherwise do nothing
  (options.str_x_axis_label) ? options.var_chart_name.xAxisLabel(options.str_x_axis_label) : null; //if you set x axis label then include it in options, otherwise do nothing
  (options.str_y_axis_label) ? options.var_chart_name.yAxisLabel(options.str_y_axis_label) : null; //if you set y axis label then include it in options, otherwise do nothing
  (options.str_x_axis_format) ? options.var_chart_name.xAxis().tickFormat(options.str_x_axis_format) : null; //if you set y axis format then include it in options, otherwise do nothing
  (options.str_y_axis_format) ? options.var_chart_name.yAxis().tickFormat(options.str_y_axis_format) : null; //if you set y axis format then include it in options, otherwise do nothing
  (options.bool_elastic_x) ? options.var_chart_name.elasticX(options.bool_elastic_x) : null; //if you set elastic x then include it in options, otherwise do nothing
  (options.bool_elastic_y) ? options.var_chart_name.elasticY(options.bool_elastic_y) : null; //if you set elastic y then include it in options, otherwise do nothing
  (options.bool_render_area) ? options.var_chart_name.renderArea(options.bool_render_area) : null; //if you set renderArea then include it in options, otherwise do nothing
  (options.bool_render_data_points) ? options.var_chart_name.renderDataPoints(options.bool_render_data_points) : null; //if you set renderDataPoints then include it in options, otherwise do nothing
  (options.bool_render_horizontal_grid_lines) ? options.var_chart_name.renderHorizontalGridLines(options.bool_render_horizontal_grid_lines) : null; //if you set renderHorizontalGridLines then include it in options, otherwise do nothing
  (options.bool_render_vertical_grid_lines) ? options.var_chart_name.renderVerticalGridLines(options.bool_render_vertical_grid_lines) : null; //if you set renderVerticalGridLines then include it in options, otherwise do nothing
  (options.bool_mouse_zoomable) ? options.var_chart_name.mouseZoomable(options.bool_mouse_zoomable) : null; //if you set mouseZoomable then include it in options, otherwise do nothing
  (options.num_clip_padding) ? options.var_chart_name.clipPadding(options.num_clip_padding) : null; //if you set clipPadding then include it in options, otherwise do nothing
  (options.var_value_accessor) ? options.var_chart_name.valueAccessor(options.var_value_accessor) : null;
  (options.var_render_data_points) ? options.var_chart_name.renderDataPoints(options.var_render_data_points) : null;
  (options.var_key_accessor) ? options.var_chart_name.keyAccessor(options.var_key_accessor) : null;
  (options.var_x_ordering) ? options.var_chart_name.ordering(options.var_x_ordering) : null;
  (options.var_dash_style) ? options.var_chart_name.dashStyle(options.var_dash_style) : null;
  (options.var_colors) ? options.var_chart_name.colors(options.var_colors) : null; //if you set colors function then include it in options, otherwise do nothing
};
