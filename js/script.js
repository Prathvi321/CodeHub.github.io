// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Show loader
  const loader = document.querySelector('.loader-container');
  
  // Hide loader after page loads
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.style.opacity = '0';
      setTimeout(function() {
        loader.style.display = 'none';
      }, 500);
    }, 1000);
  });
  
  // Initialize theme
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check if user has a saved preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.classList.toggle('light-mode', currentTheme === 'light');
    updateThemeIcon(currentTheme === 'light');
  } else {
    // Otherwise use system preference
    document.body.classList.toggle('light-mode', !prefersDarkScheme.matches);
    updateThemeIcon(!prefersDarkScheme.matches);
  }
  
  // Theme toggle functionality
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isLightMode = document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
      updateThemeIcon(isLightMode);
    });
  }
  
  function updateThemeIcon(isLightMode) {
    if (themeToggle) {
      themeToggle.innerHTML = isLightMode 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
    }
  }
  
  // Copy code functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const codeContainer = this.closest('.code-container');
      const codeElement = codeContainer.querySelector('code');
      
      navigator.clipboard.writeText(codeElement.textContent)
        .then(() => {
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Copied!';
          this.classList.add('copy-success');
          
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('copy-success');
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          alert('Failed to copy code. Please try again.');
        });
    });
  });
  
  // Scroll animations
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  function checkScroll() {
    const windowHeight = window.innerHeight;
    const windowTopPosition = window.scrollY;
    const windowBottomPosition = windowTopPosition + windowHeight;
    
    revealElements.forEach(element => {
      const elementHeight = element.offsetHeight;
      const elementTopPosition = element.offsetTop;
      const elementBottomPosition = elementTopPosition + elementHeight;
      
      // Check if element is in viewport
      if (
        elementBottomPosition >= windowTopPosition && 
        elementTopPosition <= windowBottomPosition
      ) {
        element.classList.add('active');
      }
    });
  }
  
  // Initial check and event listener
  checkScroll();
  window.addEventListener('scroll', checkScroll);
  
  // Typing effect for code blocks
  const codeBlocks = document.querySelectorAll('.code-container pre code');
  
  codeBlocks.forEach(code => {
    const originalContent = code.innerHTML;
    const characters = originalContent.split('');
    code.innerHTML = '';
    
    // Add characters one by one with a delay
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < characters.length) {
        code.innerHTML += characters[i];
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 10);
  });
  
  // Syntax highlighting (minimal implementation)
  document.querySelectorAll('pre code').forEach(block => {
    highlightSyntax(block);
  });
  
  function highlightSyntax(codeBlock) {
    // Get content
    let code = codeBlock.textContent;
    
    // Simple pattern matching (this is a basic implementation)
    const patterns = [
      { regex: /(\/\/.*)/g, class: 'token comment' },
      { regex: /(".*?"|'.*?')/g, class: 'token string' },
      { regex: /\b(function|const|let|var|if|else|for|while|return|new|class)\b/g, class: 'token keyword' },
      { regex: /\b(true|false|null|undefined)\b/g, class: 'token boolean' },
      { regex: /\b(\d+)\b/g, class: 'token number' },
      { regex: /(\(|\)|\{|\}|\[|\]|;|,|\.|=|\+|-|\*|\/)/g, class: 'token punctuation' }
    ];
    
    // Apply highlighting
    patterns.forEach(pattern => {
      code = code.replace(pattern.regex, match => {
        return `<span class="${pattern.class}">${match}</span>`;
      });
    });
    
    // Update HTML with highlighted code
    codeBlock.innerHTML = code;
  }
});