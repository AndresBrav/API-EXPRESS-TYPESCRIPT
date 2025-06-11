import cron from 'node-cron';
import { downloadAutomaticFiles } from '../Services/Scheduler/schedulerCars';
import { processedAuthomaticFiles } from '../Services/Scheduler/processedFiles';

// cron.schedule('*/10 * * * * *', async () => {
//     /* download from ftp */
//     downloadAutomaticFiles();
// }); 

cron.schedule('*/10 * * * * *', async () => {
    processedAuthomaticFiles();
});
