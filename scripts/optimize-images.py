"""
Convert screenshot PNGs into the one format the site uses: lossless WebP,
1800px wide, in src/assets/work.

Lossless is deliberate. These are flat UI screenshots, where lossy WebP is both
worse looking and (measurably) larger: on a sample screen, lossless came out at
232K against 374K for quality 95. There is no quality/size tradeoff to make here.

The 1800px width is a decode-memory ceiling, not a file-size one. The source
exports are around 5760px wide, which a browser has to expand to roughly 79MB of
RGBA to paint. Enough of those on one page will lock up a tab, regardless of how
small the file on disk is.

Usage:
    python scripts/optimize-images.py <source-dir> [more dirs...]
    python scripts/optimize-images.py <source.png>
    python scripts/optimize-images.py <dir> --dry-run

Filenames are the contract: whatever a file is called becomes the key that
content files reference, so `test-comments.png` lands as `test-comments.webp`
and replaces whatever was there before.
"""

import sys
from pathlib import Path

from PIL import Image

TARGET_WIDTH = 1800
DEST = Path(__file__).resolve().parent.parent / "src" / "assets" / "work"


def convert(src: Path, dest_dir: Path, dry_run: bool) -> None:
    with Image.open(src) as im:
        im = im.convert("RGBA")
        width, height = im.size
        out = dest_dir / f"{src.stem}.webp"
        verb = "replace" if out.exists() else "add"

        if dry_run:
            print(f"  {verb:7} {src.name} -> {out.name}")
            return

        scaled = im.resize(
            (TARGET_WIDTH, round(height * TARGET_WIDTH / width)), Image.LANCZOS
        )
        scaled.save(out, "WEBP", lossless=True, quality=100, method=6)

    before = src.stat().st_size // 1024
    after = out.stat().st_size // 1024
    print(
        f"  {verb:7} {src.name} -> {out.name}  "
        f"{width}x{height} -> {scaled.size[0]}x{scaled.size[1]}  "
        f"{before}K -> {after}K"
    )


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry_run = "--dry-run" in sys.argv

    if not args:
        print(__doc__)
        return 1

    sources: list[Path] = []
    for arg in args:
        path = Path(arg)
        if path.is_dir():
            sources.extend(sorted(path.glob("*.png")))
        elif path.is_file():
            sources.append(path)
        else:
            print(f"Not found: {arg}")
            return 1

    if not sources:
        print("No .png files found.")
        return 1

    DEST.mkdir(parents=True, exist_ok=True)
    print(f"{'Would write' if dry_run else 'Writing'} {len(sources)} file(s) to {DEST}")
    for src in sources:
        convert(src, DEST, dry_run)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
