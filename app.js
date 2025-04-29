// 데이터 로드 후 포트폴리오 생성
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = document.getElementById('portfolio');
  projects.forEach(project => {
    const section = document.createElement('section');
    const title = document.createElement('h2');
    title.textContent = `${project.date} — ${project.project}`;
    section.appendChild(title);

    const photosDiv = document.createElement('div');
    photosDiv.className = 'photos';

    project.photos.forEach(file => {
      const ext = file.split('.').pop().toLowerCase();
      const link = document.createElement('a');
      link.classList.add('ripple');

      if (['jpg','jpeg','png'].includes(ext)) {
        link.href = file;
        link.setAttribute('data-lightbox', project.date);
        const img = document.createElement('img');
        img.src = file;
        img.loading = 'lazy';
        link.appendChild(img);

      } else if (['mp4','webm'].includes(ext)) {
        link.href = '#';
        const video = document.createElement('video');
        video.src = file;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cursor = 'pointer';
        video.style.display = 'block';
        video.loading = 'lazy';
        video.addEventListener('click', e => {
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

  // 필터 바 로직
  document.querySelectorAll('.filter-bar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-bar button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const year = btn.dataset.filter;
      document.querySelectorAll('#portfolio section').forEach(sec => {
        const date = sec.querySelector('h2').textContent.slice(0,4);
        sec.style.display = (year==='all'||date===year) ? '' : 'none';
      });
    });
  });

  // 스크롤 애니메이션
  const sections = document.querySelectorAll('section');
  function checkVisible(){
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom >= 0) s.classList.add('visible');
    });
  }
  window.addEventListener('scroll', checkVisible);
  checkVisible();

  // 테마 토글
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    toggle.textContent = isDark ? '🌙' : '☀️';
  });

  // Top 버튼
  const topBtn = document.getElementById('topBtn');
  function checkBottom(){
    const dh = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const sp = window.pageYOffset + window.innerHeight;
    if (sp >= dh - 50) topBtn.classList.add('show');
    else topBtn.classList.remove('show');
  }
  window.addEventListener('scroll', checkBottom);
  window.addEventListener('resize', checkBottom);
  checkBottom();
  topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
});

// 비디오 모달
function openVideoModal(videoSrc){
  document.getElementById('videoModal')?.remove();
  const modal = document.createElement('div');
  modal.id='videoModal';
  Object.assign(modal.style, {
    position:'fixed',top:0,left:0,
    width:'100vw',height:'100vh',
    background:'rgba(0,0,0,0.8)',
    display:'flex',alignItems:'center',justifyContent:'center',
    zIndex:1000
  });
  const loader = document.createElement('div');
  loader.innerText='동영상 불러오는 중…';
  loader.style.color='white';
  loader.style.fontSize='20px';
  modal.appendChild(loader);
  document.body.appendChild(modal);

  const video = document.createElement('video');
  video.src=videoSrc; video.controls=true; video.autoplay=true;
  Object.assign(video.style,{
    maxWidth:'90%',maxHeight:'90%',
    borderRadius:'10px',boxShadow:'0 4px 20px rgba(0,0,0,0.5)',
    background:'#000'
  });
  video.onloadeddata = () => {
    loader.remove();
    modal.appendChild(video);
  };
  modal.addEventListener('click', ()=> modal.remove());
}
