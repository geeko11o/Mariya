// =====================================================
//  MEDIA CONFIG
//  Videos, Results, Certificates — sirf yahan badlo.
//  index.html ko touch karne ki zarurat nahi.
// =====================================================

// --- HERO VIDEO (Vimeo ID) ---
var HERO_VIDEO_ID = '1182946483';

// --- MY STORY IMAGE ---
var STORY_IMAGE = 'assets/my_story.jpg';

// --- TESTIMONIAL VIDEOS (Vimeo IDs) ---
// Naya video add karna ho: naya ID array mein daal do
var TESTIMONIAL_VIDEOS = [
  '1184869731',
  '1184870132',
  '1184869727',
  '1184869728'
];

// --- TEAM RESULT IMAGES ---
// Naya image add karna ho: path daal do
var RESULT_IMAGES = [
  'assets/results/result_1.jpeg',
  'assets/results/result_2.jpeg',
  'assets/results/result_3.jpeg',
  'assets/results/result_4.jpeg',
  'assets/results/result_5.jpeg',
  'assets/results/result_6.jpeg',
  'assets/results/result_7.jpeg',
  'assets/results/result_8.jpeg',
  'assets/results/result_9.jpeg',
  'assets/results/result_10.jpeg',
  'assets/results/result_11.jpeg',
  'assets/results/result_12.jpeg',
  'assets/results/result_13.jpeg',
  'assets/results/result_14.jpeg',
  'assets/results/result_15.jpeg',
  'assets/results/result_16.jpeg',
  'assets/results/result_17.jpeg',
  'assets/results/result_18.jpeg'
];

// --- CERTIFICATE VIDEOS (Vimeo IDs) ---
// Naya video add karna ho: naya ID array mein daal do (This replaced the old certificates section)
var CERTIFICATE_VIDEOS = [
  '1184881592',
  '1184881815',
  '1184881677',
  '1184880365',
  '1184880364',
  '1184881073',
  '1184880362'
];

// =====================================================
//  RENDERER — niche kuch mat badlo
// =====================================================
document.addEventListener('DOMContentLoaded', function () {

  // Hero Video
  var heroIframe = document.getElementById('hero-video');
  if (heroIframe) {
    heroIframe.src = 'https://player.vimeo.com/video/' + HERO_VIDEO_ID + '?controls=1&title=0&byline=0&portrait=0&badge=0&autopause=1&transparent=0';
  }

  // Story Image
  var storyImg = document.getElementById('story-image');
  if (storyImg) {
    storyImg.src = STORY_IMAGE;
  }

  // Videos
  var videoTrack = document.querySelector('.video-track');
  if (videoTrack) {
    videoTrack.innerHTML = TESTIMONIAL_VIDEOS.map(function (id) {
      return '<div class="video-item">' +
        '<div class="video-overlay"></div>' +
        '<iframe src="https://player.vimeo.com/video/' + id + '?controls=1&title=0&byline=0&portrait=0" allowfullscreen></iframe>' +
        '</div>';
    }).join('');
  }

  // Result Images
  var imageTrack = document.querySelector('.image-track');
  if (imageTrack) {
    imageTrack.innerHTML = RESULT_IMAGES.map(function (src) {
      return '<div class="image-item"><img src="' + src + '" alt="Team result" loading="lazy"></div>';
    }).join('');
  }

  // Certificates (Now Videos)
  var certTrack = document.querySelector('.cert-video-track');
  if (certTrack) {
    certTrack.innerHTML = CERTIFICATE_VIDEOS.map(function (id) {
      return '<div class="video-item">' +
        '<div class="video-overlay"></div>' +
        '<iframe src="https://player.vimeo.com/video/' + id + '?controls=1&title=0&byline=0&portrait=0" allowfullscreen></iframe>' +
        '</div>';
    }).join('');
  }

});
