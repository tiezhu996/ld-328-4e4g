from ..repository import list_members


def family():
    return {
        'name': '青禾小家',
        'admin': '妈妈',
        'members': list_members(),
        'activity': [
            {'id': 'a-1', 'member': '妈妈', 'action': '添加 有机鸡蛋', 'createdAt': '2026-05-29 18:20'},
            {'id': 'a-2', 'member': '爸爸', 'action': '消耗 低温鲜牛奶 1 瓶', 'createdAt': '2026-05-30 08:10'},
            {'id': 'a-3', 'member': '孩子', 'action': '查看 临期提醒', 'createdAt': '2026-05-30 09:05'},
        ],
    }
