class BusinessException(Exception):
    status = 400

    def __init__(self, code, message):
        super().__init__(message)
        self.code = code
        self.message = message


class FoodNotFoundException(BusinessException):
    status = 404

    def __init__(self):
        super().__init__('FOOD_NOT_FOUND', '未找到食品记录')


class InvalidQuantityException(BusinessException):
    def __init__(self):
        super().__init__('INVALID_QUANTITY', '消耗数量必须大于 0')


class InsufficientStockException(BusinessException):
    def __init__(self, remaining, unit):
        super().__init__('INSUFFICIENT_STOCK', f'库存不足，本次消耗未生效，当前剩余 {remaining} {unit}')
        self.remaining = remaining
