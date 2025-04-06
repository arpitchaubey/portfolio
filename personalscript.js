const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual key
const SHEET_ID = '1XVpInTQfLufDF1JQBVlYiu3lQWto905z4Hdn6I81ePc';
const RANGE = 'PersonalSpace!A1:E100';

const sheetData = document.getElementById('sheet-data');

async function loadSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      sheetData.innerHTML = '<p>No data found in the sheet.</p>';
      return;
    }

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
      headers.forEach((_, i) => {
        const td = document.createElement('td');
        td.textContent = row[i] || '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    sheetData.innerHTML = '';
    sheetData.appendChild(table);
  } catch (error) {
    console.error('Error loading sheet data:', error);
    sheetData.innerHTML = '<p>Error loading data. Please check your API key or sheet permissions.</p>';
  }
}

loadSheetData();
