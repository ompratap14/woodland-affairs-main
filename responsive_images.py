"""Generate smaller image choices without replacing the original photographs."""
from pathlib import Path
import re
from PIL import Image, ImageOps

root = Path(__file__).parent
made = {}
def enhance(match):
    tag = match.group(0)
    source = re.search(r'\bsrc="(images/[^"?]+)"', tag)
    if not source or 'srcset=' in tag:
        return tag
    photo = root / source[1]
    if photo.suffix not in ('.jpg', '.webp', '.png'):
        return tag
    with Image.open(photo) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        width, height = image.size
        if 'width=' not in tag:
            tag = tag.replace('<img ', f'<img width="{width}" height="{height}" ', 1)
        variants = []
        for size in (480, 960):
            if size >= width:
                continue
            target = photo.with_name(photo.stem + f'-{size}.webp')
            if target not in made:
                smaller = image.resize((size, round(height*size/width)), Image.Resampling.LANCZOS)
                smaller.save(target, 'WEBP', quality=78, method=6)
                made[target] = target.stat().st_size
            if made[target] < photo.stat().st_size:
                variants.append(f'images/{target.name} {size}w')
        if variants:
            variants.append(f'{source[1]} {width}w')
            # Heroes need viewport width; gallery/cards need at most half on desktop.
            sizes = '100vw' if 'fetchpriority="high"' in tag else '(max-width: 760px) 100vw, 50vw'
            tag = tag.replace('<img ', '<img srcset="' + ', '.join(variants) + f'" sizes="{sizes}" ', 1)
    return tag

for page in root.glob('*.html'):
    original = page.read_text(encoding='utf-8')
    updated = re.sub(r'<img\b[^>]*>', enhance, original)
    page.write_text(updated, encoding='utf-8')
print(f'Generated {len(made)} responsive image files.')
