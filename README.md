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
| Record artwork, flight keyframes, animation durations | `src/styles/record.css` |
| Popup placement, sizing, appearance, enter/exit animation | `src/styles/dialog.css` |
| Section selection, record geometry, animation lifecycle | `src/hooks/useRecordPlayback.ts` |
| Popup keyboard navigation and focus containment | `src/components/PortfolioDialog.tsx` |
| Component composition | `src/App.tsx` |

Original artwork remains in `src/assests/` (the existing spelling is intentional for this cleanup). The imported cutouts in `src/assests/clean/` are deterministic transparent-bound trims of those originals; they do not alter the artwork. Unused variants are retained for the later redesign. Import replacement assets where they are used; no PNG-to-SVG conversions are required by the components.

## Changing the layout

Room geometry is separate from section content. The room objects are authored on a centered 1672×941 scene canvas, while the empty wall-and-floor backdrop fills the viewport independently. This prevents letterbox bars without stretching the poster, shelves, records, plants, window, or player. On viewports taller than the scene, `--floor-anchor-shift` moves the cabinet and potted plant down with the backdrop floor. The hanging foliage compensates for both `--scene-left-gap` and `--scene-top-gap`, keeping it attached to the actual viewport corner rather than the centered scene corner. Position formulas in `room-layout.css` use coordinates from that reference. Albums use stable `data-section` IDs for placement, so changing titles or content order does not move them between shelves. When adding a section, give it an ID, assign it to a shelf in `AlbumCollection.tsx`, and add its horizontal placement rule in `room-layout.css`.

The player exposes a `.playerTarget` element positioned over its platter. Adjust that target when replacing the cabinet/player artwork. Playback measures the actual album and target elements; the hook contains flight-shape calculations, not room placement coordinates. Keep the viewport-positioned record and dialog outside transformed scene containers when introducing new wrappers.

Each `.albumShelf` is a zero-height supporting edge: covers anchor their bottoms there, and both shelf image passes align their lip to that same edge. Move the entire row using `.upperShelf` or `.lowerShelf`; do not give the covers separate vertical offsets. The `--shelf-seat` percentage identifies the front edge within each trimmed shelf PNG. Update it when replacing the shelf artwork. The first image pass draws behind the covers, and the clipped second pass draws the front lip. Room layer variables preserve existing stacking; changing a child's z-index cannot lift it above its parent's stacking context.

## Interaction lifecycle

Normal playback follows `idle → lifting → flying → spinning → closing → returning → idle`. Only active phases carry a section and measured path; popup visibility and button availability are derived from the phase.

Finite CSS animation completion events advance playback. Durations live only in CSS. If renaming `recordLift`, `flyToPlayer`, `overlayExit`, or `returnToSleeve`, update the matching event names in the hook. Child animation events are ignored. Repeated actions cannot start overlapping sequences.

Resizing or scrolling during outward flight settles the record onto the newly measured player. During return it finishes the sequence and restores focus. While the popup is open, layout changes keep the record aligned, and the return path is measured again before closing. Reduced motion skips travel and continuous rotation, including when the preference changes mid-sequence.

The dialog focuses Close when opened, contains Tab/Shift+Tab, supports Escape, and scrolls its `.portfolioContent` area while keeping Close in place. Add future content and controls inside that area. Focus returns to the originating album after playback ends. Positioning belongs to the outer wrapper; animation belongs to the inner panel so mobile centering remains stable.

## Browser checks after changes

- Open and close each of the five albums. Try repeated clicks and repeated Escape presses.
- Use Tab and Shift+Tab in the popup; confirm focus returns to the selected album.
- Resize during lift, flight, playback, and return. Change reduced-motion preferences with an animation active.
- Check desktop (1440×900), tablet (768×1024), phone (390×844 and 320×568), and landscape (844×390).
- On phones, confirm the popup and Close button remain onscreen during opening and closing. Check longer content scrolls inside the panel.
- Compare the resting room against its previous appearance for accidental placement changes.

## Remaining design work

Existing objects now follow the supplied reference, with covers seated on their shelves and clear spacing between the main objects. Artwork proportions are preserved; the current cabinet is taller than the reference cabinet, so it is slightly narrower to fit between the lower shelf and the floor. Small text on phones and image-size optimization remain for a later pass. All section content is currently placeholder text; Resume is visibly unavailable until a destination is provided.
