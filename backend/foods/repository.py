from datetime import date, timedelta
from threading import Lock

from .exceptions import FoodNotFoundException, InsufficientStockException

TODAY = date(2026, 5, 30)

_STORE_LOCK = Lock()

FOODS = [
    {
        'id': 'food-1',
        'name': '有机鸡蛋',
        'category': '生鲜',
        'productionDate': '2026-05-22',
        'shelfLifeDays': 15,
        'quantity': 10,
        'unit': '个',
        'location': '冰箱',
        'openedDate': '',
        'owner': '妈妈',
        'price': 18,
    },
    {
        'id': 'food-2',
        'name': '低温鲜牛奶',
        'category': '乳制品',
        'productionDate': '2026-05-27',
        'shelfLifeDays': 7,
        'quantity': 2,
        'unit': '瓶',
        'location': '冰箱',
        'openedDate': '2026-05-29',
        'owner': '爸爸',
        'price': 24,
    },
    {
        'id': 'food-3',
        'name': '冷冻虾仁',
        'category': '冷冻',
        'productionDate': '2026-03-30',
        'shelfLifeDays': 120,
        'quantity': 1,
        'unit': '袋',
        'location': '冷冻室',
        'openedDate': '',
        'owner': '外婆',
        'price': 46,
    },
    {
        'id': 'food-4',
        'name': '全麦吐司',
        'category': '烘焙',
        'productionDate': '2026-05-25',
        'shelfLifeDays': 5,
        'quantity': 0,
        'unit': '包',
        'location': 'pantry',
        'openedDate': '2026-05-26',
        'owner': '孩子',
        'price': 16,
    },
]

CONSUMPTIONS = [
    {'id': 'c-1', 'foodId': 'food-1', 'quantity': 2, 'date': '2026-05-29', 'member': '妈妈'},
    {'id': 'c-2', 'foodId': 'food-2', 'quantity': 1, 'date': '2026-05-30', 'member': '爸爸'},
    {'id': 'c-3', 'foodId': 'food-4', 'quantity': 1, 'date': '2026-05-28', 'member': '孩子'},
]

MEMBERS = [
    {'id': 'm-1', 'name': '妈妈', 'role': '管理员', 'permission': '添加/消耗/编辑'},
    {'id': 'm-2', 'name': '爸爸', 'role': '成员', 'permission': '添加/消耗'},
    {'id': 'm-3', 'name': '孩子', 'role': '成员', 'permission': '查看/消耗'},
]


def list_foods():
    return [food.copy() for food in FOODS]


def list_consumptions():
    return [item.copy() for item in CONSUMPTIONS]


def list_members():
    return [member.copy() for member in MEMBERS]


def _next_consumption_id():
    return f"c-{len(CONSUMPTIONS) + 1}"


def apply_consumption(food_id, quantity, consumed_on, member):
    """原子地校验并扣减库存、写入消耗记录。

    返回写入后的 (食品副本, 记录副本)。库存不足时抛出
    InsufficientStockException，调用方不产生任何写入。
    """
    with _STORE_LOCK:
        food = next((item for item in FOODS if item['id'] == food_id), None)
        if food is None:
            raise FoodNotFoundException()
        if quantity > food['quantity']:
            raise InsufficientStockException(
                food['name'], quantity, food['quantity'], food['unit'],
            )
        food['quantity'] -= quantity
        record = {
            'id': _next_consumption_id(),
            'foodId': food_id,
            'quantity': quantity,
            'date': consumed_on.isoformat(),
            'member': member,
        }
        CONSUMPTIONS.append(record)
        return food.copy(), record.copy()


def expiry_date(food):
    produced = date.fromisoformat(food['productionDate'])
    return produced + timedelta(days=food['shelfLifeDays'])
