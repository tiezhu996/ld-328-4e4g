from datetime import date

from ..constants import STATUS_CONSUMED
from ..exceptions import ValidationException
from ..repository import TODAY, apply_consumption, list_consumptions, list_foods
from .inventory_service import enrich


def _parse_quantity(raw_quantity):
    try:
        quantity = int(raw_quantity)
    except (TypeError, ValueError):
        raise ValidationException('消耗数量必须是正整数。')
    if quantity <= 0:
        raise ValidationException('消耗数量必须大于 0。')
    return quantity


def _parse_date(raw_date):
    if raw_date in (None, ''):
        return TODAY
    try:
        return date.fromisoformat(raw_date)
    except (TypeError, ValueError):
        raise ValidationException('消耗日期格式无效，请使用 YYYY-MM-DD。')


def consumption_history():
    foods_by_id = {food['id']: food for food in list_foods()}
    records = []
    for item in list_consumptions():
        food = foods_by_id.get(item['foodId'], {})
        records.append({**item, 'foodName': food.get('name', '未知食品')})
    return {
        'records': records,
        'frequency': [
            {'name': food_name, 'times': sum(1 for item in records if item['foodName'] == food_name)}
            for food_name in dict.fromkeys(item['foodName'] for item in records)
        ],
    }


def consume_food(food_id, quantity, member, consumed_on=None):
    quantity = _parse_quantity(quantity)
    consumed_date = _parse_date(consumed_on)
    member = (member or '').strip() or '家庭成员'
    food, record = apply_consumption(food_id, quantity, consumed_date, member)
    enriched = enrich(food)
    return {
        'updated': True,
        'foodId': food['id'],
        'foodName': food['name'],
        'quantity': record['quantity'],
        'date': record['date'],
        'member': record['member'],
        'remaining': enriched['quantity'],
        'unit': enriched['unit'],
        'status': enriched['status'],
        'fullyConsumed': enriched['status'] == STATUS_CONSUMED,
    }
