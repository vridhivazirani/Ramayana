import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About & Methodology — Digital Atlas of the Ramayana',
  description:
    'Methodology, scope, and scholarly framework for the Digital Atlas of the Ramayana — a digital humanities project mapping the Valmiki Ramayana geography.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mist pt-14">
      {/* Header */}
      <header className="page-header px-6 py-8 text-center">
        <p className="text-ochre font-sans text-[10px] uppercase tracking-widest mb-1">
          About this project
        </p>
        <h1 className="font-serif text-parchment text-3xl md:text-4xl font-semibold max-w-2xl mx-auto">
          Methodology &amp; Scholarly Framework
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">

        {/* Section 1 — What this is */}
        <section id="scope">
          <h2 className="font-serif text-2xl text-ink mb-4">Scope and Purpose</h2>
          <p className="text-sm leading-relaxed text-charcoal mb-4">
            The Digital Atlas of the Ramayana is an academic digital humanities project that maps the
            geography of the Valmiki Ramayana onto real-world or traditionally identified locations.
            This is a scholarly cartographic exercise, not a devotional or religious artifact.
          </p>
          <p className="text-sm leading-relaxed text-charcoal mb-4">
            The project&apos;s core purpose is to bring together, in one interactive interface, the
            textual geography of the epic (as described in the poem itself), the traditional sites
            associated with the narrative by continuous pilgrimage and regional practice, and the
            positions of modern scholars on which identifications are supported, contested, or
            entirely disputed.
          </p>
          <div className="academic-note">
            <p className="text-sm font-semibold text-ochre-dark mb-2">An important caveat</p>
            <p className="text-xs leading-relaxed text-charcoal">
              Placing a pin on a map does not constitute a historical or archaeological claim.
              The Ramayana is a Sanskrit mahakavya (great poem) composed over centuries; the
              question of whether its narrative events correspond to literal historical occurrences
              is a matter of ongoing scholarly debate that this atlas does not seek to resolve.
              All site identifications are presented with their evidence base and status
              classification so that users can assess the strength of each claim independently.
            </p>
          </div>
        </section>

        {/* Section 2 — Primary Source */}
        <section id="source-text">
          <h2 className="font-serif text-2xl text-ink mb-4">Primary Source Text</h2>
          <p className="text-sm leading-relaxed text-charcoal mb-4">
            The primary textual reference for this atlas is the{' '}
            <strong>Baroda Critical Edition of the Valmiki Ramayana</strong> (Oriental Institute,
            Baroda, 1960–75), edited by G.H. Bhatt, U.P. Shah, and collaborators. This critical
            edition is the standard scholarly recension, constructed by comparing hundreds of
            manuscripts across all major regional traditions and removing later interpolations.
          </p>
          <p className="text-sm leading-relaxed text-charcoal mb-4">
            Where relevant, references are also drawn from the{' '}
            <strong>Princeton University Press translation of the Valmiki Ramayana</strong>, edited
            by Robert P. Goldman (Vols. 1–7, 1984–2017), which provides book-length scholarly
            introductions and notes on geographical interpretation.
          </p>
          <p className="text-sm leading-relaxed text-charcoal">
            All descriptions of locations in this atlas are original summaries written for this
            project. No text has been reproduced verbatim from any copyrighted translation,
            website, or secondary source.
          </p>
        </section>

        {/* Section 3 — Status System */}
        <section id="status-system">
          <h2 className="font-serif text-2xl text-ink mb-4">Site Status Classification</h2>
          <p className="text-sm leading-relaxed text-charcoal mb-6">
            Each location in this atlas carries one of three status classifications, displayed
            as colored markers on the map:
          </p>

          <div className="space-y-4">
            {/* Traditional */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-3 h-3 rounded-full bg-ochre" />
                <h3 className="font-serif text-lg text-ink font-semibold">Traditional</h3>
              </div>
              <p className="text-sm leading-relaxed text-charcoal">
                Sites identified through continuous pilgrimage tradition with textual correspondence.
                A &ldquo;traditional&rdquo; site is one where the association with the Ramayana narrative
                has been maintained in local religious practice, regional texts, and/or epigraphy for
                an extended historical period, and where the location broadly matches the poem&apos;s
                geographical description (direction of travel, proximity to named rivers, etc.).
                Traditional identification does not imply archaeological confirmation.
              </p>
            </div>

            {/* Disputed */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-3 h-3 rounded-full bg-terracotta" />
                <h3 className="font-serif text-lg text-ink font-semibold">Disputed</h3>
              </div>
              <p className="text-sm leading-relaxed text-charcoal">
                Sites where the identification is contested among scholars, where multiple competing
                theories exist, or where the evidence for a particular identification is insufficient
                to establish clear consensus. Disputed sites are presented with all major competing
                positions described. The atlas takes no position on which disputed identification
                is correct.
              </p>
            </div>

            {/* Archaeological */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-3 h-3 rounded-full bg-sage" />
                <h3 className="font-serif text-lg text-ink font-semibold">Archaeological</h3>
              </div>
              <p className="text-sm leading-relaxed text-charcoal">
                Sites where independent material evidence — from excavation, survey, remote sensing,
                or epigraphy — corroborates the traditional identification or provides independent
                data relevant to the location&apos;s identification. Archaeological status does not
                necessarily mean the site has been definitively linked to the Ramayana narrative;
                it means material evidence enriches or informs the scholarly discussion.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 — Limitations */}
        <section id="limitations">
          <h2 className="font-serif text-2xl text-ink mb-4">Limitations and Future Work</h2>
          <p className="text-sm leading-relaxed text-charcoal mb-4">
            This atlas is a v1 prototype covering approximately 18 major locations. Several
            significant omissions are acknowledged:
          </p>
          <ul className="list-none space-y-2 text-sm text-charcoal">
            {[
              'The Uttara Kanda geography (Lava and Kusha\'s kingdom, Valmiki\'s ashram) is represented only partially.',
              'Regional recension variants (the southern, Bengali, and northwestern recensions) may identify different locations than the Baroda Critical Edition.',
              'The Kishkindha Kanda\'s detailed description of the four directions (digvijaya passages) could yield additional geographical data.',
              'Formal GIS shapefiles and spatial analysis would allow for more rigorous distance and directional verification.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-ochre mt-0.5 flex-shrink-0">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 5 — Credit */}
        <section id="credit" className="border-t border-stone-lighter pt-8">
          <h2 className="font-serif text-xl text-ink mb-3">Project Note</h2>
          <p className="text-sm leading-relaxed text-charcoal">
            This digital atlas is an independent academic project. It does not represent the
            position of any religious institution, government body, or archaeological survey.
            All citations are to published scholarly works; see the{' '}
            <a href="/references" className="text-ochre underline hover:text-ochre-dark">
              References page
            </a>{' '}
            for the full bibliography.
          </p>
        </section>
      </div>
    </div>
  );
}
