from rest_framework.decorators import api_view
from rest_framework.response import Response
from .constants import APP_CODE, APP_NAME
from .services import (
    consume_food,
    consumption_history,
    dashboard,
    family,
    foods,
    intake_template,
    recipes,
    reminders,
    report,
)


@api_view(['GET'])
def health(_request):
    return Response({'status': 'ok', 'service': APP_CODE, 'name': APP_NAME})


@api_view(['GET'])
def dashboard_view(_request):
    return Response(dashboard())


@api_view(['GET'])
def foods_view(_request):
    return Response(foods())


@api_view(['GET'])
def intake_view(_request):
    return Response(intake_template())


@api_view(['GET'])
def reminders_view(_request):
    return Response(reminders())


@api_view(['GET', 'POST'])
def consumption_view(request):
    if request.method == 'POST':
        return Response(consume_food(
            request.data.get('foodId', ''),
            int(request.data.get('quantity', 1)),
            request.data.get('member', '家庭成员'),
        ))
    return Response(consumption_history())


@api_view(['GET'])
def recipes_view(_request):
    return Response(recipes())


@api_view(['GET'])
def report_view(request):
    return Response(report(request.GET.get('month', '2026-05')))


@api_view(['GET'])
def family_view(_request):
    return Response(family())
