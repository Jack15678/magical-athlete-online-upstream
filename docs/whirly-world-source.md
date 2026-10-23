# Whirly World source follow-up

Reviewed 2026-10-23. This is a source investigation, not a completed map implementation.

## 2026-10-24: implement known connections and co-design the rest

Latest correction after the first Dots delivery: the user specified **six** pairs. The target is the existing four plus **18 ↔ 22** and **24 ↔ 27**. The earlier four-pair approval is superseded. The received model and current engine draft still contain four pairs; the attempted four-pair opening was withdrawn before any commit, push or deployment. The additional pairs are being handed back to Dots in [the six-pair revision brief](prompts/dots-whirly-world-six-pairs.md). Finish the six-pair model and corresponding engine checks before reopening the map/tours.

The user explicitly chose to implement the visible portion first and discuss a house-rule layout for the obscured portion. Finding a complete original image is no longer a prerequisite for finishing a clearly labelled web adaptation.

- Implemented in `src/shared/tracks.ts`: the source-read 3 ↔ 5, 7 ↔ 12 and 10 ↔ 15 pairs, plus **20 ↔ 23**, supplied by the user on 2026-10-24. The latter is recorded as a user-supplied correction, not independently established by the earlier image review. The draft uses the existing landing/warp engine and tile renderer, with `verified: false`.
- The initial proposals **18 ↔ 22** and **24 ↔ 27** are now included in the user's six-pair target, retaining 20 ↔ 23 and ordinary cells elsewhere, including 28–29. These are web adaptation values, not an original-board reconstruction claim or a tested balance result.
- The four-pair draft is available to development fixtures, with an in-race explanation. It is not selectable for a normal room while the six-pair model and rules await completion. This wait is for the requested revision, not for an unobstructed source image.
- After agreement, label the playable map and any tour containing it as a web adaptation; do not present a custom layout as the original official board. The source investigation below remains a dated record of the original map's evidence gap.

## Confirmed source

The user-supplied `magical_athlete_sec_livro_de_regras_da_expansao_s_350133.pdf` gives the Whirl landing/warp rule on page 23 and a perspective board illustration on page 21. The three independently readable pairs remain **3 ↔ 5, 7 ↔ 12, 10 ↔ 15**, numbered from START=0 along the main route. See [Second Wind source review](second-wind-map-source.md#whirly-world可确认机制与图片缺口) for the rule and test requirements.

Page 21 is a single 1473 × 1035 JPEG image (PDF image object 464, with transparency mask 463), not a board image with a separately removable foreground box. Inspection of the rendered page and the PDF image inventory confirms that extracting the page objects cannot reveal the covered cells. The lower route and the ends of its Whirls cannot all be verified from this image. Existing warp engine support does not establish the missing map data.

## Further source checks

- The publisher's [public product catalog](https://www.cmyk.games/products.json?limit=250) returned 59 products. The matching products were `Magical Athlete` and `Magical Athlete Case (6 games)`; their listed photographs were for the base game. No Second Wind board image was present in that response. This is a dated observation of that catalog response, not a claim that no such image exists anywhere.
- The [Ludopedia rulebook listing](https://ludopedia.com.br/jogo/magical-athlete-second-wind/anexos/350133) matches the supplied PDF. Search results for the early Second Wind announcement and community sharing of the rulebook did not yield an independently readable, uncovered Whirly board.
- The [BGG general forum listing](https://boardgamegeek.com/boardgame/454103/magical-athlete/forums/65) had a search-indexed “Expansion First Look” item, but fetching the page returned a Cloudflare “Sorry, you have been blocked” page. Its underlying discussion and images were not verified.

## Remaining prerequisite for an exact reproduction

An unobstructed photo/scan of the full Whirly side, or the complete endpoint list from its author/publisher, is still required. A useful image must expose every cell on the lower straight and both ends of every Whirl. Once it is available, add the full symmetric pair table and verify bidirectional landing, crossing without landing, ability warp arrivals, destination abilities, and serialization between the original landing and the Whirl warp.

The 2026-10-23 investigation established only three pairs and did not change gameplay. The implemented co-design draft and subsequent user corrections are described above; it is not presented as a complete original-board reconstruction.
