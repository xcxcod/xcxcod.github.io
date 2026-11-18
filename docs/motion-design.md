# Portfolio motion direction

> The hero portion of this earlier plan is superseded by [the measured hero proof](performance/hero-investigation.md). Lower sections retain the choreography below; the hero now has exclusive ScrollTrigger ownership and on-demand rendering.

## Original motion pass (historical)

## Audit and references
The previous controller scrubbed generic entrances over short viewport intervals. Projects were sticky, but the hero, about and education did not share a story arc. The existing lens, constellation, typography and actual portfolio content are retained.

Browser study: Apple iPhone Air, MacBook Pro / PROLED XDR, and giats.me. Apple's staged product scale, visual holding space, persistent context and feature grouping inform the pacing. Giats informs the asymmetric composition and masked text. Some Apple media loads inconsistently in this browser; no claim is made to have inspected every video frame. No reference artwork, copy or branding is reused.

## Section choreography
| Scene | Initial state and trigger | Scroll sequence | Pin / transition | Reverse | Mobile / reduced motion |
|---|---|---|---|---|---|
| Hero | Headline masks enter once after intro; field already visible | 5–40% headline lifts/contracts; 0–55% field expands; glass backdrop turns and moves; 50–84% bridge text emerges | 195svh chapter / 100svh sticky stage; bridge leads into Work | All scene transforms reverse; first-load entrance runs once | Natural flow, no pin/bridge; reduced keeps all identity visible |
| Selected Work | Preview inset and tipped; caption masked | 0–55% preview expands; 10–64% perspective straightens; 44–78% description opens; 65–90% technologies enter | 175svh per project; viewport holds preview; release to next project | Exact paused timeline seek | Unpinned with shorter viewport-based interval; reduced static |
| About | Heading/copy masked, wordmark offset | 0–18% label, 8–45% heading, 34–75% biography, continuous wordmark parallax | 170svh chapter, sticky editorial scene | Exact timeline reversal | No pin; readable document flow / reduced static |
| Education | Heading anchored, actual study and learning groups masked | Sequential university and current-learning reveals; no fabricated milestones/dates | Sticky heading alongside flowing details | Scroll progress reverses | Stacked content, no sticky heading / reduced static |
| Toolkit | Existing scattered 23-node graph | Assembly and edges use common native-scroll clock; subtle establishing camera position; user interaction completes assembly | No long pin because controls and detail panel need space | Nodes reconstruct/re-scatter until user explicitly engages | Touch cards and accessible list / reduced assembled graph |
| Contact | Invitation masked below viewport | Label, title and invitation reveal locally at viewport approach | No pin; settles into footer | Exact reversal | Same short reveal / reduced static |

## Engineering decisions
Use paused Web Animations API timelines, CSS sticky and existing R3F. GSAP/ScrollTrigger evaluated: unnecessary for this finite set of transforms since the existing paused timelines already allow exact, reversible seeking. No wheel interception, smooth-scroll engine or simulated scroll position. One passive scroll listener + scheduled RAF controls DOM scenes and dispatches the shared `portfolio:scroll` clock to WebGL components. Geometry measured only on resize/content-size/font changes. No React state per frame. No continuously running DOM animation loop.

Reduced-motion cancels timelines and removes sticky scene lengths. Pause scroll effects exposes static content immediately. Keyboard focus forces containing tracks to completion. Without JS, all content remains in natural flow. All listeners, observers, timelines and scheduled frames are released on cleanup. Heavy scenes remain lazy loaded and visibility-aware; no additional libraries or image sequences.

## Verification
- Typecheck, lint, 42 tests across 11 files, and the 13-page static production export pass.
- Actual production output tested in IAB at 1440×1000, 768×1024 and 390×844.
- Slow forward/back scroll, held scroll progress, fast end-to-end scroll and reversal checked through every section. Hero held at 0.3642 without scrolling; project caption reversed to 0.184 after upward scrolling.
- Motion pause removes sticky layout and timelines. Keyboard-focus reveal and OS reduced-motion branches covered by automated tests; OS setting itself was not changed during browser QA.
- Mobile Next.js selection shows the real Portfolio Website association. No horizontal overflow at final tested widths; no browser warnings/errors in the tested session.
- Some reference Apple media failed to render consistently; comparison is limited to the scenes and layout states that loaded.
