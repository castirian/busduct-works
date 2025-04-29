import os

def auto_rename_photos(folder_path):
    if not os.path.exists(folder_path):
        print(f"❌ 경로가 존재하지 않습니다: {folder_path}")
        return

    files = sorted([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])

    for idx, filename in enumerate(files, start=1):
        ext = os.path.splitext(filename)[1].lower()  # 확장자는 소문자로
        new_name = f"photo{idx}{ext}"
        src = os.path.join(folder_path, filename)
        dst = os.path.join(folder_path, new_name)
        os.rename(src, dst)
    
    print(f"✅ 총 {len(files)}개의 파일을 리네임 완료했습니다.")
folder_path = "C:\\Users\\pc\\Desktop\\mysite\\images\\2025-05-03\\"

photos = []
file_list = sorted(os.listdir(folder_path))
for idx, filename in enumerate(file_list, start=1):
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png']:  # 이미지 파일만
        photos.append(f"\"images/2025-05-03/photo{idx}.jpg\"")

# 자동 생성된 JavaScript 배열 출력
print(",\n".join(photos))

# 여기다가 실제 작업 폴더 경로 넣기
auto_rename_photos("C:\\Users\\pc\\Desktop\\mysite\\images\\2025-05-03\\")


