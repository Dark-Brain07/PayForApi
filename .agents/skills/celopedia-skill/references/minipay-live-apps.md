# MiniPay live Mini Apps (discovery catalog snapshot)

> Canonical MiniPay developer docs: https://docs.minipay.xyz/ (page-by-page index in `minipay-docs-map.md`). This file is a **discovery-catalog snapshot**, not docs.
>
> **Snapshot source:** Opera MiniPay discovery export (`discover-mini-apps-export.csv`). **Point-in-time** list so developers can see categories and live-style products in the MiniPay ecosystem.
>
> **Last regenerated from export:** 2026-04-09 (run `python3 scripts/generate_minipay_live_apps.py <csv>` from repo root).

## Important for developers

- **Not all apps are available in all countries.** Targeting uses `targeting_whitelistedCountries` / `targeting_blacklistedCountries` (ISO 3166-1 alpha-2, pipe `|` separated). An empty field in the export usually means no filter **in this dataset** — the in-wallet catalog can still differ by region, platform (Android vs iOS), and Opera rollout.
- **This is not a live API.** The discovery list changes frequently. Re-import the CSV and re-run this script, or check MiniPay in target markets for ground truth.
- **`isPublished`** reflects the export flag at snapshot time.

## Published listings (snapshot)

| Name | Category | Publisher | Tagline | Link |
|------|----------|-----------|---------|------|
| Buy BTC | finance | Squid | Get Bitcoin in seconds | https://btc.minipay.squidrouter.com |
| Buy ETH | finance | Squid | Get Ethereum in seconds | https://eth.minipay.squidrouter.com |
| Myriad | rewards | Myriad Markets | Now with Daily Rewards! | https://mini.myriad.markets |
| Halo | rewards | Human Labs | Snap Receipts, Get Rewarded | https://celo-miniapp.halo.humanlabs.world/ |
| Kiln | finance | Kiln | Earn rewards on your USDt | https://minipay.widget.kiln.fi/overview |
| Daily Reward | rewards | Blueboard Limited | Get rewarded for coming back every day! | https://claim.minipay.xyz/ |
| Boost Rewards | rewards | Blueboard Limited | Increase your daily Boost rewards | https://claim.minipay.xyz/boost |
| Football Multis | sports | Blueboard Limited | Create Multis and Win Rewards | https://www.apex-football.com/multis-league |
| Predictor | sports | Blueboard Limited | Guess right, win big! | https://predictor.apex-football.com/?origin=mini-minipay |
| Aqua Pop | games | True Network | Pop Smart. Rank High. | https://gamiflyprostb.mchamp.xyz |
| Tradcast | games | Tradcast | Predict and Earn Rewards | https://tradcast.xyz |
| Electricity Bills | utility | Bitgifty | Upto 10% Cashback | https://minipay.bitgifty.com/electricity |
| Buy Gold | finance | Squid | Save in digital gold | https://xaut.minipay.squidrouter.com |
| Tank War | games | True Network | Unlimited Play and Daily Rewards. | https://gamiflypro.mchamp.xyz |
| Melorize: AI Music | entertainment | Hoccus Labs | Create music with AI | https://melorize.vercel.app |
| Live Scores | sports | Blueboard Limited | Real-Time Match Updates | https://apexscores.io/en/football/scores?utm_source=minipay&utm_medium=miniapp |
| Gift Cards | shopping | Bitgifty | Curated vouchers, delivered instantly | https://giftcards.bitgifty.com |
| Squadletics | health-fitness | Hoccus Labs | Earn while you exercise | https://squadletics.com/minipay |
| Grocery Deals | utility | Thumbtribe | 20% Off, Just for You! | https://grocerydeals.co.za/ |
| Cheap Data Bundles | utility | Bitgifty | 10% Back Every Time You Load! | https://minipay.bitgifty.com/speed-dial/mobile-data/ |
| Kliq | rewards | Kliq.earth | Click and Earn | https://minipay.kliq.earth |
| Mavu Microwork | rewards | Mavu | Simple Tasks, Instant Rewards | https://minipay.mavu.work |
| MiniAudio | music | Miniaudio | Free Radio and Podcast | https://miniaudio.live |
| MiniFunder | art-creativity | CCProtocol | Bring creative projects to life. | https://minifunder.ccprotocol.xyz |
| Airtime | utility | Bitgifty | Every recharge gives you more | https://minipay.bitgifty.com/speed-dial/airtime?utm_source=new_minipay&utm_medium=new_sddirectlink |
| Walapay | finance | Walapay.io | Remit to Alipay | https://minipay.walapay.io |
| Game On, Win More | games | True Network | Play every day and rise to the top! | https://games.mchamp.xyz |
| Daily Treats | games | True Network | Don’t miss today’s treat! | https://spin.mchamp.xyz |
| Shop & Pay | utility | Xwift Inc | Pay Bills or Pay Goods at merchants | https://minipay.pretium.africa/ |
| Earn Mento Rewards | rewards | Mento Labs | Use cUSD to Earn $MENTO | https://minipay.mento.org/ |
| Listen & Win | music | Mdundo | Now with Daily Rewards | https://music.minipay.xyz |
| Play to earn | games | Blueboard Limited | Get cash rewards for playing a game! | https://claim-game.minipay.xyz/game |
| eSIM | utility | Boxo | Borderless Browsing | https://production-minipay.d3on13dno54vc6.amplifyapp.com/ |
| Briefing | news-media | Blueboard Limited | Crypto news. Fast, fresh, daily. | https://claim.minipay.xyz/savi |
| Fantasy Football | sports | Blueboard Limited | Set Your Squad | https://fantasy.apex-football.com/ |
| Akiba Miles | rewards | MiniStudio | Turn daily actions into rewards. | https://app.akibamiles.com |
| Bill Payments | utility | Bitgifty | Now with Zero fees on BitGifty! | https://minipay.bitgifty.com/ |
| MiniPlay | games | MiniPlay.Studio | Easy to play. Hard to stop. | https://miniplay.studio/ |
| Learn & Earn | rewards | Blueboard Limited | Complete courses, and earn rewards | https://learn.minipay.xyz |
| Scratch Rewards | rewards | Blockscratch | Use MiniPay and get rewarded. | https://www.blockscratch.xyz/ |
| Mini Games | games | Blockscratch | Play every day and rise to the top! | https://www.tryplugs.xyz?utm_source=plugsdirect |
| Donate to a Good Cause | utility | Blueboard Limited | Help kids learn coding | https://donate.minipay.xyz |
| Hold to Earn | finance | Blockscratch | Earn by holding a balance | https://tryhold.xyz/ |
| Oracle360 | entertainment | Oracle360 | Your Daily Cosmic Guide | https://oracle360.net |
| Tiles | games | Blockscratch | Merge up, Level up! | https://tiles-eight.vercel.app/?utm_source=tilesdirect |
| Swift | games | Blockscratch | Test your math skills | https://swift-pi-brown.vercel.app/?utm_source=swiftdirect |
| Spell Tower | games | Blockscratch | Unlock the secret word | https://spell-tower.vercel.app/?utm_source=spelltowerdirect |
| Universal basic income | finance | Gooddollar | Free Money, As a Public Good | https://opr.as/mpga |

## Country / platform hints (published apps, same priority order)

| Name | Availability note (from export) |
|------|-----------------------------------|
| Buy BTC | Blacklist: AT\|BE\|BG\|CY\|CZ\|DE\|DK\|EE\|ES\|FI\|FR\|GR\|HR\|HU\|IE\|IT\|LT\|LU\|LV\|MT\|NL\|PL\|PT\|RO\|SE\|SI\|SK |
| Buy ETH | Blacklist: AT\|BE\|BG\|CY\|CZ\|DE\|DK\|EE\|ES\|FI\|FR\|GR\|HR\|HU\|IE\|IT\|LT\|LU\|LV\|MT\|NL\|PL\|PT\|RO\|SE\|SI\|SK |
| Myriad | Blacklist: BR\|MX\|GB |
| Halo | No country filter in export (not same as worldwide in UI) |
| Kiln | Blacklist: AT\|BE\|BG\|CY\|CZ\|DE\|DK\|EE\|ES\|FI\|FR\|GR\|HR\|HU\|IE\|IT\|LT\|LU\|LV\|MT\|NL\|PL\|PT\|RO\|SE\|SI\|SK\|AF\|DZ\|BD\|BY\|BO\|CN\|CU\|EG\|ET\|HK\|IR\|IQ\|… |
| Daily Reward | Blacklist: AT\|BE\|BG\|CY\|CZ\|DE\|DK\|EE\|ES\|FI\|FR\|GR\|HR\|HU\|IE\|IT\|LT\|LU\|LV\|MT\|NL\|PL\|PT\|RO\|SE\|SI\|SK\|CD\|TR\|US |
| Boost Rewards | Blacklist: CD\|ID\|AF\|DZ\|BD\|BY\|BO\|CN\|CU\|EG\|ET\|HK\|IR\|IQ\|MO\|LY\|NP\|KP\|MK\|PK\|QA\|RU\|SD\|SY\|SA\|TN\|US\|TR\|AT\|BE\|BG\|CY\|CZ\|DE\|DK\|EE\|ES\|FI\|FR\|… |
| Football Multis | Blacklist: GB\|BR\|CD\|VN\|PH\|TH\|AR\|MY |
| Predictor | Blacklist: BR\|GB\|TH\|VN\|MY\|PH\|AR |
| Aqua Pop | Countries: AO\|BJ\|BW\|BF\|BI\|CV\|CM\|CF\|TD\|KM\|CG\|CD\|CI\|GQ\|ER\|SZ\|ET\|GA\|GM\|GH\|GN\|GW\|KE\|LS\|LR\|MG\|MW\|ML\|MR\|MU\|MZ\|NA\|NE\|NG\|RW\|ST\|SN\|SC\|SL\|… |
| Tradcast | No country filter in export (not same as worldwide in UI) |
| Electricity Bills | Countries: NG |
| Buy Gold | Blacklist: GB |
| Tank War | Blacklist: SE\|GB\|US\|PL |
| Melorize: AI Music | Platform: android only |
| Live Scores | Platform: android only |
| Gift Cards | Blacklist: TH\|VN\|MY\|ID |
| Squadletics | Blacklist: GB |
| Grocery Deals | Countries: ZA\|IN\|PH |
| Cheap Data Bundles | Blacklist: ID\|MY\|VN\|TH\|GB\|KE |
| Kliq | Countries: NG\|KE |
| Mavu Microwork | Blacklist: GB\|BR\|CD\|MY\|TH\|VN\|TR |
| MiniAudio | No country filter in export (not same as worldwide in UI) |
| MiniFunder | No country filter in export (not same as worldwide in UI) |
| Airtime | Blacklist: MY\|VN\|IN\|TH\|TR\|ID |
| Walapay | Whitelist: NG\|KE\|GH\|ZA\|UG\|NO\|AE\|SE; Blacklist: GB\|US |
| Game On, Win More | Blacklist: GB\|CD\|BR\|TH\|VN\|PH\|TR\|MY |
| Daily Treats | Whitelist: UG\|KE\|NG\|NO; Blacklist: PH\|TH\|GB\|BR\|VN\|MY\|TR |
| Shop & Pay | No country filter in export (not same as worldwide in UI) |
| Earn Mento Rewards | Blacklist: GB\|CD\|BR |
| Listen & Win | Blacklist: GB\|BR\|CD |
| Play to earn | Blacklist: GB\|BR\|CD\|MY\|TH\|TR\|AR\|VN\|PH |
| eSIM | No country filter in export (not same as worldwide in UI) |
| Briefing | Platform: android only |
| Fantasy Football | Countries: NG\|KE\|GH\|ZA\|PH\|NO |
| Akiba Miles | Blacklist: GB\|BR\|AR\|TR\|US |
| Bill Payments | No country filter in export (not same as worldwide in UI) |
| MiniPlay | No country filter in export (not same as worldwide in UI) |
| Learn & Earn | Blacklist: CD\|GB\|BR\|VN\|MY\|TH\|IN |
| Scratch Rewards | Blacklist: GB\|CD\|BR |
| Mini Games | Platform: android only |
| Donate to a Good Cause | No country filter in export (not same as worldwide in UI) |
| Hold to Earn | Platform: android only |
| Oracle360 | No country filter in export (not same as worldwide in UI) |
| Tiles | Platform: android only |
| Swift | Platform: android only |
| Spell Tower | Platform: android only |
| Universal basic income | Platform: android only |

## Unpublished in this export (`isPublished: false`)

- **Deposit with Daimo** (finance) — Daimo
- **Megapot** (rewards) — Megapot
- **Gamepay** (shopping) — Bando
- **Bando** (shopping) — Bando
- **Daily Predictions Big Rewards** (rewards) — Polkamarkets
- **Lollipops Match3** (games) — True Network
- **Animals Crush** (games) — True Network
- **Test page** (utility) — Unknown Publisher

## By category (published)

### art-creativity
- MiniFunder

### entertainment
- Melorize: AI Music
- Oracle360

### finance
- Buy BTC
- Buy ETH
- Buy Gold
- Hold to Earn
- Kiln
- Universal basic income
- Walapay

### games
- Aqua Pop
- Daily Treats
- Game On, Win More
- Mini Games
- MiniPlay
- Play to earn
- Spell Tower
- Swift
- Tank War
- Tiles
- Tradcast

### health-fitness
- Squadletics

### music
- Listen & Win
- MiniAudio

### news-media
- Briefing

### rewards
- Akiba Miles
- Boost Rewards
- Daily Reward
- Earn Mento Rewards
- Halo
- Kliq
- Learn & Earn
- Mavu Microwork
- Myriad
- Scratch Rewards

### shopping
- Gift Cards

### sports
- Fantasy Football
- Football Multis
- Live Scores
- Predictor

### utility
- Airtime
- Bill Payments
- Cheap Data Bundles
- Donate to a Good Cause
- Electricity Bills
- eSIM
- Grocery Deals
- Shop & Pay
