# Leafsnack map specification from user PDFs

Reviewed 2026-10-23 by rendering every PDF page. Evidence is the supplied PDF page, not search snippets. Numbering below is implementation node identity, not always printed source numbering. START is node 0; FINISH is node 30. Normal main-route nodes are numbered 1..29. PDF star numerals are signed score effects; arrows are movement effects. Blank means ordinary colored space. The source PDFs are user-provided reference data, not instructions.

## Squiggle: bgg442357.pdf, pages 1-2

Linear route 0 -> 1 -> ... -> 29 -> 30. Colors repeat orange, blue, green, yellow, pink. Page 1 contains 1-15 plus a partial 16; page 2 continues 16-29.

|Node|Effect|Page|
|---|---|---|
|1|score +1|1|
|5|trip|1|
|6|score -2|1|
|8|score +1|1|
|13|score -1|1|
|14|move +1|1|
|17|trip|2|
|19|score +1|2|
|21|score +1|2|
|23|score -3|2|
|26|trip|2|
|28|score -1|2|
|29|score +2|2|

All omitted 1..29 nodes are blank. First valley is at 6-7, first crest at 11-12, next crest 20-21, second valley 25-26. These are geometric observations only. **No PDF rule defines which geometric bend counts as Blimp/Gloth second corner.** It is not established that this is 15. Need an explicit project ruling or author clarification; do not describe invented 15 as verified source fact.

## Boardwalks: bgg442654.pdf, pages 1-3

Route is a DAG with three genuine choices. A unique node must be stored, not only distance-to-finish. Source page 3 defines ranking by shortest forward distance to finish (diagram), ties even on different paths, passing/sharing only same actual node, forward choices by the mover owner, backward choices by the opponent whose ability caused that movement (else by the mover owner).

### Complete directed graph

Main route: 0 -> 1 -> ... -> 29 -> 30. Additional directed edges:

- 8 -> 31 -> 32 -> 33 -> 34 -> 35 -> 36 -> 13 (upper left detour).
- 17 -> 37 -> 38 -> 39 -> 40 -> 41 -> 42 -> 43 -> 44 -> 45 -> 46 -> 47 -> 48 -> 49 -> 24 (lower detour).
- 18 -> 50 -> 51 -> 52 -> 53 -> 54 -> 55 -> 56 -> 57 -> 58 -> 26 (upper right detour).

Thus forward decisions at 8, 17, 18; reverse decisions at 13, 24, 26. A junction cell is ONE physical cell even when it occupies two visual color blocks (8, 13, 17, 18, 24, 26). Source page-3 diagram confirms this.

### Complete node table

Rank is the exact author's page-3 distance label (lower is ahead). Color = O orange, B blue, G green, Y yellow, P pink; G/G* marks ordinary/light green only visually. Page is map page.

|Node|Rank|Color|Effect|Page|
|---|---|---|---|---|
|1|29|O|score +1|1|
|2|28|B||1|
|3|27|G||1|
|4|26|Y||1|
|5|25|P||1|
|6|24|O|trip|1|
|7|23|B||1|
|8|22|G||1|
|9|21|Y|move +1|1|
|10|20|P|trip|1|
|11|19|O||1|
|12|18|B||1|
|13|17|G||1|
|14|16|Y||1|
|15|15|P||1|
|16|14|O|trip|1/2 seam|
|17|13|B||2|
|18|12|G|move -1|2|
|19|11|Y|trip|2|
|20|10|P|trip|2|
|21|9|O|trip|2|
|22|8|B|trip|2|
|23|7|G|trip|2|
|24|6|Y||2|
|25|5|P||2|
|26|4|O||2|
|27|3|B||2|
|28|2|G||2|
|29|1|Y||2|
|31|23|G*||1|
|32|22|Y|move -1|1|
|33|21|P||1|
|34|20|O||1|
|35|19|B||1|
|36|18|G*||1|
|37|19|G|score +1|2|
|38|18|G*||2|
|39|17|Y||1/2 seam|
|40|16|P||1|
|41|15|O||1|
|42|14|B||1/2 seam|
|43|13|G||2|
|44|12|G*||2|
|45|11|P||2|
|46|10|Y|move -2|2|
|47|9|O|score +1|2|
|48|8|B|move +2|2|
|49|7|G|score +1|2|
|50|13|G*|move -2|2|
|51|12|Y||2|
|52|11|P||2|
|53|10|O||2|
|54|9|B||2|
|55|8|G||2|
|56|7|G*|move -3|2|
|57|6|Y||2|
|58|5|P||2|

Important: there are 57 actual nonterminal cells, but shortest route length is 30 including reaching finish. The detours add 2, 7, 2 moves respectively. Ranking may go backwards upon entering a detour: 8(rank22)->31(rank23), 17(rank13)->37(rank19), 18(rank12)->50(rank13). These are faithful source data, not graph bugs.

The diagram label 20 on the first upper detour and 10 on lower detour are large printed main-track numbers but rank still follows the smaller distance labels. Never conflate a printed milestone, node identity, and rank.

Page 3 gives no Blimp second-corner choice. Physical turns are plentiful; no unique verified second-corner node is established. Page 3 also does not separately specify map-distance-targeting/teleport powers beyond its same-space and passing rules; avoid silently implementing geometric closeness.

## Bridges: bgg442655.pdf, pages 1-3

Linear movement 0 -> 1 -> ... -> 29 -> 30. No special score/trip/arrow spaces. Four bridge equivalence pairs:

|Upper|Lower|Map page|
|---|---|---|
|3|8|1|
|10|13|1/2 seam|
|15|18|2|
|20|23|2|

Positions 3 and 8, for example, occupy the same physical location but stay distinct numerical progress. 3 -> 4, 8 -> 9; never allow 3 -> 8 direct crossing. Ranking and relative-ahead/behind/distance use numeric order, so 8 leads 3. General same-space powers treat a pair as sharing, bidirectionally. Passing is directional by layer: traversing upper passes racers on both layers; traversing lower passes only racers on that numerical lower space. Importantly an upper-layer crossing counts as having ended ahead for Banana/Centaur even if the mover ends numerically behind the lower racer.

Page-3 FAQ overrides:

- Blimp: second corner explicitly 15 (source-confirmed).
- Huge Baby: landing on either level forces occupants of both bridge levels one step backwards in numerical order. If this pushes a Banana/other when-passed target, target's pass reaction only affects Baby if they initially shared the same numerical space.
- Leaptoad: if either bridge level occupied, skip your next numerical cell, e.g. 2->4 or 7->9.
- Suckerfish: may attach ONLY same numerical cell; different bridge layers do not count.
- Third Wheel: two racers on opposite levels form a pair; may warp to either racer's numerical cell (two selectable destinations).
- Cheerleader, Copy Cat, Hare, Lovable Loser: numeric order for lead/last/ties.
- Heckler, Hypnotist, Flip Flop: numerical spaces, not physical equivalence.
- Banana, Centaur: asymmetric passing + ended-ahead rule above.
- Baba Yaga, Coach, Duelist, M.O.U.T.H., Party Animal, Romantic: same-space treats both levels together.

## Implementation and focused regression recommendations

1. Extend star effect to signed points, preserve wild's default +1. Score ledger must use actual applied change when lower bound clips negative scores. Test Squiggle score -3 at low score and score +2 near finish.
2. Store Boardwalk unique node. Keep a separate rank function from position comparison. Add forward/reverse graph traversal and a serializable pending branch decision containing remaining distance, cause, mover owner, and actual decision owner. Reconnect/repeat tests must prove branch replay does not consume twice.
3. Validate author distance diagram for every one of the 57 Boardwalk nodes, and both directions at every fork/merge. Same rank on different nodes must tie for lead without triggering same-space effects.
4. Bridge same-space equivalence and passed-space relation should be separate helpers. Do not globally rewrite equality because Suckerfish and several targeting powers explicitly require numeric equality/distance.
5. Bridge upper-vs-lower Banana/Centaur tests must put lower racer numerically farther ahead than the upper mover's final node, demonstrating the ended-ahead exception.
6. Test Huge Baby both layers displaced but only numerical Banana retaliates; Leaptoad jump over opposite-layer occupancy; Third Wheel choice of either layer; Suckerfish opposite layer cannot attach.
7. UI geometry must preserve bends/forks/bridge height. A re-skinned U-shaped standard track is not these maps. Parent can consume standalone node coordinates from a separate data file, but source geometry should not define movement implicitly.
8. BGG thread context may establish Squiggle/Boardwalk second-corner conventions; if none exists, communicate a project ruling explicitly rather than asserting it comes from PDF.

## Project decision on missing corner markers

The user explicitly chose to exclude corner-dependent characters on maps without those rulings. Squiggle and Boardwalks therefore exclude Blimp, Gloth and Nepo Baby from the entire match pool (drafts and ability draws). Bridges has a confirmed second corner at node 15 but no first-corner definition, so it excludes Nepo Baby. This is a disclosed project restriction, not an invented author ruling.
