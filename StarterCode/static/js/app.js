// Display the default plot
function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        // Create array to hold all names (all ID names)
        var names = data.names;
        // Append an option in the dropdown
        var dropdown = d3.select('#selDataset');
        names.forEach(function (name) {
            dropdown.append('option').text(name);
        });

        // Get the initial ID to display
        var initialId = names[0];

        // Call the updatePlotly function with the initial ID
        updatePlotly(initialId);
    });
}

// Update the plot 
function updatePlotly(id) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        // Get the sample data
        var samples = data.samples.filter(sample => sample.id === id)[0];
        var sample_values = samples.sample_values;
        var otu_ids = samples.otu_ids;
        var otu_labels = samples.otu_labels;

        // Get the demographic information
        var metadata = data.metadata.filter(metadata => metadata.id === parseInt(id))[0];
        displayDemographicInfo(metadata);

        // Create Bar Chart
        createBarChart(sample_values, otu_ids, otu_labels);

        // Create a bubble chart
        createBubbleChart(otu_ids, sample_values, otu_labels);

        // Plot the weekly washing frequency in a gauge chart
        plotGaugeChart(metadata.wfreq);
    });
}

function displayDemographicInfo(metadata) {
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html('');
    Object.entries(metadata).forEach(([key, value]) => {
        sampleMetadata.append('p').text(`${key}: ${value}`);
    });
}

function createBarChart(values, ids, labels) {
    var trace1 = {
        x: values.slice(0, 10).reverse(),
        y: ids.slice(0, 10).map(id => "OTU " + id).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: 'rgb(27, 161, 187)',
            opacity: 0.6,
            line: {
                color: 'rgb(8, 48, 107)',
                width: 1.5
            }
        }
    };

    var layout1 = {
        title: '<b>Top 10 OTU</b>',
    };

    var data = [trace1];
    Plotly.newPlot('bar', data, layout1);
}

function createBubbleChart(otu_ids, sample_values, otu_labels) {
    var trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    };

    var layout2 = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
        autosize: true,
        showlegend: false,
        margin: {
            l: 150,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        }
    };

    var data2 = [trace2];
    Plotly.newPlot('bubble', data2, layout2);
}

function plotGaugeChart(wFreq) {
    var level = wFreq * 20;

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: creating a triangle
    var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var dataGauge = [
        {
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { size: 28, color: '850000' },
            showlegend: false,
            name: 'Washing Frequency',
            text: level,
            hoverinfo: 'text+name',
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: [
                    'rgba(14, 127, 0, .5)',
                    'rgba(110, 154, 22, .5)',
                    'rgba(170, 202, 42, .5)',
                    'rgba(202, 209, 95, .5)',
                    'rgba(210, 206, 145, .5)',
                    'rgba(232, 226, 202, .5)',
                    'rgba(232, 226, 202, .5)',
                    'rgba(232, 226, 202, .5)',
                    'rgba(232, 226, 202, .5)',
                    'rgba(255, 255, 255, 0)',
                ],
            },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
        },
    ];

    var layoutGauge = {
        shapes: [
            {
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: { color: '850000' },
            },
        ],
        title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        height: 400,
        width: 400,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1],
        },
        yaxis: {
            zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1],
    },
};

var data = [dataGauge];

Plotly.newPlot('gauge', data, layoutGauge);
}

// Call updatePlotly
function optionChanged(id) {
    updatePlotly(id);
}

init();
