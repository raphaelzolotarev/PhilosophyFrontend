
// Immediately Invoked Function Expression (IIFE) for night mode
(function (window, document) {
    'use strict';

    // Check if localStorage is available
    //if (!('localStorage' in window)) return;

    // Check if night mode is enabled in localStorage
    const nightMode = localStorage.getItem('gmtNightMode');

    if (nightMode === 'true') {
        document.documentElement.classList.add('night-mode');
    }

    // Get the night mode toggle button
    const nightModeToggle = document.querySelector('#night-mode');
    if (!nightModeToggle) return;

    // Toggle night mode when the button is clicked
    nightModeToggle.addEventListener('click', function (event) {
        event.preventDefault();
        document.documentElement.classList.toggle('night-mode');

        // Update localStorage based on the current mode
        if (document.documentElement.classList.contains('night-mode')) {
            localStorage.setItem('gmtNightMode', 'true');
        } else {
            localStorage.setItem('gmtNightMode', 'false');
        }
    }, false);

})(window, document);


/*

// Night Mode JS
(function (window, document, undefined) {
		'use strict';
		if (!('localStorage' in window)) return;
		var nightMode = localStorage.getItem('gmtNightMode');
		if (nightMode) {
			document.documentElement.className += ' night-mode';
		}
	})(window, document);


	(function (window, document, undefined) {

		'use strict';

		// Feature test
		if (!('localStorage' in window)) return;

		// Get our newly insert toggle
		var nightMode = document.querySelector('#night-mode');
		if (!nightMode) return;

		// When clicked, toggle night mode on or off
		nightMode.addEventListener('click', function (event) {
			event.preventDefault();
			document.documentElement.classList.toggle('night-mode');
			if (document.documentElement.classList.contains('night-mode')) {
				localStorage.setItem('gmtNightMode', true);
				return;
			}
			localStorage.removeItem('gmtNightMode');
		}, false);

	})(window, document);*/