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
