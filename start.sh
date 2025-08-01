echo "En attente de PostgreSQL..."
while ! nc -z postgres 5432; do
  echo "PostgreSQL n'est pas encore prêt - attente..."
  sleep 2
done

echo "PostgreSQL est prêt !"

echo "Application des migrations..."
npx prisma migrate deploy

echo "Démarrage de l'application..."
npm run dev