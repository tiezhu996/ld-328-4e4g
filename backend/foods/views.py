from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

from .constants import APP_CODE, APP_NAME
from .exceptions import BusinessException, InsufficientStockException
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


def api_exception_handler(exc, context):
    if isinstance(exc, BusinessException):
        data = {'code': exc.code, 'message': exc.message}
        if isinstance(exc, InsufficientStockException):
            data['remaining'] = exc.remaining
            data['requested'] = exc.requested
            data['unit'] = exc.unit
        return Response(data, status=exc.http_status)
    return drf_exception_handler(exc, context)


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
        result = consume_food(
            request.data.get('foodId', ''),
            request.data.get('quantity', 1),
            request.data.get('member', '家庭成员'),
            request.data.get('date'),
        )
        return Response(result, status=201)
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
