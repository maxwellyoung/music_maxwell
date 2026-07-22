# Music site measurement

The site uses Vercel Web Analytics for anonymous page views and a deliberately small set of decision-useful interaction events. No names, emails, note text, search terms, or other user-entered content are sent as event properties.

| Event | Trigger | Properties | Decision supported |
| --- | --- | --- | --- |
| `audio_excerpt_started` | First play of an excerpt during a page visit | `release`, `location` | Does the visible hook earn a listen? |
| `audio_excerpt_completed` | Excerpt reaches its end | `release`, `location` | Does the excerpt hold attention? |
| `release_entered` | Visitor enters a dedicated release room | `release`, `location` | Which archive surfaces earn deeper attention? |
| `archive_item_opened` | Archive drawer opens | `release` | Which older releases invite exploration? |
| `streaming_destination_clicked` | Visitor leaves for a listening destination | `release`, `service`, `location`, optional `state` | Which paths convert attention into listening? |
| `campaign_film_opened` | Visitor deliberately opens a campaign film | `release`, `film_id` | Which campaign idea earns a view? |
| `campaign_film_completed` | Campaign film reaches its end | `release`, `film_id` | Which film holds through 18 seconds? |

Implementation rules:

- Events fire from explicit user actions or media completion, never viewport impressions.
- A first-play guard prevents duplicate excerpt-start events during the same page visit.
- Film completion is guarded once per open session.
- Custom events require a Vercel Pro or Enterprise plan to appear in the Vercel events panel; anonymous page-view analytics still work when enabled for the project.
