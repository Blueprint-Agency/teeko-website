# Content schedule: Teeko

Source: the Content Schedule tab of docs/content-schedule-2026-10-to-2027-03.html (Oct 2026 to
Mar 2027, prepared 30 Sep 2026). This file is that plan with a status column. The SEO client
tracker reads it on every push.

**Blog posts are written in the admin panel, not in this repo, so nothing is detected
automatically. The Status column is the only record: update it when a piece moves.**
Statuses: Not started, In progress, Blocked, Built (written, waiting for sign-off or
publishing), Live (published on teeko.ai), Dropped. Code work (the Build rows) is Built when
it is merged and Live when it is deployed.

**Type** gives the pillar and the language: EN, BM, or ZH (中文). BM and 中文 rows are the
previous month's topics, retitled to each language's own keyword rather than translated.
160 pieces count toward the plan. The Build and Optimise rows are extra work and are not part
of the 160. The Slug column is optional. Fill it in once a post is published, for reference.

Keep the ID column. It is how the tracker matches rows. A new row needs a new, unused ID.

## Month 1: Build + Arrival Core

October 2026. 10 English pieces while the ttklia.com path and the locale layer are built

| ID | Piece | Primary keyword | Type | Slug | Status | Evidence |
|---|---|---|---|---|---|---|
| tk001 | ttklia.com cta on all 12 existing posts + nav link |  | Build |  | Not started | Not counted in the 160. OPEN-ITEMS #1: waits on the client’s link plan and UTM convention |
| tk002 | Locale layer: data model, routing, hreflang, switcher |  | Build |  | Not started | Not counted in the 160. OPEN-ITEMS #2: every BM and 中文 piece depends on it |
| tk003 | GA4 outbound-click event · restaurant page metadata · F1 cluster refresh |  | Build |  | Not started | Not counted in the 160. KPI 2 baseline and a quick ranking lift |
| tk004 | MDAC: fill in Malaysia's arrival card before you fly | mdac malaysia | Transport · EN |  | Not started | 14,800/mo · SD 32. Route: Homepage: plan the ride |
| tk005 | KLIA2 to KL Sentral: bus, train, taxi and Grab compared | transport from klia2 to kl sentral | Transport · EN |  | Not started | 1,600/mo · SD 16. Route: Bus: KLIA2 → KL Sentral |
| tk006 | Arriving at KLIA2: from the gate to your ride | klia2 arrival guide | Transport · EN |  | Not started | Route: Bus destinations list |
| tk007 | KLIA2 taxi: counters, coupons and which door | klia2 taxi | Transport · EN |  | Not started | 170/mo · SD 15. Route: Taxi booking |
| tk008 | KLIA2 to Bukit Bintang | klia2 to bukit bintang | Transport · EN |  | Not started | 140/mo · SD 13. Route: Bus: KLIA2 → Pudu Sentral |
| tk009 | KLIA to KLIA2 transfer | klia to klia2 | Transport · EN |  | Not started | 260/mo · SD 23. Route: /bus/klia2-to-klia1 |
| tk010 | Landing late at KLIA2: stay at the airport or ride now | klia2 capsule hotel | Transport · EN |  | Not started | 3,600/mo · SD 21. Route: Taxi booking |
| tk011 | Where to eat near KL Sentral | kl sentral food | Food · EN |  | Not started | 8,100/mo · SD 14. Route: Bus: KLIA2 → KL Sentral |
| tk012 | Bukit Bintang food | bukit bintang food | Food · EN |  | Not started | 5,400/mo · SD 17. Route: Bus: KLIA2 → Pudu Sentral |
| tk013 | Tourist SIM in Malaysia: collect at KLIA2 or use an eSIM | tourist sim card malaysia | SIM · EN |  | Not started | 320/mo · SD 17. Route: SIM booking, then bus |

## Month 2: KL Food + Genting

November 2026. BM and 中文 launch with Month 1’s topics

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
| tk024 | MDAC: fill in Malaysia's arrival card before you fly |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Homepage: plan the ride |
| tk025 | KLIA2 ke KL Sentral (KLIA2 to KL Sentral: bus, train, taxi and Grab compared) | klia2 ke kl sentral | Transport · BM |  | Not started | 210/mo · SD 17. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk026 | Arriving at KLIA2: from the gate to your ride |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk027 | KLIA2 taxi: counters, coupons and which door |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk028 | KLIA2 to Bukit Bintang |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk029 | KLIA to KLIA2 transfer |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-klia1 |
| tk030 | Landing late at KLIA2: stay at the airport or ride now |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk031 | Makan dekat KL Sentral (Where to eat near KL Sentral) | makanan sedap kl | Food · BM |  | Not started | 1,000/mo · SD 24. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk032 | Bukit Bintang food |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk033 | SIM pelancong (Tourist SIM in Malaysia: collect at KLIA2 or use an eSIM) |  | SIM · BM |  | Not started | Keyword not yet measured. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk034 | MDAC: fill in Malaysia's arrival card before you fly |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Homepage: plan the ride |
| tk035 | 吉隆坡机场到市区 (KLIA2 to KL Sentral: bus, train, taxi and Grab compared) | 吉隆坡机场到市区 | Transport · ZH |  | Not started | 30/mo · SD 42. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk036 | Arriving at KLIA2: from the gate to your ride |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk037 | KLIA2 taxi: counters, coupons and which door |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk038 | KLIA2 to Bukit Bintang |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk039 | KLIA to KLIA2 transfer |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: /bus/klia2-to-klia1 |
| tk040 | Landing late at KLIA2: stay at the airport or ride now |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk041 | 吉隆坡中央车站美食 (Where to eat near KL Sentral) | 吉隆坡美食 | Food · ZH |  | Not started | 1,900/mo · SD 39. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk042 | Bukit Bintang food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Pudu Sentral |
| tk043 | 马来西亚电话卡 (Tourist SIM in Malaysia: collect at KLIA2 or use an eSIM) | 马来西亚电话卡 | SIM · ZH |  | Not started | 90/mo · SD 59. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |

## Month 3: Penang & the South

December 2026

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
| tk080 | Car charter from KLIA2 for families and groups | klia2 car charter | Transport · EN |  | Not started | Route: Car charter |
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
| tk106 | KL Sentral to KLIA2 for your flight home | kl sentral to klia2 | Transport · EN |  | Not started | 3,600/mo · SD 19. Route: Taxi to KLIA, if sold. ⚑ Client to confirm ttklia.com sells this direction |
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
| tk120 | Car charter from KLIA2 for families and groups |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk121 | Chinese New Year in KL 2027: what's open, where to eat |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk122 | Ramadan bazaar in KL 2027 |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk123 | Thaipusam at Batu Caves: getting there |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk124 | Ipoh food |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya. ⚑ Needs Ipoh restaurant rows in admin |
| tk125 | KLIA2 to Ipoh |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Ipoh Amanjaya |
| tk126 | KLIA2 transit: leaving the airport on a layover |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk127 | KLIA2 bus terminal: where it is and how boarding works |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk128 | Grab or taxi at KLIA2 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk129 | KLIA2 to Putrajaya and Cyberjaya |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi booking |
| tk130 | Car charter from KLIA2 for families and groups |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk131 | Chinese New Year in KL 2027: what's open, where to eat |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk132 | Ramadan bazaar in KL 2027 |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk133 | Thaipusam at Batu Caves: getting there |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk134 | Refresh pass: rework Month 1–2 pieces at positions 11–30; food-to-route internal links |  | Optimise |  | Not started | Not counted in the 160. From Search Console data |

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
| tk147 | KL Sentral to KLIA2 for your flight home |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi to KLIA, if sold. ⚑ Client to confirm ttklia.com sells this direction |
| tk148 | eSIM or physical SIM: setting up data before you land |  | SIM · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk149 | Kopitiam breakfast in KL |  | Food · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk150 | Travelling with children from KLIA2 |  | Transport · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk151 | Penang in 3 days from KLIA2 |  | Destination · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk152 | Search Console slot 1, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk153 | Search Console slot 2, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk154 | Search Console slot 3, BM version |  | GSC slot · BM |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk155 | Buka puasa buffets in KL (BM version leads) |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk156 | Travelling in Malaysia over Hari Raya 2027 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus destinations list |
| tk157 | KL Sentral to KLIA2 for your flight home |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Taxi to KLIA, if sold. ⚑ Client to confirm ttklia.com sells this direction |
| tk158 | eSIM or physical SIM: setting up data before you land |  | SIM · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: SIM booking, then bus |
| tk159 | Kopitiam breakfast in KL |  | Food · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → KL Sentral |
| tk160 | Travelling with children from KLIA2 |  | Transport · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Car charter |
| tk161 | Penang in 3 days from KLIA2 |  | Destination · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. Route: Bus: KLIA2 → Sungai Nibong |
| tk162 | Search Console slot 1, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk163 | Search Console slot 2, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk164 | Search Console slot 3, 中文 version |  | GSC slot · ZH |  | Not started | Locale keyword measured at brief stage. Retitled to the locale’s own keyword, not translated. ⚑ Chosen in the first week of Feb from page-2 queries with no dedicated page |
| tk165 | Second refresh pass, schema across the library, 6-month KPI report, Month 7+ calendar |  | Optimise |  | Not started | Not counted in the 160 |

