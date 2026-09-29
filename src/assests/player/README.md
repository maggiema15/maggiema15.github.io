# Layered record player artwork

Generated with the built-in `image_gen` tool, using the existing cabinet/player illustration as the style reference. These are transparent PNGs, with runtime sizes reduced from the generated masters. No API/CLI fallback was used. Existing source artwork remains intact.

| Asset | Runtime size | Purpose |
| --- | --- | --- |
| [turntable-v2.png](turntable-v2.png) | 960 × 640 | Empty player with lid, platter and arm socket; no vinyl or arm baked in |
| [vinyl-v2.png](vinyl-v2.png) | 512 × 512 | Circular, top-down groove texture and blank cream label |
| [tonearm-v2.png](tonearm-v2.png) | 427 × 640 | Separate arm, counterweight, pivot and cartridge |
| [cabinet-top-v2.png](cabinet-top-v2.png) | 960 × 733 | Tabletop repair after removing the old integrated player |

## Prompt set

### Empty player — stylized-concept

Use the supplied original player/cabinet image as a style reference only. Generate one isolated vintage walnut record player in the same warm, ink-outlined, softly painted illustrated style. Elevated centered front view, horizontal front edge, open cream-tinted translucent dust lid. Large empty dark platter with a silver rim and a small spindle. The platter ellipse should be about 2.5:1. Include small feet and an empty tonearm pivot socket at the right. No vinyl record, center label, tonearm, needle, cabinet, text, floor, cast shadow, or other objects. Genuine transparent background with clean cutout edges. The player will be assembled with separate animated record and tonearm layers.

### Vinyl — stylized-concept

Generate a single top-down vinyl record matching the illustrated player reference. Perfectly centered circular silhouette on a square canvas, approximately 90% filled. Dark charcoal grooves with fine painted texture, even diffuse shading and no strong directional reflection. Blank warm cream paper label approximately 28% of the diameter and a tiny transparent spindle hole. No lettering, symbols, logos, sleeve, player, shadow, or other objects. Genuine transparent background. This texture must rotate smoothly in an app.

### Tonearm — stylized-concept

Generate one separate top-down tonearm matching the illustrated vintage player reference. Brushed silver, subtly bent or gently S-shaped, with a circular pivot, small counterweight above it, and a compact cartridge with a muted rust stylus below. On the portrait canvas, put the pivot near x=50%, y=18%, counterweight near y=5%, and cartridge near x=50%, y=90%. Warm hand-painted shading with clean ink edges. No player, record, deck, text, shadow, or extra objects. Genuine transparent background. The app will flatten this top-down layer into perspective and rotate it around its pivot.

### Tabletop repair — precise-object-edit

Edit the supplied original cabinet illustration. Remove only the complete record player, dust lid, record, tonearm, player feet, and their shadow. Restore the bare walnut tabletop underneath. Preserve the cabinet's viewpoint, shape, body, portrait, sign, records, legs, existing illustration style, canvas proportions, and placement. Keep the space above and around it genuinely transparent. Do not add objects or change the cabinet design.

## Runtime assembly

The generated tabletop repair is clipped to the upper 35.8% of the original cabinet canvas. Below that boundary, the app renders the exact original cabinet image. This preserves the original portrait, record shelves, sign, front, and legs, rather than relying on the generated edit to reproduce them.

`src/data/recordPlayer.ts` contains the measured platter and arm anchors. The platter target is an ellipse, so its measured height/width supplies the seated record perspective. The tonearm's pivot is at 50%, 20% of its own image; it shares that perspective and the same deck anchors in both its idle and active renderings. The vinyl's actual alpha bounds are x=7…504 and y=6…502; `record.css` compensates for that small transparent margin.

The sleeve images provide the label inserts. Lighting and the contact shadow remain separate from the spinning texture. Assets are shared by both motion styles, and the original player image remains available in `src/assests/clean/table-v2-tight.png`.
