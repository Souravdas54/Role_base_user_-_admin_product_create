// Toggle sidebar on mobile
document
  .getElementById ('sidebarToggle')
  .addEventListener ('click', function () {
    document.querySelector ('.sidebar').classList.toggle ('active');
  });

// Simulate category filtering
document.querySelectorAll ('.sidebar-menu a').forEach (link => {
  link.addEventListener ('click', function (e) {
    e.preventDefault ();

    // Remove active class from all links
    document
      .querySelectorAll ('.sidebar-menu a')
      .forEach (l => l.classList.remove ('active'));

    // Add active class to clicked link
    this.classList.add ('active');

    // In a real application, you would filter products here
    console.log ('Filtering by: ' + this.textContent);
  });
});

// Simulate search functionality
document
  .querySelector ('.search-bar button')
  .addEventListener ('click', function () {
    const searchTerm = document.querySelector ('.search-bar input').value;
    if (searchTerm) {
      console.log ('Searching for: ' + searchTerm);
      // In a real application, you would filter products by search term
    }
  });

// Allow pressing Enter to search
document
  .querySelector ('.search-bar input')
  .addEventListener ('keypress', function (e) {
    if (e.key === 'Enter') {
      document.querySelector ('.search-bar button').click ();
    }
  });

// Product details button
document.querySelectorAll ('.btn-details').forEach (button => {
  button.addEventListener ('click', function () {
    const productName = this.parentElement.querySelector ('.product-title')
      .textContent;
    alert ('Viewing details for: ' + productName);
    // In a real application, you would navigate to a product details page
  });
});
