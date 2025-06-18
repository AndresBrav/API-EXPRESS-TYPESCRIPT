import cron from 'node-cron';
import { downloadAutomaticFiles } from '../Services/Scheduler/schedulerCars';
import { interpretedAuthomaticFiles } from '../Services/Scheduler/interpretedFiles';
import { processedAuthomticFiles } from '../Services/Scheduler/processedFiles';
import { reloadDataBase } from '../Services/Scheduler/loadFiles';

// cron.schedule('0 */2 * * *', async () => {
//     /* download from ftp */
//     await downloadAutomaticFiles();
// });

cron.schedule('*/5 * * * *', async () => {
    /* download from ftp */
    await downloadAutomaticFiles();
});

// every 10 minutes
cron.schedule('*/5 * * * *', async () => {
    await interpretedAuthomaticFiles();
});

// // every 3 hours
// cron.schedule('0 */3 * * *', async () => {
//     await interpretedAuthomaticFiles();
// });

// every 15 minutes
cron.schedule('*/5 * * * *', async () => {
    await processedAuthomticFiles();
});

// cron.schedule('*/10 * * * * *',async () => {
//     await reloadDataBase()
// })

// every 20 minutes
cron.schedule('*/5 * * * *', async () => {
    await reloadDataBase();
});
