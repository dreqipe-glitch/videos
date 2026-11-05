# Reel 2: «دور المرأة الدركية في مجال الفروسية»: timing map

Source: `reel_furusiya.mp4`, 1080×1920, 30 fps, 1998 frames (66.600 s), AAC stereo 44.1 kHz.
Word times come from **MMS forced alignment of the reference script** against the voice-over (`align_script.py`,
output `words-aligned.json`). Whisper large-v3 was used only to check the wording: it rewrote parts of the Darija
into standard Arabic (for example «الكثير من» for «بزاف ديال»), so its text and times were not used.
Every segment start agrees with your silencedetect pause map to within 0.05 s.

## Checks

- **Gaps:** blackdetect (`pix_th=0.10`) and per-frame luma confirm the 4 gaps exactly. Every gap frame has luma 16.0.
  F131, F918 and F1263 are the first footage frames. GAP 4 runs to F1997.
- **Last script line:** it is **not spoken**. The voice-over ends on «للجميع» at 66.36 s (F1991). «ومتنساش.. تابع الصفحة…»
  is not in the audio and won't be captioned. The Follow beat in 4D is on screen only.
- **Low-score words:** three short words scored low: «اللي» (0.25), «بهذا» (0.42 / 0.40) and «سؤال» (0.34).
  Their times are still consistent with the words around them. Captions use the script spelling.

## Beats per gap (F = global frame, L = frame inside the gap)

### GAP 1: F0–F130 (hook)
| Beat | Word (spoken) | Frame |
|---|---|---|
| Spotlight + equestrian icon already rising, horse-head icon draws on, «؟» pops (L2–L10) | silence | F0–F40 |
| «سؤال» wipes in (RTL) | سؤال 1.34 s | **F40** |
| «اليوم» wipes in + pink underline | اليوم 1.58 s | **F47** |
| Title + «؟» match-move up and shrink | شنو 2.50 s | **F75** |
| Line 1 «شنو هو دور المرأة الدركية», word by word | شنو F75 · هو F82 · دور F91 · المرأة F98 · الدركية F109 | F75–F109 |
| Line 2 «في مجال الفروسية؟» reveals as one line («الفروسية» pink) | spoken **after** the gap: في F129 · مجال F134 · الفروسية F144 | F110 (all visible by F115) |
| Exit flash into the footage | | F124–F130 |

### GAP 2: F848–F917 (duties checklist, 7 tiles)
| Beat | Word | Frame |
|---|---|---|
| Entry: grid in, labels readable; tiles 1–2 already lit with pink ✓ dot, tile 2 pulses | tail of البيئة (ends 28.43 s = F853) | F848–F855 |
| Tile 3 «البحث» lights (border draws, icon fills, burst) | البحث 28.95 s | **F868** |
| Tile 4 «حفظ النظام العام» lights | حفظ 29.81 s | **F894** |
| Tiles 5–7 stay dimmed (40%) | | |
| Exit flash | | F911–F917 |

### GAP 3: F1100–F1262 (the 4 values)
| Beat | Word | Frame |
|---|---|---|
| Entry: rider icon + label «مجرد مهارة في ركوب الخيل» | ماشي 36.65 s (= first gap frame) | F1100 |
| Pink strike wipes across «مجرد مهارة» | مجرد F1110 · مهارة F1125 | F1110–F1136 |
| Rider icon shrinks into the centre | الخيل ends F1162 | F1162–F1176 |
| Equestrian icon pops at centre (~360 px) with glow ring | بل 39.23 s | **F1177** |
| Headline «مجال كيجمع بين», word by word | مجال F1183 · كيجمع F1197 · بين F1211 | |
| Card «الصبر» (hourglass) + pink link | الصبر 40.57 s | **F1217** |
| Card «القوة» (flexed arm) + link | القوة 41.35 s | **F1241** |
| Cards «التركيز» (target) + «الانضباط» (chevrons) **together** | spoken **after** the gap: التركيز F1267 · والانضباط F1292 | **F1250** |
| Pink sweep across all 4 cards, then exit flash | | F1252–F1262 |

> As you asked: «التركيز» and «والانضباط» start 5 and 30 frames after the gap, so their two cards come in together
> at F1250, in the last 12 frames, and all four cards are on screen before the exit.

### GAP 4: F1388–F1997 (four sub-scenes, to the end)
**4A: skills + logo (F1388–F1510)**
| Beat | Word | Frame |
|---|---|---|
| Entry flash; equestrian icon centre; the 7 duty + 4 value icons fly in and orbit (match-cut) | كيعكس 46.55 s | F1388–F1410 |
| Headline «تنوع المهارات والكفاءات», word by word; constellation pulses once | تنوع F1412 · المهارات F1427 · والكفاءات F1447 | |
| Constellation collapses into the centre | داخل 48.99 s | **F1470** |
| Gendarmerie logo: scale 0.85 → 1, back-out, pink sweep; hold | المؤسسة 49.35 s | **F1481** |
| Logo fades out completely | | F1500–F1508 |

**4B: tribute (F1509–F1717)**
| Beat | Word | Frame |
|---|---|---|
| Icon returns centre-top (~340 px) with a warm glow | | F1504–F1511 |
| Line 1 «تحية تقدير لكل نساء الدرك الملكي», word by word («نساء الدرك الملكي» pink) | تحية F1511 · تقدير F1525 · لكل F1541 · نساء F1554 · الدرك F1566 · الملكي F1575 | |
| Red + green line accent with a green star outline draws under it | | F1585–F1600 |
| Line 2 «في خدمة الوطن والمواطنين» | في F1652 · خدمة F1656 · الوطن F1666 · والمواطنين F1683 | |
| Slow pink light sweep over the frame | الوطن 55.53 s | **F1666** |

**4C: the question (F1718–F1851)**
| Beat | Word | Frame |
|---|---|---|
| Match-cut: big pink «؟» slams in (1.15 → 1, small shake) | ودابا 57.28 s | **F1718** |
| «شنو رأيكم في حضور المرأة الدركية في مجال الفروسية؟», word by word, 3 lines, small rider icon | شنو F1742 · رأيكم F1748 · في F1763 · حضور F1768 · المرأة F1778 · الدركية F1788 · في F1806 · مجال F1811 · الفروسية F1820 | |
| 2–3 empty comment bubbles with typing dots pop around it | | F1826–F1840 |

**4D: CTA (F1852–F1997)**
| Beat | Word | Frame |
|---|---|---|
| Comment bubble + «خلّيو لينا آراءكم في التعاليق», word by word | خلّيو 61.72 s (F1852) … التعاليق 62.82 s (**F1885**) | |
| Share icon with arrow motion + «بارتاجيو الفيديو» | وبارتاجيو 63.66 s (**F1910**) · الفيديو F1929 | |
| Avatar flies top-right → centre, grows to ~360 px; hashtag fades | باش 64.80 s | **F1944**–F1958 |
| «تابع» pops; cursor taps; «✓ متابَع» + pink burst | | F1956 · tap F1966 · ✓ F1968 |
| Facebook, TikTok, Instagram pop, 3-frame stagger | | F1972 · F1975 · F1978 |
| Everything settled and readable | | F1984–F1997 (0.45 s) |

> You suggested starting the Follow move at ≈65.0 s. I start it at «باش» (64.80 s, F1944) so the finished layout
> stays readable for about half a second before F1997. Starting at 65.0 would leave only about 0.25 s. The end tag
> follows straight after F1997.

## Not in the inserts (over footage, captions only)
«في مجال الفروسية داخل الدرك الملكي» (from F131) and all other words between gaps, the tail «النظام العام» (F918–F927)
after GAP 2, and «التركيز والانضباط وارتباط المرأة الدركية بهذا المجال» after GAP 3.
