from django.urls import path
from .views import (
    consumption_view,
    dashboard_view,
    family_view,
    foods_view,
    health,
    intake_view,
    recipes_view,
    reminders_view,
    report_view,
)

urlpatterns = [
    path('health', health),
    path('dashboard/overview', dashboard_view),
    path('foods', foods_view),
    path('foods/intake-template', intake_view),
    path('reminders', reminders_view),
    path('consumption', consumption_view),
    path('recipes', recipes_view),
    path('reports/monthly', report_view),
    path('family', family_view),
]
