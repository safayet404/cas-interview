// Function to convert UTC string to User's Local Time
export const formatLocalTime = (isoString) => {
    if (!isoString) return 'N/A';

    const date = new Date(isoString);

    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};