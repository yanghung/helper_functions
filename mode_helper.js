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
