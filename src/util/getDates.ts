export function getBoliviaDateAsSQLString(): string {
    const now = new Date();

    const boliviaTimeStr = now.toLocaleString('en-US', {
        timeZone: 'America/La_Paz',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // boliviaTimeStr = '05/14/2025, 10:31:15'
    // We convert that to sql format: '2025-05-14 10:31:15'

    const [datePart, timePart] = boliviaTimeStr.split(', ');
    const [month, day, year] = datePart.split('/');

    return `${year}-${month}-${day} ${timePart}`;
}