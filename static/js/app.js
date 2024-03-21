//Defining a function for the variables, and setting up the initial 940 information on entry to page 
function fetchDataAndInitialize() {
    // Grabbing Data from website and sending to console:
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then(function(data) {
        console.log("Data:", data);

        //Define variables:
        let ids = data.names;

        // Connecting to the HTML drop-down menu
        let selectElement = document.getElementById("selDataset");

            // Populate the dropdown menu with the fetched IDs
            ids.forEach(id => {
                let option = document.createElement("option"); //For each ID make a dropdown option
                option.value = id;
                option.textContent = id; //Dropdown option name = ID number
                selectElement.appendChild(option); //Apply changes to dropdown
            });
            console.log("Dropdown Menu Populated");
            
            // Showing information for intial 940 based on future functions:
            displayInfo('940'); // Demographic information
            fetchDataAndCreateBarChart('940'); //Bar-chart
            fetchDataAndCreateBubbleChart('940'); //Bubble-chart
        })
        .catch(function(error) {
            console.log("Error fetching data:", error);
        });
    }


// Function to create bar chart
function fetchDataAndCreateBarChart(selectedValue) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json") //Connect to data
        .then(function(data) {
            //Matching the dropdown menu with the necessary ID data
            let selectedData = data.samples.find(sample => sample.id === selectedValue); 
  
            // Sort the data based on sample_values in descending order
            selectedData.otu_ids = selectedData.otu_ids.slice(0, 10).reverse();
            selectedData.sample_values = selectedData.sample_values.slice(0, 10).reverse();
            selectedData.otu_labels = selectedData.otu_labels.slice(0, 10).reverse();
  
            // Order OTU IDs by sample values (assisted by AI)
            let sortedIndices = selectedData.sample_values.map((_, i) => i).sort((a, b) => selectedData.sample_values[b] - selectedData.sample_values[a]);
            selectedData.otu_ids = sortedIndices.map(index => selectedData.otu_ids[index]);
            selectedData.sample_values = sortedIndices.map(index => selectedData.sample_values[index]);
            selectedData.otu_labels = sortedIndices.map(index => selectedData.otu_labels[index]);
  
            // Create the bar chart using the selected data
            createBarChart(selectedData);
        })
  }
  
// Function to format the bar-chart (Base code sourced from Plotly)
function createBarChart(selectedData) {
    let trace1 = {
        y: selectedData.otu_ids.map(String), // Convert to string to force categorical type
        x: selectedData.sample_values, 
        type: 'bar',
        orientation: 'h', // Set orientation to horizontal
        text: selectedData.otu_labels.map((label, index) => `${label}: ${selectedData.sample_values[index].toFixed(2)} units`), // Hover text
        marker: {
            color: 'rgb(142,124,195)'
        } //Purple styling
    };
  
    let data = [trace1];
  
    let layout = {
        title: 'Top 10 OTU IDs based on number of specimens for subjectID ' + selectedData.id, //Title + ID number
        font: {
            family: 'Raleway, sans-serif'
        }, //Default text from source
        showlegend: false,
        xaxis: {
            title: 'Sample Values' // Label x-axis
        },
        yaxis: {
            title: 'OTU IDs', // Label y-axis
            type: 'category', // Force categorical type
            zeroline: false,
            gridwidth: 2,
            autorange: 'reversed' // Reverse the order of categories
        },
        bargap: 0.05,
        width: 1000, // Adjust width (double the width)
        height: 400 // Adjust height
    };
  
    // Plot the horizontal bar chart
    Plotly.newPlot('bar', data, layout);
  }

// Function to fetch data and create bubble chart (Base code sourced from Plotly)
function fetchDataAndCreateBubbleChart(selectedValue) {
        d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
            .then(function(data) {
                let selectedData = data.samples.find(sample => sample.id === selectedValue);
                createBubbleChart(selectedData);
            })
            .catch(function(error) {
                console.log("Error fetching data:", error);
            });
    }

    // Function to create the bubble chart using Plotly
function createBubbleChart(selectedData) {
    let trace1 = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        mode: 'markers',
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: 'Earth'
        },
        text: selectedData.otu_labels
    };

    let data = [trace1];

    let layout = {
        title: 'Bubble Chart for subjectID ' + selectedData.id,
        xaxis: {
            title: 'OTU IDs' // Label x-axis
        },
        yaxis: {
            title: 'Sample Values' // Label y-axis
        }
    };

    Plotly.newPlot('bubble', data, layout);
    }


// Function to display metadata for the selected ID (Assisted with AI)
function displayInfo(selectedValue) {
    // Use D3 to fetch the JSON data containing IDs and metadata
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then(function(data) {
            // Find the metadata for the selected ID
            let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedValue));
  
            // Get the sample-metadata element
            let metadataElement = document.getElementById("sample-metadata");
            console.log("Metadata Element:", metadataElement); // Check metadata element
            metadataElement.innerHTML = ""; // Clear previous metadata
  
            // Iterate over the key-value pairs in the metadata and append them to the HTML
            Object.entries(selectedMetadata).forEach(([key, value]) => {
                let p = document.createElement("p");
                p.textContent = `${key}: ${value}`;
                metadataElement.appendChild(p);
            });
        })
        .catch(function(error) {
            console.log("Error fetching metadata:", error);
        });
  }


// Function to handle the change event of the dropdown menu
function optionChanged(selectedValue) {
    // Reflects the graphs and metadata for the newly selectedd ID
    fetchDataAndCreateBarChart(selectedValue);
    fetchDataAndCreateBubbleChart(selectedValue);
  
    // Display metadata for the selected ID
    displayInfo(selectedValue);  
  }


fetchDataAndInitialize();