from collections import Counter
from .inventory_service import foods


def report(month='2026-05'):
    items = foods()
    category_counter = Counter(item['category'] for item in items)
    wasted = [item for item in items if item['status'] in ['expired', 'consumed']]
    return {
        'month': month,
        'categoryShare': [{'name': name, 'value': value} for name, value in category_counter.items()],
        'wasteAmount': sum(item['price'] for item in wasted),
        'mostPurchased': sorted(
            [{'name': item['name'], 'quantity': item['quantity'], 'category': item['category']} for item in items],
            key=lambda item: item['quantity'],
            reverse=True,
        )[:10],
        'mostWasted': sorted(
            [{'name': item['name'], 'amount': item['price'], 'status': item['status']} for item in wasted],
            key=lambda item: item['amount'],
            reverse=True,
        )[:10],
        'export': {'pdf': '/api/reports/monthly.pdf', 'available': 'mock'},
    }
