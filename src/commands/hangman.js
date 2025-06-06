const { SlashCommandBuilder, InteractionContextType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Hangman = require('../models/Hangman');
const path = require('node:path');

const wordList = [
    "GROSS",
    "DEUTSCH",
    "KLEIN",
    "LETZTE",
    "EINFACH",
    "EIGEN",
    "WEITER",
    "WICHTIG",
    "WENIGE",
    "NÄCHST",
    "SCHÖN",
    "SCHNELL",
    "NATÜRLICH",
    "STARK",
    "GLEICH",
    "MÖGLICH",
    "GERADE",
    "RICHTIG",
    "VERGANGEN",
    "GENAU",
    "GEMEINSAM",
    "WIRKLICH",
    "SCHWER",
    "AKTUELL",
    "SICHER",
    "WENIG",
    "DEUTLICH",
    "VERSCHIEDEN",
    "BEKANNT",
    "PRIVAT",
    "LEICHT",
    "INTERNATIONAL",
    "DIREKT",
    "OFFEN",
    "POLITISCH",
    "ÖFFENTLICH",
    "KOMMEND",
    "RECHT",
    "SCHLECHT",
    "ENTSPRECHEND",
    "ERFOLGREICH",
    "ALLEIN",
    "KNAPP",
    "EINZIG",
    "PERSÖNLICH",
    "ZUSÄTZLICH",
    "EUROPÄISCH",
    "BESONDERE",
    "EHEMALIG",
    "ZAHLREICH",
    "TATSÄCHLICH",
    "KÜNFTIG",
    "EINZELN",
    "ERNEUT",
    "GESAMT",
    "SOZIAL",
    "ÄHNLICH",
    "POSITIV",
    "FOLGEND",
    "BESTIMMT",
    "ENDLICH",
    "TÄGLICH",
    "NÄMLICH",
    "UNTERSCHIEDLICH",
    "INTERESSANT",
    "ALLGEMEIN",
    "TECHNISCH",
    "AKTIV",
    "HÄUFIG",
    "VÖLLIG",
    "GLEICHZEITIG",
    "ANSCHLIESSEND",
    "HEUTIG",
    "KOSTENLOS",
    "KOMPLETT",
    "MODERN",
    "GENUG",
    "FALSCH",
    "OFFIZIELL",
    "GERING",
    "SCHWARZ",
    "SCHWIERIG",
    "NOTWENDIG",
    "MEIST",
    "WELTWEIT",
    "HISTORISCH",
    "AMERIKANISCH",
    "SELTEN",
    "TEUER",
    "OFFENBAR",
    "BEREIT",
    "SOGENANNT",
    "REGELMÄSSIG",
    "SPEZIELL",
    "NORMAL",
    "FINANZIELL",
    "PERFEKT",
    "GEPLANT",
    "FRANZÖSISCH",
    "ABSOLUT",
    "BISHERIG",
    "BREIT",
    "NÖTIG",
    "WIRTSCHAFTLICH",
    "WEISS",
    "KONKRET",
    "ZUFRIEDEN",
    "STÄNDIG",
    "GÜNSTIG",
    "FRISCH",
    "MUSIKALISCH",
    "SPANNEND",
    "ZUSTÄNDIG",
    "VORHANDEN",
    "PLÖTZLICH",
    "NATIONAL",
    "UNBEDINGT",
    "ERFORDERLICH",
    "GRUNDSÄTZLICH",
    "ENTSCHEIDEND",
    "LANGSAM",
    "DIGITAL",
    "WESENTLICH",
    "TRADITIONELL",
    "PRAKTISCH",
    "ZENTRAL",
    "WAHRSCHEINLICH",
    "JÄHRLICH",
    "KATHOLISCH",
    "HERZLICH",
    "GESETZLICH",
    "BELIEBT",
    "RUSSISCH",
    "BRITISCH",
    "ERHEBLICH",
    "KLASSISCH",
    "BARRIEREFREI",
    "STAATLICH",
    "EVANGELISCH",
    "INDIVIDUELL",
    "TÄTIG",
    "FERTIG",
    "VERANTWORTLICH",
    "GESUND",
    "SPORTLICH",
    "GEFÄHRLICH",
    "JEWEILIG",
    "UNABHÄNGIG",
    "SCHLIMM",
    "INTENSIV",
    "GLÜCKLICH",
    "ÜBRIG",
    "BESTEHEND",
    "BEGEISTERT",
    "URSPRÜNGLICH",
    "LAUFEND",
    "ANGEBLICH",
    "NIEDRIG",
    "HEISS",
    "RIESIG",
    "SUPER",
    "ZUNEHMEND",
    "EXTREM",
    "UNMITTELBAR",
    "STOLZ",
    "GEMÄSS",
    "RUHIG",
    "REGIONAL",
    "SCHWACH",
    "RELATIV",
    "KRITISCH",
    "HEIMISCH",
    "ÜBERLEGEN",
    "ÜBLICH",
    "AUSREICHEND",
    "VOLLSTÄNDIG",
    "BAYERISCH",
    "SINNVOLL",
    "DEMOKRATISCH",
    "DUNKEL",
    "OFFENSICHTLICH",
    "ONLINE",
    "AUTOMATISCH",
    "TOTAL",
    "DRINGEND",
    "ÜBERRASCHEND",
    "AUSSCHLIESSLICH",
    "ITALIENISCH",
    "ALLEINE",
    "ENGLISCH",
    "ATTRAKTIV",
    "SELBSTVERSTÄNDLICH",
    "ERHÄLTLICH",
    "UNBEKANNT",
    "MOBIL",
    "VERGEBEN",
    "MASSIV",
    "HERVORRAGEND",
    "ERNST",
    "NEGATIV",
    "SCHARF",
    "WUNDERBAR",
    "GOLDEN",
    "EINDEUTIG",
    "MENSCHLICH",
    "WISSENSCHAFTLICH",
    "DAMALIG",
    "VERFÜGBAR",
    "RECHTLICH",
    "STÄDTISCH",
    "BETROFFEN",
    "BERÜHMT",
    "MOMENTAN",
    "ENDGÜLTIG",
    "MAXIMAL",
    "BERUFLICH",
    "MEDIZINISCH",
    "ENORM",
    "DIVERS",
    "INTERESSIERT",
    "TYPISCH",
    "KRÄFTIG",
    "ÜBERTRAGEN",
    "UMFANGREICH",
    "HEFTIG",
    "BUNDESWEIT",
    "AUFMERKSAM",
    "WILLKOMMEN",
    "LANGJÄHRIG",
    "STELLVERTRETEND",
    "MEHRFACH",
    "OPTIMAL",
    "EXTERN",
    "ORDENTLICH",
    "GESELLSCHAFTLICH",
    "SOZIALISTISCH",
    "LANGFRISTIG",
    "DOPPELT",
    "FREIWILLIG",
    "NACHHALTIG",
    "GEEIGNET",
    "EHRENAMTLICH",
    "FREUNDLICH",
    "PROFESSIONELL",
    "CHINESISCH",
    "KULTURELL",
    "HEILIG",
    "GENERELL",
    "AUSFÜHRLICH",
    "FÜHREND",
    "AUSLÄNDISCH",
    "TÜRKISCH",
    "ÖSTERREICHISCH",
    "LUSTIG",
    "GESPANNT",
    "WERTVOLL",
    "DURCHSCHNITTLICH",
    "ZUKÜNFTIG",
    "WESTLICH",
    "VIELFÄLTIG",
    "UNGLAUBLICH",
    "STRENG",
    "HOCHWERTIG",
    "UNGEWÖHNLICH",
    "GEMÜTLICH",
    "GLOBAL",
    "BILLIG",
    "GERECHT",
    "KURZFRISTIG",
    "VORAUSSICHTLICH",
    "KREATIV",
    "ANGENEHM",
    "FREMD",
    "JÜDISCH",
    "AUSDRÜCKLICH",
    "RASCH",
    "EHRLICH",
    "SICHTBAR",
    "STILL",
    "EVENTUELL",
    "GEZIELT",
    "BLOSS",
    "IDEAL",
    "SPANISCH",
    "OLYMPISCH",
    "WUNDERSCHÖN",
    "SCHADE",
    "LOKAL",
    "TROCKEN",
    "INTERN",
    "MONATLICH",
    "WEIBLICH",
    "ELEKTRONISCH",
    "WEITGEHEND",
    "REICH",
    "DICHT",
    "STEIGEND",
    "STABIL",
    "DIESJÄHRIG",
    "UMSTRITTEN",
    "WIENER",
    "GEGENWÄRTIG",
    "ERREICHBAR",
    "GEGENSEITIG",
    "MITTEL",
    "KÖRPERLICH",
    "KRANK",
    "BEDEUTEND",
    "SCHLICHT",
    "KÜNSTLERISCH",
    "UNKLAR",
    "EINZIGARTIG",
    "SONSTIG",
    "LECKER",
    "ENTFERNT",
    "TELEFONISCH",
    "RECHTZEITIG",
    "LOCKER",
    "JAPANISCH",
    "GROSSARTIG",
    "SAUBER",
    "MÄCHTIG",
    "ÜBERWIEGEND",
    "MÄNNLICH",
    "ÖRTLICH",
    "SCHRIFTLICH",
    "JETZIG",
    "ANGEMESSEN",
    "BEDINGT",
    "TRAURIG",
    "DERARTIG",
    "DAUERHAFT",
    "VERHALTEN",
    "EINSTIMMIG",
    "KONSEQUENT",
    "SEXUELL",
    "MILITÄRISCH",
    "ISRAELISCH",
    "EINIG",
    "KOMMUNAL",
    "VORLÄUFIG",
    "FRÖHLICH",
    "LEBEND",
    "EINMALIG",
    "LETZTERE",
    "EFFEKTIV",
    "CHRISTLICH",
    "FRIEDLICH",
    "VEREINIGT",
    "ERNSTHAFT",
    "ALTERNATIV",
    "GEISTIG",
    "DRAMATISCH",
    "DERZEITIG",
    "JAHRELANG",
    "SOWJETISCH",
    "INNOVATIV",
    "DEFINITIV",
    "POLNISCH",
    "SCHEINBAR",
    "ENGAGIERT",
    "LEBENDIG",
    "VERGLEICHBAR",
    "AUSSERGEWÖHNLICH",
    "VORLIEGEND",
    "BEQUEM",
    "FLEXIBEL",
    "ERSTAUNLICH",
    "SÄCHSISCH",
    "VERMEINTLICH",
    "UNGEFÄHR",
    "PARALLEL",
    "ARABISCH",
    "KOMPLEX",
    "PSYCHISCH",
    "EXKLUSIV",
    "WIRKSAM",
    "HESSISCH",
    "EINHEITLICH",
    "GEWALTIG",
    "ÄRZTLICH",
    "ÖKOLOGISCH",
    "GEWOHNT",
    "HERRLICH",
    "BEEINDRUCKEND",
    "SPONTAN",
    "KOMPLIZIERT",
    "VORHERIG",
    "VOLLKOMMEN",
    "VORSICHTIG",
    "ERHÖHT",
    "SÜDLICH",
    "SAARLÄNDISCH",
    "SOUVERÄN",
    "WEICH",
    "MASSGEBLICH",
    "OPTISCH",
    "LEISE",
    "ABHÄNGIG",
    "VIRTUELL",
    "HÜBSCH",
    "REICHLICH",
    "BUCHEN",
    "ZULÄSSIG",
    "KÜNSTLICH",
    "EMOTIONAL",
    "KORREKT",
    "HAUPTSÄCHLICH",
    "GRIECHISCH",
    "ERKENNBAR",
    "INHALTLICH",
    "ZUVERLÄSSIG",
    "UNMÖGLICH",
    "ZUGÄNGLICH",
    "VERSTELLBAR",
    "DENKBAR",
    "GÜLTIG",
    "HILFREICH",
    "RELIGIÖS",
    "SPEKTAKULÄR",
    "BETRETEN",
    "JURISTISCH",
    "TÖDLICH",
    "VERNÜNFTIG",
    "KOSTENFREI",
    "ISLAMISCH",
    "KOMISCH",
    "STRATEGISCH",
    "RELEVANT",
    "RESTLICH",
    "BESCHEIDEN",
    "EINSTIG",
    "THEORETISCH",
    "ANONYM",
    "MENSCH",
    "PROZENT",
    "STADT",
    "WOCHE",
    "SPIEL",
    "MILLION",
    "FRAGE",
    "SEITE",
    "THEMA",
    "SONNTAG",
    "PLATZ",
    "LEBEN",
    "MINUTE",
    "ARBEIT",
    "UNTERNEHMEN",
    "MONAT",
    "SAMSTAG",
    "STRASSE",
    "GRUND",
    "PROBLEM",
    "BEITRAG",
    "FREITAG",
    "VEREIN",
    "PUNKT",
    "POLIZEI",
    "STUNDE",
    "BEISPIEL",
    "INFORMATION",
    "MITGLIED",
    "FAMILIE",
    "PREIS",
    "GESCHICHTE",
    "SEPTEMBER",
    "PERSON",
    "MÖGLICHKEIT",
    "SCHULE",
    "BEREICH",
    "MONTAG",
    "GRUPPE",
    "OKTOBER",
    "MITTWOCH",
    "DONNERSTAG",
    "ERGEBNIS",
    "DOKTOR",
    "MANNSCHAFT",
    "PROJEKT",
    "NOVEMBER",
    "JANUAR",
    "APRIL",
    "PROGRAMM",
    "AUGUST",
    "ANGEBOT",
    "GEMEINDE",
    "NACHRICHT",
    "TERMIN",
    "LEUTE",
    "ERFOLG",
    "MITARBEITER",
    "KUNDE",
    "DIENSTAG",
    "TELEFON",
    "METER",
    "ENTSCHEIDUNG",
    "DEZEMBER",
    "ABEND",
    "KOMMENTAR",
    "CHANCE",
    "TRAINER",
    "MUSIK",
    "ELTERN",
    "ANFANG",
    "SCHÜLER",
    "FEBRUAR",
    "SACHE",
    "FREUND",
    "INTERNET",
    "ZUKUNFT",
    "PARTEI",
    "BLICK",
    "VORSITZENDE",
    "MARKT",
    "KREIS",
    "BESUCHER",
    "EINSATZ",
    "SPIELER",
    "ENTWICKLUNG",
    "FIRMA",
    "STELLE",
    "KIRCHE",
    "REGIERUNG",
    "VERANSTALTUNG",
    "REGION",
    "GESPRÄCH",
    "HILFE",
    "KOSTEN",
    "BERLINER",
    "BÜRGERMEISTER",
    "JUGENDLICHE",
    "LEISTUNG",
    "PRODUKT",
    "SAISON",
    "FOLGE",
    "WOCHENENDE",
    "BÜRGER",
    "ARTIKEL",
    "STAAT",
    "AUFGABE",
    "INTERESSE",
    "ANGABE",
    "RAHMEN",
    "NAMEN",
    "WASSER",
    "TITEL",
    "STÜCK",
    "ANTWORT",
    "VERFÜGUNG",
    "PRÄSIDENT",
    "AUSSTELLUNG",
    "ROLLE",
    "NACHT",
    "MILLIARDE",
    "ERFAHRUNG",
    "BEGINN",
    "DATEN",
    "RICHTUNG",
    "MUTTER",
    "GESELLSCHAFT",
    "POLITIK",
    "BETRIEB",
    "SITUATION",
    "KARTE",
    "ZEITUNG",
    "ZUSCHAUER",
    "PROFIL",
    "SCHRITT",
    "SOMMER",
    "MITTE",
    "KRAFT",
    "LEIPZIGER",
    "FÜHRUNG",
    "RECHT",
    "MEINUNG",
    "VATER",
    "LIEBE",
    "MÜLLER",
    "SPASS",
    "LÖSUNG",
    "TEILNEHMER",
    "ANMELDUNG",
    "KLASSE",
    "GRUSS",
    "SPORT",
    "KILOMETER",
    "URTEIL",
    "KONTAKT",
    "GERICHT",
    "KONZERT",
    "MÄDCHEN",
    "STIMME",
    "-MAIL",
    "HINWEIS",
    "AKTION",
    "WOHNUNG",
    "WEISE",
    "UNTERSTÜTZUNG",
    "KAMPF",
    "BERICHT",
    "BEKLAGTE",
    "INHALT",
    "ALTER",
    "SICHERHEIT",
    "RUNDE",
    "KUNST",
    "FAHRZEUG",
    "MUSEUM",
    "GERÄT",
    "GLÜCK",
    "REIHE",
    "FARBE",
    "GRÜNE",
    "VERGLEICH",
    "FUSSBALL",
    "BÜHNE",
    "SYSTEM",
    "REISE",
    "PUBLIKUM",
    "START",
    "WIRTSCHAFT",
    "BESUCH",
    "GRENZE",
    "ANSPRUCH",
    "REGEL",
    "VERTRAG",
    "ARCHIV",
    "MASSNAHME",
    "SCHWEIZER",
    "GESCHÄFT",
    "RATHAUS",
    "GEBÄUDE",
    "HOTEL",
    "KÜNSTLER",
    "PARTIE",
    "WUNSCH",
    "LANDKREIS",
    "FEUERWEHR",
    "KOLLEGE",
    "ZUSAMMENARBEIT",
    "KLÄGER",
    "ANGST",
    "KLAUS",
    "THEATER",
    "MOMENT",
    "DOLLAR",
    "GEBURTSTAG",
    "AUTOR",
    "GEFÜHL",
    "ANTRAG",
    "JAHRHUNDERT",
    "DISKUSSION",
    "KRIEG",
    "PARTNER",
    "GESETZ",
    "OPFER",
    "GEGNER",
    "DRUCK",
    "QUALITÄT",
    "VERBINDUNG",
    "GEFAHR",
    "KRITIK",
    "MENGE",
    "KULTUR",
    "STAND",
    "SUCHE",
    "VIDEO",
    "SCHADEN",
    "BODEN",
    "MITTEL",
    "HÄLFTE",
    "TREFFEN",
    "SICHT",
    "STUDIE",
    "GEDANKE",
    "PRAXIS",
    "DIENST",
    "VERFAHREN",
    "TOCHTER",
    "BEDEUTUNG",
    "LICHT",
    "ANBIETER",
    "MESSE",
    "DEUTSCHE",
    "PATIENT",
    "VORTRAG",
    "VORTEIL",
    "FREUDE",
    "MODELL",
    "FEHLER",
    "BEVÖLKERUNG",
    "QUELLE",
    "ZUSAMMENHANG",
    "GESICHT",
    "LEITER",
    "KONZEPT",
    "LEITUNG",
    "SPRACHE",
    "VERTRETER",
    "EINRICHTUNG",
    "JUNGE",
    "UNIVERSITÄT",
    "GESCHÄFTSFÜHRER",
    "SITZUNG",
    "HINTERGRUND",
    "KRANKENHAUS",
    "BEHÖRDE",
    "BERATUNG",
    "ESSEN",
    "ANLAGE",
    "AUFZUG",
    "EXPERTE",
    "FORUM",
    "AUFTRITT",
    "VORSTAND",
    "AUSSAGE",
    "STANDORT",
    "JUGEND",
    "VORSTELLUNG",
    "HALLE",
    "NATUR",
    "LINIE",
    "GOTTESDIENST",
    "GEMEINDERAT",
    "EINTRITT",
    "TECHNIK",
    "WETTBEWERB",
    "RICHTER",
    "SEKUNDE",
    "AUSBILDUNG",
    "HOFFNUNG",
    "ENERGIE",
    "HERBST",
    "WINTER",
    "PROFESSOR",
    "GEBIET",
    "ERINNERUNG",
    "EINDRUCK",
    "ZEITPUNKT",
    "ORGANISATION",
    "MORGEN",
    "WETTER",
    "POLITIKER",
    "AUFTRAG",
    "POSITION",
    "HAMBURGER",
    "UNION",
    "VORSCHLAG",
    "MOTTO",
    "TÄTER",
    "KÖRPER",
    "VORAUSSETZUNG",
    "PAUSE",
    "LEHRER",
    "FACEBOOK",
    "KLÄGERIN",
    "GARTEN",
    "ÄNDERUNG",
    "NIEDERLAGE",
    "VERBAND",
    "TISCH",
    "SERIE",
    "UNFALL",
    "LESER",
    "BEZIEHUNG",
    "VERSION",
    "GEWINN",
    "STRECKE",
    "RISIKO",
    "NUMMER",
    "ANTEIL",
    "MATERIAL",
    "ZUGANG",
    "FAHRER",
    "NUTZER",
    "VERGANGENHEIT",
    "FUNKTION",
    "VEREINBARUNG",
    "TRAINING",
    "SERVICE",
    "MARKE",
    "ZENTRUM",
    "ENGAGEMENT",
    "ANGRIFF",
    "SORGE",
    "FAHRT",
    "INTERVIEW",
    "BEWEGUNG",
    "SPRECHER",
    "GRÖSSE",
    "VERHÄLTNIS",
    "GASTGEBER",
    "GELEGENHEIT",
    "HERSTELLER",
    "LISTE",
    "GRUNDLAGE",
    "FISCHER",
    "VORJAHR",
    "AUSGABE",
    "INITIATIVE",
    "ZEICHEN",
    "FORDERUNG",
    "BERUF",
    "DETAIL",
    "MEHRHEIT",
    "GENERATION",
    "VERHANDLUNG",
    "ROMAN",
    "SCHUTZ",
    "WEBSITE",
    "AUSWAHL",
    "VERSUCH",
    "ANSICHT",
    "MEISTER",
    "ARBEITSPLATZ",
    "SZENE",
    "VERWALTUNG",
    "WERDEN",
    "HABEN",
    "KÖNNEN",
    "GEBEN",
    "MÜSSEN",
    "SOLLEN",
    "SAGEN",
    "KOMMEN",
    "WOLLEN",
    "GEHEN",
    "MACHEN",
    "STEHEN",
    "FINDEN",
    "LASSEN",
    "SEHEN",
    "BLEIBEN",
    "STELLEN",
    "LIEGEN",
    "ZEIGEN",
    "NEHMEN",
    "DÜRFEN",
    "SONDERN",
    "BRINGEN",
    "HALTEN",
    "WISSEN",
    "SPIELEN",
    "MÖGEN",
    "FÜHREN",
    "SETZEN",
    "ERKLÄREN",
    "BIETEN",
    "BEKOMMEN",
    "ERHALTEN",
    "GEHÖREN",
    "BEGINNEN",
    "GELTEN",
    "HEISSEN",
    "SPRECHEN",
    "TREFFEN",
    "GEWINNEN",
    "SCHREIBEN",
    "ZIEHEN",
    "SCHAFFEN",
    "ARBEITEN",
    "LAUFEN",
    "NUTZEN",
    "SUCHEN",
    "BRAUCHEN",
    "BERICHTEN",
    "FREUEN",
    "ERREICHEN",
    "SORGEN",
    "FAHREN",
    "TRAGEN",
    "MEINEN",
    "BESTEHEN",
    "LEBEN",
    "HELFEN",
    "ENTSCHEIDEN",
    "ENTSTEHEN",
    "DENKEN",
    "KENNEN",
    "VERLIEREN",
    "FEIERN",
    "LEGEN",
    "FOLGEN",
    "ERWARTEN",
    "VERSUCHEN",
    "FORDERN",
    "LESEN",
    "NENNEN",
    "TEILEN",
    "HANDELN",
    "FRAGEN",
    "GLAUBEN",
    "ÖFFNEN",
    "ÜBERNEHMEN",
    "SCHEINEN",
    "STEIGEN",
    "GELINGEN",
    "SCHLIESSEN",
    "UNTERSTÜTZEN",
    "FEHLEN",
    "STARTEN",
    "TRETEN",
    "VERSTEHEN",
    "ENTWICKELN",
    "LADEN",
    "PLANEN",
    "KAUFEN",
    "ANZEIGEN",
    "ERZÄHLEN",
    "LERNEN",
    "HOFFEN",
    "GEFALLEN",
    "HÖREN",
    "ERSCHEINEN",
    "BEFINDEN",
    "FÜHLEN",
    "PRÄSENTIEREN",
    "FALLEN",
    "SITZEN",
    "ERINNERN",
    "BETONEN",
    "SCHLAGEN",
    "ÄNDERN",
    "ERFAHREN",
    "KOSTEN",
    "WÄHLEN",
    "BAUEN",
    "HOLEN",
    "VORSTELLEN",
    "ERKENNEN",
    "WÜNSCHEN",
    "ANBIETEN",
    "WIRKEN",
    "MELDEN",
    "INFORMIEREN",
    "BEDEUTEN",
    "ERLEBEN",
    "WARTEN",
    "BESTÄTIGEN",
    "ZÄHLEN",
    "VERBINDEN",
    "REICHEN",
    "RECHNEN",
    "BESUCHEN",
    "PASSEN",
    "SCHAUEN",
    "ERFOLGEN",
    "FÄLLEN",
    "VERKAUFEN",
    "PASSIEREN",
    "ZAHLEN",
    "STIMMEN",
    "EINSETZEN",
    "VERÖFFENTLICHEN",
    "LIEBEN",
    "VERWENDEN",
    "LEISTEN",
    "AUFNEHMEN",
    "VERLASSEN",
    "BESCHÄFTIGEN",
    "VERLETZEN",
    "FUNKTIONIEREN",
    "ERGEBEN",
    "ERÖFFNEN",
    "WEISEN",
    "ÜBERZEUGEN",
    "BITTEN",
    "RUFEN",
    "ENTHALTEN",
    "BILDEN",
    "STERBEN",
    "ERZIELEN",
    "WERFEN",
    "BETREFFEN",
    "ENTDECKEN",
    "SICHERN",
    "WACHSEN",
    "VERHINDERN",
    "ERHÖHEN",
    "ERMÖGLICHEN",
    "DAUERN",
    "EMPFEHLEN",
    "LIEFERN",
    "BESCHLIESSEN",
    "EINLADEN",
    "VERTRETEN",
    "BEZEICHNEN",
    "BETEILIGEN",
    "ERFÜLLEN",
    "DIENEN",
    "LÖSEN",
    "KÄMPFEN",
    "VERDIENEN",
    "BETRAGEN",
    "GERATEN",
    "GESTALTEN",
    "STATTFINDEN",
    "RICHTEN",
    "BEZAHLEN",
    "MITTEILEN",
    "STECKEN",
    "BESCHREIBEN",
    "BESTIMMEN",
    "SCHICKEN",
    "BENÖTIGEN",
    "HÄNGEN",
    "VERZICHTEN",
    "VERSPRECHEN",
    "WECHSELN",
    "DREHEN",
    "BEWEGEN",
    "REAGIEREN",
    "FESTSTELLEN",
    "DROHEN",
    "VERGESSEN",
    "GREIFEN",
    "VERLANGEN",
    "BEGLEITEN",
    "GEBÄREN",
    "SAMMELN",
    "VERFÜGEN",
    "BETREIBEN",
    "BEENDEN",
    "FÖRDERN",
    "GRÜNDEN",
    "VERBESSERN",
    "PRÜFEN",
    "ENTSPRECHEN",
    "STAMMEN",
    "DURCHFÜHREN",
    "GENIESSEN",
    "EINSTELLEN",
    "LAUTEN",
    "BEZIEHEN",
    "ANNEHMEN",
    "VERÄNDERN",
    "SINGEN",
    "SCHÜTZEN",
    "BELEGEN",
    "ORGANISIEREN",
    "KÜNDIGEN",
    "BESITZEN",
    "KRITISIEREN",
    "DARSTELLEN",
    "KLINGEN",
    "ABSCHLIESSEN",
    "REDEN",
    "ENDEN",
    "DISKUTIEREN",
    "ERLAUBEN",
    "VERFOLGEN",
    "ENTFERNEN",
    "UMSETZEN",
    "WARNEN",
    "AUFBAUEN",
    "INTERESSIEREN",
    "TEILNEHMEN",
    "GESCHEHEN",
    "BEOBACHTEN",
    "LANDEN",
    "VERWEISEN",
    "SCHÄTZEN",
    "ERLÄUTERN",
    "ERSTELLEN",
    "AUSSEHEN",
    "BESTELLEN",
    "BEWEISEN",
    "SINKEN",
    "ANSEHEN",
    "ESSEN",
    "VORBEREITEN",
    "ABGEBEN",
    "GEDENKEN",
    "BEHANDELN",
    "ÄUSSERN",
    "RETTEN",
    "AUSGEHEN",
    "SCHEITERN",
    "VERMITTELN",
    "INVESTIEREN",
    "BEHAUPTEN",
    "STOSSEN",
    "WENDEN",
    "VERPFLICHTEN",
    "BEGRÜSSEN",
    "VORSEHEN",
    "ERHEBEN",
    "KÜMMERN",
    "ERMITTELN",
    "MERKEN",
    "LEIDEN",
    "FLIEGEN",
    "PROFITIEREN",
    "BENUTZEN",
    "ANKOMMEN",
    "VERSCHWINDEN",
    "SPAREN",
    "BEGRÜNDEN",
    "BETRACHTEN",
    "HERRSCHEN",
    "DRÜCKEN",
    "EIGNEN",
    "FASSEN",
    "ERWERBEN",
    "ANFANGEN",
    "VERTEILEN",
    "WOHNEN",
    "TESTEN",
    "VERBRINGEN",
    "BERATEN",
    "LEITEN",
    "GENÜGEN",
    "ANKÜNDIGEN",
    "ERGÄNZEN",
    "VERBIETEN",
    "ZEICHNEN",
    "ERSETZEN",
    "TREIBEN",
    "HERSTELLEN",
    "AUSSCHLIESSEN",
    "VERANSTALTEN",
    "VERURTEILEN",
    "ANTRETEN",
    "ANMELDEN",
    "VERMEIDEN",
    "BEREITEN",
    "SPERREN",
    "VERABSCHIEDEN",
    "BRECHEN",
    "PRODUZIEREN",
    "REDUZIEREN",
    "KLÄREN",
    "SCHIESSEN",
    "BEHALTEN",
    "VORNEHMEN",
    "LOHNEN",
    "SPÜREN",
    "EINRICHTEN",
    "ACHTEN",
    "BEANTWORTEN",
    "RÜCKEN",
    "GELANGEN",
    "AUFSTELLEN",
    "BEANTRAGEN",
    "ÜBERRASCHEN",
    "BERÜCKSICHTIGEN",
    "DANKEN",
    "DURCHSETZEN",
    "HEBEN",
    "LACHEN",
    "AUSZEICHNEN",
    "HINTERLASSEN",
    "BLICKEN",
    "TRENNEN",
    "ABLEHNEN",
    "TÖTEN",
    "BEITRAGEN",
    "UNTERSUCHEN",
    "TRAINIEREN",
    "PRÄGEN",
    "STÄRKEN",
    "REGISTRIEREN",
    "FINANZIEREN",
    "STEIGERN",
    "ANSPRECHEN",
    "FÜLLEN",
    "BEACHTEN",
    "AUFTRETEN",
    "VERRATEN",
    "FANGEN",
    "WIDMEN",
    "VERPASSEN",
    "KLAPPEN",
    "ABSOLVIEREN",
    "ERWEITERN",
    "TRINKEN",
    "ZWINGEN",
    "VERTEIDIGEN",
    "ZULASSEN",
    "VERLEIHEN",
    "PFLEGEN",
    "RÄUMEN",
    "BETREUEN",
    "ERWEISEN",
    "VERGLEICHEN",
    "UMFASSEN",
    "VERMUTEN",
    "STUDIEREN",
    "EINGEHEN",
    "VERLAUFEN",
    "HINWEISEN",
    "BESTREITEN",
    "ÜBERPRÜFEN",
    "GEBIETEN",
    "ANGEHEN",
    "LOBEN",
    "VORLIEGEN",
    "KONZENTRIEREN",
    "BEWERTEN",
    "LEHNEN",
    "ENGAGIEREN",
    "FLIESSEN",
    "KONTROLLIEREN",
    "STÖREN",
    "UMGEHEN",
    "STÜRZEN",
    "AUSBAUEN",
    "UNTERSCHEIDEN",
    "INSTALLIEREN",
    "WERBEN",
    "SPRINGEN",
    "EMPFANGEN",
    "REISEN",
    "EINFÜHREN",
    "SCHENKEN",
    "ANPASSEN",
    "BESETZEN",
    "SENDEN",
    "BEFÜRCHTEN",
    "VERSORGEN",
    "VORLEGEN",
    "FORTSETZEN",
    "KEHREN",
    "ANTWORTEN",
    "ABSEHEN",
    "SPEICHERN",
    "KOMMENTIEREN",
    "ERWÄHNEN",
    "UNTERLIEGEN",
    "BEMÜHEN",
    "EHREN",
    "ERTEILEN",
    "ANLEGEN",
    "STOPPEN",
    "MESSEN",
    "BEDIENEN",
    "ÜBERGEBEN",
    "FESTLEGEN",
    "VERSICHERN",
    "ERRICHTEN",
    "AUFGEBEN",
    "ANSCHAUEN",
    "ZERSTÖREN",
    "AKZEPTIEREN",
    "LOCKEN",
    "ERLEDIGEN",
    "VERSCHIEBEN",
    "AUSLÖSEN",
    "VERLÄNGERN",
    "VERLEGEN",
    "SIEGEN",
    "VERWANDELN",
    "AUSGEBEN",
    "UNTERNEHMEN",
    "FÜGEN",
    "GESTEHEN",
    "SENKEN",
    "AUSSPRECHEN",
    "DRÄNGEN",
    "LÖSCHEN",
    "VERBREITEN",
    "VERURSACHEN",
    "MITBRINGEN",
    "GARANTIEREN",
    "MITMACHEN",
    "SCHNEIDEN",
    "GEBRAUCHEN",
    "FESTHALTEN",
    "STEUERN",
    "ERLEIDEN",
    "EMPFINDEN",
    "RATEN",
    "SCHLAFEN",
    "BEMERKEN",
    "BEKENNEN",
    "AUSSTATTEN",
    "STREICHEN",
    "WAHRNEHMEN",
    "FÜRCHTEN",
    "AUSFALLEN",
    "SCHIEBEN",
    "VERKÜNDEN",
    "AUSFÜHREN",
    "ERFASSEN",
    "ZUSTIMMEN",
    "UNTERHALTEN",
    "REGELN",
    "VERFASSEN",
    "BEGEGNEN",
    "ZURÜCKKEHREN",
    "BEGEHEN",
    "VERZEICHNEN",
    "INTEGRIEREN",
    "GEWÄHRLEISTEN",
    "WAGEN",
    "TANZEN",
    "BEFASSEN",
    "GEFÄHRDEN",
    "AUFHEBEN",
    "ERARBEITEN",
    "GEWÄHREN",
    "AUSPROBIEREN",
    "EINBRINGEN",
    "BEWERBEN",
    "VEREINBAREN",
    "SPENDEN",
    "KLAGEN",
    "KRIEGEN",
    "ANGEBEN",
    "AUSSETZEN",
    "PACKEN",
    "REALISIEREN",
    "BEFREIEN",
    "TAUCHEN",
];

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function unterstreicheSatz(satz) {
    const woerter = satz.split(" ");
    const unterstricheneWoerter = woerter.map(wort => {
        return wort.split('').map(() => "\\_").join("");
    });
    return unterstricheneWoerter.join("\n");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Starte ein Spiel von Galgenmännchen.')
        .addStringOption(option =>
            option.setName('wort')
                .setDescription('Wort mindestens 5 Buchstaben')
                .setMinLength(5)
                .setRequired(false)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            await interaction.deferReply();
            let wortobj = interaction.options.get('wort');
            let wort = null;
            let user = interaction.user;
            if (!wortobj) {
                wort = wordList[getRandom(0, wordList.length - 1)];
                user = client.user;
            } else {
                wort = wortobj.value;
                const regex = /^[\u0041-\u005A\u0061-\u007A\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF\s]+$/; // A-Z, a-z, ÄÖÜäöü, ß
                if (!regex.test(wort)) {
                    await interaction.editReply('Das übergebene Wort enthält Zeichen die nicht zugelassen sind.');
                    return;
                }
            }
            const activeHangman = await Hangman.findOne({ guildId: interaction.guild.id, status: 'laufend' });
            if (activeHangman) {
                await interaction.editReply('Es läuft bereits ein Galgenmännchen Spiel. Bitte beende dies zuerst.');
                return;
            }
            await Hangman.deleteMany({ guildId: interaction.guild.id, status: 'beendet' });
            wort = wort.replaceAll('ß', 'ss').toUpperCase();
            let leerzeichen = unterstreicheSatz(wort);
            const file = new AttachmentBuilder(path.join(__dirname, '../../img/hangman0.png'));
            const hangman = new EmbedBuilder()
                .setColor(0x0033cc)
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 256 }) })
                .setTitle(`Galgenmännchen`)
                .setDescription(`${leerzeichen}\n\n${wort.replaceAll(' ', '').length} Buchstaben`)
                .setThumbnail(`attachment://hangman0.png`);
            const message = await interaction.editReply({ embeds: [hangman], files: [file] });
            const hangmanData = new Hangman({
                authorId: user.id,
                guildId: interaction.guild.id,
                messageId: message.id,
                word: wort,
            });
            await hangmanData.save();
        } catch (error) {
            console.log(error);
        }
    },
};