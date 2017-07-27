/*
Helper functions to use in mode dataviz proof of concept
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
}


function addToDropdown(the_list, dropdown_html_id) {
  for (var i=0; i<the_list.length; i++) {
    var opt = document.createElement('option');
    var the_value=the_list[i];
    opt.value = the_value;
    opt.innerHTML = the_value;
    document.getElementById(dropdown_html_id).appendChild(opt);
  }
}
