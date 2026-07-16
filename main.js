/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initStickyHeader();
  initMobileNav();
  initHeroTypewriter();
  initProjectsPanel();
  initGitHubStats();
  initContactForm();
  initScrollReveal();
  initAvatar3DTilt();
});

/* ==========================================================================
   1. CUSTOM INTERACTIVE CURSOR (DESKTOP ONLY)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  // Check if touch device - if so, don't initialize cursor
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
    return;
  }

  // Display cursor elements for non-touch devices
  cursor.style.display = 'block';
  cursorDot.style.display = 'block';

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow animation loop
  function animateCursor() {
    // Cursor outer border inertia (slower)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Inner dot inertia (faster)
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale cursor on interactive element hover
  const interactives = document.querySelectorAll('a, button, .project-card, .stack-badge, .contact-item, .close-panel-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorDot.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorDot.classList.remove('hovered');
    });
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL SPY & PROGRESS BAR
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    // Header Sticky transition
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const percentage = (scrollY / windowHeight) * 100;
      scrollProgress.style.width = `${percentage}%`;
    }

    // Scroll Spy: highlight active menu links
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // adjust offset for header
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION (DRAWER)
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    menuToggle.classList.add('open');
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeDrawer() {
    menuToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = 'auto'; // Unlock background scrolling
  }

  menuToggle.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   4. HERO SIGNATURE MOBILE WRITER ANIMATION
   ========================================================================== */
function initHeroTypewriter() {
  const codeArea = document.getElementById('code-typing-area');
  const phoneScreen = document.querySelector('.phone-screen');
  const hotReload = document.getElementById('hot-reload-flash');
  
  if (!codeArea || !phoneScreen || !hotReload) return;

  // Flutter dart code string with custom highlight labels
  const dartCode = 
`<span class="code-cm">// main.dart</span>
<span class="code-kw">import</span> <span class="code-st">'package:flutter/material.dart'</span>;

<span class="code-kw">void</span> <span class="code-fn">main</span>() {
  <span class="code-fn">runApp</span>(<span class="code-kw">const</span> <span class="code-cl">PortfolioApp</span>());
}

<span class="code-kw">class</span> <span class="code-cl">PortfolioApp</span> <span class="code-kw">extends</span> <span class="code-cl">StatelessWidget</span> {
  <span class="code-kw">const</span> <span class="code-cl">PortfolioApp</span>({<span class="code-kw">super</span>.key});

  <span class="code-nd">@override</span>
  <span class="code-cl">Widget</span> <span class="code-fn">build</span>(<span class="code-cl">BuildContext</span> context) {
    <span class="code-kw">return</span> <span class="code-cl">MaterialApp</span>(
      theme: <span class="code-cl">ThemeData</span>.<span class="code-fn">dark</span>(),
      home: <span class="code-kw">const</span> <span class="code-cl">ProfileScreen</span>(),
    );
  }
}`;

  // Helper typing function that skips HTML tags to speed rendering and avoid printing raw brackets
  function typeHtml(element, text, index, speed, callback) {
    if (index < text.length) {
      if (text[index] === '<') {
        let tagEnd = text.indexOf('>', index);
        if (tagEnd !== -1) {
          element.innerHTML += text.substring(index, tagEnd + 1);
          index = tagEnd + 1;
        } else {
          element.innerHTML += text[index];
          index++;
        }
      } else {
        element.innerHTML += text[index];
        index++;
      }
      
      // Randomize speed slightly to feel natural
      const actualSpeed = text[index - 1] === '\n' ? speed * 5 : speed;
      setTimeout(() => typeHtml(element, text, index, speed, callback), actualSpeed);
    } else {
      if (callback) callback();
    }
  }

  function startAnimationCycle() {
    // Reset phone screen to code view
    phoneScreen.classList.remove('ui-active');
    codeArea.innerHTML = "";
    
    // Begin typing
    setTimeout(() => {
      typeHtml(codeArea, dartCode, 0, 15, () => {
        // Typing done, show flash lightning bolt
        setTimeout(() => {
          hotReload.style.transform = 'scale(1.3)';
          hotReload.style.color = '#22D3EE';
          
          // Flash animation trigger, then morph screen to Rendered UI
          setTimeout(() => {
            hotReload.style.transform = 'scale(1)';
            hotReload.style.color = '#00C896';
            phoneScreen.classList.add('ui-active');
            
            // Wait 12 seconds on the completed app UI state before resetting
            setTimeout(startAnimationCycle, 12000);
          }, 600);
        }, 1200);
      });
    }, 1000);
  }

  startAnimationCycle();
}

/* ==========================================================================
   5. FEATURED PROJECTS ACCORDION EXPANDER
   ========================================================================== */
// Data structure for Abdelrahman Salah's project listings
const projectsData = {
  medimate: {
    title: 'MediMate (صيدلتي)',
    category: 'Medication Management System',
    overview: 'MediMate (صيدلتي) is a high-fidelity cross-platform mobile client engineered to coordinate medication logs, automate notification schedules, and manage family profiles. Built in Flutter and integrated with Firebase, it supports full offline functionality, synchronizes data on connection, and alerts users via local notifications.',
    problem: 'Medication non-adherence due to forgetfulness causes severe healthcare issues. Managing prescription schedules for elderly dependents and child care folders creates logistical headaches for families.',
    solution: 'A reactive dashboard utilizing Flutter to track medication inventories, dispatch alarms locally via mobile notification channels, synchronize logs to a Firebase Auth secure backend, and log real-time statuses.',
    features: [
      'Automatic medication alarms',
      'Shared family health profiles',
      'Inventory stock alerts',
      'Cloud database synchronization',
      'Smart medical assistant consults',
      'Fully offline operational capabilities'
    ],
    architecture: 'Clean Architecture with Cubit state management. Adheres strictly to separation of concerns (Data, Domain, Presentation layers) with the Repository pattern.',
    lessons: 'Configuring background alarms that persist across devices and restarts was complex. Mastered Flutter platform channels, native alarm scheduling APIs, and efficient Firestore offline cache policies.',
    tech: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Cubit', 'Local Notifications', 'Material 3', 'Clean Architecture'],
    mockup: 'assets/projects/medimate_preview.png',
    videoEmbed: `<iframe src="https://www.youtube.com/embed/y9QMl1prIdQ" allowfullscreen></iframe>`,
    videoVertical: true,
    links: {
      github: 'https://github.com/Abdosalah4',
      video: 'https://www.youtube.com/watch?v=y9QMl1prIdQ'
    }
  }
};

function initProjectsPanel() {
  const cards = document.querySelectorAll('.project-card');
  const panel = document.getElementById('project-detail-panel');
  const closeBtn = document.getElementById('close-panel-btn');
  
  if (!panel || !closeBtn) return;

  let activeProjectId = null;

  function populatePanel(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    // Set panel content
    document.getElementById('panel-project-cat').innerText = data.category;
    document.getElementById('panel-project-title').innerText = data.title;
    document.getElementById('panel-project-overview').innerText = data.overview;
    document.getElementById('panel-project-problem').innerText = data.problem;
    document.getElementById('panel-project-solution').innerText = data.solution;
    document.getElementById('panel-project-architecture').innerText = data.architecture;
    document.getElementById('panel-project-lessons').innerText = data.lessons;
    // Populate media dynamically (image, local video, or YouTube embed)
    const mediaContainer = document.getElementById('panel-mockup-media-container');
    if (mediaContainer) {
      mediaContainer.innerHTML = ""; // Clear existing image
      
      const isMobile = data.videoVertical !== false; // Mobile by default
      if (isMobile) {
        mediaContainer.className = "panel-mockup-container phone-mockup";
      } else {
        mediaContainer.className = "panel-mockup-container";
      }
      
      if (data.videoEmbed) {
        // Embed YouTube/Vimeo iframe
        const wrapper = document.createElement('div');
        wrapper.className = isMobile ? "video-embed-wrapper" : "video-embed-wrapper horizontal";
        wrapper.innerHTML = data.videoEmbed;
        mediaContainer.appendChild(wrapper);
      } else if (data.mockup && (data.mockup.endsWith('.mp4') || data.mockup.endsWith('.webm') || data.mockup.endsWith('.ogg'))) {
        // Direct local or CDN video file with preload="none" to prevent freezing network calls
        const video = document.createElement('video');
        video.src = data.mockup;
        video.controls = true;
        video.autoplay = false;
        video.preload = "none";
        video.muted = true;
        video.playsInline = true;
        video.className = "panel-mockup-video";
        mediaContainer.appendChild(video);
      } else if (data.mockup) {
        // Standard image
        const img = document.createElement('img');
        img.src = data.mockup;
        img.alt = `${data.title} Mockup`;
        img.className = "panel-mockup-img";
        mediaContainer.appendChild(img);
      }
    }

    // Populate features list
    const featuresList = document.getElementById('panel-project-features');
    featuresList.innerHTML = "";
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.innerText = feat;
      featuresList.appendChild(li);
    });

    // Populate tech badges
    const techContainer = document.getElementById('panel-project-tech');
    techContainer.innerHTML = "";
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.innerText = t;
      techContainer.appendChild(span);
    });

    // Populate action buttons (only if link resource exists)
    const actionsContainer = document.getElementById('panel-project-actions');
    actionsContainer.innerHTML = "";
    
    if (data.links) {
      if (data.links.github) {
        const btn = document.createElement('a');
        btn.href = data.links.github;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.className = "btn btn-outline btn-sm btn-icon";
        btn.innerHTML = `
          <span>GitHub Repo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        `;
        actionsContainer.appendChild(btn);
      }
      
      if (data.links.video) {
        const btn = document.createElement('a');
        btn.href = data.links.video;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.className = "btn btn-primary btn-sm btn-icon";
        btn.innerHTML = `
          <span>Watch Demo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        `;
        actionsContainer.appendChild(btn);
      }
      
      if (data.links.apk) {
        const btn = document.createElement('a');
        btn.href = data.links.apk;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.className = "btn btn-outline btn-sm btn-icon";
        btn.innerHTML = `
          <span>Download APK</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        `;
        actionsContainer.appendChild(btn);
      }
      
      if (data.links.live) {
        const btn = document.createElement('a');
        btn.href = data.links.live;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
        btn.className = "btn btn-outline btn-sm btn-icon";
        btn.innerHTML = `
          <span>Live Demo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        `;
        actionsContainer.appendChild(btn);
      }
    }
  }

  function openPanel(projectId) {
    // Populate panel first
    populatePanel(projectId);
    
    // Toggle class
    panel.classList.add('open');
    activeProjectId = projectId;

    // Scroll smoothly to panel after short transition delay
    setTimeout(() => {
      const panelTop = panel.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: panelTop,
        behavior: 'smooth'
      });
    }, 150);
  }

  function closePanel() {
    panel.classList.remove('open');
    activeProjectId = null;
  }

  // Bind clicks on project cards
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const projectId = card.getAttribute('data-project-id');
      if (!projectId) return;

      // Prevent closing if clicking on external buttons directly
      if (e.target.closest('a')) return;

      if (activeProjectId === projectId) {
        closePanel();
      } else {
        openPanel(projectId);
      }
    });
  });

  closeBtn.addEventListener('click', closePanel);
}

/* ==========================================================================
   6. GITHUB LIVE STATS INTEGRATION (WITH FAILSafe GRACEFUL DEGRADATION)
   ========================================================================== */
function initGitHubStats() {
  const username = 'Abdosalah4';
  const reposContainer = document.getElementById('github-repos-list');
  const repoCountEl = document.getElementById('github-repos');
  const followerCountEl = document.getElementById('github-followers');
  const followingCountEl = document.getElementById('github-following');
  const bioEl = document.getElementById('github-bio');

  // Hardcoded premium fallback cache if API rate limits or connection fails
  const fallbackProfile = {
    bio: 'Flutter Developer | Passionate about OOP, Clean Architecture, and building responsive mobile UI designs.',
    public_repos: 8,
    followers: 12,
    following: 15,
    topRepos: [
      {
        name: 'MediMate',
        description: 'Medicine management application built in Flutter with Firebase synchronization, inventory management, and local notifications.',
        stargazers_count: 3,
        language: 'Dart'
      },
      {
        name: 'WeatherApp',
        description: 'Clean Weather Forecast mobile client utilizing REST APIs, Cubit state management, and Dio HTTP networking layers.',
        stargazers_count: 2,
        language: 'Dart'
      },
      {
        name: 'ecommerce-portfolio',
        description: 'Clean modular Flutter mobile store client with persistent cart configurations, dynamic product grids, and authentication streams.',
        stargazers_count: 1,
        language: 'Dart'
      }
    ]
  };

  function applyFallback() {
    // Populate stats elements with offline cache
    if (repoCountEl) repoCountEl.innerText = fallbackProfile.public_repos;
    if (followerCountEl) followerCountEl.innerText = fallbackProfile.followers;
    if (followingCountEl) followingCountEl.innerText = fallbackProfile.following;
    if (bioEl) bioEl.innerText = fallbackProfile.bio;

    // Render repository fallback lists
    if (reposContainer) {
      reposContainer.innerHTML = "";
      fallbackProfile.topRepos.forEach(repo => {
        const item = document.createElement('a');
        item.href = `https://github.com/Abdosalah4/${repo.name}`;
        item.target = "_blank";
        item.className = "github-repo-item";
        item.innerHTML = `
          <div class="repo-header">
            <span class="repo-name">${repo.name}</span>
            <span class="repo-stars">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${repo.stargazers_count}</span>
            </span>
          </div>
          <p class="repo-desc">${repo.description}</p>
          <div class="repo-lang">
            <span class="lang-color dart"></span>
            <span>${repo.language}</span>
          </div>
        `;
        reposContainer.appendChild(item);
      });
    }
  }

  // Load stats from official Github endpoints
  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error("API rate limits or request block");
      return res.json();
    })
    .then(data => {
      // Success: render dynamic profile statistics
      if (repoCountEl) repoCountEl.innerText = data.public_repos;
      if (followerCountEl) followerCountEl.innerText = data.followers;
      if (followingCountEl) followingCountEl.innerText = data.following;
      if (bioEl && data.bio) bioEl.innerText = data.bio;

      // Fetch top user repos
      return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    })
    .then(res => {
      if (!res.ok) throw new Error("Error loading repos");
      return res.json();
    })
    .then(repos => {
      if (!reposContainer) return;
      reposContainer.innerHTML = "";
      
      // Filter out forks if any, and slice top 3
      const filtered = repos.filter(r => !r.fork).slice(0, 3);
      
      if (filtered.length === 0) {
        applyFallback();
        return;
      }

      filtered.forEach(repo => {
        const item = document.createElement('a');
        item.href = repo.html_url;
        item.target = "_blank";
        item.className = "github-repo-item";
        
        const langLower = repo.language ? repo.language.toLowerCase() : 'dart';
        
        item.innerHTML = `
          <div class="repo-header">
            <span class="repo-name">${repo.name}</span>
            <span class="repo-stars">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${repo.stargazers_count}</span>
            </span>
          </div>
          <p class="repo-desc">${repo.description || 'No description provided.'}</p>
          <div class="repo-lang">
            <span class="lang-color ${langLower}"></span>
            <span>${repo.language || 'Dart'}</span>
          </div>
        `;
        reposContainer.appendChild(item);
      });
    })
    .catch(err => {
      // Graceful Degradation trigger
      console.warn("GitHub live widget failed to fetch. Rendering safe fallback statistics.", err);
      applyFallback();
    });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATIONS & FEEDBACK TOASTS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusContainer = document.getElementById('form-status');
  
  if (!form || !statusContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    // Status visual elements
    statusContainer.innerText = "";
    statusContainer.className = "form-status";
    
    // Basic verification checks
    if (!name || !email || !message) {
      statusContainer.innerText = "Please complete all inputs.";
      statusContainer.classList.add('error');
      return;
    }
    
    // Verify Email matches standard parameters
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusContainer.innerText = "Invalid email format.";
      statusContainer.classList.add('error');
      return;
    }
    
    // Animate submission state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('span').innerText = "Sending Message...";
    
    // Simulate API query lag (e.g. Formspree/Web3Forms connection delay)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalText;
      
      // Clear form
      form.reset();
      
      // Update on-screen feedback
      statusContainer.innerText = `Thanks, ${name}! Your email has been logged. I'll get back to you shortly.`;
      statusContainer.classList.add('success');
      
      // Dismiss success alert automatically
      setTimeout(() => {
        statusContainer.innerText = "";
        statusContainer.className = "form-status";
      }, 6000);
      
    }, 1500);
  });
}

/* ==========================================================================
   8. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal-el');
  
  // Exit if browser does not support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once triggered to prevent re-triggering animations
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12, // element should be 12% in viewport before reveal triggers
    rootMargin: '0px 0px -40px 0px' // adjust trigger offsets
  });

  elements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   9. 3D PARALLAX AVATAR TILT EFFECT
   ========================================================================== */
function initAvatar3DTilt() {
  const container = document.getElementById('avatar-3d-container');
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotation calculations (max 15 degrees)
    const rotateX = -(y - centerY) / (rect.height / 10);
    const rotateY = (x - centerX) / (rect.width / 10);
    
    container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    // Smooth reset transition
    container.style.transform = 'rotateX(0deg) rotateY(0deg)';
    container.style.transition = 'transform 0.5s ease-out';
  });

  container.addEventListener('mouseenter', () => {
    container.style.transition = 'none';
  });
}
