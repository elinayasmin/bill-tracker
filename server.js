const express = require('express');
const cors = require('cors'); 
const axios = require('axios');

const app = express();
app.use(cors()); 

const sheetId = '1gjHDxitgSFzSfnhfY_OK9Urjm--4MaOf1wsc9je6-C4'; 
const vendorSheet = 'Sheet1';
const departmentSheet = 'Sheet2';

async function fetchGoogleSheet(sheetName) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq&sheet=${sheetName}`;
        const response = await axios.get(url);
        
        if (!response.data) throw new Error(`No data returned from ${sheetName}`);

        const jsonData = JSON.parse(response.data.substring(47, response.data.length - 2));
        if (!jsonData.table || !jsonData.table.rows) throw new Error(`Invalid format in ${sheetName}`);

        return jsonData.table.rows.map(row => row.c.map(cell => cell?.v?.trim())).filter(row => row.length);
    } catch (error) {
        console.error(`Error fetching ${sheetName}:`, error.message);
        return [];
    }
}

app.get('/vendors', async (req, res) => {
    const vendorData = await fetchGoogleSheet(vendorSheet);
    res.json({ vendors: vendorData.map(row => row[0]) });
});

app.get('/departments', async (req, res) => {
    const departmentData = await fetchGoogleSheet(departmentSheet);
    res.json({ departments: departmentData.map(row => ({ department: row[0], hod: row[1] })) });
});



const PORT = 5000; 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
