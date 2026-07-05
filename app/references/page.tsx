import type { Metadata } from 'next';
import locationsData from '@/data/locations.json';
import { Location } from '@/types';

export const metadata: Metadata = {
  title: 'References — Digital Atlas of the Ramayana',
  description:
    'Full bibliography of scholarly sources cited in the Digital Atlas of the Ramayana.',
};

// Deduplicate and sort all sources from locations.json
function getBibliography(): { citation: string; locations: string[] }[] {
  const locations = locationsData as Location[];
  const citationMap = new Map<string, string[]>();

  for (const loc of locations) {
    for (const source of loc.sources) {
      const existing = citationMap.get(source) || [];
      if (!existing.includes(loc.name)) {
        existing.push(loc.name);
      }
      citationMap.set(source, existing);
    }
  }

  // Sort alphabetically by citation
  return Array.from(citationMap.entries())
    .map(([citation, locations]) => ({ citation, locations }))
    .sort((a, b) => a.citation.localeCompare(b.citation));
}

// Group by author/category prefix
function groupByCategory(
  entries: { citation: string; locations: string[] }[],
): Record<string, { citation: string; locations: string[] }[]> {
  const groups: Record<string, { citation: string; locations: string[] }[]> = {
    'Primary Source': [],
    'Monographs & Books': [],
    'Journal Articles & Reports': [],
  };

  for (const entry of entries) {
    if (entry.citation.includes('Baroda Critical Edition') || entry.citation.startsWith('Valmiki')) {
      groups['Primary Source'].push(entry);
    } else if (
      entry.citation.includes('Journal') ||
      entry.citation.includes('Bulletin') ||
      entry.citation.includes('Current Science') ||
      entry.citation.includes('Puratattva') ||
      entry.citation.includes('Indian Archaeology')
    ) {
      groups['Journal Articles & Reports'].push(entry);
    } else {
      groups['Monographs & Books'].push(entry);
    }
  }

  return groups;
}

export default function ReferencesPage() {
  const bibliography = getBibliography();
  const grouped = groupByCategory(bibliography);

  return (
    <div className="min-h-screen bg-mist pt-14">
      {/* Header */}
      <header className="page-header px-6 py-8 text-center">
        <p className="text-ochre font-sans text-[10px] uppercase tracking-widest mb-1">
          Scholarly Sources
        </p>
        <h1 className="font-serif text-parchment text-3xl md:text-4xl font-semibold">
          References &amp; Bibliography
        </h1>
        <p className="text-stone-light text-xs mt-2">
          {bibliography.length} unique citations · deduplicated from all site entries
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        <div className="academic-note">
          <p className="text-xs leading-relaxed text-charcoal">
            All sources listed below are cited in the location entries of this atlas. Citations
            follow the short-form pattern: <em>Author — Title. Publisher, Year</em>. No text
            has been reproduced verbatim from any of these works; all location descriptions are
            original summaries. For full publication details, consult each work directly.
          </p>
        </div>

        {Object.entries(grouped).map(([category, entries]) =>
          entries.length === 0 ? null : (
            <section key={category} id={`refs-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <h2 className="font-serif text-xl text-ink mb-1">{category}</h2>
              <div className="w-12 h-0.5 bg-ochre mb-5" />

              <ul className="space-y-5">
                {entries.map(({ citation, locations }, i) => (
                  <li
                    key={i}
                    className="group bg-white rounded-xl border border-stone-lighter p-4 hover:border-ochre/40 hover:shadow-card-hover transition-all duration-200"
                  >
                    <p className="text-sm leading-relaxed text-charcoal font-medium">
                      {citation}
                    </p>
                    <p className="text-[10px] text-stone mt-2 flex flex-wrap gap-1">
                      <span className="font-semibold uppercase tracking-wide">Used for:</span>
                      {locations.map((loc, j) => (
                        <span
                          key={j}
                          className="bg-parchment border border-parchment-dark rounded px-1.5 py-0.5 text-stone"
                        >
                          {loc}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ),
        )}

        {/* Note on further reading */}
        <section className="border-t border-stone-lighter pt-8">
          <h2 className="font-serif text-xl text-ink mb-4">Further Reading</h2>
          <p className="text-sm text-charcoal leading-relaxed mb-4">
            The following works are not directly cited in location entries but are foundational
            to the scholarly study of Ramayana geography and transmission history:
          </p>
          <ul className="space-y-3">
            {[
              'Goldman, Robert P. (ed.) — The Ramayana of Valmiki: An Epic of Ancient India, Vols. 1–7. Princeton University Press, 1984–2017. [English translation with extensive geographical and textual notes]',
              'Pollock, Sheldon — The Language of the Gods in the World of Men: Sanskrit, Culture, and Power in Premodern India. University of California Press, 2006.',
              'Lüders, Heinrich — "Zur Geschichte des östlichen Iran." Sitzungsberichte der Preussischen Akademie der Wissenschaften, 1930. [Historical geography of the Aranya Kanda region]',
              'Bhatt, G.H. (ed.) — The Vālmīki-Rāmāyaṇa: Critical Edition, 7 vols. Oriental Institute, Baroda, 1960–1975.',
              'Guruge, Ananda — The Ramayana — a New Retelling of the Valmiki Ramayana. Motilal Banarsidass, 1960. [Contains geographical appendices]',
            ].map((item, i) => (
              <li key={i} className="source-citation text-xs leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
