import cron from 'node-cron';
import { downloadAutomaticFiles } from '../Services/Scheduler/schedulerCars';
import { processedAuthomaticFiles } from '../Services/Scheduler/processedFiles';

// cron.schedule('*/40 * * * * *', async () => {
//     /* download from ftp */
//     await downloadAutomaticFiles();
// });

// cron.schedule('*/10 * * * * *', async () => {
//     await processedAuthomaticFiles();
// });
