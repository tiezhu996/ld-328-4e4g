from ..constants import REMINDER_DAYS
from .inventory_service import foods


def reminders():
    alerts = [
        item for item in foods()
        if item['status'] in ['expiring', 'expired'] and item['quantity'] > 0
    ]
    return {
        'preference': {'daysBefore': REMINDER_DAYS, 'time': '09:00', 'emailMock': True},
        'messages': [
            {
                'id': f"msg-{item['id']}",
                'title': f"{item['name']} 即将到期" if item['status'] == 'expiring' else f"{item['name']} 已过期",
                'body': f"剩余 {item['daysLeft']} 天，存放在 {item['location']}，建议优先处理。",
                'channel': ['站内消息', '邮件模拟'],
            }
            for item in alerts
        ],
    }
