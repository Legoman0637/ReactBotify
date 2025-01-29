const imagesPath = "images/";

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageUrl, flip) {
  // Create a new img element for the overlay
  const overlayImage = document.createElement("img");
  overlayImage.src = overlayImageUrl;
  overlayImage.style.position = "absolute";
  overlayImage.style.top = "0";
  overlayImage.style.left = "40%"; // Move overlay more to the right
  overlayImage.style.width = "100%";
  overlayImage.style.height = "100%";
  overlayImage.style.zIndex = "0"; // Ensure overlay is on top but below the time indicator
  thumbnailElement.style.position = "relative"; // Style the thumbnailElement to handle absolute positioning

  // Append the overlay to the parent of the thumbnail
  thumbnailElement.parentElement.appendChild(overlayImage);
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
  // Query all YouTube video thumbnails on the page that haven't been processed yet
  // (ignores shorts thumbnails)
  const elementQuery =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)";
  const thumbnailElements = document.querySelectorAll(elementQuery);

  // Apply overlay to each thumbnail
  thumbnailElements.forEach((thumbnailElement) => {
    // Apply overlay and add to processed thumbnails
    let loops = Math.random() > 0.001 ? 1 : 20; // Easter egg

    for (let i = 0; i < loops; i++) {
      // Get overlay image URL from your directory
      const overlayImageUrl = getRandomImageFromDirectory();
      const flip = Math.random() < 0.25; // 25% chance to flip the image
      applyOverlay(thumbnailElement, overlayImageUrl, flip);
    }
  });
}

// Get the URL of an image
function getImageURL(index) {
  return chrome.runtime.getURL(`${imagesPath}${index}.png`);
}

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
  const randomIndex = Math.floor(Math.random() * highestImageIndex) + 1;
  return getImageURL(randomIndex);
}

// Checks if an image exists in the image folder
async function checkImageExistence(index = 1) {
  const testedURL = getImageURL(index);
  try {
    await fetch(testedURL);
    return true; // Image exists
  } catch {
    return false; // Image does not exist
  }
}

let highestImageIndex;
// Gets the highest index of an image in the image folder starting from 1
async function getHighestImageIndex() {
  let i = 4;
  while (await checkImageExistence(i)) {
    i *= 2;
  }

  let min = i <= 4 ? 1 : i / 2;
  let max = i;

  while (min <= max) {
    let mid = Math.floor((min + max) / 2);
    if (await checkImageExistence(mid)) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }

  highestImageIndex = max;
}

getHighestImageIndex().then(() => {
  setInterval(applyOverlayToThumbnails, 100);
  console.log(
    "MrBeastify Loaded Successfully, " + highestImageIndex + " images detected."
  );
});
