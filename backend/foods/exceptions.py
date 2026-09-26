from rest_framework import status as http_status


class BusinessException(Exception):
    def __init__(self, code, message, http_status=http_status.HTTP_400_BAD_REQUEST):
        super().__init__(message)
        self.code = code
        self.message = message
        self.http_status = http_status


class ValidationException(BusinessException):
    def __init__(self, message):
        super().__init__('VALIDATION_ERROR', message, http_status.HTTP_400_BAD_REQUEST)


class FoodNotFoundException(BusinessException):
    def __init__(self):
        super().__init__('FOOD_NOT_FOUND', '未找到食品记录', http_status.HTTP_404_NOT_FOUND)


class InsufficientStockException(BusinessException):
    def __init__(self, food_name, requested, remaining, unit):
        message = (
            f'{food_name} 当前仅剩 {remaining}{unit}，无法消耗 {requested}{unit}，'
            '本次消耗未生效，库存与记录均未改动。'
        )
        super().__init__('INSUFFICIENT_STOCK', message, http_status.HTTP_409_CONFLICT)
        self.food_name = food_name
        self.requested = requested
        self.remaining = remaining
        self.unit = unit
