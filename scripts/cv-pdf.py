# Renders /cv-print/ to public/cv/sebastian-koster-cv.pdf.
# Run with the site served locally:  npm run build && npx astro preview --port 4330 &  python3 scripts/cv-pdf.py
import asyncio, sys
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4330/cv-print/'

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto(URL, wait_until='networkidle')
        await pg.emulate_media(media='print')
        await pg.evaluate('document.fonts.ready')
        await pg.pdf(path='public/cv/sebastian-koster-cv.pdf', format='A4', print_background=True, prefer_css_page_size=True)
        await b.close()

asyncio.run(main())
