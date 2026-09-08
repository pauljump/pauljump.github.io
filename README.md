# Paul Jump

Paul's personal site and the public story of how a wide year of building led to
[Kit](https://kit.polyfeeds.dev).

Live site: [pauljump.github.io](https://pauljump.github.io)

Narrative portfolio: [pauljump.github.io/portfolio](https://pauljump.github.io/portfolio)

The repository is a dependency-free static GitHub Pages site. The homepage is
the short-link hub authored directly in `index.html`. The longer Kit narrative
formerly on the homepage now lives at [/kit/](https://pauljump.github.io/kit/).
The applied AI case study remains available at
[/case/](https://pauljump.github.io/case/).

Public product links:

- [Try Kit](https://kit.polyfeeds.dev)
- [See the packet demo](https://kit.polyfeeds.dev/demo)

The general resume is available at
[/resume/Paul-Jump-Resume.docx](https://pauljump.github.io/resume/Paul-Jump-Resume.docx).

This repository contains no private family records, client documents, medical
files, or unpublished legal material.

MatterScope outreach analytics use the existing Pulse collector. Tagged links:

- Demo: https://go.polyfeeds.dev/r/matterscope-demo-x
- Case: https://go.polyfeeds.dev/r/matterscope-case-x
- Source: https://go.polyfeeds.dev/r/matterscope-code-x

The campaign is `legora-matterscope`. Pulse records redirect clicks, case views,
active dwell time, case-to-demo clicks, and demo interactions / GitHub clicks.
Tags identify the outreach link, not a verified person's identity. Scanner hits
remain visible and are excluded from Pulse's estimated human-click count.

The hosted synthetic demo alone includes `case/matterscope-tracking.js`. It sends
allowlisted interaction names, campaign tags, a browser visitor ID, and page / referrer
paths; Pulse adds its existing network and device metadata. It does not read document
or runtime content. The original capture and release download in the MatterScope
repository have no analytics. Regenerate the hosted copy with
`node scripts/publish-matterscope-demo.mjs` (requires sibling `matterscope` checkout).
Verify with `node --test tests/matterscope-tracking.test.mjs`.
