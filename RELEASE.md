# Release and maintenance

ReachLab is a static educational app. It has no server-side user accounts, payment flow, analytics, or model API costs. Notes stay in browser storage, and exports are downloaded to the user's device. The hosting provider serves application files; normal hosting access logs are outside the app's control.

## Public links

- App: https://aamogh21.github.io/reachlab/
- Source: https://github.com/AAmogh21/reachlab

## Before publishing an update

1. Run `node --test` and `npm run lint`.
2. Start the server, then run `npm run test:browser` and `node scripts/review-regressions.mjs`.
3. Change the cache version in `sw.js` when cached application files change. Existing open tabs may keep the previous worker until closed and reopened.
4. Run `node scripts/build-static.mjs`. The `dist/` output deliberately contains only app and report assets.
5. Commit and push source to `main`. Publish the contents of `dist/` to the repository's `gh-pages` branch, preserving its history. GitHub Pages builds that branch automatically.
6. Confirm the Pages build succeeded and verify the public URL. Run browser checks against the release with `REACHLAB_URL` set to the public address.

The example Actions workflow in `research/pages-workflow.example.yml` is an optional future alternative. It is not an active workflow; enabling it requires appropriate GitHub workflow authorization and changing the Pages publishing source. Current deployment uses the gh-pages branch.

## Browser testing scope

Automated checks use Chromium. Responsive checks include a 390px viewport. Offline revisits and local training have been verified after an initial successful load. Safari, Firefox, assistive-technology use, and classroom learning outcomes have not been independently tested. The app can be shared as a public educational release within these stated limits.

## Reproducing the research

Run `node scripts/extended-benchmark.mjs`. Figure generation additionally needs Python and the packages in `research/requirements.txt`: `python -m pip install -r research/requirements.txt`, then `python scripts/plot-results.py`. The three-scene study is a synthetic engineering experiment, not hardware validation or evidence of learning gains.

## Feedback

Use GitHub Issues for reproducible bugs. Include the browser, scene, parameters, expected result, and observed result. Do not upload private student or medical information. Notebook content is not needed for ordinary bug reports.
