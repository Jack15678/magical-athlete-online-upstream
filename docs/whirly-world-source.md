# Whirly World source follow-up

Reviewed 2026-10-23. This is a source investigation, not a completed map implementation.

## Confirmed source

The user-supplied `magical_athlete_sec_livro_de_regras_da_expansao_s_350133.pdf` gives the Whirl landing/warp rule on page 23 and a perspective board illustration on page 21. The three independently readable pairs remain **3 ↔ 5, 7 ↔ 12, 10 ↔ 15**, numbered from START=0 along the main route. See [Second Wind source review](second-wind-map-source.md#whirly-world可确认机制与图片缺口) for the rule and test requirements.

Page 21 is a single 1473 × 1035 JPEG image (PDF image object 464, with transparency mask 463), not a board image with a separately removable foreground box. Inspection of the rendered page and the PDF image inventory confirms that extracting the page objects cannot reveal the covered cells. The lower route and the ends of its Whirls cannot all be verified from this image. Existing warp engine support does not establish the missing map data.

## Further source checks

- The publisher's [public product catalog](https://www.cmyk.games/products.json?limit=250) returned 59 products. The matching products were `Magical Athlete` and `Magical Athlete Case (6 games)`; their listed photographs were for the base game. No Second Wind board image was present in that response. This is a dated observation of that catalog response, not a claim that no such image exists anywhere.
- The [Ludopedia rulebook listing](https://ludopedia.com.br/jogo/magical-athlete-second-wind/anexos/350133) matches the supplied PDF. Search results for the early Second Wind announcement and community sharing of the rulebook did not yield an independently readable, uncovered Whirly board.
- The [BGG general forum listing](https://boardgamegeek.com/boardgame/454103/magical-athlete/forums/65) had a search-indexed “Expansion First Look” item, but fetching the page returned a Cloudflare “Sorry, you have been blocked” page. Its underlying discussion and images were not verified.

## Remaining prerequisite

An unobstructed photo/scan of the full Whirly side, or the complete endpoint list from its author/publisher, is still required. A useful image must expose every cell on the lower straight and both ends of every Whirl. Once it is available, add the full symmetric pair table and verify bidirectional landing, crossing without landing, ability warp arrivals, destination abilities, and serialization between the original landing and the Whirl warp.

The partial three-pair map must not be opened as the complete Whirly World map. This follow-up changes no map availability or gameplay behavior.
