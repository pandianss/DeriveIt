import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
from datetime import datetime

def generate_certificate(student_name: str, course_name: str, issue_date: datetime):
    """
    Generates a certificate image offline-first logic as specified in Phase 3.
    """
    # Create a blank white image (acting as a basic certificate template)
    # In production, we would load an actual background template image.
    width, height = 800, 600
    img = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Simple border
    draw.rectangle([20, 20, width-20, height-20], outline=(0, 51, 102), width=10)
    draw.rectangle([25, 25, width-25, height-25], outline=(0, 102, 204), width=3)

    # Fonts
    try:
        # Tries to use a standard system font, fallback to default
        title_font = ImageFont.truetype("arial.ttf", 40)
        body_font = ImageFont.truetype("arial.ttf", 24)
        name_font = ImageFont.truetype("arial.ttf", 36)
    except IOError:
        # Fallback if arial is not found
        title_font = ImageFont.load_default(size=40)
        body_font = ImageFont.load_default(size=24)
        name_font = ImageFont.load_default(size=36)

    # Texts
    title = "CERTIFICATE OF ABSTRACTION MASTERY"
    subtitle = "This is proudly presented to"
    reason = f"For deterministic proficiency in {course_name}"
    date_str = f"Date: {issue_date.strftime('%B %d, %Y')}"

    # Draw Text (using anchors to center text)
    draw.text((width/2, 100), title, font=title_font, fill=(0, 51, 102), anchor="mm")
    draw.text((width/2, 200), subtitle, font=body_font, fill=(100, 100, 100), anchor="mm")
    draw.text((width/2, 280), student_name, font=name_font, fill=(0, 0, 0), anchor="mm")
    
    # Line under name
    draw.line((width/2 - 200, 310, width/2 + 200, 310), fill=(0,0,0), width=2)

    draw.text((width/2, 360), reason, font=body_font, fill=(50, 50, 50), anchor="mm")
    draw.text((200, 500), date_str, font=body_font, fill=(0,0,0), anchor="mm")
    draw.text((600, 500), "MathPath System", font=body_font, fill=(0,0,0), anchor="mm")
    
    # Save to BytesIO
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    # In production, this buffer would be uploaded to S3/Cloudflare R2 and the URL saved.
    return buffer.getvalue()
