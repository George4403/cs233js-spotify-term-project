class Artist {

    constructor() {
        this.artistName = {
            artist: "",
            tracks: {},
            popularity: [],
            selectedTrack: null
        };

        this.clientID = "4c15e19067fd4e66b8b075a6e53839ab";
        this.clientSecret = "1a0b2b1255c94798ab70d92facf6c42f";
        this.accessToken = null;

        this.$topTrack = document.getElementById('#topTrack');
        this.$form = document.getElementById("trackForm");
        this.$artist = document.querySelector('#artist');
        this.$track = document.querySelector('#trackList');
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.displayTracks = this.displayTracks.bind(this);
        this.$form.addEventListener("submit", this.onFormSubmit);
    }

    onFormSubmit(event) {
        event.preventDefault();
    
        // get artist name from the ui
        
        // API Access Token
        let authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + this.clientID + '&client_secret=' + this.clientSecret
        }
        fetch("https://accounts.spotify.com/api/token", authParameters)
            .then(result => result.json())
            .then(data => {
                this.accessToken = data.access_token;
                console.log('Access Token:', this.accessToken);
                this.artistSearch();
            })
    }

    artistSearch() {
        let artistName = this.$artist.value;
        console.log("Search for " + artistName);
    
        // Get request using search to get the Artist ID
        let searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            }
        };
    
        fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(artistName) + '&type=artist', searchParameters)
            .then(response => response.json())
            .then(data => {
                const artistID = data.artists.items[0].id;
                console.log('Artist ID:', artistID);
    
                // Use the obtained artistID here or call other methods
    
                // Get request with Artist ID to grab all the top tracks from that artist
                return fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=us', searchParameters);
            })
            .then(response => response.json())
            .then(data => {
                console.log('Top Tracks:', data);
                // Process the top tracks data here
                this.displayTracks(data.tracks);
            })
            .catch(error => console.error('Error:', error));
    }    

    displayTracks(tracks) {
        // Assuming there is a container element with the ID 'trackList' on your HTML
        const trackListContainer = document.getElementById('trackList');
    
        // Clear previous content
        trackListContainer.innerHTML = '';
    
        // Create an ordered list to hold the tracks
        const trackList = document.createElement('ol');
    
        // Iterate through each track and create list items (li)
        tracks.forEach(track => {
            const listItem = document.createElement('li');
            listItem.classList.add('track-item'); // Add a class to the list item
    
            // Create an image element for the album cover
            const albumCover = document.createElement('img');
            albumCover.src = track.album.images[1].url;
            albumCover.alt = 'Album Cover';
    
            // Create a span for the track name
            const trackName = document.createElement('span');
            trackName.textContent = track.name;
    
            // Append the album cover and track name to the list item
            listItem.appendChild(albumCover);
            listItem.appendChild(trackName);
    
            // Append the list item to the ul
            trackList.appendChild(listItem);
    
            // Append click event listener to each list item
            listItem.addEventListener('click', () => {
                // Check if track details already exist
                const existingDetails = listItem.nextElementSibling;
                if (existingDetails && existingDetails.classList.contains('track-details')) {
                    // If details exist, toggle their visibility
                    existingDetails.classList.toggle('hidden');
                } else {
                    // If details don't exist, render them
                    const trackDetails = document.createElement('div');
                    trackDetails.classList.add('track-details');
                    trackDetails.innerHTML = `
                        <p>Album: ${track.album.name}</p>
                        <p>Track Number: ${track.track_number}</p>
                        <p>Release Date: ${track.album.release_date}</p>
                        <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
                    `;
                    listItem.insertAdjacentElement('afterend', trackDetails);
                }
            });
        });
    
        // Append the ul to the container
        trackListContainer.appendChild(trackList);
    }

    clearCurrentTrack() {
        this.$topTrack.innerHTML = "";
    }
}

window.onload = () => { new Artist();}