/**
 * Site-wide configuration and German UI copy.
 * Strings live here so a wording change is one edit, not a grep.
 */

export const SITE = {
	name: 'HR Tech Nugget',
	url: 'https://hr-tech-nugget.pages.dev',
	lang: 'de',
	author: 'Sebastian Eßling',
	authorInitials: 'SE',
	authorRole: 'Bereichsleiter MTB IT for HR',
	authorCompany: 'mindsquare AG',
	authorBio:
		'Verantwortet IT für HR-Transformation bei mindsquare. Schreibt über Digitalisierung, KI und Daten im HR.',
	description:
		'Notizen aus der Praxis zu Digitalisierung im HR, KI & Daten und dem Umbau zu einer modernen HR-Organisation.',
	thesis:
		'Die meisten HR-Transformationen scheitern an derselben Stelle: Die Technik geht live, die Organisation bewegt sich nicht.',
	establishedYear: 2026,
} as const;

/**
 * Everything that has to be filled in before the site may go public.
 * Fill these once — Impressum, Datenschutz, About and the newsletter form all
 * read from here, so there is no second place to forget.
 *
 * An empty string renders as a visibly marked placeholder and keeps the
 * "not ready to publish" banner on the legal pages.
 */
export const OWNER = {
	/** Buttondown newsletter username, from your Buttondown dashboard. */
	buttondownUser: '',
	email: '',
	linkedinUrl: '',
	street: '',
	postalCity: '',
	country: 'Deutschland',
	/** Optional; leave empty if you do not want to publish a phone number. */
	phone: '',
	/** Or the note that it does not apply to a purely private site. */
	vatId: '',
} as const;

/** Fields that must be set before publishing. `phone` is deliberately optional. */
export const REQUIRED_OWNER_FIELDS = [
	'buttondownUser',
	'email',
	'linkedinUrl',
	'street',
	'postalCity',
	'vatId',
] as const satisfies readonly (keyof typeof OWNER)[];

export function missingOwnerFields(): string[] {
	return REQUIRED_OWNER_FIELDS.filter((key) => OWNER[key].trim() === '');
}

export function isPublishReady(): boolean {
	return missingOwnerFields().length === 0;
}

export const TOPIC_IDS = ['digitalisierung', 'ki-daten', 'organisation'] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export type Topic = {
	id: TopicId;
	/** Zero-padded index shown on the topic cards. */
	order: string;
	/** Card heading. */
	title: string;
	/** Compact uppercase form used in the archive TOPIC column and badges. */
	short: string;
	/** Card body copy. */
	dek: string;
};

export const TOPICS: readonly Topic[] = [
	{
		id: 'digitalisierung',
		order: '01',
		title: 'Digitalisierung im HR',
		short: 'DIGITALISIERUNG',
		dek: 'Raus aus Tabellen und E-Mail-Postfächern — und vorbei an der Falle, alte Prozesse bloß zu digitalisieren.',
	},
	{
		id: 'ki-daten',
		order: '02',
		title: 'KI & Daten im HR',
		short: 'KI & DATEN IM HR',
		dek: 'Was KI heute wirklich für HR-Teams leistet, und auf welchem Datenfundament das still und leise aufbaut.',
	},
	{
		id: 'organisation',
		order: '03',
		title: 'Moderne HR-Organisation',
		short: 'MODERNE HR-ORG',
		dek: 'Strukturen, Rollen und Arbeitsweisen neu denken — nicht nur den Tech-Stack darunter.',
	},
] as const;

export function topicById(id: TopicId): Topic {
	const topic = TOPICS.find((t) => t.id === id);
	if (!topic) throw new Error(`Unknown topic id: ${id}`);
	return topic;
}

/** Primary navigation. `key` matches the `active` prop on TopBar. */
export const NAV = [
	{ key: 'nuggets', label: 'NUGGETS', href: '/nuggets/' },
	{ key: 'themen', label: 'THEMEN', href: '/themen/' },
	{ key: 'ueber', label: 'ÜBER MICH', href: '/ueber-mich/' },
] as const;

export type NavKey = (typeof NAV)[number]['key'];

/** All user-facing chrome copy, German. */
export const UI = {
	subscribe: 'ABONNIEREN',
	fieldNotes: 'AUS DER PRAXIS',
	thesisLabel: 'DIE THESE',
	latest: 'AKTUELL',
	archive: 'ARCHIV',
	moreNuggets: 'WEITERE NUGGETS',
	readNugget: 'NUGGET LESEN',
	backHome: '← START',
	backNuggets: '← ALLE NUGGETS',
	backTopics: '← ALLE THEMEN',
	colNumber: 'NR.',
	colDate: 'DATUM',
	colTitle: 'TITEL',
	colTopic: 'THEMA',
	colTime: 'ZEIT',
	author: 'AUTOR',
	published: 'VERÖFFENTLICHT',
	readingTime: 'LESEZEIT',
	share: 'TEILEN',
	copyLink: 'LINK KOPIEREN',
	readNext: 'WEITERLESEN',
	shortVersion: 'KURZFASSUNG',
	aboutCta: 'ÜBER MICH',
	newsletterHeading: 'Neue Nuggets per E-Mail.',
	newsletterSub: 'EIN NUGGET, WENN EINES FERTIG IST. KEIN SPAM. JEDERZEIT ABBESTELLBAR.',
	newsletterUnset: 'NEWSLETTER NOCH NICHT VERBUNDEN — buttondownUser IN site.ts SETZEN.',
	emailPlaceholder: 'du@unternehmen.de',
	minutes: 'MIN',
	minutesRead: 'MIN LESEZEIT',
	nuggetsWord: 'NUGGETS',
	fullArchive: 'GESAMTES ARCHIV',
	updated: 'AKTUALISIERT',
	skipToContent: 'ZUM INHALT SPRINGEN',
	allViewsMyOwn: 'ALLE ANSICHTEN SIND MEINE EIGENEN',
	menu: 'MENÜ',
} as const;

export const FOOTER_LINKS = [
	{ label: 'RSS', href: '/rss.xml' },
	{ label: 'LINKEDIN', href: OWNER.linkedinUrl || '/ueber-mich/' },
	{ label: 'IMPRESSUM', href: '/impressum/' },
	{ label: 'DATENSCHUTZ', href: '/datenschutz/' },
] as const;

/** DD.MM.YYYY — the format the design uses everywhere. */
export function formatDate(date: Date): string {
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	return `${dd}.${mm}.${date.getFullYear()}`;
}

/** Zero-padded nugget number: 7 -> "07". */
export function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

/** "1 NUGGET" / "5 NUGGETS" — German singular has no trailing s. */
export function nuggetCount(n: number): string {
	return `${n} ${n === 1 ? 'NUGGET' : 'NUGGETS'}`;
}
