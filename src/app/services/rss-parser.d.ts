declare module 'rss-parser' {
  interface RSSEntry {
    title: string;
    link: string;
    pubDate: Date;
    creator: string;
    content: string;
    contentSnippet: string;
    guid: string;
    categories: string[];
    isoDate: string;
  }

  interface ParserCallback {
    (err: Error | null, parsed: RSSEntry[]): void;
  }
}
