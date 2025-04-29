import os
import re
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

def load_existing_projects(data_js_path="data.js"):
    existing_projects = {}
    if os.path.exists(data_js_path):
        try:
            with open(data_js_path, "r", encoding="utf-8") as f:
                content = f.read()
                matches = re.findall(r'date:\s*\"(.*?)\"\s*,\s*project:\s*\"(.*?)\"', content)
                for date, project in matches:
                    existing_projects[date] = project
        except Exception as e:
            print(f"❗ data.js 읽기 실패: {e}")
    return existing_projects

def generate_data(images_base="images", output_file="data.js"):
    project_entries = []
    allowed_exts = [".jpg", ".jpeg", ".png", ".mp4", ".webm"]
    existing_projects = load_existing_projects(output_file)

    for folder in sorted(os.listdir(images_base), reverse=True):
        folder_path = os.path.join(images_base, folder)
        if not os.path.isdir(folder_path):
            continue

        photos = []
        files = sorted(os.listdir(folder_path))
        idx = 1
        for filename in files:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in allowed_exts:
                continue

            new_name = f"photo{idx}{ext}"
            old_path = os.path.join(folder_path, filename)
            new_path = os.path.join(folder_path, new_name)

            if filename != new_name:
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                else:
                    print(f"⚠️ {new_name} 이미 존재함. 건너뜀.")
                    continue

            if ext in [".jpg", ".jpeg", ".png"]:
                resize_image(new_path)

            photos.append(f"\"{images_base}/{folder}/{new_name}\"")
            idx += 1

        if photos:
            project_name = existing_projects.get(folder, "")  # 기존 project 유지 or 공란
            entry = (
                "  {\n"
                f"    date: \"{folder}\",\n"
                f"    project: \"{project_name}\",\n"
                f"    photos: [\n      {',\n      '.join(photos)}\n    ]\n"
                "  }"
            )
            project_entries.append(entry)

    js_content = "const projects = [\n" + ",\n".join(project_entries) + "\n];"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(js_content)

    print("✅ data.js 생성 완료 (기존 프로젝트명 유지, 신규는 공란)")

if __name__ == "__main__":
    generate_data()
