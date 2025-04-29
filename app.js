document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section');
  const topBtn = document.getElementById('topBtn');

  function checkVisibility() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        section.classList.add('visible');
      }
    });

    if (window.scrollY > 300) {
      topBtn.style.display = 'block';
    } else {
      topBtn.style.display = 'none';
    }
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility();

  topBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
