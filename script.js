const timezones = [
    { offset: -11, cities: ["Pago Pago", "Midway"] },
    { offset: -10, cities: ["Honolulu", "Papeete", "Tahiti"] },
    { offset: -9, cities: ["Anchorage", "Fairbanks"] },
    { offset: -8, cities: ["Los Angeles", "Vancouver", "Tijuana"] },
    { offset: -7, cities: ["Denver", "Edmonton", "Phoenix"] },
    { offset: -6, cities: ["Mexico City", "Chicago", "Guatemala"] },
    { offset: -5, cities: ["New York", "Lima", "Toronto", "Havana"] },
    { offset: -4, cities: ["Santiago", "Halifax", "Caracas"] },
    { offset: -3, cities: ["São Paulo", "Buenos Aires", "Montevideo"] },
    { offset: -2, cities: ["Fernando de Noronha"] },
    { offset: -1, cities: ["Azores", "Cape Verde"] },
    { offset: 0, cities: ["London", "Lisbon", "Accra", "Dublin"] },
    { offset: 1, cities: ["Paris", "Rome", "Lagos", "Berlin"] },
    { offset: 2, cities: ["Cairo", "Johannesburg", "Athens"] },
    { offset: 3, cities: ["Moscow", "Istanbul", "Nairobi", "Riyadh"] },
    { offset: 4, cities: ["Dubai", "Baku", "Yerevan"] },
    { offset: 5, cities: ["Karachi", "Tashkent", "Maldives"] },
    { offset: 6, cities: ["Dhaka", "Almaty", "Omsk"] },
    { offset: 7, cities: ["Bangkok", "Jakarta", "Hanoi"] },
    { offset: 8, cities: ["Shanghai", "Singapore", "Perth", "Taipei"] },
    { offset: 9, cities: ["Tokyo", "Seoul", "Pyongyang"] },
    { offset: 10, cities: ["Sydney", "Vladivostok", "Guam"] },
    { offset: 11, cities: ["Noumea", "Solomon Is."] },
    { offset: 12, cities: ["Auckland", "Fiji", "Kamchatka"] },
];

function renderTimezones() {
    const timeline = document.getElementById('timeline');
    const totalOffsets = 24;

    timezones.forEach(tz => {
        const percentage = ((tz.offset + 11) / totalOffsets) * 100;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'timezone-info';
        wrapper.style.left = `${percentage}%`;
        wrapper.dataset.offset = tz.offset;

        const point = document.createElement('div');
        point.className = 'timezone-point';

        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-container';

        const phaseIcon = document.createElement('div');
        phaseIcon.className = 'phase-icon';
        phaseIcon.id = `phase-${tz.offset}`;

        const time = document.createElement('div');
        time.className = 'timezone-time';
        time.id = `time-${tz.offset}`;

        const date = document.createElement('div');
        date.className = 'timezone-date';
        date.id = `date-${tz.offset}`;

        const cities = document.createElement('div');
        cities.className = 'timezone-cities';
        cities.innerHTML = tz.cities.join('<br>');

        timeContainer.appendChild(phaseIcon);
        timeContainer.appendChild(time);
        timeContainer.appendChild(date);
        wrapper.appendChild(point);
        wrapper.appendChild(timeContainer);
        wrapper.appendChild(cities);
        timeline.appendChild(wrapper);
    });
}

function updateClocks() {
    const now = new Date();
    document.getElementById('local-time').textContent = now.toLocaleTimeString();

    const localDay = now.getDate();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    timezones.forEach(tz => {
        const tzHour = (utcHours + tz.offset + 24) % 24;
        
        const timeString = String(tzHour).padStart(2, '0') + ':' + String(utcMinutes).padStart(2, '0');
        document.getElementById(`time-${tz.offset}`).textContent = timeString;

        // Update Day/Night Icon
        const isDay = tzHour >= 6 && tzHour < 18;
        document.getElementById(`phase-${tz.offset}`).textContent = isDay ? '☀️' : '🌙';

        // Update Date Indicator
        const tzTime = new Date(now.getTime() + (tz.offset - (-now.getTimezoneOffset()/60)) * 3600 * 1000);
        const tzDay = tzTime.getDate();
        const dateElement = document.getElementById(`date-${tz.offset}`);
        if (dateElement) {
            if (tzDay > localDay) {
                dateElement.textContent = '(+1d)';
            } else if (tzDay < localDay) {
                dateElement.textContent = '(-1d)';
            } else {
                dateElement.textContent = '';
            }
        }
    });
}

function highlightUserTimezone() {
    const userOffset = -new Date().getTimezoneOffset() / 60;
    const closestOffset = timezones.reduce((prev, curr) => {
        return (Math.abs(curr.offset - userOffset) < Math.abs(prev.offset - userOffset) ? curr : prev);
    });

    const userTimezoneElement = document.querySelector(`[data-offset="${closestOffset.offset}"]`);
    if (userTimezoneElement) {
        userTimezoneElement.classList.add('user-timezone');
        const line = document.createElement('div');
        line.className = 'vertical-line';
        userTimezoneElement.appendChild(line);
    }
    document.getElementById('user-timezone').textContent = `Your Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}

function handleMouseMove(event) {
    const timelineWrapper = document.getElementById('timeline-wrapper');
    const mouseX = event.clientX;
    const screenWidth = window.innerWidth;
    const maxScrollLeft = timelineWrapper.scrollWidth - timelineWrapper.clientWidth;
    timelineWrapper.scrollLeft = (mouseX / screenWidth) * maxScrollLeft;
}

document.addEventListener('DOMContentLoaded', () => {
    renderTimezones();
    updateClocks();
    highlightUserTimezone();
    setInterval(updateClocks, 1000);
    document.addEventListener('mousemove', handleMouseMove);
});
