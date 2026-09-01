# World land topology

`world-land-110m.json` is `world-atlas@2` `land-110m.json`, downloaded from
jsDelivr on 2026-09-01. The ISC-licensed topology is derived from Natural
Earth's public-domain 1:110m land boundaries. It is bundled locally so the
Homepage globe remains accurate, private and independent of third-party
runtime requests.

Source: <https://github.com/topojson/world-atlas>

The topology remains the no-network fallback for the globe renderer. The
primary local renderer now uses the self-hosted NASA Blue Marble texture at
`../images/home/earth-blue-marble-nasa-2048.jpg`; its source and credit are
recorded in `../images/GENERATED-ASSETS.md`. No browser-time request is made to
NASA or another third party.
