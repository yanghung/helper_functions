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
