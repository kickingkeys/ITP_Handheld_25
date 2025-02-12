document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.image-section');
  
  // Selection handling
  sections.forEach(section => {
      section.addEventListener('click', (e) => {
          // Don't trigger selection if clicking navigation arrows
          if (e.target.closest('.nav-arrow')) return;
          
          // Remove selection from all sections
          sections.forEach(s => s.classList.remove('selected'));
          // Add selection to clicked section
          section.classList.add('selected');
      });
  });
  
  sections.forEach(section => {
      let startX = 0;
      let currentTranslate = 0;
      let currentIndex = 0;
      const container = section.querySelector('.image-container');
      const images = container.querySelectorAll('img');
      const maxIndex = images.length - 1;
      
      // Touch events
      section.addEventListener('touchstart', touchStart);
      section.addEventListener('touchmove', touchMove);
      section.addEventListener('touchend', touchEnd);
      
      // Mouse events
      section.addEventListener('mousedown', touchStart);
      section.addEventListener('mousemove', touchMove);
      section.addEventListener('mouseup', touchEnd);
      section.addEventListener('mouseleave', touchEnd);
      
      // Navigation arrows
      const leftArrow = section.querySelector('.nav-arrow.left');
      const rightArrow = section.querySelector('.nav-arrow.right');
      
      leftArrow?.addEventListener('click', () => moveSlide('left'));
      rightArrow?.addEventListener('click', () => moveSlide('right'));
      
      function touchStart(e) {
          startX = getPositionX(e);
          section.classList.add('grabbing');
      }
      
      function touchMove(e) {
          if (startX === 0) return;
          
          const currentX = getPositionX(e);
          const diff = startX - currentX;
          const translate = currentTranslate - diff;
          
          container.style.transform = `translateX(${translate}px)`;
      }
      
      function touchEnd(e) {
          if (!startX) return;
          
          const diff = startX - getPositionX(e);
          if (Math.abs(diff) > 100) {
              if (diff > 0 && currentIndex < maxIndex) {
                  currentIndex++;
              } else if (diff < 0 && currentIndex > 0) {
                  currentIndex--;
              }
          }
          
          updateSlidePosition();
          startX = 0;
          section.classList.remove('grabbing');
      }
      
      function moveSlide(direction) {
          if (direction === 'left' && currentIndex > 0) {
              currentIndex--;
          } else if (direction === 'right' && currentIndex < maxIndex) {
              currentIndex++;
          }
          updateSlidePosition();
      }
      
      function updateSlidePosition() {
          // If we've gone past the last image, loop to the first
          if (currentIndex > maxIndex) {
              currentIndex = 0; // Reset to first image
              currentTranslate = 0; // Reset translation
              container.style.transition = 'none'; // Disable transition for instant jump
              container.style.transform = `translateX(0)`; // Jump to first image
              // Force a reflow
              container.offsetHeight;
              container.style.transition = 'transform 0.3s ease'; // Re-enable transition
          }
          // If we've gone before the first image, loop to the last
          else if (currentIndex < 0) {
              currentIndex = maxIndex; // Reset to last image
              currentTranslate = -section.offsetWidth * currentIndex; // Set translation to last image
              container.style.transition = 'none'; // Disable transition for instant jump
              container.style.transform = `translateX(${currentTranslate}px)`; // Jump to last image
              // Force a reflow
              container.offsetHeight;
              container.style.transition = 'transform 0.3s ease'; // Re-enable transition
          }
          else {
              currentTranslate = currentIndex * -section.offsetWidth; // Calculate translation
              container.style.transform = `translateX(${currentTranslate}px)`; // Apply translation
          }
      }
      
      function getPositionX(e) {
          return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      }
  });
  
  // Shuffle functionality
  const shuffleBtn = document.querySelector('.shuffle');
  shuffleBtn?.addEventListener('click', () => {
      sections.forEach(section => {
          const images = section.querySelector('.image-container').querySelectorAll('img');
          const randomIndex = Math.floor(Math.random() * images.length);
          const container = section.querySelector('.image-container');
          container.style.transform = `translateX(${-randomIndex * section.offsetWidth}px)`;
      });
  });
  
  // Save functionality
  const saveBtn = document.querySelector('.save-button');
  saveBtn?.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - document.querySelector('.bottom-nav').offsetHeight;
      
      // Draw each visible section
      sections.forEach((section, index) => {
          const img = section.querySelector('img');
          const sectionHeight = canvas.height / 3;
          ctx.drawImage(img, 0, index * sectionHeight, canvas.width, sectionHeight);
      });
      
      // Convert to image and download
      canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'landscape.png';
          a.click();
          URL.revokeObjectURL(url);
      }, 'image/png');
  });
});