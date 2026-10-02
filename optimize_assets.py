from pathlib import Path
from PIL import Image, ImageOps
import re

root = Path(__file__).parent
sources = [p for p in root.iterdir() if p.suffix in ('.html', '.css', '.js')]
contents = {p: p.read_text(encoding='utf-8') for p in sources}
before = after = count = 0
for photo in (root / 'images').glob('*.jpg'):
    relative = 'images/' + photo.name
    if photo.stat().st_size < 90000 or not any(relative in text for text in contents.values()):
        continue
    target = photo.with_suffix('.webp')
    with Image.open(photo) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=82, method=6)
    if target.stat().st_size >= photo.stat().st_size:
        continue
    before += photo.stat().st_size
    after += target.stat().st_size
    count += 1
    for path in contents:
        contents[path] = contents[path].replace(relative, 'images/' + target.name)
for path, text in contents.items():
    if path.suffix == '.html':
        text = re.sub(r'((?:theme|depth|intro|cinematic|menu|book|app)\.(?:css|js))(?:\?v=[^"\s>]*)?', r'\1?v=20261002-smooth', text)
    if text != path.read_text(encoding='utf-8'):
        path.write_text(text, encoding='utf-8')
if count:
    print(f'{count} referenced photos: {before:,} bytes -> {after:,} bytes ({(1-after/before)*100:.0f}% smaller)')
else:
    print('Referenced photos already optimized; asset versions refreshed.')
