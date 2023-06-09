fetch('convert.json')
  .then(response => response.json())
  .then(data => {
    const searchinput = document.getElementById('inputbar');
    const searchwrapper = document.querySelector('.search-input');
    const resultwrapper = document.querySelector('#searchResults');
    const tableWrapper = document.querySelector('.table-wrapper');
    let results = [];

    searchinput.addEventListener('keyup', (e) => {
      results = [];
      let input = searchinput.value;
      if (input.length) {
        results = data.filter(item => item.schemeName.toLowerCase().includes(input.toLowerCase()));
      }
      renderResults(results);
    });
document.addEventListener('click', (e) => {
      const target = e.target;
      if (!searchwrapper.contains(target)) {
        searchwrapper.classList.remove('show');
        resultwrapper.innerHTML = '';
      }
});
    function renderResults(results) {
      if (!results.length) {
        searchwrapper.classList.remove('show');
        resultwrapper.innerHTML = '';
      } else {
        let content = results.map((item) => {
          return `<li><a href="#" data-scheme="${item.schemeCode}">${item.schemeName}</a></li>`;
        }).join('');
        console.log(content);

        searchwrapper.classList.add('show');
        resultwrapper.innerHTML = `<ul>${content}</ul>`;

        // Add event listeners to each search result link
        const resultLinks = resultwrapper.querySelectorAll('a');
        resultLinks.forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const schemeCode = link.getAttribute('data-scheme');
            fetchSchemeData(schemeCode);
          });
        });
      }
    }

    function fetchSchemeData(schemeCode) {
      const apiUrl = `https://api.mfapi.in/mf/${schemeCode}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const metaData = data.meta;
          const schemeData = data.data;

          // Clear previous table data
          tableWrapper.innerHTML = '';

          // Create the table
          const table = document.createElement('table');
          table.classList.add('data-table');

          // Create table header
          const tableHeader = document.createElement('thead');
          const headerRow = document.createElement('tr');
          const headerCols = ['Date', 'Net Asset Value'];

          headerCols.forEach((col) => {
            const headerCol = document.createElement('th');
            headerCol.textContent = col;
            headerRow.appendChild(headerCol);
          });

          tableHeader.appendChild(headerRow);
          table.appendChild(tableHeader);

          // Create table body
          const tableBody = document.createElement('tbody');
          if (schemeData.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = headerCols.length;
            emptyCell.textContent = 'No data available';
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
          } else {
            schemeData.forEach((item) => {
              const row = document.createElement('tr');
              const dateCell = document.createElement('td');
              const navCell = document.createElement('td');

              dateCell.textContent = item.date;
              navCell.textContent = item.nav;

              row.appendChild(dateCell);
              row.appendChild(navCell);
              tableBody.appendChild(row);
            });
          }

          table.appendChild(tableBody);
          tableWrapper.appendChild(table);
        })
        .catch(error => {
          console.log('Error fetching scheme data:', error);
        });
    }
  });


// Add event listener to the Clear button
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearTable);

function clearTable() {
  const tableWrapper = document.querySelector('.table-wrapper');
  const searchInput = document.getElementById('inputbar');

  tableWrapper.innerHTML = '';
  searchInput.value = '';
}