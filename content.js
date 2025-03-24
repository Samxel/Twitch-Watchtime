let currentURL = window.location.href;
let streamStartTime = null;
let liveTimeElement = null;
let initialCheckDone = false;

// Updates the displayed livestream duration
function updateLiveTimeElement() {
  if (!liveTimeElement) return;

  const now = new Date();
  const diff = now - streamStartTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const ariaHiddenSpan = liveTimeElement.querySelector('span[aria-hidden="true"]');
  const pElement = liveTimeElement.querySelector('p');

  if (ariaHiddenSpan && pElement) {
    ariaHiddenSpan.textContent = formattedTime;
    pElement.innerHTML = `${formattedTime}&nbsp;since the stream started`;
  }
}

// Creates the livestream duration element
function createLiveTimeElement() {
  const now = new Date();
  const diff = now - streamStartTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const newLiveTimeElement = document.createElement('div');
  newLiveTimeElement.className = 'Layout-sc-1xcs6mc-0 kbdfeJ';
  newLiveTimeElement.setAttribute('bis_skin_checked', '1');
  newLiveTimeElement.setAttribute('title', 'Watchtime');

  //const prefix = document.createElement('span');
  //prefix.textContent = '🕒 ';
  //newLiveTimeElement.prepend(prefix)

  const spanElement = document.createElement('span');
  spanElement.className = 'live-time';

  const ariaHiddenSpan = document.createElement('span');
  ariaHiddenSpan.setAttribute('aria-hidden', 'true');
  ariaHiddenSpan.textContent = formattedTime;

  const pElement = document.createElement('p');
  pElement.className = 'CoreText-sc-1txzju1-0 InjectLayout-sc-1i43xsx-0 cmeMuc';
  pElement.innerHTML = `${formattedTime}&nbsp;since the stream started`;

  spanElement.appendChild(ariaHiddenSpan);
  spanElement.appendChild(pElement);
  newLiveTimeElement.appendChild(spanElement);

  return newLiveTimeElement;
}

// Adds the livestream duration element to the page
function addLiveTimeElement() {
  const liveTimeSpan = document.querySelector('span.live-time');

  if (liveTimeSpan) {
    const liveTimeDiv = liveTimeSpan.closest('div');

    if (liveTimeDiv) {
      const parentDiv = liveTimeDiv.parentNode;

      if (parentDiv) {
        liveTimeElement = createLiveTimeElement();
        parentDiv.insertBefore(liveTimeElement, liveTimeDiv.nextSibling);

        console.log('Live-Time Element added!');
        return true; // Element found and added
      } else {
        console.log('Parent Div not found!');
      }
    } else {
      console.log('Live-Time Div not found!');
    }
  } else {
    console.log('Live-Time Span not found!');
  }
  return false; // Element not found
}

// Checks if the URL has changed
function checkURLChange() {
  if (window.location.href !== currentURL) {
    console.log("URL has changed!");
    currentURL = window.location.href;
    streamStartTime = new Date();

    if (liveTimeElement) {
      liveTimeElement.remove();
      liveTimeElement = null;
    }
    addLiveTimeElement();
  }
}

// Initial check after page load
function initialCheck() {
  streamStartTime = new Date();
  if (!initialCheckDone) {
    // Delay the first check to allow the page to load
    setTimeout(() => {
      if (!addLiveTimeElement()) {
        // If the element is still not found, start the Mutation Observer
        startObserver();
      }
      initialCheckDone = true;
    }, 2000);
  }
}

let observer = null;

// Starts the Mutation Observer to watch for the live-time element
function startObserver() {
  const channelInfoContent = document.querySelector('.channel-info-content');

  if (!channelInfoContent) {
    console.warn("channel-info-content div not found. Observer will not start.");
    return;
  }

  observer = new MutationObserver(function(mutations) {
    if (addLiveTimeElement()) {
      observer.disconnect();
      console.log("Observer disconnected (Element found).");
    }
  });

  const config = {
    childList: true,
    subtree: true
  };

  observer.observe(channelInfoContent, config); // Observe the correct element!
  console.log("Observer started, watching channel-info-content div.");
}
// Initialize on page load
initialCheck();

// Update the timer every second
setInterval(updateLiveTimeElement, 1000);

// Check the URL every 2 seconds
setInterval(checkURLChange, 2000);
