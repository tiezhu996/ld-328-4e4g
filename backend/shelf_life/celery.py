import os
from celery import Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE','shelf_life.settings')
app=Celery('shelf_life')
app.config_from_object('django.conf:settings',namespace='CELERY')
