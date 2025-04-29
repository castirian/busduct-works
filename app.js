const portfolioDiv = document.getElementById('portfolio');

projects.sort((a, b) => new Date(b.date) - new Date(a.date));

projects.forEach(project => {
  const section = document.createElement('section');
  
  const title = document.createElement('h2');
  title.textContent = `${project.date} | ${project.project}`;
  section.appendChild(title);
  
  const photosDiv = document.createElement('div');
  photosDiv.className = 'photos';
  
  project.photos.forEach(photo => {
    const link = document.createElement('a');
    link.href = photo;
    link.setAttribute('data-lightbox', project.date);
    const img = document.createElement('img');
    img.src = photo;
    img.alt = `${project.project} 사진`;
    link.appendChild(img);
    photosDiv.appendChild(link);
  });
  
  section.appendChild(photosDiv);
  portfolioDiv.appendChild(section);
});

// Scroll animation
const revealSections = () => {
  document.querySelectorAll('section').forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      sec.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);
