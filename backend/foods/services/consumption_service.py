from ..constants import STATUS_CONSUMED
from ..exceptions import FoodNotFoundException, InsufficientStockException, InvalidQuantityException
from ..logger import app_logger
from ..repository import add_consumption, find_food, list_consumptions, list_foods, update_food_quantity


def consumption_history():
    foods_by_id = {food['id']: food for food in list_foods()}
    records = []
    for item in list_consumptions():
        food = foods_by_id.get(item['foodId'], {})
        records.append({**item, 'foodName': food.get('name', '未知食品')})
    return {
        'records': records,
        'frequency': [
            {'name': record['foodName'], 'times': len([item for item in records if item['foodName'] == record['foodName']])}
            for record in records
        ],
    }


def consume_food(food_id, quantity, member):
    food = find_food(food_id)
    if food is None:
        raise FoodNotFoundException()
    if quantity <= 0:
        raise InvalidQuantityException()
    if quantity > food['quantity']:
        raise InsufficientStockException(food['quantity'], food['unit'])
    remaining = food['quantity'] - quantity
    update_food_quantity(food_id, remaining)
    record = add_consumption(food_id, quantity, member)
    app_logger.info('消耗 %s x%s，操作人 %s，剩余 %s', food['name'], quantity, member, remaining)
    return {
        'updated': True,
        'foodId': food_id,
        'foodName': food['name'],
        'remaining': remaining,
        'status': STATUS_CONSUMED if remaining == 0 else 'active',
        'member': member,
        'quantity': quantity,
        'date': record['date'],
    }
