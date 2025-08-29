# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Prisma (Database ORM)

This project is set up with Prisma for database management.

### Running Migrations

To apply the schema to your database:
```bash
npx prisma migrate dev --name init
```

### Seeding the Database

To populate the database with initial demo data:
```bash
npx prisma db seed
```
