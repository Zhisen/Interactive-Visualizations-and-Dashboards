function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json(`/metadata/${sample}`).then(function(data){
// Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {
      panel.append('h6').text(`${key}: ${value}`)
    });

})}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    var label  = data.otu_ids.slice(0,10);
    var value = data.sample_values.slice(0,10);
    var text = data.otu_labels.slice(0,10);
    trace_pie = [{
      values: value,
      labels: label,
      hovertext: text,
      hoverinfo: 'hovertext',
      type: 'pie'
    }];
    var layout = {margin: {t: 0, l: 0}};
    Plotly.newPlot('pie',trace_pie,layout);

    var trace_bubble = [{
      x:data.otu_ids,
      y:data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker:{
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: 'Earth'
      }
    
    }];
    var bubble_layout = {
      marin: {t: 0},
      hovermode: 'closest',
      xaxis: {title:'OTU ID'}
    }
    Plotly.newPlot('bubble', trace_bubble, bubble_layout);
  })
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
