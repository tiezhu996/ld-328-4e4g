from .inventory_service import foods

RECIPE_RULES = [
    {'match': '鸡蛋', 'recipe': '番茄炒蛋', 'need': '鸡蛋 2 个 + 番茄 1 个'},
    {'match': '牛奶', 'recipe': '牛奶燕麦杯', 'need': '牛奶 1 瓶 + 燕麦 40g'},
    {'match': '吐司', 'recipe': '法式吐司', 'need': '吐司 2 片 + 鸡蛋 1 个'},
    {'match': '虾仁', 'recipe': '虾仁滑蛋', 'need': '虾仁 1 袋 + 鸡蛋 2 个'},
]


def recipes():
    priority = sorted(
        [item for item in foods() if item['quantity'] > 0],
        key=lambda item: item['daysLeft'],
    )
    recommendations = []
    for item in priority:
        rule = next((rule for rule in RECIPE_RULES if rule['match'] in item['name']), None)
        recommendations.append({
            'foodId': item['id'],
            'foodName': item['name'],
            'daysLeft': item['daysLeft'],
            'recipe': rule['recipe'] if rule else '清库存快手拼盘',
            'need': rule['need'] if rule else f"{item['name']} + 常备调味",
        })
    return {'priorityFoods': priority[:5], 'recommendations': recommendations[:5]}
