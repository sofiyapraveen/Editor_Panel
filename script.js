document.addEventListener('DOMContentLoaded', () => {
  // Slider functionality
  const slides = document.querySelectorAll('.slide');
  const prevSlideBtn = document.getElementById('prev-slide');
  const nextSlideBtn = document.getElementById('next-slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

  // Text box
  const addTextBtn = document.getElementById('add-text-btn');
  const editorPanel = document.getElementById('editor-panel');
  const textInput = document.getElementById('text-input');
  const fontFamilySelect = document.getElementById('font-family-select');
  const fontStyleSelect = document.getElementById('font-style-select');
  const textAlignSelect = document.getElementById('text-align-select');
  const lineHeightInput = document.getElementById('line-height-input');
  const animationSelect = document.getElementById('animation-select');

  let activeTextBox = null;
  let textBoxIdCounter = 1;

  // create new text box
function createTextBox() {
    const slide = slides[currentSlide];
    const textBox = document.createElement('div');
    textBox.classList.add('text-box');
    textBox.setAttribute('contenteditable', 'true');
    textBox.setAttribute('data-id', textBoxIdCounter++);
    textBox.style.top = '50%';
    textBox.style.left = '50%';
    textBox.style.transform = 'translate(-50%, -50%)';
    textBox.style.fontFamily = fontFamilySelect.value;
    textBox.style.fontSize = '16px';
    textBox.style.color = '#000';
    textBox.style.fontWeight = 'normal';
    textBox.style.fontStyle = 'normal';
    textBox.style.textAlign = 'left';
    textBox.style.lineHeight = '1.2';
    textBox.textContent = '';

    // Controls container
    const controls = document.createElement('div');
    controls.classList.add('text-controls');

    // Delete button
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.title = 'Delete Text';
    btnDelete.textContent = '🗑️';
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      if (textBox === activeTextBox) {
        clearActiveTextBox();
      }
      textBox.remove();
    });

    // Copy button
    const btnCopy = document.createElement('button');
    btnCopy.classList.add('btn-copy');
    btnCopy.title = 'Copy Text';
    btnCopy.textContent = '📋';
    btnCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      const clone = textBox.cloneNode(true);
      clone.setAttribute('data-id', textBoxIdCounter++);
      clone.style.top = 'calc(' + textBox.style.top + ' + 20px)';
      clone.style.left = 'calc(' + textBox.style.left + ' + 20px)';
      clone.classList.remove('active');
      clone.querySelector('.text-controls').remove();
      addTextBoxListeners(clone);
      slide.appendChild(clone);
    });

    controls.appendChild(btnDelete);
    controls.appendChild(btnCopy);
    textBox.appendChild(controls);

    slide.appendChild(textBox);
    addTextBoxListeners(textBox);
    setActiveTextBox(textBox);
  }

  // Add event listeners to text box
  function addTextBoxListeners(textBox) {
    // Select text box on click
    textBox.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveTextBox(textBox);
    });

    // Dragging
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    textBox.addEventListener('mousedown', (e) => {
      if (e.target.closest('.text-controls')) return; // Ignore drag on controls
      isDragging = true;
      const rect = textBox.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || activeTextBox !== textBox) return;
      const slideRect = textBox.parentElement.getBoundingClientRect();
      let left = e.clientX - slideRect.left - dragOffsetX;
      let top = e.clientY - slideRect.top - dragOffsetY;

      // Constrain within slide
      left = Math.max(0, Math.min(left, slideRect.width - textBox.offsetWidth));
      top = Math.max(0, Math.min(top, slideRect.height - textBox.offsetHeight));

      textBox.style.left = left + 'px';
      textBox.style.top = top + 'px';
      textBox.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Update text content from editor panel
    textInput.addEventListener('input', () => {
      if (activeTextBox) {
        activeTextBox.textContent = textInput.value;
        if (!activeTextBox.querySelector('.text-controls')) {
          const controls = document.createElement('div');
          controls.classList.add('text-controls');
          const btnDelete = document.createElement('button');
          btnDelete.classList.add('btn-delete');
          btnDelete.title = 'Delete Text';
          btnDelete.textContent = '🗑️';
          btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTextBox) {
              activeTextBox.remove();
              clearActiveTextBox();
            }
          });
          const btnCopy = document.createElement('button');
          btnCopy.classList.add('btn-copy');
          btnCopy.title = 'Copy Text';
          btnCopy.textContent = '📋';
          btnCopy.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTextBox) {
              const clone = activeTextBox.cloneNode(true);
              clone.setAttribute('data-id', textBoxIdCounter++);
              clone.style.top = 'calc(' + activeTextBox.style.top + ' + 20px)';
              clone.style.left = 'calc(' + activeTextBox.style.left + ' + 20px)';
              clone.classList.remove('active');
              clone.querySelector('.text-controls').remove();
              addTextBoxListeners(clone);
              activeTextBox.parentElement.appendChild(clone);
            }
          });
          controls.appendChild(btnDelete);
          controls.appendChild(btnCopy);
          activeTextBox.appendChild(controls);
        }
      }
    });

    // Prevent losing focus on contenteditable when typing
    textBox.addEventListener('input', () => {
      if (activeTextBox === textBox) {
        textInput.value = textBox.textContent;
      }
    });
  }

  // Set active text box and update editor panel
  function setActiveTextBox(textBox) {
    if (activeTextBox) {
      activeTextBox.classList.remove('active');
    }
    activeTextBox = textBox;
    if (activeTextBox) {
      activeTextBox.classList.add('active');
      textInput.value = activeTextBox.textContent;
      fontFamilySelect.value = activeTextBox.style.fontFamily || 'Arial';
      fontStyleSelect.value = getFontStyle(activeTextBox);
      textAlignSelect.value = activeTextBox.style.textAlign || 'left';
      lineHeightInput.value = parseFloat(activeTextBox.style.lineHeight) || 1.2;
      animationSelect.value = activeTextBox.dataset.animation || 'none';
    } else {
      textInput.value = '';
    }
  }

  // Clear active text box
  function clearActiveTextBox() {
    if (activeTextBox) {
      activeTextBox.classList.remove('active');
      activeTextBox = null;
      textInput.value = '';
    }
  }

  // Get font style string from element styles
  function getFontStyle(el) {
    const weight = el.style.fontWeight || 'normal';
    const style = el.style.fontStyle || 'normal';
    if (weight === 'bold' && style === 'italic') return 'bold italic';
    if (weight === 'bold') return 'bold';
    if (style === 'italic') return 'italic';
    return 'normal';
  }

  // Update font family
  fontFamilySelect.addEventListener('change', () => {
    if (activeTextBox) {
      activeTextBox.style.fontFamily = fontFamilySelect.value;
    }
  });

  // Update font style
  fontStyleSelect.addEventListener('change', () => {
    if (activeTextBox) {
      const val = fontStyleSelect.value;
      if (val.includes('bold')) {
        activeTextBox.style.fontWeight = 'bold';
      } else {
        activeTextBox.style.fontWeight = 'normal';
      }
      if (val.includes('italic')) {
        activeTextBox.style.fontStyle = 'italic';
      } else {
        activeTextBox.style.fontStyle = 'normal';
      }
    }
  });

  // Update text alignment
  textAlignSelect.addEventListener('change', () => {
    if (activeTextBox) {
      activeTextBox.style.textAlign = textAlignSelect.value;
    }
  });

  // Update line height
  lineHeightInput.addEventListener('input', () => {
    if (activeTextBox) {
      activeTextBox.style.lineHeight = lineHeightInput.value;
    }
  });

  // Update animation (for demo, just add a CSS class)
  animationSelect.addEventListener('change', () => {
    if (activeTextBox) {
      const prevAnimation = activeTextBox.dataset.animation;
      if (prevAnimation && prevAnimation !== 'none') {
        activeTextBox.classList.remove('anim-' + prevAnimation);
      }
      const newAnimation = animationSelect.value;
      if (newAnimation && newAnimation !== 'none') {
        activeTextBox.classList.add('anim-' + newAnimation);
      }
      activeTextBox.dataset.animation = newAnimation;
    }
  });

  // Add text button
  addTextBtn.addEventListener('click', () => {
    createTextBox();
  });

  // Deselect text box when clicking outside
  document.addEventListener('click', (e) => {
    if (activeTextBox && !activeTextBox.contains(e.target) && !editorPanel.contains(e.target)) {
      clearActiveTextBox();
    }
  });

  // Add poetry text box on first slide by default
  function addDefaultPoetry() {
    const firstSlide = slides[0];
    const poetryBox = document.createElement('div');
    poetryBox.classList.add('text-box');
    poetryBox.setAttribute('contenteditable', 'true');
    poetryBox.setAttribute('data-id', textBoxIdCounter++);
    poetryBox.style.top = '50px';
    poetryBox.style.left = '50px';
    poetryBox.style.fontFamily = 'Georgia, serif';
    poetryBox.style.fontSize = '18px';
    poetryBox.style.color = '#000';
    poetryBox.style.fontWeight = 'normal';
    poetryBox.style.fontStyle = 'italic';
    poetryBox.style.textAlign = 'left';
    poetryBox.style.lineHeight = '1.5';
    poetryBox.textContent = 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both';

    // Controls container
    const controls = document.createElement('div');
    controls.classList.add('text-controls');

    // Delete button
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.title = 'Delete Text';
    btnDelete.textContent = '🗑️';
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      if (poetryBox === activeTextBox) {
        clearActiveTextBox();
      }
      poetryBox.remove();
    });

    // Copy button
    const btnCopy = document.createElement('button');
    btnCopy.classList.add('btn-copy');
    btnCopy.title = 'Copy Text';
    btnCopy.textContent = '📋';
    btnCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      const clone = poetryBox.cloneNode(true);
      clone.setAttribute('data-id', textBoxIdCounter++);
      clone.style.top = 'calc(' + poetryBox.style.top + ' + 20px)';
      clone.style.left = 'calc(' + poetryBox.style.left + ' + 20px)';
      clone.classList.remove('active');
      clone.querySelector('.text-controls').remove();
      addTextBoxListeners(clone);
      firstSlide.appendChild(clone);
    });

    controls.appendChild(btnDelete);
    controls.appendChild(btnCopy);
    poetryBox.appendChild(controls);

    firstSlide.appendChild(poetryBox);
    addTextBoxListeners(poetryBox);
    setActiveTextBox(poetryBox);
  }

  // Initialize first slide
  showSlide(currentSlide);
  addDefaultPoetry();
});
