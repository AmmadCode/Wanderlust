// Filter functionality with backend integration
const filters = document.querySelectorAll('.filter');
const mobileFilterItems = document.querySelectorAll('.mobile-filter-item');
let activeFilter = null;

// Get current category from URL
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category');
const currentSearch = urlParams.get('search');

// Set active filter on page load
if (currentCategory) {
  activeFilter = currentCategory;
  const activeDesktopFilter = document.querySelector(`.filter[data-filter="${currentCategory}"]`);
  const activeMobileFilter = document.querySelector(`.mobile-filter-item[data-filter="${currentCategory}"]`);
  
  if (activeDesktopFilter) activeDesktopFilter.classList.add('active');
  if (activeMobileFilter) activeMobileFilter.classList.add('active');
}

// Desktop filter clicks
filters.forEach(filter => {
  filter.addEventListener('click', function() {
    const filterType = this.getAttribute('data-filter');
    handleFilterClick(filterType, this);
  });
});

// Mobile filter clicks
mobileFilterItems.forEach(item => {
  item.addEventListener('click', function() {
    const filterType = this.getAttribute('data-filter');
    handleFilterClick(filterType, this);
  });
});

function handleFilterClick(filterType, element) {
  const url = new URL(window.location.href);
  
  if (activeFilter === filterType) {
    // Remove filter if clicking the same one
    url.searchParams.delete('category');
    activeFilter = null;
  } else {
    // Set new filter
    url.searchParams.set('category', filterType);
    activeFilter = filterType;
  }
  
  // Preserve search parameter
  if (currentSearch) {
    url.searchParams.set('search', currentSearch);
  }
  
  // Navigate to filtered URL
  window.location.href = url.toString();
}

// Clear filters functions
function clearAllFilters() {
  const url = new URL(window.location.href);
  url.searchParams.delete('category');
  url.searchParams.delete('search');
  window.location.href = url.toString();
}

function removeSearchFilter() {
  const url = new URL(window.location.href);
  url.searchParams.delete('search');
  window.location.href = url.toString();
}

function removeCategoryFilter() {
  const url = new URL(window.location.href);
  url.searchParams.delete('category');
  window.location.href = url.toString();
}

// Preserve category when searching
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-container');
  const searchInput = document.querySelector('.search-input');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      if (activeFilter) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'category';
        input.value = activeFilter;
        this.appendChild(input);
      }
    });
  }
  
  // Set search input value from URL
  if (searchInput && currentSearch) {
    searchInput.value = currentSearch;
  }
});

// Fixed scroll functionality
function scrollFilters(direction) {
  const filtersContainer = document.getElementById('filters');  // ✅ Correct element
  const scrollAmount = 200;
  
  if (filtersContainer) {
    if (direction === 'left') {
      filtersContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      filtersContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}

// Mobile filter dropdown
function toggleMobileFilters() {
  const dropdown = document.getElementById('mobileFilterDropdown');
  dropdown.classList.toggle('show');
}

// Close mobile filters when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('mobileFilterDropdown');
  const filterBtn = document.querySelector('.mobile-filter-btn');
  
  if (dropdown && filterBtn && !dropdown.contains(event.target) && !filterBtn.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});