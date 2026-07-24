const fs = require('fs');
const sources = [
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.dunya.com/rss/ekonomi.xml', name: 'DÃ¼nya' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.bloomberght.com/rss/ekonomi', name: 'Bloomberg HT' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.ekonomim.com/rss/ekonomi.xml', name: 'Ekonomim' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.haberturk.com/rss/ekonomi.xml', name: 'HabertÃ¼rk' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.ensonhaber.com/rss/ekonomi.xml', name: 'Ensonhaber' },
];
async function main() {
  const all = [];
  for (const s of sources) {
    try {
      const r = await fetch(s.url);
      const d = await r.json();
      if (d.status === 'ok' && d.items) {
        d.items.forEach(item => {
          if (item.title && !all.some(x => x.title === item.title)) {
            all.push({ title: item.title, description: item.description || item.content, url: item.link, source: s.name, date: item.pubDate, image: item.thumbnail || item.enclosure?.link || null });
          }
        });
      }
    } catch (e) { console.error(s.name + ' failed:', e.message); }
  }
  all.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync('news.json', JSON.stringify(all.slice(0, 50), null, 2));
  console.log('News saved: ' + Math.min(all.length, 50));
}
main();
