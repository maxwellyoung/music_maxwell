# Music site measurement

The site uses Vercel Web Analytics for anonymous page views and a deliberately small set of decision-useful interaction events. No names, emails, note text, search terms, or other user-entered content are sent as event properties.

| Event | Trigger | Properties | Decision supported |
| --- | --- | --- | --- |
| `audio_excerpt_started` | First play of an excerpt during a page visit | `release`, `location` | Does the visible hook earn a listen? |
| `audio_excerpt_completed` | Excerpt reaches its end | `release`, `location` | Does the excerpt hold attention? |
| `release_entered` | Visitor enters a dedicated release room | `release`, `location` | Which archive surfaces earn deeper attention? |
| `archive_item_opened` | Archive drawer opens | `release` | Which older releases invite exploration? |
| `streaming_destination_clicked` | Visitor leaves for a listening destination | `release`, `service`, `location`, optional `state` | Which paths convert attention into listening? |
| `film_opened` | Visitor opens an official release film | `release`, `location` | Which release rooms send attention to film? |
| `release_site_opened` | Visitor opens an external release microsite | `release`, `location` | Does a distinct release world earn a visit? |

Implementation rules:

- Events fire from explicit user actions or media completion, never viewport impressions.
- A first-play guard prevents duplicate excerpt-start events during the same page visit.
- Custom events require a Vercel Pro or Enterprise plan to appear in the Vercel events panel; anonymous page-view analytics still work when enabled for the project.
