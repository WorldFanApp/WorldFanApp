// Mock Minikit SDK
const Minikit = {
    // Simulate initialization if needed, e.g., Minikit.init('app_id')
    init: (appId) => {
        console.log(`Minikit initialized with App ID: ${appId}`);
    },

    // Mock function to check Orb verification status
    isOrbVerified: () => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Randomly return true or false for simulation purposes
                const isVerified = Math.random() < 0.5;
                if (isVerified) {
                    resolve({ verified: true, proof: "mock_proof_string" });
                } else {
                    // Simulate a reason for not being verified
                    resolve({ verified: false, error: "User not verified" });
                }
                // To simulate an error:
                // reject("Simulated SDK error");
            }, 1500);
        });
    }
};

// Initialize the mock SDK (if it had an init step)
// Minikit.init('mock_app_id_123');

// --- Mock Artist Data ---
const MOCK_ARTISTS = [
    "The Beatles", "Led Zeppelin", "Pink Floyd", "Queen", "Michael Jackson",
    "Madonna", "Elton John", "Stevie Wonder", "Bob Dylan", "Jimi Hendrix",
    "Radiohead", "Nirvana", "Red Hot Chili Peppers", "The Rolling Stones", "Eminem",
    "Taylor Swift", "Beyoncé", "Adele", "Drake", "Kanye West", "Daft Punk",
    "Coldplay", "U2", "Metallica", "Guns N' Roses", "The Eagles", "ABBA",
    "Bob Marley", "Elvis Presley", "Frank Sinatra", "Arctic Monkeys", "The Strokes"
];

// --- Artist Suggestion Logic ---
function fetchMockArtistSuggestions(query) {
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            if (!query) {
                resolve([]);
                return;
            }
            const lowerQuery = query.toLowerCase();
            const suggestions = MOCK_ARTISTS.filter(artist =>
                artist.toLowerCase().includes(lowerQuery)
            );
            resolve(suggestions.slice(0, 5)); // Return top 5 matches
        }, 300);
    });
}

function displayArtistSuggestions(suggestions, inputElement, suggestionsContainer) {
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const ul = document.createElement('ul');
    suggestions.forEach(artistName => {
        const li = document.createElement('li');
        li.textContent = artistName;
        li.addEventListener('click', () => {
            const currentArtists = inputElement.value.split(',').map(s => s.trim()).filter(s => s);
            // Remove the current (partially typed) query before adding the selected artist
            const lastCommaIndex = inputElement.value.lastIndexOf(',');
            let SemicolonNeedsToBeAdded = false;
            if(inputElement.value.endsWith(', ') || inputElement.value.endsWith(',')){
                SemicolonNeedsToBeAdded = true;
            }


            if (lastCommaIndex !== -1) {
                inputElement.value = inputElement.value.substring(0, lastCommaIndex + 1).trim() + " ";
            } else {
                inputElement.value = ''; // Clear if it was the first artist
            }
            
            if (inputElement.value.trim() === '' || inputElement.value.endsWith(', ') || inputElement.value.endsWith(',')) {
                 if(SemicolonNeedsToBeAdded && inputElement.value.length > 0 && !(inputElement.value.endsWith(', ') || inputElement.value.endsWith(','))){
                    inputElement.value += ", ";
                 }
                 inputElement.value += artistName;
            } else {
                 if(inputElement.value.length > 0 && !(inputElement.value.endsWith(', ') || inputElement.value.endsWith(','))){
                    inputElement.value += ", ";
                 }
                 inputElement.value += artistName;
            }
            
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
            inputElement.focus();
        });
        ul.appendChild(li);
    });
    suggestionsContainer.appendChild(ul);
    suggestionsContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Orb Verification Logic ---
    const statusElement = document.getElementById('verification-status');

    if (!statusElement) {
        console.error('Error: verification-status element not found.');
        return;
    }

    statusElement.textContent = 'Checking Orb verification status...';

    // Call the mock Orb verification check
    Minikit.isOrbVerified()
        .then(response => {
            if (response.verified) {
                statusElement.textContent = 'User is Orb Verified.';
                statusElement.style.color = 'green';
                console.log('Verification successful:', response);
            } else {
                statusElement.textContent = `User is NOT Orb Verified. Reason: ${response.error || 'Unknown'}`;
                statusElement.style.color = 'red';
                console.warn('Verification failed:', response);
            }
        })
        .catch(error => {
            statusElement.textContent = `Error checking verification status: ${error}`;
            statusElement.style.color = 'red';
            console.error('SDK Error:', error);
        });
    } // Closing brace for if(statusElement)

    // --- Signup Form Logic (Artist Suggestions) ---
    const favArtistsInput = document.getElementById('fav-artists');
    const artistSuggestionsContainer = document.getElementById('artist-suggestions');

    if (favArtistsInput && artistSuggestionsContainer) {
        favArtistsInput.addEventListener('input', (e) => {
            const currentInputValue = e.target.value;
            const lastCommaIndex = currentInputValue.lastIndexOf(',');
            // Query is the part after the last comma, or the whole string if no comma
            const query = currentInputValue.substring(lastCommaIndex + 1).trim();

            if (query.length < 1) { // Don't show suggestions for empty query or just spaces
                artistSuggestionsContainer.innerHTML = '';
                artistSuggestionsContainer.style.display = 'none';
                return;
            }

            fetchMockArtistSuggestions(query)
                .then(suggestions => {
                    displayArtistSuggestions(suggestions, favArtistsInput, artistSuggestionsContainer);
                })
                .catch(error => {
                    console.error("Error fetching artist suggestions:", error);
                    artistSuggestionsContainer.innerHTML = '';
                    artistSuggestionsContainer.style.display = 'none';
                });
        });

        // Hide suggestions when clicking outside the input and suggestions list
        document.addEventListener('click', (event) => {
            if (artistSuggestionsContainer && 
                !favArtistsInput.contains(event.target) && 
                !artistSuggestionsContainer.contains(event.target)) {
                artistSuggestionsContainer.style.display = 'none';
            }
        });
    }

    // TODO: Add logic for country/city dropdowns
    
    // --- Account Creation Options Logic ---
    const anonymousRadio = document.getElementById('create-account-anonymous');
    const verboseRadio = document.getElementById('create-account-verbose');
    const accountDetailsDiv = document.getElementById('account-details');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (anonymousRadio && verboseRadio && accountDetailsDiv && emailInput && phoneInput) {
        anonymousRadio.addEventListener('change', () => {
            if (anonymousRadio.checked) {
                accountDetailsDiv.style.display = 'none';
                emailInput.required = false;
                phoneInput.required = false;
                // Optionally clear values:
                // emailInput.value = '';
                // phoneInput.value = '';
            }
        });

        verboseRadio.addEventListener('change', () => {
            if (verboseRadio.checked) {
                accountDetailsDiv.style.display = 'block';
                emailInput.required = true;
                phoneInput.required = true;
            }
        });

        // Ensure correct initial state based on default checked radio (anonymous)
        if (anonymousRadio.checked) {
            accountDetailsDiv.style.display = 'none';
            emailInput.required = false;
            phoneInput.required = false;
        } else if (verboseRadio.checked) { // Should not happen with 'anonymous' as default, but good practice
            accountDetailsDiv.style.display = 'block';
            emailInput.required = true;
            phoneInput.required = true;
        }
    }

    // TODO: Add form submission logic

    // --- Dashboard Tab Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-contents .tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all tabs and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active')); // Relies on CSS to hide inactive panes

                // Activate clicked tab and corresponding pane
                button.classList.add('active');
                const tabTargetId = button.getAttribute('data-tab') + '-content';
                const targetPane = document.getElementById(tabTargetId);
                if (targetPane) {
                    targetPane.classList.add('active'); // Relies on CSS to show active pane
                } else {
                    console.error(`Tab content pane with ID '${tabTargetId}' not found.`);
                }
            });
        });

        // Ensure the default active tab (Account) content is shown if classes were set in HTML
        // This is mostly handled by CSS (.active class), but good to be explicit if needed
        // or if initial state wasn't set in HTML (which it is in our case).
        // Example: document.getElementById('account-content').classList.add('active');
    }
});
