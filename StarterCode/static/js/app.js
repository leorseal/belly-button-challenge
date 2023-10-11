// Constants for data URLs
const DATA_URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initialization function
function init() {
    d3.json(DATA_URL).then(function (data) {
        const names = data.names;
        const dropdown = d3.select('#selDataset');
        names.forEach(name => dropdown.append('option').text(name));
        const initialId = names[0];
        updatePlotly(initialId);
    });
}

// Update the plot
function updatePlotly(id) {
    d3.json(DATA_URL).then(function (data) {
        const samples = data.samples.find(sample => sample.id === id);
        const { sample_values, otu_ids, otu_labels } = samples;

        const metadata = data.metadata.find(metadata => metadata.id === parseInt(id));
        displayDemographicInfo(metadata);

        createBarChart(sample_values, otu_ids, otu_labels);
        createBubbleChart(otu_ids, sample_values, otu_labels);
        plotGaugeChart(metadata.wfreq);
    });
}

// Display demographic information
function displayDemographicInfo(metadata) {
    const sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html('');
    Object.entries(metadata).forEach(([key, value]) => {
        sampleMetadata.append('p').text(`${key}: ${value}`);
    });
}

// Create the bar chart
function createBarChart(values, ids, labels) {
    const trace1 = {
        x: values.slice(0, 10).reverse(),
        y: ids.slice(0, 10).map(id => "OTU " + id).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: 'DeepSkyBlue',  // Changed from numeric to word form
            opacity: 0.6,
            line: {
                color: 'DarkBlue',  // Changed from numeric to word form
                width: 1.5
            }
        }
    };

    const layout1 = {
        title: '<b>Top 10 OTU</b>',
    };

    const data = [trace1];
    Plotly.newPlot('bar', data, layout1);
}

// Create the bubble chart
function createBubbleChart(otu_ids, sample_values, otu_labels) {
    const trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    };

    const layout2 = {
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

    const data2 = [trace2];
    Plotly.newPlot('bubble', data2, layout2);
}

// Create the gauge chart
function plotGaugeChart(wFreq) {
    const level = wFreq * 20;
    const degrees = 180 - level;
    const radius = 0.5;
    const radians = (degrees * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    const mainPath = 'M -.0 -0.05 L .0 0.05 L ';
    const pathX = String(x);
    const space = ' ';
    const pathY = String(y);
    const pathEnd = ' Z';
    const path = mainPath.concat(pathX, space, pathY, pathEnd);

    const dataGauge = [
        {
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { size: 28, color: 'DarkRed' },  // Changed from numeric to word form
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
                    'LimeGreen',
                    'Lime',
                    'YellowGreen',
                    'Chartreuse',
                    'LightGoldenRodYellow',
                    'LightGray',
                    'LightGray',
                    'LightGray',
                    'LightGray',
                    'RoyalBlue',  // Changed from numeric to word form
                ],
            },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
        },
    ];

    const layoutGauge = {
        shapes: [
            {
                type: 'path',
                path: path,
                fillcolor: 'LimeGreen',  // Changed from numeric to word form
                line: { color: 'Black' },  // Changed from numeric to word form
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

    const data = [dataGauge];
    Plotly.newPlot('gauge', data, layoutGauge);
}

// Call updatePlotly
function optionChanged(id) {
    updatePlotly(id);
}

init();
