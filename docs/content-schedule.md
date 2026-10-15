# Content schedule: Teeko

Source: the Content Schedule tab of docs/content-schedule-2026-10-to-2027-03.html (Oct 2026 to
Mar 2027, prepared 30 Sep 2026, October additions 1 Oct 2026). This file is that plan with a status column. The SEO client
tracker reads it on every push.

**Blog posts are written in the admin panel, not in this repo, so nothing is detected
automatically. The Status column is the only record: update it when a piece moves.**
Statuses: Not started, In progress, Blocked, Built (written, waiting for sign-off or
publishing), Live (published on teeko.ai), Dropped. Code work (the Build rows) is Built when
it is merged and Live when it is deployed.

**Type** gives the pillar and the language: EN, BM, or ZH (中文). BM and 中文 rows are the
previous month's topics, retitled to each language's own keyword rather than translated.
190 pieces count toward the plan (70 EN, 60 BM, 60 中文). The Build and Optimise rows are extra work and
are not part of the 190. The Slug column is optional. Fill it in once a post is published, for reference.

Keep the ID column. It is how the tracker matches rows. A new row needs a new, unused ID.

## Month 1: Build + Arrival Core

October 2026. 20 English pieces while the ttklia.com path and the locale layer are built. tk166–tk175 (Lalaport, private transfer, private driver) were added on 1 Oct 2026

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk001 | ttklia.com cta on all 12 existing posts + nav link |  | Build |  | In progress | Not counted in the 190. 15 Oct 2026: ttklia cta block added in admin to the 9 older posts without one (the 3 F1 posts already link the F1 shuttle), UTM utm_medium=blog&utm_campaign=<slug>&utm_content=en. Nav link “Airport Transfer” (utm_medium=nav) is live on teeko.ai (15 Oct 2026, main d834a50). OPEN-ITEMS #1: the client has not confirmed the UTM convention |
| tk002 | Locale layer: data model, routing, hreflang, switcher |  | Build |  | Live | Not counted in the 190. OPEN-ITEMS #2: every BM and 中文 piece depends on it |
| tk003 | GA4 outbound-click event · restaurant page metadata · F1 cluster refresh |  | Build |  | Not started | Not counted in the 190. KPI 2 baseline and a quick ranking lift |
| tk004 | MDAC: fill in Malaysia's arrival card before you fly | mdac malaysia | Transport · EN | /blog/mdac-malaysia | Live | 14,800/mo · SD 32. Route: Homepage: plan the ride |
| tk005 | KLIA2 to KL Sentral: bus, train, taxi and Grab compared | transport from klia2 to kl sentral | Transport · EN | /blog/klia2-to-kl-sentral | Live | 1,600/mo · SD 16. Route: Bus: KLIA2 → KL Sentral. Publish after tk166 (links its Lalaport section) |
| tk006 | Arriving at KLIA2: from the gate to your ride | klia2 arrival hall | Transport · EN | /blog/klia2-arrival-hall | Live | 590/mo · SD 31. Retargeted 11 Oct: “klia2 arrival guide” measured 10, “klia2 arrival” is flight-status intent. “klia2 arrival pick up point” 320/mo · SD 14 is the secondary. Route: /bus/destinations |
| tk007 | KLIA2 airport taxi: how to find the taxi counter | airport taxi klia2 | Transport · EN | /blog/klia2-airport-taxi | Live | 210/mo · SD 21 (“klia2 taxi” 170/mo · SD 15, also in the title). Retitled 6 Oct 2026 around ttklia’s TikTok walk to the Door 2 and Door 3 counters; coupons dropped, no source for how they work. Route: Taxi booking |
| tk008 | KLIA2 to Bukit Bintang | klia2 to bukit bintang | Transport · EN | /blog/klia2-to-bukit-bintang | Live | 140/mo · SD 13. Route: /bus/klia2-to-kl-city-centre-pudu-sentral and /bus/klia2-to-lalaport-bbcc (the guessed /bus/klia2-to-pudu-sentral is a 404). Absorbs KLIA2 → Lalaport from tk169 (11 Oct) |
| tk009 | KLIA1 to KLIA2: train, shuttle or taxi | klia1 to klia2 | Transport · EN | /blog/klia1-to-klia2 | Live | 1,300/mo · SD 18 (“klia2 to klia1” 720, “klia to klia2” 260). Retargeted 11 Oct. Route: /taxi/klia2-to-klia and /taxi/klia-to-klia2. /bus/klia2-to-klia1 exists but KLIA1 is not in the search dropdown and no price shows; client to confirm |
| tk010 | Landing late at KLIA2: stay at the airport or ride now | klia2 capsule hotel | Transport · EN | /blog/klia2-capsule-hotel | Live | 3,600/mo · SD 21. Route: Taxi booking |
| tk011 | Where to eat near KL Sentral | kl sentral food | Food · EN |  | Blocked | 8,100/mo · SD 14 (“nu sentral food” 27,100). Route: Bus: KLIA2 → KL Sentral. ⚑ The 8 KL Sentral rows in the database are hotel dining; needs NU Sentral (Quizinn Foodcourt, Original Penang Kayu, Kailash Parbat) and Brickfields banana leaf rows added in admin (11 Oct) |
| tk012 | Bukit Bintang food | bukit bintang food | Food · EN | /blog/bukit-bintang-food | Live | 5,400/mo · SD 17. Route: Bus: KLIA2 → Pudu Sentral |
| tk013 | Malaysia tourist SIM card: collect at KLIA2 or use an eSIM | malaysia tourist sim card | SIM · EN | /blog/malaysia-tourist-sim-card | Live | 320/mo · SD 14 (“tourist sim card malaysia” 320 · SD 17 as secondary). Route: SIM booking, then /bus/klia2-to-kl-sentral. ⚑ “No ID required” on the SIM pages vs the 2026 MCMC registration rules: OPEN-ITEMS #14 |
| tk166 | Singapore to KL by bus: arriving at Lalaport BBCC | singapore to kl bus | Transport · EN | /blog/singapore-to-kl-bus | Live | 6,600/mo in Singapore, 590/mo in Malaysia · SD 21. Route: return leg /bus/lalaport-to-bugis, then the onward ride. ⚑ ttklia.com does not sell Singapore → Lalaport (reverse URLs 404); client to confirm |
| tk167 | Lalaport BBCC Transportation Hub: finding your bus, lockers and lounge | lalaport transportation hub | Transport · EN | /blog/lalaport-transportation-hub | Live | 1,000/mo · SD 14. The hub name “lalaport bbcc” gets 5,400/mo · SD 21; use it as the secondary keyword. Route: /guide/how-to-get-from-lalaport |
| tk168 | KL to Singapore bus from Lalaport: choosing your drop-off point | kl to singapore bus | Transport · EN | /blog/kl-to-singapore-bus | Live | 6,600/mo · SD 40 (“bus from kl to singapore” 6,600 · SD 34). Retargeted 11 Oct from “lalaport to singapore bus” (70). Route: /bus/lalaport-destinations and the 24 /bus/lalaport-to-* pages |
| tk169 | Bukit Bintang to KLIA2: the bus from Lalaport BBCC | bukit bintang to klia2 | Transport · EN | /blog/bukit-bintang-to-klia2 | Live | 90/mo · SD 10. Retargeted 11 Oct: “klia2 to lalaport” measured 10 and overlapped tk008, which now covers that direction. Route: /bus/lalaport-to-klia2 |
| tk170 | Where to eat at and around Lalaport BBCC | lalaport bbcc food | Food · EN |  | Blocked | 260/mo · SD 13. Route: /bus/klia2-to-lalaport-bbcc. ⚑ Needs Lalaport restaurant rows in admin |
| tk171 | Things to do in Bukit Bintang from Lalaport BBCC: walking distance, MRT, monorail and Grab | things to do in bukit bintang | Destination · EN | /blog/things-to-do-in-bukit-bintang | Live | 880/mo · SD 18. Retargeted 3 Oct: “things to do near lalaport” measured 0. Route: /bus/lalaport-to-klia2 |
| tk172 | Taxi to KLIA or KLIA2 from KL: fixed-price taxi, Grab or bus | taxi to klia | Transport · EN | /blog/taxi-to-klia | Live | 880/mo · SD 26 (“klia transfer” 1,300 · SD 28 as secondary, both directions). Retargeted 11 Oct. Route: ttklia.com homepage Taxi tab (swap arrow), /bus/lalaport-to-klia2. ⚑ /taxi/bukit-bintang-bangsar-to-klia2 and ~150 other hyphenated reverse slugs 404: OPEN-ITEMS #15 |
| tk173 | KLIA2 to your KL hotel by private transfer: sedan, MPV or van | airport transfer kuala lumpur | Transport · EN | /blog/airport-transfer-kuala-lumpur | Live | 170/mo · SD 21 (“kl airport transfer” 50 MY, 70 SG). Retargeted 11 Oct. Route: /taxi/klia2-to-bukit-bintang-bangsar |
| tk174 | Hiring a private driver in KL and Selangor: how the 8- and 10-hour charters work | rent car with driver kuala lumpur | Transport · EN |  | Blocked | 210/mo · SD 11 (“private driver kuala lumpur” 70). Retargeted 11 Oct. Route: /car-charter. ⚑ Fuel, tolls, parking, overtime and coverage are not published, and three price rows are flagged deleted in ttklia’s data: OPEN-ITEMS #15 |
| tk175 | Genting Highlands by private driver: a day trip from KL | genting highlands day trip | Transport · EN | /blog/genting-highlands-day-trip | Live | 140/mo · SD 20 (“genting day trip” 50). Retargeted 11 Oct. Route: /car-charter. Client confirmed 3 Oct: the charter covers Genting. Genting van is Coming Soon, so not linked |
| tk196 | KLIA2 bus station: how to walk there from arrivals | klia2 bus station | Transport · EN | /blog/klia2-bus-station | Live | 320/mo · SD 18 (“klia2 bus terminal” the same). Added 6 Oct 2026 at the client’s request, embeds ttklia’s TikTok walk-through. Narrower than tk006, which should link to it. Route: /guide/how-to-get-from-klia2 |
| tk197 | Terminal bas KLIA2 (KLIA2 bus station: how to walk there from arrivals) | terminal bas klia2 | Transport · BM | /ms/blog/terminal-bas-klia2 | Live | 720/mo · SD 16. Route: /guide/how-to-get-from-klia2 |
| tk198 | 吉隆坡机场巴士 (KLIA2 bus station: how to walk there from arrivals) | 吉隆坡机场巴士 | Transport · ZH | /zh/blog/klia2-bus-station | Live | 10/mo · SD 50; the only Chinese variant with measured volume (“klia2 巴士”, “klia2 巴士站” measured nothing). Route: /guide/how-to-get-from-klia2 |

## Month 2: KL Food + Genting

November 2026. BM and 中文 launch with Month 1’s topics. The Lalaport and private-transport set (tk176–tk185) goes to 中文 first

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk014 | KLIA2 food: where to eat after you land | klia2 food | Food · EN |  | Not started | 8,100/mo · SD 14. Route: Bus destinations list. ⚑ Needs KLIA2 outlets added in admin |
| tk015 | Petaling Street food | petaling street food | Food · EN |  | Not started | 5,400/mo · SD 26. Route: Bus: KLIA2 → Pudu Sentral |
| tk016 | Jalan Alor food | jalan alor food | Food · EN |  | Not started | 3,600/mo · SD 31. Route: Bus: KLIA2 → Pudu Sentral |
| tk017 | Where to eat in KL on your first night | best food in kl | Food · EN |  | Not started | 1,600/mo · SD 20. Route: Bus: KLIA2 → KL Sentral |
| tk018 | Nasi lemak in KL | nasi lemak kl | Food · EN |  | Not started | 1,300/mo · SD 20. Route: Bus: KLIA2 → KL Sentral |
| tk019 | Halal food in KL | halal food kl | Food · EN |  | Not started | 170/mo · SD 16. Route: Bus: KLIA2 → KL Sentral |
| tk020 | Genting Highlands food | genting highlands food | Food · EN |  | Not started | 2,400/mo · SD 17. Route: /genting. ⚑ Needs Genting restaurant rows in admin |
| tk021 | KL to Genting: bus, taxi and the cable car | kl to genting | Transport · EN |  | Not started | 720/mo · SD 24. Route: /genting |
| tk022 | KLIA2 luggage storage | klia2 luggage storage | Transport · EN |  | Not started | 720/mo · SD 12. Route: Bus destinations list |
| tk023 | Things to do in Genting | things to do in genting | Destination · EN |  | Not started | 590/mo · SD 18. Route: /genting |
| tk024 | MDAC Malaysia: Cara Isi Kad Ketibaan Sebelum Terbang | mdac malaysia | Transport · BM | /ms/blog/cara-isi-mdac-malaysia | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Homepage: plan the ride |
| tk025 | KLIA2 ke KL Sentral: Bas, Tren, Teksi atau Grab | klia2 ke kl sentral | Transport · BM | /ms/blog/klia2-ke-kl-sentral | Live | 210/mo · SD 17. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk026 | Balai Ketibaan KLIA2: Dari Pintu Pesawat ke Bas atau Teksi | balai ketibaan klia2 | Transport · BM | /ms/blog/balai-ketibaan-klia2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk027 | Teksi KLIA2 (KLIA2 airport taxi: how to find the taxi counter) | teksi klia2 | Transport · BM | /ms/blog/teksi-klia2 | Live | 20/mo · SD 37. Route: Taxi booking |
| tk028 | KLIA2 ke Bukit Bintang: Bas, Tren atau Teksi | klia2 ke bukit bintang | Transport · BM | /ms/blog/klia2-ke-bukit-bintang | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk029 | KLIA 1 ke KLIA 2: Tren, Bas atau Teksi | klia 1 ke klia 2 | Transport · BM | /ms/blog/klia-1-ke-klia-2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-klia1 |
| tk030 | Hotel Kapsul KLIA2: Tidur di Sini atau Terus ke KL | hotel kapsul klia2 | Transport · BM | /ms/blog/hotel-kapsul-klia2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk031 | Makan dekat KL Sentral (Where to eat near KL Sentral) | makanan sedap kl | Food · BM |  | Not started | 1,000/mo · SD 24. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk032 | Tempat Makan Bukit Bintang: Apa Nak Makan dan Di Mana | tempat makan bukit bintang | Food · BM | /ms/blog/tempat-makan-bukit-bintang | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk033 | SIM Kad Pelancong Malaysia: Ambil di KLIA2 atau Guna eSIM | sim kad pelancong | SIM · BM | /ms/blog/sim-kad-pelancong-malaysia | Live | Keyword not yet measured. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk034 | 马来西亚入境卡MDAC：出发前怎么填写 | 马来西亚入境卡 | Transport · ZH | /zh/blog/mdac-malaysia | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Homepage: plan the ride |
| tk035 | 吉隆坡机场到市区：KLIA2去KL Sentral怎么走 | 吉隆坡机场到市区 | Transport · ZH | /zh/blog/klia2-to-kl-sentral | Live | 30/mo · SD 42. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk036 | KLIA2入境大厅：下机后怎么去搭车 | KLIA2入境大厅 | Transport · ZH | /zh/blog/klia2-arrival-hall | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk037 | 吉隆坡机场德士 (KLIA2 airport taxi: how to find the taxi counter) | 吉隆坡机场德士 | Transport · ZH | /zh/blog/klia2-airport-taxi | Live | No Chinese variant measured volume (吉隆坡机场德士, 吉隆坡机场出租车, klia2德士 all 0); 德士 is the Malaysian usage. Route: Taxi booking |
| tk038 | KLIA2到Bukit Bintang：巴士、火车和德士 | KLIA2到Bukit Bintang | Transport · ZH | /zh/blog/klia2-to-bukit-bintang | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk039 | KLIA1到KLIA2：火车、巴士和转机须知 | klia1到klia2 | Transport · ZH | /zh/blog/klia1-to-klia2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-klia1 |
| tk040 | KLIA2酒店：晚到住机场还是直接进城 | klia2酒店 | Transport · ZH | /zh/blog/klia2-capsule-hotel | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk041 | 吉隆坡中央车站美食 (Where to eat near KL Sentral) | 吉隆坡美食 | Food · ZH |  | Not started | 1,900/mo · SD 39. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk042 | Bukit Bintang美食：吃什么、在哪吃 | bukit bintang美食 | Food · ZH | /zh/blog/bukit-bintang-food | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk043 | 马来西亚电话卡：KLIA2领取还是用eSIM | 马来西亚电话卡 | SIM · ZH | /zh/blog/malaysia-tourist-sim-card | Live | 90/mo · SD 59. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk176 | 新加坡到吉隆坡巴士：在Lalaport BBCC下车 | 新加坡到吉隆坡巴士 | Transport · ZH | /zh/blog/singapore-to-kl-bus | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: return leg /bus/lalaport-to-bugis, then the onward ride. ⚑ ttklia.com does not sell Singapore → Lalaport (reverse URLs 404); client to confirm |
| tk177 | Lalaport BBCC交通枢纽：巴士、储物柜和休息室 | lalaport bbcc | Transport · ZH | /zh/blog/lalaport-transportation-hub | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /guide/how-to-get-from-lalaport |
| tk178 | 吉隆坡到新加坡巴士：从Lalaport BBCC出发 | 吉隆坡到新加坡巴士 | Transport · ZH | /zh/blog/kl-to-singapore-bus | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-bugis (+23 Singapore stops) |
| tk179 | Bukit Bintang去KLIA2怎么搭巴士 | Bukit Bintang去KLIA2 | Transport · ZH | /zh/blog/bukit-bintang-to-klia2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-klia2 |
| tk180 | Where to eat at and around Lalaport BBCC |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-lalaport-bbcc. ⚑ Needs Lalaport restaurant rows in admin |
| tk181 | Bukit Bintang景点：走路、MRT和单轨都能到 | bukit bintang景点 | Destination · ZH | /zh/blog/things-to-do-in-bukit-bintang | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-klia2 |
| tk182 | 去吉隆坡机场：定价德士、Grab还是巴士 | 去吉隆坡机场 | Transport · ZH | /zh/blog/taxi-to-klia | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: taxi transfer (sedan, MPV, van). ⚑ KL-side deep link not found; client to supply |
| tk183 | 吉隆坡机场接送：轿车、MPV还是Van | 吉隆坡机场接送 | Transport · ZH | /zh/blog/airport-transfer-kuala-lumpur | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: taxi transfer · /taxi/klia2-to-klia |
| tk184 | Hiring a private driver in KL and Selangor: how the 8- and 10-hour charters work |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /car-charter |
| tk185 | 云顶一日游：吉隆坡包车上Genting Highlands | 云顶一日游 | Transport · ZH | /zh/blog/genting-highlands-day-trip | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /car-charter. Client confirmed 3 Oct: the charter covers Genting. Genting van is Coming Soon, so not linked |

## Month 3: Penang & the South

December 2026. Includes the Lalaport and private-transport set in BM (tk186–tk195)

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk044 | Penang food | penang food | Food · EN |  | Not started | 9,900/mo · SD 14. Route: Bus: KLIA2 → Sungai Nibong |
| tk045 | KLIA2 to Penang by bus | klia2 to penang | Transport · EN |  | Not started | 70/mo · SD 32. Route: Bus: KLIA2 → Sungai Nibong / Butterworth |
| tk046 | Melaka food | melaka food | Food · EN |  | Not started | 6,600/mo · SD 24. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk047 | Jonker Street food | jonker street food | Food · EN |  | Not started | 880/mo · SD 13. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk048 | KLIA2 to Melaka | klia2 to melaka | Transport · EN |  | Not started | 170/mo · SD 17. Route: Bus: KLIA2 → Melaka Sentral |
| tk049 | JB food | jb food | Food · EN |  | Not started | 2,900/mo · SD 12. Route: Bus: KLIA2 → Larkin |
| tk050 | KLIA2 to Johor Bahru | klia2 to johor bahru | Transport · EN |  | Not started | 50/mo · SD 28. Route: /bus/klia2-to-johor-jaya · /taxi/klia-to-johor-bahru |
| tk051 | Things to do in Kuala Lumpur | things to do in kuala lumpur | Destination · EN |  | Not started | 8,100/mo · SD 24. Route: Bus: KLIA2 → KL Sentral |
| tk052 | Malaysia SIM card: which plan for how many days | sim card malaysia | SIM · EN |  | Not started | 1,300/mo · SD 15. Route: SIM booking, then bus |
| tk053 | New Year's Eve in KL: where to watch, how to get back | new year eve kl | Destination · EN |  | Not started | Route: Taxi booking |
| tk054 | KLIA2 food: where to eat after you land |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list. ⚑ Needs KLIA2 outlets added in admin |
| tk055 | Petaling Street food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk056 | Jalan Alor food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk057 | Where to eat in KL on your first night |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk058 | Nasi lemak in KL |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk059 | Halal food in KL |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk060 | Genting Highlands food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting. ⚑ Needs Genting restaurant rows in admin |
| tk061 | KL to Genting: bus, taxi and the cable car |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting |
| tk062 | KLIA2 luggage storage |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk063 | Things to do in Genting |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting |
| tk064 | KLIA2 food: where to eat after you land |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list. ⚑ Needs KLIA2 outlets added in admin |
| tk065 | Petaling Street food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk066 | Jalan Alor food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk067 | Where to eat in KL on your first night |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk068 | Nasi lemak in KL |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk069 | Halal food in KL |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk070 | Genting Highlands food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting. ⚑ Needs Genting restaurant rows in admin |
| tk071 | KL to Genting: bus, taxi and the cable car |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting |
| tk072 | KLIA2 luggage storage |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk073 | Things to do in Genting |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /genting |
| tk186 | Bas dari Singapore ke Kuala Lumpur: Turun di Lalaport BBCC | bas dari singapore ke kuala lumpur | Transport · BM | /ms/blog/bas-dari-singapore-ke-kuala-lumpur | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: return leg /bus/lalaport-to-bugis, then the onward ride. ⚑ ttklia.com does not sell Singapore → Lalaport (reverse URLs 404); client to confirm |
| tk187 | Hab Pengangkutan Lalaport BBCC: Bas, Loker dan Lounge | lalaport bbcc | Transport · BM | /ms/blog/hab-pengangkutan-lalaport-bbcc | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /guide/how-to-get-from-lalaport |
| tk188 | Bas ke Singapore dari Lalaport BBCC: Pilih Tempat Turun | bas ke singapore | Transport · BM | /ms/blog/bas-ke-singapore | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-bugis (+23 Singapore stops) |
| tk189 | Bas ke KLIA2 dari Bukit Bintang: Naik di Lalaport BBCC | bas ke klia2 | Transport · BM | /ms/blog/bas-ke-klia2 | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-klia2 |
| tk190 | Where to eat at and around Lalaport BBCC |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-lalaport-bbcc. ⚑ Needs Lalaport restaurant rows in admin |
| tk191 | Tempat Menarik di Bukit Bintang dari Lalaport BBCC | tempat menarik di bukit bintang | Destination · BM | /ms/blog/tempat-menarik-di-bukit-bintang | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /bus/lalaport-to-klia2 |
| tk192 | Teksi ke KLIA dan KLIA2: Harga Tetap, Grab atau Bas | teksi ke klia | Transport · BM | /ms/blog/teksi-ke-klia | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: taxi transfer (sedan, MPV, van). ⚑ KL-side deep link not found; client to supply |
| tk193 | Airport Transfer KLIA2 ke Hotel di KL: Sedan, MPV atau Van | airport transfer klia | Transport · BM | /ms/blog/airport-transfer-klia | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: taxi transfer · /taxi/klia2-to-klia |
| tk194 | Hiring a private driver in KL and Selangor: how the 8- and 10-hour charters work |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /car-charter |
| tk195 | Cara ke Genting Highlands: Sehari dengan Pemandu Peribadi | cara ke genting highlands | Transport · BM | /ms/blog/cara-ke-genting-highlands | Live | Keyword measured 15 Oct 2026 (Ubersuggest MY). Retitled to the locale’s own keyword, not translated. Route: /car-charter. Client confirmed 3 Oct: the charter covers Genting. Genting van is Coming Soon, so not linked |

## Month 4: North + Festive Prep

January 2027. Festive pieces go out a month before their search peak

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk074 | Ipoh food | ipoh food | Food · EN |  | Not started | 8,100/mo · SD 16. Route: Bus: KLIA2 → Ipoh Amanjaya. ⚑ Needs Ipoh restaurant rows in admin |
| tk075 | KLIA2 to Ipoh | klia2 to ipoh | Transport · EN |  | Not started | 110/mo · SD 29. Route: Bus: KLIA2 → Ipoh Amanjaya |
| tk076 | KLIA2 transit: leaving the airport on a layover | klia2 transit | Transport · EN |  | Not started | 210/mo · SD 22. Route: Taxi booking |
| tk077 | KLIA2 bus terminal: where it is and how boarding works | klia2 bus terminal | Transport · EN |  | Not started | 320/mo · SD 17. Route: Bus destinations list |
| tk078 | Grab or taxi at KLIA2 | grab klia2 | Transport · EN |  | Not started | 70/mo · SD 22. Route: Taxi booking |
| tk079 | KLIA2 to Putrajaya and Cyberjaya | klia2 to putrajaya | Transport · EN |  | Not started | 110/mo · SD 17. Route: Taxi booking |
| tk080 | Selangor by private driver: Kuala Selangor and Sekinchan in a day | kuala selangor day trip | Transport · EN |  | Not started | Route: /car-charter. Replaced “Car charter from KLIA2 for families and groups” on 1 Oct to avoid overlap with tk174 |
| tk081 | Chinese New Year in KL 2027: what's open, where to eat | chinese new year kl | Destination · EN |  | Not started | Route: Bus: KLIA2 → KL Sentral |
| tk082 | Ramadan bazaar in KL 2027 | ramadan bazaar kl | Food · EN |  | Not started | 140/mo · SD 19. Route: Bus: KLIA2 → KL Sentral |
| tk083 | Thaipusam at Batu Caves: getting there | thaipusam batu caves | Destination · EN |  | Not started | Route: Bus: KLIA2 → KL Sentral |
| tk084 | Penang food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk085 | KLIA2 to Penang by bus |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong / Butterworth |
| tk086 | Melaka food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk087 | Jonker Street food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk088 | KLIA2 to Melaka |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral |
| tk089 | JB food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Larkin |
| tk090 | KLIA2 to Johor Bahru |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-johor-jaya · /taxi/klia-to-johor-bahru |
| tk091 | Tempat menarik di KL (Things to do in Kuala Lumpur) | tempat menarik di kl | Destination · BM |  | Not started | 3,600/mo · SD 37. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk092 | Malaysia SIM card: which plan for how many days |  | SIM · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk093 | New Year's Eve in KL: where to watch, how to get back |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk094 | 槟城美食 (Penang food) | 槟城美食 | Food · ZH |  | Not started | 6,600/mo · SD 38. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk095 | KLIA2 to Penang by bus |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong / Butterworth |
| tk096 | Melaka food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk097 | Jonker Street food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral. ⚑ Needs Melaka restaurant rows in admin |
| tk098 | KLIA2 to Melaka |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Melaka Sentral |
| tk099 | JB food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Larkin |
| tk100 | KLIA2 to Johor Bahru |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-johor-jaya · /taxi/klia-to-johor-bahru |
| tk101 | 吉隆坡景点 (Things to do in Kuala Lumpur) | 吉隆坡景点 | Destination · ZH |  | Not started | 1,900/mo · SD 62. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk102 | Malaysia SIM card: which plan for how many days |  | SIM · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk103 | New Year's Eve in KL: where to watch, how to get back |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |

## Month 5: Ramadan, Raya & First Refresh

February 2027. 7 planned + 3 Search Console slots

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk104 | Buka puasa buffets in KL (BM version leads) | buffet ramadhan kl | Food · EN |  | Not started | 260/mo · SD 13. Route: Bus: KLIA2 → KL Sentral |
| tk105 | Travelling in Malaysia over Hari Raya 2027 | balik kampung raya | Transport · EN |  | Not started | Route: Bus destinations list |
| tk106 | KL Sentral to KLIA2 for your flight home | kl sentral to klia2 | Transport · EN |  | Not started | 3,600/mo · SD 19. Route: private transfer to KLIA/KLIA2 (taxi booking). Client confirmed 3 Oct: no bus in this direction, private transport can be ordered |
| tk107 | eSIM or physical SIM: setting up data before you land | esim malaysia | SIM · EN |  | Not started | 5,400/mo · SD 24. Route: SIM booking, then bus |
| tk108 | Kopitiam breakfast in KL | kopitiam kl | Food · EN |  | Not started | Route: Bus: KLIA2 → KL Sentral |
| tk109 | Travelling with children from KLIA2 | klia2 with kids | Transport · EN |  | Not started | Route: Car charter |
| tk110 | Penang in 3 days from KLIA2 | penang itinerary | Destination · EN |  | Not started | Route: Bus: KLIA2 → Sungai Nibong |
| tk111 | Search Console slot 1 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk112 | Search Console slot 2 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk113 | Search Console slot 3 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk114 | Ipoh food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya. ⚑ Needs Ipoh restaurant rows in admin |
| tk115 | KLIA2 to Ipoh |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya |
| tk116 | KLIA2 transit: leaving the airport on a layover |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk117 | KLIA2 bus terminal: where it is and how boarding works |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk118 | Grab or taxi at KLIA2 |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk119 | KLIA2 to Putrajaya and Cyberjaya |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk120 | Selangor by private driver: Kuala Selangor and Sekinchan in a day |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /car-charter |
| tk121 | Chinese New Year in KL 2027: what's open, where to eat |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk122 | Ramadan bazaar in KL 2027 |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk123 | Thaipusam at Batu Caves: getting there |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk124 | Ipoh food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya. ⚑ Needs Ipoh restaurant rows in admin |
| tk125 | KLIA2 to Ipoh |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya |
| tk126 | KLIA2 transit: leaving the airport on a layover |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk127 | KLIA2 bus terminal: where it is and how boarding works |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk128 | Grab or taxi at KLIA2 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk129 | KLIA2 to Putrajaya and Cyberjaya |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk130 | Selangor by private driver: Kuala Selangor and Sekinchan in a day |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /car-charter |
| tk131 | Chinese New Year in KL 2027: what's open, where to eat |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk132 | Ramadan bazaar in KL 2027 |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk133 | Thaipusam at Batu Caves: getting there |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk134 | Refresh pass: rework Month 1–2 pieces at positions 11–30; food-to-route internal links |  | Optimise |  | Not started | Not counted in the 190. From Search Console data |

## Month 6: Compound

March 2027. 4 planned + 6 Search Console slots. Month 6 topics reach BM and 中文 in Month 7

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk135 | Hawker food in KL: where locals eat | hawker food kl | Food · EN |  | Not started | Route: Bus: KLIA2 → Pudu Sentral |
| tk136 | KL public transport for first-timers: LRT, MRT and cards | kl public transport | Transport · EN |  | Not started | Route: Bus: KLIA2 → KL Sentral |
| tk137 | Hari Raya week in KL: what's open | hari raya kl | Destination · EN |  | Not started | Route: Taxi booking |
| tk138 | Ipoh in a day from KLIA2 | ipoh day trip | Destination · EN |  | Not started | Route: Bus: KLIA2 → Ipoh Amanjaya |
| tk139 | Search Console slot 4 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk140 | Search Console slot 5 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk141 | Search Console slot 6 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk142 | Search Console slot 7 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk143 | Search Console slot 8 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk144 | Search Console slot 9 |  | GSC slot · EN |  | Not started | ⚑ Chosen in the first week of Mar from live Search Console data |
| tk145 | Buka puasa buffets in KL (BM version leads) |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk146 | Travelling in Malaysia over Hari Raya 2027 |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk147 | KL Sentral to KLIA2 for your flight home |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: private transfer to KLIA/KLIA2 (taxi booking). Client confirmed 3 Oct: no bus in this direction, private transport can be ordered |
| tk148 | eSIM or physical SIM: setting up data before you land |  | SIM · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk149 | Kopitiam breakfast in KL |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk150 | Travelling with children from KLIA2 |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk151 | Penang in 3 days from KLIA2 |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk152 | Search Console slot 1, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk153 | Search Console slot 2, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk154 | Search Console slot 3, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk155 | Buka puasa buffets in KL (BM version leads) |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk156 | Travelling in Malaysia over Hari Raya 2027 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk157 | KL Sentral to KLIA2 for your flight home |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: private transfer to KLIA/KLIA2 (taxi booking). Client confirmed 3 Oct: no bus in this direction, private transport can be ordered |
| tk158 | eSIM or physical SIM: setting up data before you land |  | SIM · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk159 | Kopitiam breakfast in KL |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk160 | Travelling with children from KLIA2 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk161 | Penang in 3 days from KLIA2 |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk162 | Search Console slot 1, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk163 | Search Console slot 2, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk164 | Search Console slot 3, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk165 | Second refresh pass, schema across the library, 6-month KPI report, Month 7+ calendar |  | Optimise |  | Not started | Not counted in the 190 |

