from PIL import Image

img = Image.open('/Users/apple/.gemini/antigravity-ide/brain/9b9862f1-230e-4421-b774-543a385e42da/media__1783167358050.png')
width, height = img.size

# Sample near top (grey)
top_pixel = img.getpixel((width // 2, height // 4))
# Sample near bottom (black)
bottom_pixel = img.getpixel((width // 2, height * 3 // 4))

print(f"Top color (RGB): {top_pixel[:3]} -> Hex: #{top_pixel[0]:02x}{top_pixel[1]:02x}{top_pixel[2]:02x}")
print(f"Bottom color (RGB): {bottom_pixel[:3]} -> Hex: #{bottom_pixel[0]:02x}{bottom_pixel[1]:02x}{bottom_pixel[2]:02x}")
