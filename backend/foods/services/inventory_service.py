from ..constants import APP_CODE, FOOD_CATEGORIES, LOCATIONS, REMINDER_DAYS
from ..repository import TODAY, expiry_date, list_foods


def enrich(food):
    expire_at = expiry_date(food)
    days_left = (expire_at - TODAY).days
    if food['quantity'] <= 0:
        status = 'consumed'
    elif days_left < 0:
        status = 'expired'
    elif days_left <= REMINDER_DAYS:
        status = 'expiring'
    else:
        status = 'fresh'
    return {
        **food,
        'expireDate': expire_at.isoformat(),
        'daysLeft': days_left,
        'status': status,
        'progress': max(0, min(100, round(days_left / food['shelfLifeDays'] * 100))),
    }


def foods():
    return [enrich(food) for food in list_foods()]


def dashboard():
    items = foods()
    return {
        'service': APP_CODE,
        'total': len(items),
        'fresh': len([item for item in items if item['status'] == 'fresh']),
        'expiring': len([item for item in items if item['status'] == 'expiring']),
        'expired': len([item for item in items if item['status'] == 'expired']),
        'consumed': len([item for item in items if item['status'] == 'consumed']),
        'items': items,
    }


def intake_template():
    return {
        'categories': FOOD_CATEGORIES,
        'locations': LOCATIONS,
        'csvHeaders': ['name', 'category', 'productionDate', 'shelfLifeDays', 'quantity', 'location', 'openedDate'],
    }
