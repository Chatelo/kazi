# Kazi

Kazi is a job application management system designed to streamline the process of searching, applying, and managing job applications.

## File Structure

```plaintext
.
├── README.md
├── SimplyHired_debug.png
├── app
│   ├── api
│   │   ├── applications
│   │   │   └── route.ts
│   │   ├── auth
│   │   │   └── [...nextauth]
│   │   │       └── route.ts
│   │   ├── jobs
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── register
│   │   │   └── route.ts
│   │   ├── saved-jobs
│   │   │   └── route.ts
│   │   └── web-jobs
│   │       └── route.ts
│   ├── dashboard
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   ├── register
│   │   └── page.tsx
│   └── search
│       └── page.tsx
├── components
│   ├── JobApplications.tsx
│   ├── JobCard.tsx
│   ├── JobList.tsx
│   ├── JobSearch.tsx
│   ├── LoginForm.tsx
│   ├── ModeToggle.tsx
│   ├── Navbar.tsx
│   ├── Providers.tsx
│   ├── RegisterForm.tsx
│   ├── SavedJobs.tsx
│   ├── WebJobList.tsx
│   ├── theme-provider.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── components.json
├── hooks
│   └── use-toast.ts
├── lib
│   ├── email.ts
│   ├── prisma.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── prisma
│   ├── migrations
│   │   ├── 20241014151439_first_dev
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── tailwind.config.ts
├── tsconfig.json
└── types
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js
- pnpm

### .env

- rename .env.example to .env
- And provide Redis(`https://cloud.redis.io/`) and upstash(`https://upstash.com/`) varibles.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/kazi.git
   ```
2. Navigate to the project directory:
   ```sh
   cd kazi
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```

### Running the Application

1. Start the development server:
   ```sh
   pnpm dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
