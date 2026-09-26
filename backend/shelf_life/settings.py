import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY='dev-secret'
DEBUG=True
ALLOWED_HOSTS=['*']
INSTALLED_APPS=['django.contrib.auth','django.contrib.contenttypes','rest_framework','foods']
ROOT_URLCONF='shelf_life.urls'
MIDDLEWARE=[]
if os.getenv('DB_HOST'):
    DATABASES={'default':{'ENGINE':'django.db.backends.postgresql','HOST':os.getenv('DB_HOST','db'),'PORT':int(os.getenv('DB_PORT','5432')),'NAME':os.getenv('DB_NAME','app'),'USER':os.getenv('DB_USER','app'),'PASSWORD':os.getenv('DB_PASSWORD','app_pwd')}}
else:
    DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':BASE_DIR / 'db.sqlite3'}}
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
REST_FRAMEWORK={
'UNAUTHENTICATED_USER':None,
'EXCEPTION_HANDLER':'foods.views.api_exception_handler',
}
CELERY_BROKER_URL=f"redis://{os.getenv('REDIS_HOST','localhost')}:{os.getenv('REDIS_PORT','6379')}/0"
CELERY_RESULT_BACKEND=CELERY_BROKER_URL
