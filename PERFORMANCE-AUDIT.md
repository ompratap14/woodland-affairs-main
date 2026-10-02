# Website performance audit — 2 October 2026

## Changes

- Re-encoded the existing background film from 23,648,010 to 11,252,268 bytes (52.4% smaller). Preserved 1920×1080, 30 fps and the full 28.4-second footage. Removed its unused audio track and moved MP4 metadata to the beginning for streaming.
- Video starts when needed instead of preloading behind the intro. Existing offscreen and hidden-tab pausing remains in place.
- Added 480px/960px WebP choices for photographs, with intrinsic dimensions to reserve their layout space. Original photographs remain available.
- Made Google Fonts CSS nonblocking, with a no-JavaScript fallback.
- Replaced the changing 3D glare gradient with a static gradient moved using transforms.
- Fixed rapid touch interactions leaving previously tapped cards or scenes tilted.
- Limited hero scroll updates to one per animation frame, and removed duplicate entrance observation on cinematic pages.
- Removed the fixed mobile header's background blur and shortened mobile entrance transitions.
- Updated stylesheet/script cache versions on all five pages.

## Verification

Automated Chrome checks against the local server, at 390×844 with touch/mobile emulation and 1440×900 desktop, with 4× CPU throttling:

- Home, Menu, Gallery, Celebrate and Contact: no JavaScript exceptions, HTTP error responses, broken loaded images or horizontal overflow detected.
- No unexpected layout-shift entries recorded during the tested flows.
- Mobile navigation opens and closes.
- All three à la carte menus turn forward/backward without changing book height.
- Hari Nagar and Dwarka each show five buffet packages; Janakpuri shows its existing enquiry message.
- WhatsApp chooser opens with all three outlets.
- Optimized video plays at 1920×1080 and pauses after scrolling offscreen.
- Rapid taps on different restaurant cards settle back to zero active cards.
- Mobile hero, restaurant card and menu book screenshots visually reviewed.
- JavaScript syntax, local asset/link existence and Git whitespace checks passed.

Local home-page DOM readiness changed from ~7.2 seconds to 0.9–1.2 seconds in the recorded runs. These are local test observations, not production Core Web Vitals or a controlled network benchmark. Image-transfer totals vary with browser cache and lazy loading.

## Limits

The compressed film is still 11.3 MB; slow connections may display the poster while it buffers. Initial long tasks were still recorded with 4× CPU throttling (up to ~0.8 seconds), so zero lag on every phone is not established. Physical Android/iPhone testing and live hosting/network measurements remain outside this local audit. Changes have not been deployed.

`audit-site.cjs` contains the repeatable browser checks. It uses the bundled Playwright path on this workstation. `responsive_images.py` generates the image variants. Local audit screenshots, JSON results and downloaded encoder tools are ignored by Git.
