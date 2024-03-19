// Function to fetch data and initialize the page
function fetchDataAndInitialize() {
  // Use D3 to fetch the JSON data containing IDs and samples
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
      .then(function(data) {
          console.log("Data:", data);

          // Extract the IDs from the fetched data
          let ids = data.names;

          // Get the select element by its ID
          let selectElement = document.getElementById("selDataset");
          console.log("Select Element:", selectElement); // Check if select element is retrieved

          // Populate the dropdown menu with the fetched IDs
          ids.forEach(id => {
              let option = document.createElement("option");
              option.value = id;
              option.textContent = id;
              selectElement.appendChild(option);
          });

          console.log("Dropdown Menu Populated"); // Check if dropdown menu is populated successfully

          // Display metadata for the default ID (e.g., ID940)
          displayMetadata('940'); // Assuming ID940 is the default ID

          // Create the chart for the default ID
          fetchDataAndCreateCharts('940'); // Assuming ID940 is the default ID
      })
      .catch(function(error) {
          console.log("Error fetching data:", error);
      });
}

// Function to fetch data and create bar chart
function fetchDataAndCreateCharts(selectedValue) {
  fetchDataAndCreateBarChart(selectedValue);
  fetchDataAndCreateBubbleChart(selectedValue);
}

// Function to fetch data and create bar chart
function fetchDataAndCreateBarChart(selectedValue) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
      .then(function(data) {
          console.log("Data:", data);

          // Find the selected data based on the ID
          let selectedData = data.samples.find(sample => sample.id === selectedValue);

          // Sort the data based on sample_values in descending order
          selectedData.otu_ids = selectedData.otu_ids.slice(0, 10).reverse();
          selectedData.sample_values = selectedData.sample_values.slice(0, 10).reverse();
          selectedData.otu_labels = selectedData.otu_labels.slice(0, 10).reverse();

          // Order OTU IDs by sample values
          let sortedIndices = selectedData.sample_values.map((_, i) => i).sort((a, b) => selectedData.sample_values[b] - selectedData.sample_values[a]);
          selectedData.otu_ids = sortedIndices.map(index => selectedData.otu_ids[index]);
          selectedData.sample_values = sortedIndices.map(index => selectedData.sample_values[index]);
          selectedData.otu_labels = sortedIndices.map(index => selectedData.otu_labels[index]);

          // Create the bar chart using the selected data
          createBarChart(selectedData);
      })
      .catch(function(error) {
          console.log("Error fetching data:", error);
      });
}

// Function to create the bar chart using Plotly
function createBarChart(selectedData) {
  var trace1 = {
      y: selectedData.otu_ids.map(String), // Convert to string to force categorical type
      x: selectedData.sample_values, // Switched x and y
      type: 'bar',
      orientation: 'h', // Set orientation to horizontal
      text: selectedData.otu_labels.map((label, index) => `${label}: ${selectedData.sample_values[index].toFixed(2)} units`),
      marker: {
          color: 'rgb(142,124,195)'
      }
  };

  var data = [trace1];

  var layout = {
      title: 'Top 10 OTU IDs based on number of specimens for subjectID ' + selectedData.id,
      font: {
          family: 'Raleway, sans-serif'
      },
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

// Function to fetch data and create bubble chart
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
  var trace1 = {
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

  var data = [trace1];

  var layout = {
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

// Function to handle the change event of the dropdown menu
function optionChanged(selectedValue) {
  console.log("Selected value:", selectedValue);
  // Call fetchDataAndCreateChart function with the selected ID
  fetchDataAndCreateCharts(selectedValue);

  // Display metadata for the selected ID
  displayMetadata(selectedValue);
}

// Function to display metadata for the selected ID
function displayMetadata(selectedValue) {
  // Use D3 to fetch the JSON data containing IDs and metadata
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
      .then(function(data) {
          // Find the metadata for the selected ID
          let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedValue));
          console.log("Selected Metadata:", selectedMetadata); // Check selected metadata

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

// Call fetchDataAndInitialize to initialize the page
fetchDataAndInitialize();
