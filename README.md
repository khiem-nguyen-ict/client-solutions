# Client Solutions - Vietnam SVG Map Landing Page

A modern, interactive landing page featuring an innovative **SVG map of Vietnam** with real-time interaction capabilities, designed for marketing campaigns and client solutions showcasing.

## 🎯 Features

- **Interactive SVG Map of Vietnam** - Hover and click interactions with smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern Marketing Page** - Clean, professional layout optimized for conversion
- **Fast Loading** - Lightweight HTML/CSS/JavaScript for excellent performance
- **Easy Customization** - Simple structure for adapting to different campaigns

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Graphics**: SVG with interactive animations
- **Performance**: Optimized for fast loading and rendering

## 📁 Project Structure

```
client-solutions/
├── index.html              # Main landing page
├── css/
│   └── style.css          # Styling and animations
├── js/
│   └── main.js            # Interactive functionality
├── images/
│   └── vietnam-map.svg    # Interactive Vietnam map
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor (optional, for customization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khiem-nguyen-ict/client-solutions.git
   cd client-solutions
   ```

2. **Open in browser**
   - Simply double-click `index.html` to open it locally
   - Or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. **View in browser**
   - Open `http://localhost:8000` (or your configured port)

## 📖 Usage

### Interactive Map Features

- **Hover Interaction**: Provinces highlight with smooth color transitions
- **Click Events**: Districts show detailed information on click
- **Info Panel**: Display campaign-specific information dynamically
- **Responsive Tooltips**: Information appears contextually on all devices

### Customizing for Your Campaign

1. **Update Text Content**
   - Edit campaign name, descriptions in `index.html`

2. **Modify Colors**
   - Update CSS variables in `style.css` for brand colors
   - Adjust SVG paths fill colors

3. **Add Your Data**
   - Link to your API or static data source
   - Update JavaScript event handlers in `main.js`

## 🎨 Customization Guide

### Change Map Colors

In `css/style.css`:
```css
.province {
  fill: #your-color;
  transition: fill 0.3s ease;
}

.province:hover {
  fill: #your-highlight-color;
}
```

### Update Campaign Info

In `index.html`, modify the data attributes:
```html
<g class="province" data-name="Hanoi" data-info="Your campaign message">
  <!-- SVG path -->
</g>
```

## 🚀 Deployment

### Deploy to GitHub Pages
```bash
# Push to main branch
git push origin main

# GitHub Pages will automatically deploy from /docs or main branch
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Build command: (leave empty - this is static HTML)
3. Publish directory: `/`
4. Deploy!

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

## 📊 Performance Optimization

- ✅ Optimized SVG for fast rendering
- ✅ Minified CSS and JavaScript
- ✅ No external dependencies (pure HTML/CSS/JS)
- ✅ Lazy loading support for images

## 🔄 Best Practices

- Use SVG maps for better scalability than raster images
- Implement touch events for mobile users
- Add accessibility attributes (alt text, ARIA labels)
- Cache static assets in production

## 🌐 Marketing Integration

This landing page can be integrated with:
- Email marketing campaigns (direct link in emails)
- Social media campaigns (share-friendly design)
- CMS platforms (easy to host and customize)
- Analytics platforms (GTM, Google Analytics)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add: new feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Author**: Khiem Nguyen
- **Email**: nguyenthanhkhiemvn@gmail.com
- **GitHub**: [@khiem-nguyen-ict](https://github.com/khiem-nguyen-ict)

## 🌟 Show Your Support

If you found this useful:
- ⭐ Star the repository
- 🍴 Fork and create your own campaigns
- 📢 Share with others

---

**Perfect for**: Marketing campaigns, client showcases, regional data visualization, interactive landing pages.
