# ReadThePantheons Website

A modern, responsive website for "The Pantheons" book series - Book 1: In The Beginning.

## Features

- **Modern Design**: Dark and light theme with orange accents
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Scrolling**: Enhanced navigation with smooth scroll effects
- **Interactive Elements**: Hover effects, animations, and form handling
- **Semantic HTML**: Clean, accessible markup
- **Performance Optimized**: Lightweight and fast-loading

## Sections

1. **Header**: Sticky navigation with logo, menu, and social media icons
2. **Hero Section**: Eye-catching introduction with book description
3. **Excerpts Section**: Chapter previews with call-to-action buttons
4. **Founding Circle**: Tiered support options (Initiate and Pantheon tiers)
5. **The World Awaits**: Roadmap and world-building information
6. **Newsletter**: Email subscription form
7. **Footer**: Contact information and social links

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

### Development

The website is built with vanilla HTML, CSS, and JavaScript - no build process required!

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - Interactive features and animations

## Customization

### Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --color-dark: #1a1a1a;
    --color-light-beige: #f5f1eb;
    --color-orange: #ff6b35;
    /* ... */
}
```

### Content

Update the content directly in `index.html`. All text, images, and sections can be easily modified.

### Adding Images

Replace the placeholder divs with actual images:

```html
<!-- Instead of -->
<div class="excerpt-image-placeholder">...</div>

<!-- Use -->
<img src="path/to/image.jpg" alt="Chapter 1 cover" class="excerpt-image">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Integrate payment processing for Founding Circle tiers
- [ ] Add excerpt modal/popup functionality
- [ ] Connect newsletter form to email service
- [ ] Add image optimization and lazy loading
- [ ] Implement analytics tracking
- [ ] Add blog/news section

## License

© 2025 ReadThePantheons. All rights reserved.

## Contact

For questions or support, contact: author@readthepantheons.com

