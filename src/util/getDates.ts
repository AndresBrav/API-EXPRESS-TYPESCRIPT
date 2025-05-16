
export const getBoliviaDate = (): Date => {
    const date = new Date();
    // Set the time to the Bolivian time zone (UTC-4)
    const offset = -4 * 60; // UTC-4 in minutes
    const boliviaTime: Date = new Date(date.getTime() + offset * 60 * 1000);
    return boliviaTime
}