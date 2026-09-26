# About page video (autoplay, muted, streaming)

## Goal
Add the council video to `/about` so it starts playing, muted, as soon as the page opens. The page must never wait for the video: the page renders immediately, the poster shows first, and the video streams in and starts after its first few seconds have loaded.

## Assets (Supabase `public-photos`, public)
- Video: `KofC6033_About_720p.mp4` (1280x720, about 6.5 MB), used on all screen sizes
- Poster: `KofC6033_About_poster.jpg` (1280x720 title frame)
The MP4 is encoded with `faststart`, so browsers can play it while it downloads.

## Placement
Directly below the About page hero (the "58 years of brothers, one parish." section), before "How we got here". It must sit inside the page's existing centered content container, aligned with the text columns: width 100% of that container, never wider, shrinking with the window on smaller screens. Do not make it full-bleed.

## Component
New client component `src/components/AboutVideo.tsx`, styles in a CSS module.

Use a native `<video>` element, not an iframe or a player library:
- `autoPlay muted playsInline loop={false} preload="metadata"`, `poster` = the poster URL.
- One `<source>`: the 720p file.
- Wrap in a box with `aspect-ratio: 16 / 9`, `width: 100%`, the poster as its background, rounded corners matching the site's cards. No layout shift while loading.
- Hide native controls. Add two small overlay buttons, bottom-right, with visible focus rings and `aria-label`s:
  - **Sound on / off** (the video starts muted because browsers block autoplay with sound). Turning sound on also restarts the video from 0:00 if it has played less than 3 seconds.
  - **Pause / play**.
- When the video ends, show a centered **Replay** button over the last frame.
- Pause the video when it scrolls out of view and resume when it comes back (IntersectionObserver, threshold 0.25), unless the viewer paused it themselves.

## Do not autoplay when
- `prefers-reduced-motion: reduce`, or
- `navigator.connection?.saveData === true`.
In those cases show the poster with a large centered **Play** button, and load nothing but the poster until it is clicked.

## Constraints
- If autoplay is blocked anyway (the `play()` promise rejects), fall back to the poster with the Play button. Never show an error.
- Clean up the observer and listeners on unmount.
- Do not touch `next.config`; the Supabase host is already allowed.

## Stop
Build, verify on localhost at desktop and mobile widths, stop for review.
