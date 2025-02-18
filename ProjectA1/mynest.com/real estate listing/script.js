document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/listings.json')
    .then(response => response.json())
    .then(data => {
      const listingsContainer = document.getElementById('listings');
      data.forEach(listing => {
        const card = document.createElement('div');
        card.classList.add('property-card');
        card.innerHTML = `
          <img src="${listing.image}" alt="${listing.title}">
          <h2>${listing.title}</h2>
          <p>Price: ${listing.price}</p>
          <p>Location: ${listing.location}</p>
          <button onclick="alert('Contact: ${listing.contact}')">Contact Agent</button>
          <span class="status ${listing.status}">${listing.status}</span>
        `;
        listingsContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching listings:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    // Add click event to status indicators
    const statusElements = document.querySelectorAll('.status');
    
    statusElements.forEach(status => {
        status.addEventListener('click', function() {
            if (status.classList.contains('available')) {
                status.classList.remove('available');
                status.classList.add('sold');
                status.textContent = 'Sold';
            } else {
                status.classList.remove('sold');
                status.classList.add('available');
                status.textContent = 'Available';
            }
        });
    });
});
