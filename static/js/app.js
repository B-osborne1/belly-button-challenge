// Use D3 to fetch the JSON data containing IDs
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
  // Extract the IDs from the fetched data
  let ids = data.names;

  // Get the select element by its ID
  let selectElement = document.getElementById("selDataset");

  // Populate the dropdown menu with the fetched IDs
  ids.forEach(id => {
    let option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    selectElement.appendChild(option);
  });
}).catch(function(error) {
  console.error("Error fetching data:", error);
});

function optionChanged(selectedValue) {
  // Code to handle the change event goes here
  console.log("Selected value:", selectedValue);
}