# Date & Time

Displays a clock and date information in the status bar.

<img src="./images/screenshot.png" width="300">

## Configuration Options

|Option                        |Default|Description                                        |Example       |
|------------------------------|-------|---------------------------------------------------|--------------|
|`dateTime.showOnStartup`      |`true` |Show date & time on startup.                       |              |
|`dateTime.use24HourClock`     |`true` |Use a 24 hour clock.                               |**18**:43     |
|`dateTime.showAMPM`           |`false`|Show AM/PM.                                        |7:43 **PM**   |
|`dateTime.showDayOfWeek`      |`false`|Show the day of the week.                          |**Fri** 1 Jul |
|`dateTime.showDayOfMonth`     |`false`|Show the day of the month.                         |Fri **1** Jul |
|`dateTime.showMonth`          |`false`|Show the month.                                    |Fri 1 **Jul** |
|`dateTime.showHours`          |`true` |Show hours.                                        |**18**:43     |
|`dateTime.showMinutes`        |`true` |Show minutes.                                      |18:**43**     |
|`dateTime.showSeconds`        |`false`|Show seconds.                                      |18:43:**12**  |
|`dateTime.padDays`            |`false`|Pad the day of the month with a leading 0.         |Fri **01** Jul|
|`dateTime.padHours`           |`true` |Pad hours with a leading 0.                        |**09**:43     |
|`dateTime.padMinutes`         |`true` |Pad minutes with a leading 0.                      |18:**03**     |
|`dateTime.padSeconds`         |`true` |Pad seconds with a leading 0.                      |18:43:**04**  |
|`dateTime.locale`             |`null` |Date & time locale.                                |es-us         |
|`dateTime.timeZone`           |`null` |Time zone.                                         |Europe/Paris  |
|`dateTime.flashTimeSeparators`|`false`|Flash the time separators.                         |              |
|`dateTime.timeSeparator`      |`:`    |Time separator character.                          |              |
|`dateTime.timeSeparatorOff`   |` `    |Flashing time separator character.                 |              |
|`dateTime.customFormat`       |`null` |Use a custom date & time format.                   |              |
|`dateTime.clipboardFormat`    |`null` |Use a custom date & time format when copying.      |              |
|`dateTime.fractionalPrecision`|`null` |Update interval divisor for fractional seconds.    |              |
|`dateTime.statusBarAlignment` |`right`|Status bar alignment, left or right.               |left          |
|`dateTime.statusBarPriority`  |`null` |Status bar priority. Higher means more to the left.|10            |
|`dateTime.displayPrefix`      |`null` |Prepend a string to the displayed time.            |Time:         |
|`dateTime.displaySuffix`      |`null` |Append a string to the displayed time.             |.             |

### Example usage

```javascript
// 28 Feb 18:47
"dateTime.showDayOfMonth": true,
"dateTime.showMonth": true

// 9:30 AM
"dateTime.use24HourClock": false,
"dateTime.showAMPM": true
```

## Custom date & time format

Custom date & time formats can be specified using the following format:

|                          |Token  |Output                                |
|--------------------------|-------|--------------------------------------|
|Month                     |`M`    |1 2 ... 11 12                         |
|                          |`Mo`   |1st 2nd ... 11th 12th                 |
|                          |`MM`   |01 02 ... 11 12                       |
|                          |`MMM`  |Jan Feb ... Nov Dec                   |
|                          |`MMMM` |January February ... November December|
|Quarter                   |`Q`    |1 2 3 4                               |
|                          |`Qo`   |1st 2nd 3rd 4th                       |
|Day of Month              |`D`    |1 2 ... 30 31                         |
|                          |`Do`   |1st 2nd ... 30th 31st                 |
|                          |`DD`   |01 02 ... 30 31                       |
|Day of Year               |`DDD`  |1 2 ... 364 365                       |
|                          |`DDDo` |1st 2nd ... 364th 365th               |
|                          |`DDDD` |001 002 ... 364 365                   |
|Day of Week               |`d`    |0 1 ... 5 6                           |
|                          |`do`   |0th 1st ... 5th 6th                   |
|                          |`dd`   |Su Mo ... Fr Sa                       |
|                          |`ddd`  |Sun Mon ... Fri Sat                   |
|                          |`dddd` |Sunday Monday ... Friday Saturday     |
|Day of Week (Locale)      |`e`    |0 1 ... 5 6                           |
|                          |`eo`   |0th 1st ... 5th 6th                   |
|Day of Week (ISO)         |`E`    |1 2 ... 6 7                           |
|                          |`Eo`   |1st 2nd ... 6th 7th                   |
|Week of Year              |`w`    |1 2 ... 52 53                         |
|                          |`wo`   |1st 2nd ... 52nd 53rd                 |
|                          |`ww`   |01 02 ... 52 53                       |
|Week of Year (ISO)        |`W`    |1 2 ... 52 53                         |
|                          |`Wo`   |1st 2nd ... 52nd 53rd                 |
|                          |`WW`   |01 02 ... 52 53                       |
|Year                      |`YY`   |70 71 ... 29 30                       |
|                          |`YYYY` |1970 1971 ... 2029 2030               |
|Week Year                 |`gg`   |70 71 ... 29 30                       |
|                          |`gggg` |1970 1971 ... 2029 2030               |
|Week Year (ISO)           |`GG`   |70 71 ... 29 30                       |
|                          |`GGGG` |1970 1971 ... 2029 2030               |
|AM/PM                     |`A`    |AM PM                                 |
|                          |`a`    |am pm                                 |
|Hour                      |`H`    |0 1 ... 22 23                         |
|                          |`HH`   |00 01 ... 22 23                       |
|                          |`h`    |1 2 ... 11 12                         |
|                          |`hh`   |01 02 ... 11 12                       |
|Minute                    |`m`    |0 1 ... 58 59                         |
|                          |`mm`   |00 01 ... 58 59                       |
|Second                    |`s`    |0 1 ... 58 59                         |
|                          |`ss`   |00 01 ... 58 59                       |
|Fractional Second         |`S`    |0 1 ... 8 9                           |
|                          |`SS`   |00 01 ... 98 99                       |
|                          |`SSS`  |000 001 ... 998 999                   |
|Unix Timestamp            |`X`    |1360013296                            |
|Unix Millisecond Timestamp|`x`    |1360013296123                         |
|Abbreviated Timezone      |`z`    |EST                                   |
|Unabbreviated Timezone    |`zzz`  |Eastern Standard Time                 |
|Escape                    |`[...]`|Text between `[` and `]` is escaped   |

### Example usage

```javascript
// Friday, January the 1st, 2016
"dateTime.customFormat": "dddd, MMMM [the] Do, YYYY"

// 2016-01-01 10:12:03
"dateTime.customFormat": "YYYY-MM-DD HH:mm:ss"
```

## Date & time locale

The locale can be one of:

- af - *Afrikaans*
- am - *Amharic*
- ar-dz - *Arabic (Algeria)*
- ar-iq - *Arabic (Iraq)*
- ar-kw - *Arabic (Kuwait)*
- ar-ly - *Arabic (Lybia)*
- ar-ma - *Arabic (Morocco)*
- ar-sa - *Arabic (Saudi Arabia)*
- ar-tn - *Arabic (Tunisia)*
- ar - *Arabic*
- az - *Azerbaijani*
- be - *Belarusian*
- bg - *Bulgarian*
- bi - *Bislama*
- bm - *Bambara*
- bn-bd - *Bengali (Bangladesh)*
- bn - *Bengali*
- bo - *Tibetan*
- br - *Breton*
- bs - *Bosnian*
- ca - *Catalan*
- cs - *Czech*
- cv - *Chuvash*
- cy - *Welsh*
- da - *Danish*
- de-at - *German (Austria)*
- de-ch - *German (Switzerland)*
- de - *German*
- dv - *Maldivian*
- el - *Greek*
- en-au - *English (Australia)*
- en-ca - *English (Canada)*
- en-gb - *English (United Kingdom)*
- en-ie - *English (Ireland)*
- en-il - *English (Israel)*
- en-in - *English (India)*
- en-nz - *English (New Zealand)*
- en-sg - *English (Singapore)*
- en-tt - *English (Trinidad & Tobago)*
- en - *English*
- eo - *Esperanto*
- es-do - *Spanish (Dominican Republic)*
- es-mx - *Spanish (Mexico)*
- es-PR - *Spanish (Puerto Rico)*
- es-us - *Spanish (United States)*
- es - *Spanish*
- et - *Estonian*
- eu - *Basque*
- fa - *Persian*
- fi - *Finnish*
- fo - *Faroese*
- fr-ca - *French (Canada)*
- fr-ch - *French (Switzerland)*
- fr - *French*
- fy - *Frisian*
- ga - *Irish or Irish Gaelic*
- gd - *Scottish Gaelic*
- gl - *Galician*
- gom-latn - *Konkani Latin script*
- gu - *Gujarati*
- he - *Hebrew*
- hi - *Hindi*
- hr - *Croatian*
- ht - *Haitian Creole (Haiti)*
- hu - *Hungarian*
- hy-am - *Armenian*
- id - *Indonesian*
- is - *Icelandic*
- it-ch - *Italian (Switzerland)*
- it - *Italian*
- ja - *Japanese*
- jv - *Javanese*
- ka - *Georgian*
- kk - *Kazakh*
- km - *Cambodian*
- kn - *Kannada*
- ko - *Korean*
- ku - *Kurdish*
- ky - *Kyrgyz*
- lb - *Luxembourgish*
- lo - *Lao*
- lt - *Lithuanian*
- lv - *Latvian*
- me - *Montenegrin*
- mi - *Maori*
- mk - *Macedonian*
- ml - *Malayalam*
- mn - *Mongolian*
- mr - *Marathi*
- ms-my - *Malay*
- ms - *Malay*
- mt - *Maltese (Malta)*
- my - *Burmese*
- nb - *Norwegian Bokmål*
- ne - *Nepalese*
- nl-be - *Dutch (Belgium)*
- nl - *Dutch*
- nn - *Nynorsk*
- oc-lnc - *Occitan, lengadocian dialecte*
- pa-in - *Punjabi (India)*
- pl - *Polish*
- pt-br - *Portuguese (Brazil)*
- pt - *Portuguese*
- rn - *Kirundi*
- ro - *Romanian*
- ru - *Russian*
- rw - *Kinyarwanda (Rwanda)*
- sd - *Sindhi*
- se - *Northern Sami*
- si - *Sinhalese*
- sk - *Slovak*
- sl - *Slovenian*
- sq - *Albanian*
- sr-cyrl - *Serbian Cyrillic*
- sr - *Serbian*
- ss - *siSwati*
- sv-fi - *Finland Swedish*
- sv - *Swedish*
- sw - *Swahili*
- ta - *Tamil*
- te - *Telugu*
- tet - *Tetun Dili (East Timor)*
- tg - *Tajik*
- th - *Thai*
- tk - *Turkmen*
- tl-ph - *Tagalog (Philippines)*
- tlh - *Klingon*
- tr - *Turkish*
- tzl - *Talossan*
- tzm-latn - *Central Atlas Tamazight Latin*
- tzm - *Central Atlas Tamazight*
- ug-cn - *Uyghur (China)*
- uk - *Ukrainian*
- ur - *Urdu*
- uz-latn - *Uzbek Latin*
- uz - *Uzbek*
- vi - *Vietnamese*
- yo - *Yoruba Nigeria*
- zh-cn - *Chinese (China)*
- zh-hk - *Chinese (Hong Kong)*
- zh-tw - *Chinese (Taiwan)*
- zh - *Chinese*

## Time Zones

The time zone can be one of:

- Africa/Abidjan
- Africa/Accra
- Africa/Addis_Ababa
- Africa/Algiers
- Africa/Asmera
- Africa/Bamako
- Africa/Bangui
- Africa/Banjul
- Africa/Bissau
- Africa/Blantyre
- Africa/Brazzaville
- Africa/Bujumbura
- Africa/Cairo
- Africa/Casablanca
- Africa/Ceuta
- Africa/Conakry
- Africa/Dakar
- Africa/Dar_es_Salaam
- Africa/Djibouti
- Africa/Douala
- Africa/El_Aaiun
- Africa/Freetown
- Africa/Gaborone
- Africa/Harare
- Africa/Johannesburg
- Africa/Juba
- Africa/Kampala
- Africa/Khartoum
- Africa/Kigali
- Africa/Kinshasa
- Africa/Lagos
- Africa/Libreville
- Africa/Lome
- Africa/Luanda
- Africa/Lubumbashi
- Africa/Lusaka
- Africa/Malabo
- Africa/Maputo
- Africa/Maseru
- Africa/Mbabane
- Africa/Mogadishu
- Africa/Monrovia
- Africa/Nairobi
- Africa/Ndjamena
- Africa/Niamey
- Africa/Nouakchott
- Africa/Ouagadougou
- Africa/Porto-Novo
- Africa/Sao_Tome
- Africa/Tripoli
- Africa/Tunis
- Africa/Windhoek
- America/Adak
- America/Anchorage
- America/Anguilla
- America/Antigua
- America/Araguaina
- America/Argentina/La_Rioja
- America/Argentina/Rio_Gallegos
- America/Argentina/Salta
- America/Argentina/San_Juan
- America/Argentina/San_Luis
- America/Argentina/Tucuman
- America/Argentina/Ushuaia
- America/Aruba
- America/Asuncion
- America/Bahia
- America/Bahia_Banderas
- America/Barbados
- America/Belem
- America/Belize
- America/Blanc-Sablon
- America/Boa_Vista
- America/Bogota
- America/Boise
- America/Buenos_Aires
- America/Cambridge_Bay
- America/Campo_Grande
- America/Cancun
- America/Caracas
- America/Catamarca
- America/Cayenne
- America/Cayman
- America/Chicago
- America/Chihuahua
- America/Coral_Harbour
- America/Cordoba
- America/Costa_Rica
- America/Creston
- America/Cuiaba
- America/Curacao
- America/Danmarkshavn
- America/Dawson
- America/Dawson_Creek
- America/Denver
- America/Detroit
- America/Dominica
- America/Edmonton
- America/Eirunepe
- America/El_Salvador
- America/Fort_Nelson
- America/Fortaleza
- America/Glace_Bay
- America/Godthab
- America/Goose_Bay
- America/Grand_Turk
- America/Grenada
- America/Guadeloupe
- America/Guatemala
- America/Guayaquil
- America/Guyana
- America/Halifax
- America/Havana
- America/Hermosillo
- America/Indiana/Knox
- America/Indiana/Marengo
- America/Indiana/Petersburg
- America/Indiana/Tell_City
- America/Indiana/Vevay
- America/Indiana/Vincennes
- America/Indiana/Winamac
- America/Indianapolis
- America/Inuvik
- America/Iqaluit
- America/Jamaica
- America/Jujuy
- America/Juneau
- America/Kentucky/Monticello
- America/Kralendijk
- America/La_Paz
- America/Lima
- America/Los_Angeles
- America/Louisville
- America/Lower_Princes
- America/Maceio
- America/Managua
- America/Manaus
- America/Marigot
- America/Martinique
- America/Matamoros
- America/Mazatlan
- America/Mendoza
- America/Menominee
- America/Merida
- America/Metlakatla
- America/Mexico_City
- America/Miquelon
- America/Moncton
- America/Monterrey
- America/Montevideo
- America/Montreal
- America/Montserrat
- America/Nassau
- America/New_York
- America/Nipigon
- America/Nome
- America/Noronha
- America/North_Dakota/Beulah
- America/North_Dakota/Center
- America/North_Dakota/New_Salem
- America/Ojinaga
- America/Panama
- America/Pangnirtung
- America/Paramaribo
- America/Phoenix
- America/Port-au-Prince
- America/Port_of_Spain
- America/Porto_Velho
- America/Puerto_Rico
- America/Punta_Arenas
- America/Rainy_River
- America/Rankin_Inlet
- America/Recife
- America/Regina
- America/Resolute
- America/Rio_Branco
- America/Santa_Isabel
- America/Santarem
- America/Santiago
- America/Santo_Domingo
- America/Sao_Paulo
- America/Scoresbysund
- America/Sitka
- America/St_Barthelemy
- America/St_Johns
- America/St_Kitts
- America/St_Lucia
- America/St_Thomas
- America/St_Vincent
- America/Swift_Current
- America/Tegucigalpa
- America/Thule
- America/Thunder_Bay
- America/Tijuana
- America/Toronto
- America/Tortola
- America/Vancouver
- America/Whitehorse
- America/Winnipeg
- America/Yakutat
- America/Yellowknife
- Antarctica/Casey
- Antarctica/Davis
- Antarctica/DumontDUrville
- Antarctica/Macquarie
- Antarctica/Mawson
- Antarctica/McMurdo
- Antarctica/Palmer
- Antarctica/Rothera
- Antarctica/Syowa
- Antarctica/Troll
- Antarctica/Vostok
- Arctic/Longyearbyen
- Asia/Aden
- Asia/Almaty
- Asia/Amman
- Asia/Anadyr
- Asia/Aqtau
- Asia/Aqtobe
- Asia/Ashgabat
- Asia/Atyrau
- Asia/Baghdad
- Asia/Bahrain
- Asia/Baku
- Asia/Bangkok
- Asia/Barnaul
- Asia/Beirut
- Asia/Bishkek
- Asia/Brunei
- Asia/Calcutta
- Asia/Chita
- Asia/Choibalsan
- Asia/Colombo
- Asia/Damascus
- Asia/Dhaka
- Asia/Dili
- Asia/Dubai
- Asia/Dushanbe
- Asia/Famagusta
- Asia/Gaza
- Asia/Hebron
- Asia/Hong_Kong
- Asia/Hovd
- Asia/Irkutsk
- Asia/Jakarta
- Asia/Jayapura
- Asia/Jerusalem
- Asia/Kabul
- Asia/Kamchatka
- Asia/Karachi
- Asia/Katmandu
- Asia/Khandyga
- Asia/Krasnoyarsk
- Asia/Kuala_Lumpur
- Asia/Kuching
- Asia/Kuwait
- Asia/Macau
- Asia/Magadan
- Asia/Makassar
- Asia/Manila
- Asia/Muscat
- Asia/Nicosia
- Asia/Novokuznetsk
- Asia/Novosibirsk
- Asia/Omsk
- Asia/Oral
- Asia/Phnom_Penh
- Asia/Pontianak
- Asia/Pyongyang
- Asia/Qatar
- Asia/Qostanay
- Asia/Qyzylorda
- Asia/Rangoon
- Asia/Riyadh
- Asia/Saigon
- Asia/Sakhalin
- Asia/Samarkand
- Asia/Seoul
- Asia/Shanghai
- Asia/Singapore
- Asia/Srednekolymsk
- Asia/Taipei
- Asia/Tashkent
- Asia/Tbilisi
- Asia/Tehran
- Asia/Thimphu
- Asia/Tokyo
- Asia/Tomsk
- Asia/Ulaanbaatar
- Asia/Urumqi
- Asia/Ust-Nera
- Asia/Vientiane
- Asia/Vladivostok
- Asia/Yakutsk
- Asia/Yekaterinburg
- Asia/Yerevan
- Atlantic/Azores
- Atlantic/Bermuda
- Atlantic/Canary
- Atlantic/Cape_Verde
- Atlantic/Faeroe
- Atlantic/Madeira
- Atlantic/Reykjavik
- Atlantic/South_Georgia
- Atlantic/St_Helena
- Atlantic/Stanley
- Australia/Adelaide
- Australia/Brisbane
- Australia/Broken_Hill
- Australia/Currie
- Australia/Darwin
- Australia/Eucla
- Australia/Hobart
- Australia/Lindeman
- Australia/Lord_Howe
- Australia/Melbourne
- Australia/Perth
- Australia/Sydney
- Europe/Amsterdam
- Europe/Andorra
- Europe/Astrakhan
- Europe/Athens
- Europe/Belgrade
- Europe/Berlin
- Europe/Bratislava
- Europe/Brussels
- Europe/Bucharest
- Europe/Budapest
- Europe/Busingen
- Europe/Chisinau
- Europe/Copenhagen
- Europe/Dublin
- Europe/Gibraltar
- Europe/Guernsey
- Europe/Helsinki
- Europe/Isle_of_Man
- Europe/Istanbul
- Europe/Jersey
- Europe/Kaliningrad
- Europe/Kiev
- Europe/Kirov
- Europe/Lisbon
- Europe/Ljubljana
- Europe/London
- Europe/Luxembourg
- Europe/Madrid
- Europe/Malta
- Europe/Mariehamn
- Europe/Minsk
- Europe/Monaco
- Europe/Moscow
- Europe/Oslo
- Europe/Paris
- Europe/Podgorica
- Europe/Prague
- Europe/Riga
- Europe/Rome
- Europe/Samara
- Europe/San_Marino
- Europe/Sarajevo
- Europe/Saratov
- Europe/Simferopol
- Europe/Skopje
- Europe/Sofia
- Europe/Stockholm
- Europe/Tallinn
- Europe/Tirane
- Europe/Ulyanovsk
- Europe/Uzhgorod
- Europe/Vaduz
- Europe/Vatican
- Europe/Vienna
- Europe/Vilnius
- Europe/Volgograd
- Europe/Warsaw
- Europe/Zagreb
- Europe/Zaporozhye
- Europe/Zurich
- Indian/Antananarivo
- Indian/Chagos
- Indian/Christmas
- Indian/Cocos
- Indian/Comoro
- Indian/Kerguelen
- Indian/Mahe
- Indian/Maldives
- Indian/Mauritius
- Indian/Mayotte
- Indian/Reunion
- Pacific/Apia
- Pacific/Auckland
- Pacific/Bougainville
- Pacific/Chatham
- Pacific/Easter
- Pacific/Efate
- Pacific/Enderbury
- Pacific/Fakaofo
- Pacific/Fiji
- Pacific/Funafuti
- Pacific/Galapagos
- Pacific/Gambier
- Pacific/Guadalcanal
- Pacific/Guam
- Pacific/Honolulu
- Pacific/Johnston
- Pacific/Kiritimati
- Pacific/Kosrae
- Pacific/Kwajalein
- Pacific/Majuro
- Pacific/Marquesas
- Pacific/Midway
- Pacific/Nauru
- Pacific/Niue
- Pacific/Norfolk
- Pacific/Noumea
- Pacific/Pago_Pago
- Pacific/Palau
- Pacific/Pitcairn
- Pacific/Ponape
- Pacific/Port_Moresby
- Pacific/Rarotonga
- Pacific/Saipan
- Pacific/Tahiti
- Pacific/Tarawa
- Pacific/Tongatapu
- Pacific/Truk
- Pacific/Wake
- Pacific/Wallis
