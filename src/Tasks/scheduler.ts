import cron from 'node-cron'
import { downloadAutomaticFiles } from '../Services/cars/schedulerCars';

cron.schedule('* * * * *', async () => {
    // console.log('this task is executed every minute');

    downloadAutomaticFiles()    /* download from ftp */
});