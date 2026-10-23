# Second Wind 接入、来源与核验状态（2026-10-23）

**2026-10-23 更新：** 已直接核对用户PDF第24–27页全部36张卡面及旁注，新规则修正见 [核验与网页差异](../public/rules/second-wind-verification.md)。以下保留早期接入记录；“待官方复核”的旧结论由本次逐卡核验替代，跨扩展组合仍不宣称全部官方覆盖。

当前角色数据为原作36张 + Second Wind36张，共72个稳定定义；不包含 Extra Mile。不能据此标记“完整支持72个角色”：卡文已核验，跨扩展组合不等于全部获得作者裁定。

## 已取得的资料

- [CMYK更新版基础规则书镜像](https://johnnlds.github.io/Magical-Athlete-Racers/officialrules.pdf)：直接下载成功，共32页。它是更新版基础规则书，不是 Second Wind 完整规则书。p14明确主要移动和可选/强制措辞；p15顺序为赛道、当前玩家、顺时针其他玩家；p20列出合盒四场顺序；p23区分移动、传送、停格、越过、最终骰面、并列目标、多选手固定顺序、能力失效、循环和剩余一人的规则。保存于 `docs/research-downloads/cmyk-updated-base-2026.pdf`。
- [IELLO发行商FAQ](https://iello.fr/athletes-de-compete-tatillon-repond-a-vos-questions/)：网页可访问。FAQ2.0，2026-08-28更新，声明纳入CMYK2026年8月修订。用于基础通则和原作交互，不当作续作逐卡FAQ。
- [玩家图鉴v13](https://johnnlds.github.io/Magical-Athlete-Racers/?v=13)：网页及脚本可访问，脚本 `expansionAthletes` 数组恰好36条，每条标签 Second Wind。分别读取其中技能转录、插画链接；未读取站主 Interactions 作为裁定。插画只有角色形象，不能用它证明文字确为官方卡面。
- 用户于2026-10-23提供 `magical_athlete_sec_livro_de_regras_da_expansao_s_350133.pdf`，32页：已逐页提取与查看地图/卡面；第26页明确企鹅在主移动后恢复。地图、13张Twist及未覆盖组合的准确边界见 [地图来源说明](second-wind-map-source.md)。此前Ludopedia/Discord下载失败不再表示本地没有原文。

来源优先级为：官方规则/卡面、主创原始答复、发行商FAQ、玩家卡文转录、玩家解释。当前新36张的数据均 `verified:true`，逐项记录官方PDF第24–27页定位；这个字段表示卡文已核对，不表示所有跨扩展组合均已验证。中文名都是本项目暂译，未宣称官方译名。

## 引擎落实

`characters.ts` 导出 `ORIGINAL_CHARACTERS`、完整 `CHARACTERS` 和 `characterPool('original'|'second-wind'|'mixed')`。完整36张续作记录在 `second-wind.ts`，包括稳定ID、中英文名、版本、来源/定位/访问日期、触发时点、可选性、目标、次数、持续时间、插画URL和核验状态。

每次新局记录 `characterPool` 和 `rulesVersion`，可执行规则标识与旧版本映射以 `src/engine/runtime.ts` 为准。旧存档缺版本时绑定 `legacy-base-v1` 并通过 `engine/runtime.ts` 单一版本登记继续使用保存的旧引擎 `legacy-v1.ts`；未知版本拒绝套用当前规则，保留存档待对应引擎恢复。牌库与蛋候选补充都沿用本局牌池；练习模式一直提供完整72张选四张。默认仍为 Mild/Wild/Mild/Wild，自定义赛程新增 Twisty Twirl 与三张 Leaf 地图。Whirly World 的规则书照片被盒子遮住部分路线，尚未开放；不会按名称猜测完整布局。

玩家ID用于身份、分数和重连；`Racer.identityPlayerId`保留选手创建来源，`Racer.playerId`是当前控制者，`Racer.id`是场上实例，`characterId`是印刷角色定义。Switcharoo只交换当前控制者和已用牌归属，不交换位置或实例ID。Re-Runner记录后续额外参赛条目，并在每场创建额外实例；固定行动列表不限定每玩家两名。

`effectivePowers`支持多个实际能力；Mush保留自身和新增能力，复制来源保持独立；Null从后方往前方确定哪些Null仍有效，被禁用的Null不能继续禁用更前方选手。旧的双人粘液怪例外仍仅适用粘液怪，其他角色的“其他选手”包含队友；“对方选手”按当前控制者不同筛选。

所有骰子进入可序列化 `rollBatch` 任务：主骰、六骰、追加骰、跟掷、水管和决斗。Stunner修改最终骰面，原随机值留在权威审计。Party Pooper针对所有最终6点强制重掷，其移动与连锁先完成，再生成替代骰。原骰不进入后续最终结果观察者。真人的每个可选或强制选择都必须由对应控制者提交，自动调度不提前代选；队列和隐藏context可以保存后恢复。

Cheatah设定值只保留在权威`flags.cheatahSecret`和pending.context，公共投影删除秘密字段和context。猜测完成后才发布揭晓事件。决斗第一颗保留骰同样在第二方提交前不公开。动画只读取事件。

## 当前明确待核实的续作边界

以下是可运行实现中的暂定解释或尚缺权威依据的交互，不能标记官方已核验：

1. Bite Mark：第24页现已确认形态持续本场；此前未知状态已解除。
2. Mr. Dice Guy：第25页现已确认六骰各异时不移动。2026-10-22用户授权采用明确项目房规：公开六骰后等待当前控制者整组重掷，不跳过主要移动、不提前消费额外回合。这与官方处理不同，作为用户已选定的项目规则继续保留。
3. Show-Off累加时哪些骰触发观察者，以及与Magician、Critic、Dicemonger、Nemesis、Inchworm等在追加中如何衔接，仍缺续作官方说明。当前先完成继续/停止，保留最后骰面与累计移动距离分别记录；Party Pooper会处理每颗追加骰。
4. 多个来源同时提供“以另一方式代替主移动”时，目前提供主移动能力选择；是否应顺序叠加、取代或限制，待官方裁定。多个被动加减与多来源复制已有实现，但这不等于所有72×72交互均已核验。
5. Doppelgängster自冲线、多个复制的Doppelgängster、它获得的能力是否包含对方已获得能力、与Mastermind同时结束的优先关系，仍需逐项取得权威例证。当前按首个冲线者淘汰（包含自己）、每场一次、持续获得实际能力处理。
6. Re-Runner与Switcharoo跨比赛的最终卡归属、Re-Runner获得其他角色能力后是否继续额外出场、一次比赛出现多个同名来源的额外参赛条目，需要官方续作多选手示例。
7. Hog Knight多名同时到达、原骑手到达另一名选手、骑手被淘汰/完赛、Null禁用来源后坐骑是否留下，仍需官方坐骑规则。当前非同时到达者可以夺走已在格子的坐骑，坐骑物件独立给骑手+2。
8. Penguin的恢复时点已解决：用户提供规则书第26页明确“I recover from tripping after my main move.”。新 `maps-v1` 中倒地时主骰加倍、不跳过主移动，随后站起；后续加减不随原骰翻倍。旧 `schedule-v1` 与更早存档仍由冻结引擎保留原行为，不在重连时迁移规则。固定距离或复制组合的全部解释未由这一句覆盖。
9. 第24页明确Gloth在Spoilsport取消时仍可得分；第27页明确取消前已颁名次保留。本实现一致，已解除这两项待核实问题。
10. 新获得能力不会重开已经过去的before-race时点；Understudy在before-race窗口复制能力时会继续初始化该能力（包括Sisyphus、Egg、Hog Knight等）。第27页现已明确Understudy可执行Egg等赛前效果，不能执行Re-Runner等赛后效果；本次已修正复制返场。

## 验证范围

`tests/second-wind.test.ts`对新增36张分别编写行为用例，另覆盖秘密信息投影/保存恢复、真人强制选择权限、Null与Mush、Understudy赛前初始化、复制、全类型骰子强制重掷、原骰与距离分离、控制权交换和回合外选择。`tests/second-wind-match.test.ts`分别用续作和混合池、2/4/8名玩家从选秀完成四场，所有决策使用公共投影，并在待选时保存恢复。

这些验证证明目前实现的行为和状态机可以复现；不替代官方规则来源、实际多人联机和手机渲染验收。

## 扩展压力检查

2026-10-21后端压力基线使用续作/混合牌池、2/3/8人、各30种种子，共180局，由只读取玩家投影的 AI 决策，并随每次操作更新公开版本。结果：169局完整四场，最长1264次操作；6局进入明确的 Mr. Dice Guy 六骰各异待核实暂停；5局达到3000次模拟操作限额，但仍存在合法操作；没有异常、缺失合法操作或内存溢出。限额案例包括 Soulmate 与复制其能力的 Understudy 在绊倒格形成重复传送/恢复、Diva 与绊倒格形成跨回合交换、Null/Stunner/Hopfrog 组合持续行动。这里没有给真实比赛添加任意回合数终止规则；跨回合闭环的官方处理仍需复核。Cheatah 的设定和猜测使用不同公开种子，不读取秘密队列，已避免此前测试策略恒定设1、猜1造成的固定策略停滞。结果保存在 `docs/qa/second-wind/seeded-public-ai-sweep.json`，可用 `pnpm exec tsx scripts/audit-second-wind-matches.ts` 重跑。

2026-10-22用户明确授权循环冲突裁决后，当前v2采用“完整规则状态重复、期间没有随机及可改变选择”精确检测；成立则本场和局，保留已获名次和积分，不给未完赛者补名次或额外奖励，正常进入后续分赛。Mr. Dice Guy六骰各异则等待控制者整组重掷。原作/续作/混合45局现全部完成四场，其中1次整组六骰重掷、1场强制循环和局，无暂停、操作限额或异常。两者均明确标为项目房规。复现序列、保守检测边界和不误报用例见[本轮规则复核](rule-review-2026-10-22.md)。

## 新增36张清单

完整目标/时点/次数/持续时间以 `src/shared/second-wind.ts` 同源数据为准。下表的所有中文名均为本项目暂译，核验状态均为“已核对玩家卡文转录，待官方卡面/续作规则复核”。

| ID | 英文 | 中文暂译 | 行为用例 | 外形参考 |
|---|---|---|---|---|
| `bite-mark` | Bite Mark | 咬痕 | SW-01 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Bite%20Mark.png) |
| `blunderdog` | Blunderdog | 糊涂狗 | SW-02 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Blunderdog.png) |
| `cheatah` | Cheatah | 千术豹 | SW-03 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Cheatah.png) |
| `critic` | Critic | 评论家 | SW-04 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Critic.png) |
| `diva` | Diva | 歌剧女伶 | SW-05 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Diva.png) |
| `doppelgangster` | Doppelgängster | 替身帮 | SW-06 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Doppelgangster.png) |
| `gloth` | Gloth | 葛洛斯 | SW-07 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Gloth.png) |
| `hog-knight` | Hog Knight | 野猪骑士 | SW-08 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Hog%20Knight.png) |
| `hopfrog` | Hopfrog | 弹跳蛙 | SW-09 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Hopfrog.png) |
| `hotel` | Hotel | 旅馆 | SW-10 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Hotel.png) |
| `icarus` | Icarus | 伊卡洛斯 | SW-11 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Icarus.png) |
| `kingtripper` | Kingtripper | 绊倒国王 | SW-12 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Kingtripper.png) |
| `kraken` | Kraken | 海怪 | SW-13 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Kraken.png) |
| `le-saboteur` | Le Saboteur | 破坏者 | SW-14 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/LeSaboteur.png) |
| `magical-athlete` | Magical Athlete | 魔法运动员 | SW-15 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Magical%20Athlete.png) |
| `mole` | Mole | 鼹鼠 | SW-16 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Mole.png) |
| `mr-dice-guy` | Mr. Dice Guy | 骰子先生 | SW-17 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Mr.%20Dice%20Guy.png) |
| `mush` | Mush | 蘑菇泥 | SW-18 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Mush.png) |
| `nemesis` | Nemesis | 宿敌 | SW-19 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Nemesis.png) |
| `nepo-baby` | Nepo Baby | 关系宝宝 | SW-20 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Nepo%20Baby.png) |
| `null` | Null | 虚无 | SW-21 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Null.png) |
| `overtaker` | Overtaker | 超车骷髅 | SW-22 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Overtaker.png) |
| `party-pooper` | Party Pooper | 扫兴鬼 | SW-23 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Party%20Pooper.png) |
| `penguin` | Penguin | 企鹅 | SW-24 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Penguin.png) |
| `re-runner` | Re-Runner | 返场跑者 | SW-25 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Re-Runner.png) |
| `show-off` | Show-Off | 显摆精 | SW-26 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Show-Off.png) |
| `soulmate` | Soulmate | 灵魂伴侣 | SW-27 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Soulmate.png) |
| `speed-demon` | Speed Demon | 速度恶魔 | SW-28 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Speed%20Demon.png) |
| `spoilsport` | Spoilsport | 输不起 | SW-29 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Spoilsport.png) |
| `stepdad` | Stepdad | 继父 | SW-30 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Stepdad.png) |
| `streaker` | Streaker | 裸奔客 | SW-31 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Streaker.png) |
| `stunner` | Stunner | 惊艳者 | SW-32 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Stunner.png) |
| `switcharoo` | Switcharoo | 交换袋鼠 | SW-33 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Switcharoo.png) |
| `tail` | Tail | 尾巴 | SW-34 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Tail.png) |
| `the-hose` | The Hose | 水管 | SW-35 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/The%20Hose.png) |
| `understudy` | Understudy | 替补演员 | SW-36 | [插画](https://johnnlds.github.io/Magical-Athlete-Racers/images/expansion/Understudy.png) |

## 2026-10-22 针对玩家反馈的复核

继父左右目标、交换袋鼠空目标、水管独立能力骰与绊倒、吸盘鱼实际移动预览已单独复核、修复并覆盖回归，详见[本轮规则复核](./rule-review-2026-10-22.md)。继父的“左邻”按固定选手实例顺序判断，允许自己的另一名选手；不是玩家列表的屏幕左侧。新增与复制的能力也沿用该派生关系。旧规则存档通过版本登记保留既有实现。
