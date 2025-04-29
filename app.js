const portfolio = document.getElementById('portfolio');

projects.forEach(project => {
  const section = document.createElement('section');

  const title = document.createElement('h2');
  title.textContent = `${project.date} - ${project.project}`;
  section.appendChild(title);

  const photosDiv = document.createElement('div');
  photosDiv.className = 'photos';

  project.photos.forEach(photo => {
    const link = document.createElement('a');
    link.href = photo;
    link.setAttribute('data-lightbox', project.date);

    const img = document.createElement('img');
    img.src = photo;
    link.appendChild(img);

    photosDiv.appendChild(link);
  });

  section.appendChild(photosDiv);
  portfolio.appendChild(section);
});

document.addEventListener('DOMContentLoaded', function() {
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
  checkVisibility(); // 페이지 로딩 시에도 체크
});

