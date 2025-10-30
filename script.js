let currentTimeFormat = '12h'; // '12h', '24h'

const userLocale = navigator.language; // e.g., "en-US", "cs-CZ"
const isUSLocale = userLocale === 'en-US';

const timezones = [
    { offset: -11, iana: "Pacific/Pago_Pago", cities: ["Pago Pago", "Midway Atoll", "Alofi"] },
    { offset: -10, iana: "Pacific/Honolulu", cities: ["Honolulu", "Papeete", "Tahiti", "Adak", "Rarotonga", "Fakarava"] },
    { offset: -9, iana: "America/Anchorage", cities: ["Anchorage", "Fairbanks", "Juneau", "Nome", "Sitka", "Kodiak", "Dutch Harbor"] },
    { offset: -8, iana: "America/Los_Angeles", cities: ["Los Angeles", "Vancouver", "Tijuana", "San Francisco", "Seattle", "Las Vegas", "Portland", "San Diego", "Sacramento", "Phoenix"] },
    { offset: -7, iana: "America/Denver", cities: ["Denver", "Edmonton", "Phoenix", "Salt Lake City", "Calgary", "Albuquerque", "Tucson", "Boise", "Helena", "Cheyenne"] },
    { offset: -6, iana: "America/Mexico_City", cities: ["Mexico City", "Chicago", "Guatemala City", "Dallas", "Houston", "Winnipeg", "San Salvador", "New Orleans", "Kansas City", "Monterrey"] },
    { offset: -5, iana: "America/New_York", cities: ["New York", "Lima", "Toronto", "Havana", "Bogota", "Quito", "Washington D.C.", "Miami", "Atlanta", "Boston"] },
    { offset: -4, iana: "America/Santiago", cities: ["Santiago", "Halifax", "Caracas", "La Paz", "Santo Domingo", "San Juan", "Port of Spain", "Asuncion", "Manaus", "Georgetown"] },
    { offset: -3, iana: "America/Sao_Paulo", cities: ["São Paulo", "Buenos Aires", "Montevideo", "Rio de Janeiro", "Brasilia", "Santiago", "Rosario", "Cordoba", "Salvador", "Recife"] },
    { offset: -2, iana: "America/Noronha", cities: ["Fernando de Noronha", "South Georgia"] },
    { offset: -1, iana: "Atlantic/Azores", cities: ["Azores", "Cape Verde", "Praia", "Ponta Delgada"] },
    { offset: 0, iana: "Europe/London", cities: ["London", "Lisbon", "Accra", "Dublin", "Edinburgh", "Casablanca", "Reykjavik", "Dakar", "Freetown", "Abidjan"] },
    { offset: 1, iana: "Europe/Paris", cities: ["Paris", "Rome", "Lagos", "Berlin", "Madrid", "Amsterdam", "Brussels", "Stockholm", "Oslo", "Copenhagen"] },
    { offset: 2, iana: "Africa/Cairo", cities: ["Cairo", "Johannesburg", "Athens", "Jerusalem", "Istanbul", "Helsinki", "Bucharest", "Sofia", "Kyiv", "Harare"] },
    { offset: 3, iana: "Europe/Moscow", cities: ["Moscow", "Istanbul", "Nairobi", "Riyadh", "Baghdad", "Minsk", "Addis Ababa", "Kuwait City", "Doha", "Ankara"] },
    { offset: 4, iana: "Asia/Dubai", cities: ["Dubai", "Baku", "Yerevan", "Muscat", "Tbilisi", "Abu Dhabi", "Sharjah", "Doha", "Tehran", "Port Louis"] },
    { offset: 5, iana: "Asia/Karachi", cities: ["Karachi", "Tashkent", "Maldives", "Islamabad", "Lahore", "Samarkand", "Dushanbe", "Ashgabat", "Colombo", "Kabul"] },
    { offset: 6, iana: "Asia/Dhaka", cities: ["Dhaka", "Almaty", "Omsk", "Bishkek", "Novosibirsk", "Astana", "Thimphu", "Chittagong", "Kathmandu", "Ulaanbaatar"] },
    { offset: 7, iana: "Asia/Bangkok", cities: ["Bangkok", "Jakarta", "Hanoi", "Phnom Penh", "Vientiane", "Ho Chi Minh City", "Kuala Lumpur", "Singapore", "Yangon", "Denpasar"] },
    { offset: 8, iana: "Asia/Shanghai", cities: ["Shanghai", "Singapore", "Perth", "Taipei", "Hong Kong", "Beijing", "Manila", "Kuala Lumpur", "Ulaanbaatar", "Macau"] },
    { offset: 9, iana: "Asia/Tokyo", cities: ["Tokyo", "Seoul", "Pyongyang", "Osaka", "Nagoya", "Sapporo", "Busan", "Incheon", "Hiroshima", "Fukuoka"] },
    { offset: 10, iana: "Australia/Sydney", cities: ["Sydney", "Vladivostok", "Guam", "Melbourne", "Brisbane", "Canberra", "Hobart", "Port Moresby", "Magadan", "Sakhalin"] },
    { offset: 11, iana: "Pacific/Noumea", cities: ["Noumea", "Solomon Is.", "Port Vila", "Honiara", "Majuro", "Tarawa", "Nauru", "Funafuti", "Wallis", "Futuna"] },
    { offset: 12, iana: "Pacific/Auckland", cities: ["Auckland", "Fiji", "Kamchatka", "Wellington", "Suva", "Nukualofa", "Apia", "Kiribati", "Anadyr", "Petropavlovsk-Kamchatsky"] },
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
    let localTimeOptions = {};

    if (currentTimeFormat === '12h') {
        localTimeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        if (isUSLocale) {
            localTimeOptions.hourCycle = 'h12'; // Use h12 for am/pm
        }
    } else if (currentTimeFormat === '24h') {
        localTimeOptions = { hour: 'numeric', minute: '2-digit', hour12: false };
        if (isUSLocale) {
            localTimeOptions.hourCycle = 'h23'; // Use h23 for 24-hour format
        }
    }
    document.getElementById('local-time').textContent = now.toLocaleTimeString(userLocale, localTimeOptions);

    const localDay = now.getDate();

    timezones.forEach(tz => {
        let timeZoneToUse = tz.iana;

        let timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: timeZoneToUse
        };

        if (currentTimeFormat === '12h') {
            timeOptions.hour12 = true;
            if (isUSLocale) {
                timeOptions.hourCycle = 'h12';
            }
        } else if (currentTimeFormat === '24h') {
            timeOptions.hour12 = false;
            if (isUSLocale) {
                timeOptions.hourCycle = 'h23';
            }
        }

        const timezoneDate = new Date(now.toLocaleString('en-US', { timeZone: timeZoneToUse }));
        const timeString = timezoneDate.toLocaleTimeString(userLocale, timeOptions);
        document.getElementById(`time-${tz.offset}`).textContent = timeString;

        // Update Day/Night Icon
        const tzHour = timezoneDate.getHours();
        const isDay = tzHour >= 6 && tzHour < 18;
        const phaseIconElement = document.getElementById(`phase-${tz.offset}`);
        if (phaseIconElement) {
            phaseIconElement.classList.remove('is-day', 'is-night');
            if (isDay) {
                phaseIconElement.classList.add('is-day');
            } else {
                phaseIconElement.classList.add('is-night');
            }
            phaseIconElement.textContent = '';
        }

        // Update Date Indicator
        const tzDay = timezoneDate.getDate();
        const dateElement = document.getElementById(`date-${tz.offset}`);
        if (dateElement) {
            if (tzDay !== localDay) {
                dateElement.textContent = timezoneDate.toLocaleDateString(userLocale, { month: 'short', day: 'numeric' });
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

    // Position the line on the map
    const mapLine = document.getElementById('map-vertical-line');
    if (mapLine) {
        const totalOffsets = 24;
        const percentage = ((closestOffset.offset + 11) / totalOffsets) * 100;
        mapLine.style.left = `${percentage}%`;
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

function updateMapOverlay() {
    const timelineWrapper = document.getElementById('timeline-wrapper');
    const mapOverlay = document.getElementById('map-overlay');

    const visiblePercentage = timelineWrapper.clientWidth / timelineWrapper.scrollWidth;
    const scrolledPercentage = timelineWrapper.scrollLeft / timelineWrapper.scrollWidth;

    mapOverlay.style.width = `${visiblePercentage * 100}%`;
    mapOverlay.style.left = `${scrolledPercentage * 100}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderTimezones();
    updateClocks();
    highlightUserTimezone();
    updateMapOverlay();
    setInterval(updateClocks, 1000);
    document.addEventListener('mousemove', (e) => {
        handleMouseMove(e);
        updateMapOverlay();
    });
    document.getElementById('timeline-wrapper').addEventListener('scroll', updateMapOverlay);
    document.getElementById('map-container').addEventListener('click', handleMapClick);

    document.querySelectorAll('input[name="timeFormat"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentTimeFormat = event.target.value;
            updateClocks();
        });
    });
});

function handleMapClick(event) {
    const mapContainer = document.getElementById('map-container');
    const clickX = event.clientX - mapContainer.getBoundingClientRect().left;
    const mapWidth = mapContainer.offsetWidth;
    const clickedPercentage = clickX / mapWidth;

    const totalOffsets = 24;
    const clickedOffset = Math.round(clickedPercentage * totalOffsets) - 11;

    const timelineWrapper = document.getElementById('timeline-wrapper');
    const targetElement = document.querySelector(`[data-offset="${clickedOffset}"]`);

    if (targetElement) {
        const targetLeft = targetElement.offsetLeft + (targetElement.offsetWidth / 2);
        const containerWidth = timelineWrapper.offsetWidth;
        const scrollLeft = targetLeft - (containerWidth / 2);
        timelineWrapper.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
}