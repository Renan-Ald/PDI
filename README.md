Passo 1
docker-composer up -d --build
Passo 2 
docker-compose exec web bash
Passo 3
python manage.py migrate  
