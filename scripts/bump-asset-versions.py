#!/usr/bin/env python3
"""Append ?v=<content hash> to the local CSS/JS references in the site's HTML pages.

GitHub Pages serves these files with a multi-hour max-age, so without a changing query string
browsers keep running old copies. Run this after editing styles.css, portfolio.css or
portfolio.js, and commit the result:

    python3 scripts/bump-asset-versions.py
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ("styles.css", "portfolio.css", "portfolio.js")
REF = re.compile(r'((?:href|src)="\./)(%s)(?:\?v=[0-9a-f]+)?(")' % "|".join(re.escape(a) for a in ASSETS))


def digest(name):
    return hashlib.sha1((ROOT / name).read_bytes()).hexdigest()[:8]


def main():
    versions = {name: digest(name) for name in ASSETS}
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        updated = REF.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={versions[m.group(2)]}{m.group(3)}", text)
        if updated != text:
            page.write_text(updated, encoding="utf-8")
            changed += 1
            print(f"updated {page.name}")
    print(" ".join(f"{k}?v={v}" for k, v in versions.items()))
    return 0


if __name__ == "__main__":
    sys.exit(main())
