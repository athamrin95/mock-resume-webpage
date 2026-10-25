document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.form-page'));
  const pageIndicators = Array.from(document.querySelectorAll('.page-indicator'));
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  const form = document.getElementById('applicationForm');

  let currentPage = 0;

  // Helper to update active page UI
  function updatePageView() {
    pages.forEach((page, index) => {
      page.classList.toggle('active', index === currentPage);
    });

    pageIndicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentPage);
    });
  }

  // Validate required inputs on current page before going to next page
  function validateCurrentPage() {
    const currentInputs = pages[currentPage].querySelectorAll('input, select, textarea');
    let isValid = true;

    currentInputs.forEach(input => {
      // Only validate fields that are currently visible to the user (offsetParent is not null)
      if (input.offsetParent !== null) {
        if (!input.checkValidity()) {
          input.reportValidity(); // Displays standard browser validation popup
          isValid = false;
        }
      }
    });

    return isValid;
  }

  // Next button click listener
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentPage()) {
        if (currentPage < pages.length - 1) {
          currentPage++;
          updatePageView();
        }
      }
    });
  });

  // Back button click listener
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updatePageView();
      }
    });
  });


  // --- Country Autocomplete Logic (Built-in & Instant) ---
  const allCountries = [
    { name: "Afghanistan", code: "AF" }, { name: "Albania", code: "AL" }, { name: "Algeria", code: "DZ" },
    { name: "Argentina", code: "AR" }, { name: "Australia", code: "AU" }, { name: "Austria", code: "AT" },
    { name: "Bangladesh", code: "BD" }, { name: "Belgium", code: "BE" }, { name: "Brazil", code: "BR" },
    { name: "Canada", code: "CA" }, { name: "Chile", code: "CL" }, { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" }, { name: "Czech Republic", code: "CZ" }, { name: "Denmark", code: "DK" },
    { name: "Egypt", code: "EG" }, { name: "Finland", code: "FI" }, { name: "France", code: "FR" },
    { name: "Germany", code: "DE" }, { name: "Greece", code: "GR" }, { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" }, { name: "India", code: "IN" }, { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" }, { name: "Iraq", code: "IQ" }, { name: "Ireland", code: "IE" },
    { name: "Israel", code: "IL" }, { name: "Italy", code: "IT" }, { name: "Japan", code: "JP" },
    { name: "Kenya", code: "KE" }, { name: "Malaysia", code: "MY" }, { name: "Mexico", code: "MX" },
    { name: "Morocco", code: "MA" }, { name: "Netherlands", code: "NL" }, { name: "New Zealand", code: "NZ" },
    { name: "Nigeria", code: "NG" }, { name: "Norway", code: "NO" }, { name: "Pakistan", code: "PK" },
    { name: "Peru", code: "PE" }, { name: "Philippines", code: "PH" }, { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" }, { name: "Romania", code: "RO" }, { name: "Russia", code: "RU" },
    { name: "Saudi Arabia", code: "SA" }, { name: "Singapore", code: "SG" }, { name: "South Africa", code: "ZA" },
    { name: "South Korea", code: "KR" }, { name: "Spain", code: "ES" }, { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" }, { name: "Taiwan", code: "TW" }, { name: "Thailand", code: "TH" },
    { name: "Turkey", code: "TR" }, { name: "Ukraine", code: "UA" }, { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" }, { name: "United States", code: "US" }, { name: "Vietnam", code: "VN" }
  ].sort((a, b) => a.name.localeCompare(b.name));

  function setupCountryAutocomplete(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    if (!input || !suggestions) return; // Safety check if elements don't exist

    // Filter countries as user types
    input.addEventListener('input', function () {
      const query = input.value.toLowerCase().trim();
      suggestions.innerHTML = '';

      if (query.length === 0) {
        suggestions.style.display = 'none';
        return;
      }

      const matches = allCountries.filter(c => 
        c.name.toLowerCase().includes(query)
      ).slice(0, 5);

      if (matches.length > 0) {
        suggestions.style.display = 'block';

        matches.forEach(countryObj => {
          const div = document.createElement('div');
          div.classList.add('suggestion-item');
          div.textContent = countryObj.name;

          // When user selects a country
          div.addEventListener('click', () => {
            input.value = countryObj.name;
            suggestions.style.display = 'none';
          });

          suggestions.appendChild(div);
        });
      } else {
        suggestions.style.display = 'none';
      }
    });

    // Hide suggestions if clicking outside of this specific input/suggestions pair
    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
      }
    });
  }

  // --- Dynamic Year Dropdown Logic ---
  function setupDropdownYears(id) {
    const yearSelect = document.getElementById(id);
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10; // 10 years into the future
    const minYear = 1900;

    // Loop from maxYear down to 1900
    for (let year = maxYear; year >= minYear; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }
  
  // Final Form Submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateCurrentPage()) return;

    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('formStatus');
    const fileInputResume = document.getElementById('resume');
    const fileInputCV = document.getElementById('cv');

    // Basic file size check (5MB limit)
    if (fileInputResume.files.length > 0) {
      const fileSizeMB = fileInputResume.files[0].size / 1024 / 1024;
      if (fileSizeMB > 5) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = 'File size exceeds 5MB limit. Please upload a smaller file.';
        return;
      }
    }
    if (fileInputCV.files.length > 0) {
      const fileSizeMB = fileInputCV.files.length > 0 ? fileInputCV.files[0].size / 1024 / 1024 : 0;
      if (fileSizeMB > 5) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = 'Cover Letter size exceeds 5MB limit. Please upload a smaller file.';
        return;
      }
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusMsg.style.display = 'none';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 
          'Accept': 'application/json' // Tells FormSubmit to return JSON instead of redirecting
        }
      });

      const result = await response.json();

      if (response.ok) {
        statusMsg.className = 'status-message success';
        statusMsg.textContent = 'Application submitted successfully! Check your email.';
        
        form.reset();
        
        // Manually reset experience sections & buttons visibility
        ['1', '2'].forEach(num => {
          const expDiv = document.getElementById(`experience${num}`);
          const addBtn = document.getElementById(`addExperience${num}`);
          if (expDiv) expDiv.classList.remove('active');
          if (addBtn) {
            const addContainer = addBtn.closest('.pill-group');
            if (addContainer) addContainer.style.display = 'flex';
          }
        });

        currentPage = 0;
        updatePageView();
      } else {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = result.message || 'Something went wrong. Please try again.';
      }
    } catch (error) {
      statusMsg.className = 'status-message error';
      statusMsg.textContent = 'Network error. Please try again later.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

  // Add and Remove Experience Logic
  function setupAddRemoveExperience(experienceId, addExperienceId, removeExperienceId, employerNameId) {
    const experience = document.getElementById(experienceId);
    const addExperience = document.getElementById(addExperienceId);
    const removeExperience = document.getElementById(removeExperienceId);
    const employerName = document.getElementById(employerNameId);

    // Find the wrapper container (.pill-group) of the add button
    const addExperienceContainer = addExperience.closest('.pill-group');

    addExperience.addEventListener('click', () => {
      removeExperience.checked = false
      experience.classList.add('active');
      addExperienceContainer.style.display = 'none';

      // Make it required now that the user is filling out this experience block
      if (employerName) employerName.required = true;
    });

    removeExperience.addEventListener('click', () => {
      experience.classList.remove('active');
      addExperience.checked = false
      addExperienceContainer.style.display = 'flex';

      // Remove required so the browser ignores it when hidden
      if (employerName) employerName.required = false;

      // Reset all inputs, selects, and textareas inside this experience block
      const fields = experience.querySelectorAll('input, select, textarea');
      fields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = false;
        } else if (field.tagName === 'SELECT') {
          field.selectedIndex = 0; // Resets dropdown back to the placeholder (e.g., "Month" or "Year")
        } else {
          field.value = ''; // Clears text inputs and textareas
        }
      });
    });
  }

  
  setupCountryAutocomplete('countryInput', 'countrySuggestions');
  setupCountryAutocomplete('schoolCountryInput', 'schoolCountrySuggestions');
  setupCountryAutocomplete('employerCountry1', 'employerCountrySuggestions1');
  setupCountryAutocomplete('employerCountry2', 'employerCountrySuggestions2');
  setupDropdownYears('graduationYear');
  setupDropdownYears('startYear1');
  setupDropdownYears('endYear1');
  setupDropdownYears('startYear2');
  setupDropdownYears('endYear2');
  setupAddRemoveExperience('experience1', 'addExperience1', 'removeExperience1', 'employerName1');
  setupAddRemoveExperience('experience2', 'addExperience2', 'removeExperience2', 'employerName2');
});