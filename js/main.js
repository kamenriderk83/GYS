document.addEventListener('DOMContentLoaded', function() {
    // 获取所有部分和导航点
    const sections = document.querySelectorAll('section');
    const nav = document.createElement('div');
    nav.className = 'section-nav';
    let isScrolling = false;
    let currentSection = 0;
    
    // 创建导航点
    sections.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.addEventListener('click', () => {
            scrollToSection(index);
        });
        nav.appendChild(dot);
    });
    
    document.body.appendChild(nav);

    // 滚动到指定部分
    function scrollToSection(index) {
        if (!isScrolling && index >= 0 && index < sections.length) {
            isScrolling = true;
            currentSection = index;
            sections[index].scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
            updateNavDots();
        }
    }

    // 更新导航点状态
    function updateNavDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            if (index === currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 处理滚轮事件
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    }, { passive: false });

    // 处理触摸事件
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        touchEndY = e.touches[0].clientY;
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (isScrolling) return;
        
        const diff = touchStartY - touchEndY;
        if (Math.abs(diff) > 50) { // 最小滑动距离
            if (diff > 0 && currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    });

    // 幻灯片功能
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // 初始显示第一张幻灯片
    if (slides.length > 0) {
        showSlide(0);
        // 每5秒切换一次幻灯片
        setInterval(nextSlide, 5000);
    }

    // 导航菜单功能
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.drawer-overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            if (overlay) {
                overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            navMenu.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    // 处理导航链接点击
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.remove('active');
            if (overlay) {
                overlay.style.display = 'none';
            }
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const index = [...sections].indexOf(targetSection);
                scrollToSection(index);
            }
        });
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    });

    // 初始化导航点状态
    updateNavDots();
});
