document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const indicators = document.querySelectorAll('.indicator img');

    let currentSection = 0;
    let scrolling = false; // Prevents rapid scroll jumps

    function smoothScrollTo(targetPosition, duration = 800) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function animationStep(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

            if (progress < 1) {
                requestAnimationFrame(animationStep);
            } else {
                scrolling = false; // Allow next scroll event
            }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        requestAnimationFrame(animationStep);
    }

    function updateView() {
        if (scrolling) return; // Prevent spam scrolling

        scrolling = true;
        const targetPosition = sections[currentSection].getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(targetPosition, 800);

        // Update indicator styles
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSection);
        });
    }

    // Scroll on wheel event
    window.addEventListener('wheel', (event) => {
        if (scrolling) return;

        if (event.deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (event.deltaY < 0 && currentSection > 0) {
            currentSection--;
        }
        updateView();
    });

    // Scroll on touch (for mobile)
    let touchStartY = 0;
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener('touchend', (event) => {
        if (scrolling) return;

        let touchEndY = event.changedTouches[0].clientY;
        let deltaY = touchStartY - touchEndY;

        if (deltaY > 50 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (deltaY < -50 && currentSection > 0) {
            currentSection--;
        }

        updateView();
    });

    // Handle clicking on indicator images
    indicators.forEach((indicator, index) => {
        if (index < sections.length) { // Ignore the 5th image
            indicator.addEventListener('click', () => {
                currentSection = index;
                updateView();
            });
        }
    });

    // Disable manual scrolling
    document.body.style.overflow = 'hidden';

    // Initialize view
    updateView();
});
document.querySelectorAll('.tooltip-img').forEach(img => {
    const tooltip = img.nextElementSibling;
    tooltip.textContent = img.getAttribute('data-text'); // Set tooltip text
});