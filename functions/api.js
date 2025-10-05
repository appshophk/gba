import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();

const fs = require('fs');
const path = require('path');
// const counterFile = path.join(__dirname, 'visitor_count.txt');
const counterFile = path.join('/tmp', 'visitor_count.txt');

router.get("/hello", (req, res) => res.send("Hello World!"));

function getVisitorCount(req, res) {
    try {
        // Get visitor's IP address
        const visitorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Initialize counter file if it doesn't exist
        if (!fs.existsSync(counterFile)) {
            fs.writeFileSync(counterFile, '0');
        }

        // Read and update visitor count atomically
        let totalVisitors = 0;
        const fd = fs.openSync(counterFile, 'r+');
        const buffer = Buffer.alloc(32);
        const bytesRead = fs.readSync(fd, buffer, 0, 32, 0);
        const countData = buffer.toString('utf-8', 0, bytesRead).trim();
        totalVisitors = parseInt(countData, 10) || 0;

        // IP tracking logic (commented for now)
        /*
        if (!fs.existsSync(visitorsFile)) {
            fs.writeFileSync(visitorsFile, '');
        }

        const visitors = fs.readFileSync(visitorsFile, 'utf-8')
                            .split('\n')
                            .map(ip => ip.trim())
                            .filter(ip => ip.length > 0);

        if (!visitors.includes(visitorIp)) {
            totalVisitors++;
            fs.appendFileSync(visitorsFile, visitorIp + '\n');
        }
        */

        // Always increment, per your PHP logic
        totalVisitors++;

        // Update the counter file
        fs.ftruncateSync(fd, 0);
        fs.writeSync(fd, totalVisitors.toString(), 0);
        fs.closeSync(fd);

        res.json({ totalVisitors });
    } catch (err) {
        console.error('Visitor counter error:', err);
        // Return last known count or 0
        // let totalVisitors = 0;
        let totalVisitors = 1000;
        if (fs.existsSync(counterFile)) {
            totalVisitors = parseInt(fs.readFileSync(counterFile, 'utf-8'), 10) || 0;
        }
        res.json({ totalVisitors, err });
    }
}

router.get('/getVisitorCount', getVisitorCount);

api.use("/api/", router);

export const handler = serverless(api);
