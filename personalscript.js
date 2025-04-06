// No API Key, Sheet ID, or Range needed here!

const sheetData = document.getElementById('sheet-data');
// Paste the Google Apps Script Web App URL you copied here
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxLBZ-ktL_OTaJYb9t3SWEGTHasmMOHTSf34EdJrA-CGBxDX5D6F-Oi0bFtWySn6Jy0/exec'; // <-- IMPORTANT

async function loadSheetData() {
  const url = WEB_APP_URL;

  sheetData.innerHTML = '<p>Loading data...</p>';

  try {
    const response = await fetch(url);

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ error: 'Failed to fetch data from Apps Script.' }));
       throw new Error(`Error ${response.status}: ${errorData.error || 'Unknown server error'}`);
    }

    const data = await response.json();

    // Check if the Apps Script returned an error structure
    if (data.error) {
      throw new Error(`Apps Script Error: ${data.error}`);
    }

    if (!data.values || data.values.length === 0) {
      sheetData.innerHTML = '<p>No data found in the sheet.</p>';
      return;
    }

    // --- Table building logic remains the same as before ---
    const table = document.createElement('table');
    const [headers, ...rows] = data.values;

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      for (let i = 0; i < headers.length; i++) {
         const td = document.createElement('td');
         td.textContent = row[i] || '';
         tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    sheetData.innerHTML = '';
    sheetData.appendChild(table);
    // --- End of table building logic ---

  } catch (error) {
    console.error('Error loading sheet data:', error);
    sheetData.innerHTML = `<p>Error loading data: ${error.message}. Please check console.</p>`;
  }
}

loadSheetData();
