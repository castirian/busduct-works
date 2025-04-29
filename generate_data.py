import os
from PIL import Image, ExifTags

def resize_image(path, max_width=1600):
    with Image.open(path) as img:
        try:
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation':
                    break

            exif = img._getexif()

            if exif is not None:
                orientation_value = exif.get(orientation)
                if orientation_value == 3:
                    img = img.rotate(180, expand=True)
                elif orientation_value == 6:
                    img = img.rotate(270, expand=True)
                elif orientation_value == 8:
                    img = img.rotate(90, expand=True)
        except Exception as e:
            print(f"❗ EXIF 처리 오류: {e}")

        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.LANCZOS)
        
        img.save(path, optimize=True, quality=85)

def generate_data(images_base="images", output_file="data.js"):
    project_entries = []

    for folder in sorted(os.listdir(images_base), reverse=True):
        folder_path = os.path.join(images_base, folder)
        if not os.path.isdir(folder_path):
            continue

        photos = []
        files = sorted(os.listdir(folder_path))
        for idx, filename in enumerate(files, start=1):
            ext = os.path.splitext(filename)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png"]:
                continue

            old_path = os.path.join(folder_path, filename)

            # 먼저 리사이즈
            resize_image(old_path)

            # 리네임
            new_name = f"photo{idx}{ext}"
            new_path = os.path.join(folder_path, new_name)
            if filename != new_name:
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)

            photos.append(f'"{images_base}/{folder}/{new_name}"')

        if photos:
            entry = (
                "  {\n"
                f"    date: \"{folder}\",\n"
                f"    project: \"{folder}\",\n"
                f"    photos: [\n      {',\n      '.join(photos)}\n    ]\n"
                "  }"
            )
            project_entries.append(entry)

    js_content = "const projects = [\n" + ",\n".join(project_entries) + "\n];"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"✅ data.js 파일이 생성되었습니다! ({output_file})")

if __name__ == "__main__":
    generate_data()
