# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Open Your Website
Double-click `index.html` to open in your browser

### Step 2: Test Features
- Browse products
- Add items to cart
- Try the search function
- Test on mobile (resize browser)

### Step 3: Deploy
Upload these files to your web server:
- All `.html` files
- `/css` folder
- `/js` folder
- `/images` folder
- `.htaccess` file

## ✅ Pre-Launch Checklist

- [ ] Add your product images to `/images` folder
- [ ] Update contact info (if needed)
- [ ] Test all pages
- [ ] Test on mobile device
- [ ] Verify WhatsApp links work
- [ ] Check email links work

## 📁 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage - Start here! |
| `products.html` | Product catalog |
| `css/main.css` | Main styles |
| `js/app.min.js` | All JavaScript |

## 🎨 Quick Customization

### Change Colors
Edit `css/main.css` line 7-12:
```css
:root{
--primary:#ff6bb8;      /* Change this */
--secondary:#ffd700;    /* And this */
}
```

### Add Product
Edit `products.html`, copy this template:
```html
<div class="item">
<img src="images/your-image.jpg" alt="Product Name" loading="lazy">
<h3>Product Name</h3>
<p>Description here</p>
<p class="price">₦XX,XXX</p>
<button onclick="addToCart('Product Name',XXXXX)">Add to Cart</button>
</div>
```

### Update Contact Info
Search and replace in all files:
- `2347031696283` → Your phone
- `baloguntemytope@gmail.com` → Your email
- `Tophaircollections_` → Your Instagram

## 🌐 Deployment Options

### Option 1: Traditional Hosting (cPanel, etc.)
1. Login to your hosting control panel
2. Open File Manager
3. Upload all files maintaining folder structure
4. Done!

### Option 2: Free Hosting (Netlify)
1. Go to netlify.com
2. Drag and drop your project folder
3. Get free HTTPS and CDN
4. Done!

### Option 3: GitHub Pages (Free)
1. Create GitHub account
2. Create new repository
3. Upload files
4. Enable GitHub Pages in settings
5. Done!

## 📱 Test on Mobile

### Method 1: Resize Browser
- Press F12 in Chrome
- Click device icon
- Select mobile device

### Method 2: Real Device
- Upload to server
- Open on your phone
- Test all features

## 🔧 Troubleshooting

### Images not showing?
- Check images are in `/images` folder
- Verify image filenames match HTML

### CSS not loading?
- Check `/css` folder exists
- Verify file paths are correct

### JavaScript not working?
- Check `/js/app.min.js` exists
- Open browser console (F12) for errors

## 📊 Performance Check

After deployment, test speed:
1. Go to pagespeed.web.dev
2. Enter your URL
3. Target: 90+ score

## 🎯 What's Working?

✅ Shopping cart (saves in browser)  
✅ Product search (real-time)  
✅ Order tracking  
✅ WhatsApp ordering  
✅ Mobile responsive  
✅ Fast loading  

## 📞 Need Help?

1. Check `README.md` for full documentation
2. Review `OPTIMIZATION-GUIDE.md` for technical details
3. See `MIGRATION-GUIDE.md` for file changes

## 🎉 You're Ready!

Your professional, fast-loading website is ready to go live!

---

**Quick Tip:** Bookmark this file for easy reference!
