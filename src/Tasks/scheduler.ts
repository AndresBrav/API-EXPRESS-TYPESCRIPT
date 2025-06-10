import cron from 'node-cron';
import { downloadAutomaticFiles } from '../Services/cars/schedulerCars';

// cron.schedule('* * * * *', async () => {
//     downloadAutomaticFiles()    /* download from ftp */
// });

cron.schedule('*/10 * * * * *', async () => {
    // console.log("first step")
    downloadAutomaticFiles(); /* download from ftp */
});
