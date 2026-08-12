# Tailwind UI Update

The frontend has been redesigned with Tailwind CSS and keeps the existing Node.js/MySQL API.

## Run

```bash
cd frontend
npm install
npm run dev
```

Make sure the backend is running and that `.env` contains:

```env
VITE_API_URL=http://localhost:3000/api/users
```

## UI updates

- Responsive admin sidebar
- Modern top navigation
- User statistics cards
- Search by name/email
- Paginated user table
- Add user modal
- Edit user modal
- Delete confirmation modal
- Loading, error, and success states
- Responsive mobile layout
- Tailwind CSS styling
- Lucide icons

The backend API endpoints are unchanged.
