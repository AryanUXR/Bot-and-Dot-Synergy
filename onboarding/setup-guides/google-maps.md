# Google Maps (map provider): tested default

1. **Google Cloud project.** The user creates one in their own Google account, with a billing account attached. The Maps JavaScript API needs billing even for low usage. Check the current free allowance on Google's pricing page.
2. **Enable** the Maps JavaScript API.
3. **API key.** Create one under APIs & Services → Credentials, then **restrict it**:
   - Application restriction: HTTP referrers. Add every domain the map runs on: the published domain, the preview domain (for example `*.lovable.app`), and `localhost` for development.
   - API restriction: Maps JavaScript API only.
4. **Where it lives.** In the app builder's secret store as `GOOGLE_MAPS_API_KEY`. The map reads it through a small server function. Note that a browser map key is visible to anyone who opens the page; the referrer restriction is what protects it.
5. **Map ID.** Advanced Markers need a map ID. `DEMO_MAP_ID` works for prototypes. For a public launch, create their own map ID under Map Management.
6. **Verify.** The page shows the map, and doesn't show "This page didn't load Google Maps correctly". That message almost always means the referrer restriction is missing the domain the page is on, or billing is off.
7. **Note.** With a map ID, the in-code style that hides points of interest is ignored. Google's own labels for real shops and hospitals will show under the dots. Hide them with a cloud-based map style on their map ID.
