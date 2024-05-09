// Immediately Invoked Function Expression (IIFE) to avoid global variable collisions
(function() {
    // Prevent duplicate execution
    let eventsLoaded = false;

    document.addEventListener('DOMContentLoaded', function() {
        if (eventsLoaded) return;
        eventsLoaded = true;

        const eventsContainer = document.getElementById('events-container');

        fetch('https://soagbbq-server.onrender.com/calendar/events')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(events => {
                events.forEach(event => {
                  // handle description for undefined
                  const description = event.description ? makeLinksClickable(event.description) : '';
                  
                  // Display dates
                  const dates = event.start === event.end 
                      ? event.start 
                      : `${event.start} - ${event.end}`;
                  
                  const eventElement = document.createElement('div');
                  eventElement.className = 'event-item';
                  eventElement.innerHTML = `
                      <div class="event-date"><h3>${dates}</h3></div>
                      <div class="event-details">
                          <h2>${event.summary}</h2>
                          <p>${description}</p>
                      </div>`;
                  eventsContainer.appendChild(eventElement);
                });
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = 'Unable to load events at this time.';
                eventsContainer.appendChild(errorElement);
            });
    });

    function makeLinksClickable(text) {
        // Regular expression to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        // Replace URLs with clickable links
        return text.replace(urlRegex, url => `<a class="event-link" href="${url}" target="_blank">More Details</a>`);
    }
})();
