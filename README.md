# 🗳️ Voting App

<div align="center">

![Voting App Banner](https://via.placeholder.com/1200x400/1E40AF/FFFFFF?text=🗳️+Modern+Voting+Platform)

**A modern, secure, and responsive web voting platform built with Next.js & Tailwind CSS**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-visualization-FF6384?style=flat-square&logo=chartdotjs)](https://www.chartjs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Demo](#) • [📚 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 🔐 **Secure Authentication**
- bcrypt password hashing
- Role-based access control
- Session management via cookies
- Single vote per user guarantee

</td>
<td>

### 📊 **Real-time Analytics** 
- Live voting results
- Interactive charts & graphs
- Event performance metrics
- Data visualization dashboard

</td>
</tr>
<tr>
<td>

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Beautiful blue theme palette
- Smooth animations & transitions
- SweetAlert2 notifications

</td>
<td>

### ⚡ **Event Management**
- Automated event lifecycle
- Start/end date handling
- Candidate management
- Data cleanup on deletion

</td>
</tr>
</table>

---

## 🎯 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/e-votting-website.git
cd e-voting-website

# Install dependencies
npm install

# Start development server
npm run dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🔄 User Roles

| Role | Access | Features |
|------|--------|----------|
| 👤 **User** | `/voting` | Vote on active events, view candidates |
| 🛠️ **Admin** | `/admin/*` | Full CRUD operations, analytics dashboard |
| 👋 **Guest** | `/`, `/daftar` | Registration and login only |

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Security |
|----------|---------|----------|----------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) | ![API Routes](https://img.shields.io/badge/-API_Routes-000000?style=flat-square&logo=next.js) | ![JSON](https://img.shields.io/badge/-JSON_File-000000?style=flat-square&logo=json) | ![bcrypt](https://img.shields.io/badge/-bcrypt-000000?style=flat-square&logo=npm) |
| ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat-square&logo=react) | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js) | ![File System](https://img.shields.io/badge/-File_Based-FFA500?style=flat-square) | ![Sessions](https://img.shields.io/badge/-Cookie_Sessions-FF6B6B?style=flat-square) |
| ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss) | | | |
| ![Chart.js](https://img.shields.io/badge/-Chart.js-FF6384?style=flat-square&logo=chart.js) | | | |

</div>

---

## 📁 Project Structure

```
voting-app/
├── 📁 src/
|   |──📄middleware.js           # Middleware
│   ├── 📁 app/
│   │   ├── 📁 api/              # API endpoints
│   │   │   ├── auth/
│   │   │   ├── events/
│   │   │   ├── users/
│   │   │   └── votes/
│   │   ├── 📁 admin/            # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── users/
│   │   │   └── voting/
│   │   ├── 📁 daftar/           # Registration
│   │   ├── 📁 voting/           # User voting interface
│   │   ├── 📄 page.js           # Login page
│   │   ├── 📄 layout.js         # Root layout
│   │   └── 📄 globals.css       # Global styles
│   ├── 📁 components/           # Reusable components
│   │   ├── Sidebar.js
│   │   ├── Modal.js
│   │   └── Chart.js
│   └── 📁 lib/                  # Utilities
│       ├── data.js              # Data management
│       └── data.json            # JSON database
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 postcss.config.mjs
└── 📄 README.md
```

---

## 🚀 Usage Guide

### For Users
1. **Register**: Visit `/daftar` to create an account
2. **Login**: Use your credentials on the home page
3. **Vote**: Navigate to `/voting` and participate in active events
4. **Confirm**: Review your choice in the confirmation modal

### For Administrators
1. **Access**: Login with admin credentials
2. **Events**: Create and manage voting events at `/admin/events`
3. **Candidates**: Add candidates via `/admin/voting`
4. **Analytics**: Monitor results at `/admin/dashboard`

### 🔑 Default Admin Account
```
Email: admin@example.com
Password: admin123
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #1E40AF        /* Blue 800 */
--primary-light: #3B82F6  /* Blue 500 */
--primary-lightest: #DBEAFE /* Blue 100 */

/* Status Colors */
--success: #10B981        /* Emerald 500 */
--warning: #F59E0B        /* Amber 500 */
--error: #EF4444          /* Red 500 */
```

### Typography
- **Font Family**: [Inter](https://fonts.google.com/specimen/Inter)
- **Weights**: 400, 500, 600, 700

---

## 🧪 Testing Scenarios

### ✅ Happy Path
- [x] User registration and login
- [x] Creating events with candidates
- [x] Voting process completion
- [x] Real-time result updates

### ⚠️ Edge Cases Handled
- [x] Voting after event expiration → Error notification
- [x] Event deletion → Automatic cleanup of candidates & votes
- [x] No candidates available → "Belum ada kandidat" message
- [x] Duplicate voting attempts → Blocked with notification

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Moch Ridho Kurniawan](https://github.com/lewyinn)**

[⬆ Back to Top](#-voting-app)

</div>