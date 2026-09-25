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
| Record artwork and continuous spin | `src/styles/record.css` |
| Continuous flight curve, transform keyframes, travel durations | `src/components/RecordDisc.tsx` |
| System/site motion preference and persistence | `src/hooks/useMotionPreference.ts` |
| Popup placement, sizing, appearance, enter/exit animation | `src/styles/dialog.css` |
| Booklet layout and section-specific content | `src/components/PortfolioBooklet.tsx` |
| Booklet introductions and sample album sleeves | `src/data/booklet.ts` |
| Section selection, record geometry, animation lifecycle | `src/hooks/useRecordPlayback.ts` |
| Popup keyboard navigation and focus containment | `src/components/PortfolioDialog.tsx` |
| Component composition | `src/App.tsx` |

Original artwork remains in `src/assests/` (the existing spelling is intentional for this cleanup). The imported cutouts in `src/assests/clean/` are deterministic transparent-bound trims of those originals; they do not alter the artwork. Unused variants are retained for the later redesign. Import replacement assets where they are used; no PNG-to-SVG conversions are required by the components.

## Changing the layout

Room geometry is separate from section content. The room objects are authored on a centered 1672×941 scene canvas, while the empty wall-and-floor backdrop fills the viewport independently. This prevents letterbox bars without stretching the poster, shelves, records, plants, window, or player. On viewports taller than the scene, `--floor-anchor-shift` moves the cabinet and potted plant down with the backdrop floor. The hanging foliage compensates for both `--scene-left-gap` and `--scene-top-gap`, keeping it attached to the actual viewport corner rather than the centered scene corner. Position formulas in `room-layout.css` use coordinates from that reference. Albums use stable `data-section` IDs for placement, so changing titles or content order does not move them between shelves. When adding a section, give it an ID, assign it to a shelf in `AlbumCollection.tsx`, and add its horizontal placement rule in `room-layout.css`.

The player exposes a `.playerTarget` element positioned over its platter. Adjust that target when replacing the cabinet/player artwork. The playback hook measures the actual album and target elements; `RecordDisc` turns those endpoints into a flight curve. Keep the viewport-positioned record and dialog outside transformed scene containers when introducing new wrappers.

Each `.albumShelf` is a zero-height supporting edge: covers anchor their bottoms there, and both shelf image passes align their lip to that same edge. Move the entire row using `.upperShelf` or `.lowerShelf`; do not give the covers separate vertical offsets. The shelf group matches the reference at x=712 with a width of 508 in the 1672×941 scene. Three covers sit on the upper shelf and two on the lower shelf, with individual offsets and widths on `.vinylSlot[data-album-section]`. Labels are siblings of the transformed cover buttons so they can paint above both shelf lips. Keep these slots free of transforms, filters, and z-index values that would trap their labels in a lower stacking context.

The `--shelf-seat` percentage identifies the front edge within each trimmed shelf PNG. Update it when replacing the shelf artwork. The first image pass draws behind the covers, and the clipped second pass draws the front lip. Room layer variables preserve existing stacking; changing a child's z-index cannot lift it above its parent's stacking context. Contact records use `data-contact` placement rules in `room-layout.css`: GitHub and Email form the upper pair, with LinkedIn and Resume staggered to the right below them.

## Interaction lifecycle

Normal playback follows `idle → flying → settling → spinning → closing → returning → idle`. Only active phases carry a section and measured path; popup visibility and button availability are derived from the phase. The booklet and its backdrop remain unmounted during flight and settling, leaving the entire placement visible.

The disc's lift, arc, and placement share one 1400 ms Web Animations timeline. It grows slightly in transit (remaining legible on phones), aligns above the platter, then lowers onto it during the last 22% of travel. A 420 ms `settling` phase keeps the spinning record visible on the player before the booklet opens. Returning takes 820 ms. `RecordDisc` samples the curve once and animates only transforms and opacity on a fixed-size element. Nested layers handle travel, platter tilt, and continuous rotation independently, so the spin never restarts at landing or on return. Animation completion promises advance playback through `flyToPlayer`, `recordSettled`, and `returnToSleeve`; cancellation cleans up both travel and tilt animations. The panel's finite CSS `overlayExit` event starts the return. Child animation events are ignored. Repeated actions cannot start overlapping sequences.

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

About, Projects, Experiences, and Skills render the full content from `src/data/portfolio.ts`, preserving the order of headings, metadata, paragraphs, and lists. The booklet framing text and sample album sleeves live in `src/data/booklet.ts`. The album grid reuses five existing sleeve images to demonstrate the layout; it is explicitly labeled as a sample sequence, not an actual ranking. Add real album metadata and ranks when the collection is ready. The temporary A/B controls and design query parameter have been removed.

## Browser checks after changes

- Open and close each of the five albums. Try repeated clicks and repeated Escape presses.
- Use Tab and Shift+Tab in the popup; confirm focus returns to the selected album.
- Resize during flight, playback, and return. Change reduced-motion preferences with an animation active.
- Check that the disc's rotation does not reset at landing and that a performance trace shows no recurring layout work during flight.
- Check each section's content layout, especially long headings, project lists, skill groups, and the album grid.
- Check desktop (1440×900), tablet (768×1024), phone (390×844 and 320×568), and landscape (844×390).
- On phones, confirm the popup and Close button remain onscreen during opening and closing. Check longer content scrolls inside the panel.
- Confirm the Resume vinyl opens the bundled PDF, including in the production build.
- Compare the resting room against its previous appearance for accidental placement changes.

## Remaining design work

Existing objects now follow the supplied reference, with covers seated on their shelves and clear spacing between the main objects. Artwork proportions are preserved; the current cabinet is taller than the reference cabinet, so it is slightly narrower to fit between the lower shelf and the floor. Small text on phones and image-size optimization remain for a later pass. The Top 100 Albums grid is still illustrative; the Resume vinyl links to the bundled PDF.
