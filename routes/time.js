const express = require("express");
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        // console.log(req);
        let localTime = new Date();

        let usHour = parseInt(localTime.toLocaleString("en-US", {
            timeZone: 'America/Los_Angeles',
            hour: 'numeric',
            hour12: false
        }));
        let usMin = parseInt(localTime.toLocaleString("en-US", {
            timeZone: 'America/Los_Angeles',
            minute: 'numeric'
        }));
        let usSec = parseInt(localTime.toLocaleString("en-US", {
            timeZone: 'America/Los_Angeles',
            second: "numeric"
        }));
        if (usHour < 8) {
            usHour = usHour + 24;
        }
        console.log(usHour, usMin, usSec)
        let counted_seconds = 86400 - ((usHour - 8) * 3600 + usMin * 60 + usSec);
        console.log('left time', counted_seconds)
        res
            .status(200)
            .json({leftTime:counted_seconds});
    } catch (error) {
        res
            .status(500)
            .json({error});
    }
});

module.exports = router;