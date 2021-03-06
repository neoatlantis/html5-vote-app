var _id=0; function id(){ return _id++ };

const choices = [
    { id: id(), pos: 1, text: "2017 年进群" },
    { id: id(), pos: 1, text: "经历过 G+ 时代" },
    { id: id(), pos: 1, text: "记得 20 个群友外号" },
    { id: id(), pos: 1, text: "去过 5 个群友的城市" },
    { id: id(), pos: 1, text: "半夜出门刷 Po" },
    { id: id(), pos: 1, text: "遭遇火车祥瑞" },
    { id: id(), pos: 1, text: "会讲玉兰语" },
    { id: id(), pos: 1, text: "被某安画进漫画" },
    { id: id(), pos: 1, text: "成为群管理员" },
    { id: id(), pos: 1, text: "喜欢的话题找到同好" },
    { id: id(), pos: 1, text: "和群友起八" },
    { id: id(), pos: 1, text: "10 人以上大型开饭" },
    { id: id(), pos: 1, text: "和群友喝酒" },
    { id: id(), pos: 1, text: "和初次见面的群友拼房" },
    { id: id(), pos: 1, text: "和群旗合影" },
    { id: id(), pos: 1, text: "互寄明信片" },
    { id: id(), pos: 1, text: "一起连麦吹水" },
    { id: id(), pos: 1, text: "联机打游戏" },
    { id: id(), pos: 1, text: "和群友交换纪念 Key" },
    { id: id(), pos: 1, text: "和群友交易物资" },
    { id: id(), pos: 1, text: "制作自己的 biocard" },
    { id: id(), pos: 1, text: "各种外语都学一点" },
    { id: id(), pos: 1, text: "吃德国名菜 McRib" },
    { id: id(), pos: 1, text: "在科隆户外烧烤" },
    { id: id(), pos: 1, text: "在阿姆吃排骨" },
    { id: id(), pos: 1, text: "在西班牙吃海鲜饭" },
    { id: id(), pos: 1, text: "吃遍各国中餐馆" },
    { id: id(), pos: 1, text: "约饭牌达到白金" },
    { id: id(), pos: 1, text: "参观鸮博物馆" },
    { id: id(), pos: 1, text: "给鸭梨家刷好评" },
    { id: id(), pos: 1, text: "文明观熊" },
    { id: id(), pos: 1, text: "一起蹲夏/冬令时" },
    { id: id(), pos: 1, text: "一起跨年" },
    { id: id(), pos: 1, text: "在很冷门的事上“群二”" },
    { id: id(), pos: 1, text: "在群友家蹭住" },
    { id: id(), pos: 1, text: "团购官方周边" },
    { id: id(), pos: 1, text: "到剧情相关地标打卡" },
    { id: id(), pos: 1, text: "和当地特工交朋友" },
    { id: id(), pos: 1, text: "出国活动当天往返" },
    { id: id(), pos: 1, text: "火车上写作业" },
    { id: id(), pos: 1, text: "旧版 Scanner 留了很久" },
    { id: id(), pos: 1, text: "在 Kaltenberg 搬砖" },
    { id: id(), pos: 1, text: "乘坐王师傅专车" },
    { id: id(), pos: 1, text: "挑战 GORUCK Stealth" },
    { id: id(), pos: 1, text: "参加 OCF 捡垃圾" },
    { id: id(), pos: 1, text: "集齐 GORUCK 三件套" },
    { id: id(), pos: 1, text: "组团刷 Mission Day" },
    { id: id(), pos: 1, text: "Mission Day 制霸" },
    { id: id(), pos: 1, text: "和群友组队打 Anomaly" },
    { id: id(), pos: 1, text: "赢得一场 Anomaly" },
    { id: id(), pos: 1, text: "参加官方 After Party" },
    { id: id(), pos: 1, text: "见到 NPC" },
    { id: id(), pos: 1, text: "一起追 NL-1331" },
    { id: id(), pos: 1, text: "找到 Deaddrop" },
    { id: id(), pos: 1, text: "参与一次大新闻" },
    { id: id(), pos: 1, text: "照片登上官方报道" },
    { id: id(), pos: 1, text: "在活动中受伤" },
    { id: id(), pos: 1, text: "出去玩遗失物品" },
    { id: id(), pos: 1, text: "向群友学习旅行攻略" },
    { id: id(), pos: 1, text: "欧洲地图了然于胸" },
    { id: id(), pos: 1, text: "见过完好的巴黎圣母院" },
    { id: id(), pos: 1, text: "放群友鸽子" },
    { id: id(), pos: 1, text: "极限赶车成功" },
    { id: id(), pos: 1, text: "穿越英吉利海峡" },
    { id: id(), pos: 1, text: "乘坐通宵大巴" },
    { id: id(), pos: 1, text: "在 Ingress 护照上盖章/和群友+10分" },
    { id: id(), pos: 1, text: "把大群旗带回家" },
    { id: id(), pos: 1, text: "参加线上 IFS" },
    { id: id(), pos: 1, text: "玩 PPT 卡拉 OK" },
    { id: id(), pos: 1, text: "IFS 拿过 0 AP" },
    { id: id(), pos: 1, text: "因错过活动而遗憾" },
    { id: id(), pos: 1, text: "满级重生" },
    { id: id(), pos: 1, text: "单独见群友错过约饭牌" },
    { id: id(), pos: 1, text: "收群友的二手货" },
    { id: id(), pos: 1, text: "在公众号发表文章" },
    { id: id(), pos: 1, text: "购买 CSAE 周边" },
    { id: id(), pos: 1, text: "做过谈笑风生嘉宾" },
    { id: id(), pos: 1, text: "和群友讨论学术" },
    { id: id(), pos: 1, text: "吃鳗鱼饭时拍照发群里" },
    { id: id(), pos: 1, text: "一起放风筝" },
    { id: id(), pos: 1, text: "一起看世界杯" },
    { id: id(), pos: 1, text: "吃过群友家的饭菜" },
    { id: id(), pos: 1, text: "一起买家庭会员" },
    { id: id(), pos: 1, text: "开好友房打麻将" },
    { id: id(), pos: 1, text: "一起玩 Gamee 小游戏" },
    { id: id(), pos: 1, text: "一起去看海" },
    { id: id(), pos: 1, text: "薅铁路与航司羊毛" },
    { id: id(), pos: 1, text: "聚会时不开Ingress" },
    { id: id(), pos: 1, text: "悄悄喜欢群友" },
    { id: id(), pos: 1, text: "给群友或自己过生日" },
    { id: id(), pos: 1, text: "在社交网站上关注群友" },
    { id: id(), pos: 1, text: "拥有 CSAE 群卡" },
    { id: id(), pos: 1, text: "向外国友人介绍 CSAE" },
    { id: id(), pos: 1, text: "保存群友的黑历史" },
    { id: id(), pos: 1, text: "一起玩 Wordle" },
    { id: id(), pos: 1, text: "收到群友送的礼物" },
    { id: id(), pos: 1, text: "拥有看图识字表情包" },
    { id: id(), pos: 1, text: "疫情期间线下见面" },
    { id: id(), pos: 1, text: "会认不同国家的欧元/一起去爬山" },
    { id: id(), pos: 1, text: "记得 CSAE 周年纪念日" },
];


const countries = {
    "冰岛🇮🇸": [327, 211],
    "葡萄牙🇵🇹": [538, 1633],
    "爱尔兰🇮🇪": [585, 862],
    "法罗群岛🇫🇴": [706, 380],
    "直布罗陀🇬🇮": [706, 1794],
    "马恩岛": [780, 856],
    "西班牙🇪🇸": [923, 1585],
    "英国🇬🇧": [942, 914],
    "塞浦路斯🇨🇾": [2735, 1842],
    "科索沃🇽🇰": [2090, 1480],
    "拉脱维亚🇱🇻": [2211, 592],
    "阿尔巴尼亚🇦🇱": [2011, 1614],
    "北马其顿🇲🇰": [2173, 1594],
    "梵蒂冈🇻🇦": [1718, 1572],
    "黑山🇲🇪": [1944, 1486],
    "摩尔多瓦🇲🇩": [2481, 1203],
    "马耳他🇲🇹": [1706, 1827],
    "罗马尼亚🇷🇴": [2313, 1287],
    "乌克兰🇺🇦": [2375, 1045],
    "波兰🇵🇱": [1895, 880],
    "摩纳哥🇲🇨": [1281, 1423],
    "俄罗斯🇷🇺": [2643, 581],
    "奥地利🇦🇹": [1643, 1159],
    "希腊🇬🇷": [2258, 1732],
    "芬兰🇫🇮": [2215, 379],
    "斯洛伐克🇸🇰": [1961, 1111],
    "瑞典🇸🇪": [1785, 569],
    "挪威🇳🇴": [1469, 478],
    "卢森堡🇱🇺": [1312, 1063],
    "荷兰🇳🇱": [1301, 846],
    "爱沙尼亚🇪🇪": [2371, 508],
    "圣马力诺🇸🇲": [1645, 1403],
    "立陶宛🇱🇹": [2283, 735],
    "列支敦士登🇱🇮": [1501, 1133],
    "安道尔🇦🇩": [1064, 1467],
    "匈牙利🇭🇺": [2088, 1204],
    "丹麦🇩🇰": [1518, 667],
    "瑞士🇨🇭": [1391, 1225],
    "白俄罗斯🇧🇾": [2450, 831],
    "克罗地亚🇭🇷": [1844, 1222],
    "土耳其🇹🇷": [2540, 1648],
    "斯洛文尼亚🇸🇮": [1711, 1285],
    "比利时🇧🇪": [1213, 956],
    "意大利🇮🇹": [1498, 1327],
    "塞尔维亚🇷🇸": [2029, 1354],
    "保加利亚🇧🇬": [2276, 1465],
    "波黑🇧🇦": [1864, 1367],
    "德国🇩🇪": [1537, 889],
    "捷克🇨🇿": [1747, 1043],
    "法国🇫🇷": [1154, 1147],
};




export { choices, countries };
