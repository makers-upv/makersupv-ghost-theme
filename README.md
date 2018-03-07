1. Copy to your Ghost's `content/themes/` folder
2. Enable **Public API** in Labs section
3. Choose it in the General section
4. Profit

To edit something:

1. `yarn`
2. Make sure Ghost is in development mode
3. If you rename, create or remove a file, restart Ghost
4. The CSS and JS are automatically generated, edit the files in src/ and then run `npm run build-css` or `npm run build-js`

Some things are not embedded in the theme but configurable from the Ghost admin panel
- Cover image
- Logo
- Navigation links
- Google Analytics code
