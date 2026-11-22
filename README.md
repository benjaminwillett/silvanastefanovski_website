# silvanastefanovski_website

Website for the painter Silvana Stefanovski (Arthurs Seat, Mornington Peninsula), served at [silvanastefanovski.com](https://silvanastefanovski.com) via GitHub Pages.

Plain static site: no build step. Open `index.html` in a browser to preview.

## Adding artworks

1. Save the photo into `assets/works/` (JPEG, about 2000 px on the long edge).
2. Add an entry to the `works` list in `works.js`:

```js
{ title: "Title", year: "2025", medium: "Oil on linen", size: "90 × 120 cm",
  series: "Place", image: "assets/works/title.jpg", sold: false },
```

Entries without an `image` show as an "Image to come" tile. Remove the empty entries once real works are in.

## Contact details

Set `email` and `instagram` at the top of `works.js`. Empty values are hidden on the page.

## Publishing

GitHub Pages: Settings → Pages → deploy from the `main` branch, root folder. The `CNAME` file sets the custom domain; point the domain's DNS at GitHub Pages.
