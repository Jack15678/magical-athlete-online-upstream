"""Build small transparent avatars from the retained Dots portraits (Pillow)."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'public/avatars/wurstii'
target = root / 'public/avatars/wurstii-small'
target.mkdir(exist_ok=True)
original_bytes = optimized_bytes = 0
for path in sorted(source.glob('*.png')):
    with Image.open(path) as image:
        image = image.convert('RGBA')
        image.thumbnail((256, 256), Image.Resampling.LANCZOS)
        output = target / (path.stem + '.webp')
        image.save(output, 'WEBP', quality=85, method=6, exact=True)
        with Image.open(output) as check:
            assert check.size == (256, 256) and check.mode == 'RGBA'
            assert check.getchannel('A').getextrema() == (0, 255)
        original_bytes += path.stat().st_size
        optimized_bytes += output.stat().st_size
print(f'30 portraits: {original_bytes} -> {optimized_bytes} bytes')
