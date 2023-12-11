const express = require("express");
const router = express.Router();
const {GoogleAuth} = require('google-auth-library');
// const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const {BetaAnalyticsDataClient} = require('@google-analytics/data').v1beta;

const auth = new GoogleAuth({keyFilename: './c.json'});


var response = [];
var currentVisitors = 0;
const getVisitors = async () => {
    // console.log("getting visitors")
    const analyticsDataClient = new BetaAnalyticsDataClient({auth});
    [response] =  await analyticsDataClient.runRealtimeReport({
    property: `properties/${418797833}`,
    dateRanges: [{ "startDate": "30minutesAgo", "endDate": "today" }],
    metrics: [
        {
            name: 'activeUsers',
        },
        // Add more metrics as needed
    ]
    });
    currentVisitors = 0
    if(response.rowCount>0){
        currentVisitors = response.rows[0].metricValues[0].value
    }
    // console.log("current visitors: " + currentVisitors)
}
const getVisitorsPerPage = async () => {
    const analyticsDataClient = new BetaAnalyticsDataClient({auth});
    [response] =  await analyticsDataClient.runRealtimeReport({
    property: `properties/${418797833}`,
    dateRanges: [{ "startDate": "30minutesAgo", "endDate": "today" }],
    dimensions: [{ name: "unifiedScreenName" }],
    metrics: [
        {
            name: 'eventCount',
        },
        {
            name: 'activeUsers',
        },
        // Add more metrics as needed
    ]
    });
    console.log(response)
}
getVisitors()
// getVisitorsPerPage()
setInterval(getVisitors, 2000)

// async function callRunRealtimeReport() {
      
//         // Instantiates a client
//         const dataClient = new BetaAnalyticsDataClient({auth});
//     // Construct request
//     const request = {
//     };

//     // Run request
//     const response = await dataClient.runRealtimeReport(request);
//     console.log(response);
//   }

//   callRunRealtimeReport();

router.get('/', async(req, res) => {
    try {
        // console.log(req);
        console.log("current visitors: " + currentVisitors)
        res
            .status(200)
            .json({currentVisitors});
    } catch (error) {
        res
            .status(500)
            .json({error});
    }
});

module.exports = router;