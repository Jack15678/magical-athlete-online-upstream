# 赛程、计分与开放状态

核验日期：2026-10-22。此页区分已可玩规则、项目适配和未取得的资料。公开文件介绍、下载量、作者试玩与本项目运行验收是不同证据。

## 当前可玩

- 地图：Mild Mile、Wild Wilds，沿用 `src/shared/tracks.ts` 已核验的 0–30 格数据、弯道标记和有向箭头。三维位置只用于显示，不参与计分或移动裁定。
- 经典赛：四场，Mild → Wild → Mild → Wild，默认选择。
- 自定义积分赛：4 / 6 / 8 场；按玩家编辑的有序列表循环，允许重复地图。空列表、超过比赛场数的列表和未开放地图都会被服务端拒绝，不自动删除或替换。
- 角色包独立开关：原版36、Second Wind36（沿用实验性实现）、Extra Mile31、Leaf18、Wurstii A30。后三者为粉丝内容。开关不随赛程预设变化。
- 特殊赛事始终关闭，社区锦标赛尚不可玩。

四场与默认角色包沿用原项目。两人每场每人两名选手，依玩家确认的固定顺序行动；粘液怪不影响同一玩家的另一选手属于既有项目房规。7–8人为项目变体。六／八场也属于项目规则，未取得平衡性认证。

## 预设与奖励

|方案|场数|逐场地图|状态|
|---|---:|---|---|
|经典赛|4|Mild Mile → Wild Wilds → Mild Mile → Wild Wilds|可玩|
|官方巡回|4|Mild Mile → Wild Wilds → Twisty Twirl → Whirly World|禁用：缺两张续作地图的完整规则与布局|
|扩展巡回|8|Mild Mile → Wild Wilds → Twisty Twirl → Whirly World → Squiggle → Boardwalks → Bridges → Wild Wilds|禁用：缺五张地图|

扩展巡回：七张地图各跑一次，最后回到 Wild Wilds，按八场总积分决定胜负。这是项目自定义安排，不是难度递增的验证结论，最后一场不加倍也不单独决定冠军。

名次奖励直接来自原项目 `RACE_POINTS`。每格为第一名／第二名；其他名次不增加名次分。

|场数|1|2|3|4|5|6|7|8|
|---|---|---|---|---|---|---|---|---|
|4|3 / 1|4 / 2|5 / 3|6 / 4|||||
|6|3 / 1|4 / 2|4 / 2|5 / 3|5 / 3|6 / 4|||
|8|3 / 1|3 / 1|4 / 2|4 / 2|5 / 3|5 / 3|6 / 4|6 / 4|

地图分、技能分沿用原能力；最终结算提供逐玩家、逐场的名次／地图／技能／赛事分明细。技能扣分按实际扣除量记录，原有零分下限不变；Gary等角色自身的合法奖励例外仍然生效。同分共享胜利。

## 选秀与实体牌资源

设人数P、场数R、每人每场选手数K（两人时K=2，其他K=1）。每人选R×K张，比赛开始后出赛牌进入已使用区，不再次选取；返场跑者等原技能例外仍按原规则。

四场双人保留原来两批各八张的顺逆顺逆选秀。六／八场每批翻2P张，顺序一张、逆序一张，下批首选玩家顺延一位；批数为R×K/2。AI与真人使用相同牌池和合法接口。

创建按房间人数上限验算，开始选秀按实际人数再次验算。除了选秀牌，保守预留以下同时占牌资源；这是可执行性限制，不是另一套概率分布：

- Egg仍从未选牌堆抽三张，选择能力后原三张回公共弃牌堆；不把它当永久补牌。
- Twin读取此前冠军历史，不能按普通补牌计算。
- Filmmaker每个可能的赛前持有者预留七张；计入原角色以及Egg、Twin、Understudy、Zombie等已开启的赛前复制来源，上限为本场普通选手数。
- Thespian可能被复制，每名普通选手预留一张持续展示牌，另留一次新抽牌；影片手牌中取出的展示牌已含在七张内，不重复扣除。
- 同时额外抽牌上界取Egg的三张，否则Mush或Thespian的一张。抽牌来源、洗回公共弃牌及已用牌排除逻辑均不改变。

长赛程暂不支持 **Leaf + Second Wind 同时开启**：Re-runner与赛前复制可让额外参赛者累积，私人影片手牌上界尚未核实。关闭其中一个包或使用四场即可；不会自动开包、减少技能抽牌、改变抽取范围或用已出赛角色补足。

## 来源与资料缺口

|内容|取得的证据|缺少的材料／开放条件|
|---|---|---|
|基础与巡回顺序|[官方规则镜像](https://johnnlds.github.io/Magical-Athlete-Racers/officialrules.pdf)，32页PDF。p18允许赛前约定地图顺序；p19四场总分与共享胜利；p20列出四图轮换；p23补充技能交互。已下载并阅读，p20另做页面图像检查。|此PDF不替代Second Wind新地图细则。基础特殊格仍以本仓库已核验图像为依据。|
|2026年8月更新|[原讨论](https://boardgamegeek.com/thread/3754599/a-couple-august-2026-rules-updates/page/1)|本次返回403；没有把摘要当新裁定。沿用已冻结的基线能力规则。|
|Twisty Twirl / Whirly World|基础规则p20确认名称和顺序；[Ludopedia附件介绍](https://ludopedia.com.br/jogo/magical-athlete-second-wind/anexos/350133)称有英文规则书。|附件下载跳登录；未取得完整Second Wind规则书、逐格布局及Blimp弯道标记。|
|Squiggle / Boardwalks / Bridges|[Leafsnack文件页](https://boardgamegeek.com/filepage/316780/3-custom-tracks-squiggle-boardwalks-bridges)、[作者讨论](https://boardgamegeek.com/thread/3625886/the-future-of-magical-athlete/page/6)存在可检索介绍。|入口403，未取得地图PDF、版本勘误、Boardwalks距离图与全选路裁定、Bridges上下层连接。即使Squiggle被描述为不新增通用规则，也不据此虚构格子。|
|Thrilling Thirds|[文件页](https://boardgamegeek.com/filepage/312588/thrilling-thirds-an-unofficial-expansion-for-magic)、[原讨论](https://boardgamegeek.com/thread/3591386/the-thrilling-third-house-rules-to-spice-up-the-th)。介绍指向作者tntsoma与英文Thrilling3rds.pdf。|未取得完整事件表、抽牌与回收规则、扩展牌映射。整个玩法禁用；没有删事件后宣称完整实现。|
|社区锦标赛|[指定讨论](https://boardgamegeek.com/thread/3589241/magical-athlete-tournament-see-all-player-powers-i)|入口403，未取得绑定具体作者／版本的完整阶段、晋级、同分和淘汰后操作方案。不能将八场积分赛称为锦标赛。|

已尝试原文件入口、作者公开页面、搜索索引与公开镜像；没有绕过登录或访问限制。没有新地图的伪造缩略图、3D场景、分岔规则或赛事结果。取得上述原始材料并完成规则、联机与网页实测后，才可逐项开放。

## 冻结、恢复与边界

新规则版本：`cmyk-base-aug2026-schedule-v1`。在开始选秀时一次性保存完整 `matchPlan`：场数、逐场地图、奖励、关闭的赛事、地图规则版本 `base-tracks-2026-10-21`。后续场次与恢复读取保存值，不重新展开预设。

旧fan-v3及更早存档使用各自冻结引擎；没有赛程字段的旧局继续原四场。未知规则／地图版本会明确拒绝运行。重开回到可配置大厅，房间版本继续增长；选择ID含场次，旧场次选择不能匹配新场次。已处理动作仍由现有持久去重回执保证只生效一次。

原有真正强制循环的诊断暂停继续保留，不为了让长赛程完赛而捏造名次。主动选择与新随机结果不因空间位置重复被删掉。现有回归包含强制环、合法长链、重连和私有牌区；这不意味着所有混合角色组合都保证终止或已完成平衡测试。
