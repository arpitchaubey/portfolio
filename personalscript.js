const sheetDataContainer = document.getElementById('sheet-data');

// --- IMPORTANT: PASTE YOUR COPIED WEB APP URL BELOW ---
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxptnw5huIkJ1tB4GmK3SfNj6HA3nfvyrGOdFbY-k4YcAdQ6-bwbEQ4y_G3sGp6MRip/exec';
// --- Example: const WEB_APP_URL = 'https://script.google.com/macros/s/AKfyc.../exec'; ---

async function loadSheetData() {
  // Basic check if the URL placeholder was replaced
  if (!WEB_APP_URL || WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbxptnw5huIkJ1tB4GmK3SfNj6HA3nfvyrGOdFbY-k4YcAdQ6-bwbEQ4y_G3sGp6MRip/exec') {
    sheetDataContainer.innerHTML = '<p style="color: red;">Error: Web App URL not set in script.js</p>';
    return;
  }

  sheetDataContainer.innerHTML = '<p>Loading data...</p>'; // Show loading message

  try {
    const response = await fetch(WEB_APP_URL);

    // Check if the fetch itself failed (network error, invalid URL etc.)
    if (!response.ok) {
       // Try to get error details from response, fallback to status text
       let errorMsg = `HTTP error! Status: ${response.status} ${response.statusText}`;
       try {
            const errorData = await response.json();
            // Use error message from Apps Script if available
            if(errorData && errorData.error) {
                errorMsg = `Error ${response.status}: ${errorData.error}`;
            }
       } catch(jsonError) {
            // Ignore if response wasn't JSON
            console.debug("Response was not JSON, using status text for error.");
       }
       throw new Error(errorMsg);
    }

    const data = await response.json();

    // Check if the Apps Script explicitly returned an error property in the JSON
    if (data.error) {
      throw new Error(`Apps Script Error: ${data.error}`);
    }

    // Check if the expected 'values' array is present and has data
    if (!data.values || data.values.length === 0) {
      sheetDataContainer.innerHTML = '<p>No data found in the specified sheet range.</p>';
      return;
    }

    // --- Build HTML Table ---
    const table = document.createElement('table');
    const [headers, ...rows] = data.values; // Assumes first row is headers

    // Create Table Header (thead)
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Create Table Body (tbody)
    const tbody = table.createTBody();
    rows.forEach(rowData => {
      const tr = tbody.insertRow();
      // Use headers.length to ensure correct number of cells even if row data is shorter
      for (let i = 0; i < headers.length; i++) {
         const td = tr.insertCell();
         // Use data from rowData if it exists, otherwise empty string
         td.textContent = rowData[i] !== undefined && rowData[i] !== null ? rowData[i] : '';
      }
    });

    // Clear loading message and display table
    sheetDataContainer.innerHTML = '';
    sheetDataContainer.appendChild(table);
    // --- End of Table Building ---

  } catch (error) {
    console.error('Error loading sheet data:', error);
    // Display specific error message caught
    sheetDataContainer.innerHTML = `<p style="color: red;">Error loading data: ${error.message}. Please check the console (F12) for more details.</p>`;
  }
}

// Run the function when the script loads
loadSheetData();
