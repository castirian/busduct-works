const portfolio = document.getElementById('portfolio');

projects.forEach(project => {
  const section = document.createElement('section');

  const title = document.createElement('h2');
  title.textContent = `${project.date} - ${project.project}`;
  section.appendChild(title);

  const photosDiv = document.createElement('div');
  photosDiv.className = 'photos';

  project.photos.forEach(file => {
    const ext = file.split('.').pop().toLowerCase();
    const link = document.createElement('a');

    if (['jpg', 'jpeg', 'png'].includes(ext)) {
      // ✅ 이미지인 경우: Lightbox 연결
      link.href = file;
      link.setAttribute('data-lightbox', project.date);

      const img = document.createElement('img');
      img.src = file;
      link.appendChild(img);

    } else if (['mp4', 'webm'].includes(ext)) {
      // ✅ 동영상인 경우: Lightbox 연결 ❌, 모달로 처리
      link.href = "#"; // 링크 막기 (충돌 방지)

      const video = document.createElement('video');
      video.src = file;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true; // 모바일 autoplay 활성화
      // controls ❌: 메인에서는 하단바 제거

      video.style.width = "100%";
      video.style.borderRadius = "8px";
      video.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      video.style.backgroundColor = "#000";

      video.addEventListener('click', function (e) {
        e.preventDefault();
        openVideoModal(file);
      });

      link.appendChild(video);
    }

    photosDiv.appendChild(link);
  });

  section.appendChild(photosDiv);
  portfolio.appendChild(section);
});

// ✅ 스크롤 시 섹션 애니메이션
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section');

  function checkVisibility() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility();
});

// ✅ 동영상 모달 팝업 기능
function openVideoModal(videoSrc) {
  // 기존 모달 제거
  const existingModal = document.getElementById('videoModal');
  if (existingModal) existingModal.remove();

  // 모달 박스 생성
  const modal = document.createElement('div');
  modal.id = 'videoModal';
  modal.style.position = 'fixed';
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = 1000;

  // 로딩 텍스트 (영상 로딩 대기)
  const loader = document.createElement('div');
  loader.innerText = '동영상 불러오는 중...';
  loader.style.color = 'white';
  loader.style.fontSize = '20px';
  modal.appendChild(loader);
  document.body.appendChild(modal);

  // 영상 엘리먼트 생성
  const video = document.createElement('video');
  video.src = videoSrc;
  video.controls = true;
  video.autoplay = true;
  video.style.maxWidth = '90%';
  video.style.maxHeight = '90%';
  video.style.borderRadius = '10px';
  video.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
  video.style.backgroundColor = '#000';

  // 로딩 완료되면 모달에 영상 표시
  video.onloadeddata = () => {
    modal.removeChild(loader);
    modal.appendChild(video);
  };

  // 바깥 클릭 시 닫기
  modal.addEventListener('click', () => {
    modal.remove();
  });
}
