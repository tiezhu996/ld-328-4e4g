class BusinessException(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code
        self.message = message


class FoodNotFoundException(BusinessException):
    def __init__(self):
        super().__init__('FOOD_NOT_FOUND', '未找到食品记录')
