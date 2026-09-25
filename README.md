# Vinyl Room Portfolio

Maggie Ma's illustrated portfolio, built with React, TypeScript, and Vite.

## Local development

Use a Node.js version supported by the installed Vite release (Node 24 works).

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. The site is static; it has no backend or environment variables.

## Where to make changes

| Change | Location |
| --- | --- |
| Section titles, descriptions, album artwork, reading order | `src/data/portfolio.ts` |
| Contact destinations and availability | `src/data/contacts.ts` |
| Room positions, sizes, shelf placement, scene scaling | `src/styles/room-layout.css` |
| Colors, image treatments, shadows, local component appearance, layer names | `src/styles/room-appearance.css` |
| Player layers, record texture, lighting | `src/styles/record.css` |
| Generated player assets and prompt notes | `src/assests/player/README.md` |
| Platter/arm anchors and preview settings | `src/data/recordPlayer.ts` |
| Development motion comparison controls | `src/components/MotionDevPanel.tsx` |
| Continuous flight curve, transform keyframes, travel durations | `src/components/RecordDisc.tsx` |
| System/site motion preference and persistence | `src/hooks/useMotionPreference.ts` |
| Popup placement, sizing, appearance, enter/exit animation | `src/styles/dialog.css` |
| Booklet layout and section-specific content | `src/components/PortfolioBooklet.tsx` |
| Booklet introductions and sample album sleeves | `src/data/booklet.ts` |
| Section selection, record geometry, animation lifecycle | `src/hooks/useRecordPlayback.ts` |
| Popup keyboard navigation and focus containment | `src/components/PortfolioDialog.tsx` |
| Component composition | `src/App.tsx` |

Original artwork remains in `src/assests/` (the existing spelling is intentional for this cleanup). The imported cutouts in `src/assests/clean/` are deterministic transparent-bound trims of those originals; they do not alter the artwork. The new transparent player, vinyl, tonearm, and tabletop repair live in `src/assests/player/`; that directory includes generation prompts and alignment notes. The cabinet front and album covers retain their original artwork.

## Changing the layout

Room geometry is separate from section content. The room objects are authored on a centered 1672×941 scene canvas, while the empty wall-and-floor backdrop fills the viewport independently. This prevents letterbox bars without stretching the poster, shelves, records, plants, window, or player. On viewports taller than the scene, `--floor-anchor-shift` moves the cabinet and potted plant down with the backdrop floor. The hanging foliage compensates for both `--scene-left-gap` and `--scene-top-gap`, keeping it attached to the actual viewport corner rather than the centered scene corner. Position formulas in `room-layout.css` use coordinates from that reference. Albums use stable `data-section` IDs for placement, so changing titles or content order does not move them between shelves. When adding a section, give it an ID, assign it to a shelf in `AlbumCollection.tsx`, and add its horizontal placement rule in `room-layout.css`.

The player exposes an elliptical `.playerTarget` positioned over its platter. `playerGeometry` in `src/data/recordPlayer.ts` supplies the normalized platter and tonearm coordinates. The playback hook measures the album, target, and deck; `RecordDisc` uses those measurements for the flight and the seated perspective. The overlay tonearm uses the same component and anchors as the idle player. Keep the viewport-positioned record, arm overlay, and dialog outside transformed scene containers when introducing new wrappers.

Each `.albumShelf` is a zero-height supporting edge: covers anchor their bottoms there, and both shelf image passes align their lip to that same edge. Move the entire row using `.upperShelf` or `.lowerShelf`; do not give the covers separate vertical offsets. The shelf group matches the reference at x=712 with a width of 508 in the 1672×941 scene. Three covers sit on the upper shelf and two on the lower shelf, with individual offsets and widths on `.vinylSlot[data-album-section]`. Labels are siblings of the transformed cover buttons so they can paint above both shelf lips. Keep these slots free of transforms, filters, and z-index values that would trap their labels in a lower stacking context.

The `--shelf-seat` percentage identifies the front edge within each trimmed shelf PNG. Update it when replacing the shelf artwork. The first image pass draws behind the covers, and the clipped second pass draws the front lip. Room layer variables preserve existing stacking; changing a child's z-index cannot lift it above its parent's stacking context. Contact records use `data-contact` placement rules in `room-layout.css`: GitHub and Email form the upper pair, with LinkedIn and Resume staggered to the right below them.

## Interaction lifecycle

**Lift & place** is the public default: `idle → flying → settling → playing → spinning → closing → returning → idle`. The record slides out from the sleeve's right edge, follows a short 820 ms transfer, and lowers onto the measured platter. Its size changes only to match the destination. A sleeve-edge mask hides the portion still inside the cover. The return takes 620 ms.

**Play at turntable** uses the same assets and controller, with a 220 ms local appearance instead of a transfer. Closing parks the arm and leaves a stopped record on the platter (`parked`). Another selection updates the label and starts playback from that position.

Both styles spend 220 ms settling and spinning up, followed by **1000 ms of visible playback before the booklet opens**. The `playing` phase owns that pause; `spinning` means the booklet is open. Steady rotation takes 1800 ms per revolution (33⅓ rpm). The arm engages after landing, then parks during the 240 ms booklet exit while the record brakes. The disc retains its rotation angle across phase changes. The texture and label rotate under stationary lighting; the contact shadow appears only near the platter.

`RecordDisc` samples the transfer curve once and runs browser animations on separate travel, tilt, and spin layers. Finite animation completion promises advance the controller; cancellation prevents an old animation from opening a stale section. There are no per-frame React renders. Repeated actions cannot start overlapping sequences. Reduced motion skips the flight, settling, visible-playback delay, spin, and animated exit.

Resize and scroll notifications only interrupt travel when its destination actually moves; redundant browser events and sleeve hover changes cannot skip the animation. A real layout change during outward flight aligns the record with the newly measured player and preserves the settling beat before opening. During return it finishes the sequence and restores focus. While the popup is open, layout changes keep the record aligned, and the return path is measured again before closing.

The **Record animation: On/Off** button in the room controls motion for this site. It initially follows the device's reduced-motion setting, and explicit choices are saved in local storage when available. `/?motion=on` explicitly enables motion for a preview visit, including on a device that requests reduced motion; `/?motion=off` disables it. A control click supersedes and removes that URL override. Reduced motion skips travel, settling, and continuous rotation, including when the system preference changes mid-sequence while the site is following it. JavaScript and CSS use the same effective preference so enabling motion also restores the booklet's exit animation and record return.

The dialog focuses Close when opened, contains Tab/Shift+Tab, supports Escape, and scrolls its `.portfolioContent` area while keeping Close in place. Add future content and controls inside that area. Focus returns to the originating album after playback ends. Positioning belongs to the outer wrapper; animation belongs to the inner panel so mobile centering remains stable.

## Section booklets

All five records open the same warm-paper booklet shell, in both development and production. Desktop has facing pages with the section's album artwork and introduction on the left, and its content on the right. Phones stack the pages into a scrollable reading surface. The top bar and Close stay visible while the content scrolls. The room dims behind the booklet, and the record returns to its sleeve after the booklet closes.

- About: introduction and personal background.
- Projects: numbered tracklist with project details and technologies.
- Experiences: chronology with roles, dates, and work details.
- Skills: grouped categories and supporting descriptions.
- Top 100 Albums: sample cover grid.

About, Projects, Experiences, and Skills render the full content from `src/data/portfolio.ts`, preserving the order of headings, metadata, paragraphs, and lists. The booklet framing text and sample album sleeves live in `src/data/booklet.ts`. The album grid reuses five existing sleeve images to demonstrate the layout; it is explicitly labeled as a sample sequence, not an actual ranking. Add real album metadata and ranks when the collection is ready. The previous booklet design experiment has been removed; the current development controls compare only the record motion.

## Comparing motion in development

Run `npm run dev`, then open **Motion lab** at the bottom left:

- **Lift & place** and **Play at turntable** switch the interaction style.
- **Normal / Half speed** scales the record sequence, arm movement, playback pause, and closing transition together.
- **Replay last album** repeats your last selection. Choose an album first to enable it.

Settings persist for that tab in session storage. Changing a setting resets any active sequence and clears the parked record. The panel is inert while the booklet is open, so dialog focus stays contained. The public **Record animation** switch still controls reduced motion independently. The panel and its styles are excluded from production builds; `npm run preview` uses Lift & place at normal speed.

## Browser checks after changes

- Open and close each of the five albums. Try repeated clicks and repeated Escape presses.
- Use Tab and Shift+Tab in the popup; confirm focus returns to the selected album.
- Resize during flight, playback, and return. Change reduced-motion preferences with an animation active.
- Compare both motion styles, half speed, replay, and a mode change during flight. Confirm the complete landing and one second of playback are visible before the booklet opens.
- Check that the record remains stopped during transfer, begins spinning after landing, and stops before returning. Confirm platter and arm alignment after resizing.
- Check each section's content layout, especially long headings, project lists, skill groups, and the album grid.
- Check desktop (1440×900), tablet (768×1024), phone (390×844 and 320×568), and landscape (844×390).
- On phones, confirm the popup and Close button remain onscreen during opening and closing. Check longer content scrolls inside the panel.
- Confirm the Resume vinyl opens the bundled PDF, including in the production build.
- Compare the resting room against its previous appearance for accidental placement changes.

## Remaining design work

Existing objects now follow the supplied reference, with covers seated on their shelves and clear spacing between the main objects. Artwork proportions are preserved; the current cabinet is taller than the reference cabinet, so it is slightly narrower to fit between the lower shelf and the floor. Small text on phones and image-size optimization remain for a later pass. The Top 100 Albums grid is still illustrative; the Resume vinyl links to the bundled PDF.
