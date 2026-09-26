from ..repository import list_consumptions, list_foods


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
    food = next((item for item in list_foods() if item['id'] == food_id), None)
    if not food:
        return {'updated': False}
    remaining = max(0, food['quantity'] - quantity)
    return {
        'updated': True,
        'foodId': food_id,
        'foodName': food['name'],
        'remaining': remaining,
        'status': 'consumed' if remaining == 0 else 'active',
        'member': member,
    }
