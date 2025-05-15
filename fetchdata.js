const axios = require('axios');

const sheetId = '1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4'; 
const vendorSheet = 'Sheet1';  
const departmentSheet = 'Sheet2'; 

async function fetchGoogleSheet(sheetName) {
    try {
        console.log(`Fetching data from ${sheetName}...`);
        const sheeturl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq&sheet=${sheetName}`;
        const response = await fetch(sheetUrl, { mode: 'no-cors' }); 
       
        if (!response.data) {
            throw new Error(`No data returned from ${sheetName}`);
        }

       
        const jsonData = JSON.parse(response.data.substring(47, response.data.length - 2));

      
        if (!jsonData.table || !jsonData.table.rows) {
            throw new Error(`Invalid data format in ${sheetName}`);
        }

        return jsonData.table.rows.map(row => row.c.map(cell => cell?.v?.trim())).filter(row => row.length);
    } catch (error) {
        console.error(`Error fetching sheet ${sheetName}:`, error.message);
        return [];
    }
}

async function fetchSheetData() {
    const vendorData = await fetchGoogleSheet(vendorSheet);
    const departmentData = await fetchGoogleSheet(departmentSheet);

    console.log('Extracted Vendor Names:', vendorData.map(row => row[0])); 
    console.log('Extracted Departments & HODs:', departmentData.map(row => ({ department: row[0], hod: row[1] }))); 
}

fetchSheetData();
