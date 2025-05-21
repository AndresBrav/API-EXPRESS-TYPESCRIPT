import cron from 'node-cron'
import { downloadAutomaticFiles } from '../Services/cars/schedulerCars';

cron.schedule('0 */2 * * *', async () => {
    // console.log('this task is executed every 2 minute');

    downloadAutomaticFiles()    /* download from ftp */
});