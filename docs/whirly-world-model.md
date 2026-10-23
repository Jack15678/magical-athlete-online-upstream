# Whirly World 六组模型接入（2026-10-24）

用户提供 `Whirly_World_Six_Pairs_Blender_GLB.zip`，用于完成此前约定的六组传送。已接入游戏场景和落格规则，开放 Whirly 自定义赛程、官方巡回与扩展巡回。模型制作来自 Dots；本记录区分交付方报告与本项目实际运行检查。

## 最终布局与来源

六组均为双向：**3↔5、7↔12、10↔15、18↔22、20↔23、24↔27**。其他格子普通，28、29保留冲刺区域。停在端点才触发，越过不触发，同组传送不会立即弹回。复用原有移动/warp任务与随机源，无新增规则引擎。

前三组来自已有原图核对；20↔23由用户补充；18↔22和24↔27为用户采用的共创补齐方案。地图与巡回页面均说明采用网页版布局，`verified: false`保留原图资料缺口，不再表示不可玩。完整证据边界见[来源跟进](whirly-world-source.md)。

## 资源与加载

- `public/models/tracks/whirly-world.glb`：1,970,972字节，嵌入图集，不需要额外解码器。
- `assets/blender/tracks/whirly-world.blend`：保留用户交付的可编辑工程。
- 同目录的 `whirly-label-atlas.png`、`whirly-world.json`：保留图集与交付方元数据。JSON中的原交付验收状态描述的是交付方当时的工作，本项目接入结果以本记录为准。
- `WhirlyStadium.tsx`按需加载、克隆场景；加载中或失败使用已有程序化棋盘，传送规则照常可用。资源URL带`six-pairs-20261024`版本，防止读到首版四组缓存。
- 保持`track_whirly_world`根变换为单位变换、31个落点和玩家原坐标。手机整图绕Y轴旋转−90°；摄像机总览容纳新外沿，手机预留悬浮控件空间。
- 修复Node服务的CSP：允许GLTFLoader通过`blob:`解码内嵌图集。首版接入曾出现白色格面；检查浏览器console错误并目检真实图集后确认修复。

## 本地验证

受测对象：`a200bb4`之后本次六组模型接入工作树。无子代理、A/B测试、推送或部署。

- 模型/地图/相机/赛程单测71/71：核对GLB结构、六组父节点、31个锚点、手机旋转、逐格落脚表面和实际包围盒；六组双向移动、越过不触发、技能传送、落点能力与JSON恢复通过。
- 两套完整巡回2/2：三人公开AI接口完成官方4场和扩展8场，包含选秀、逐场JSON恢复、账本核对与终局分数。
- Playwright 7/7：可玩预设与表单校验，两套巡回实际建房并刷新恢复；桌面与390px手机总览；真实掷骰17→18→22、23→24→27、三人同格和刷新；GLB请求失败时19→20→23仍可玩。成功加载用例检查pageerror与console error。
- 截图发现首轮手机总览顶部被控件遮挡；增加Whirly手机总览留白后，相关34项单测与4项场景浏览器用例重新通过，目检整板已避开控件。
- `pnpm typecheck`、`pnpm build`通过；构建仍有原有大包体提示。未重复运行整个仓库测试套件。

主要复现命令：

```powershell
pnpm exec tsx --test tests/whirly-model.test.ts tests/map-rules.test.ts tests/camera.test.ts tests/new-track-scenes.test.ts tests/competition.test.ts
pnpm exec tsx --test --test-name-pattern 'tour:' tests/map-matches.test.ts
pnpm exec playwright test tests/browser/new-track-scenes.spec.ts tests/browser/whirly-model.spec.ts tests/browser/competition.spec.ts --grep 'whirly-world|Whirly|home shows|tour can be created'
```

Node模型测试检查几何与资源结构，真实浏览器负责贴图解码和实际显示。未在本机Blender重新打开工程；交付方的Blender报告不冒充本机验证。

[桌面实际总览](qa/whirly-world-integration/desktop.png) · [手机实际总览](qa/whirly-world-integration/mobile.png)

## PR同步验证（2026-10-24）

同步主分支`ad92d2a`（四张地图美术已合并），保留Bridges高度跟随和本图手机总览留白；合并提交`3b78240`。同步后82项地图/模型/相机/赛程检查、两套完整巡回、12项浏览器地图/建房检查及2项特殊赛事浏览器检查通过，类型检查和构建通过。浏览器确认“规则待确认”“尚未取得完整事件表”“待开放内容”均不再出现；特殊赛事能开启、选择场次、创建房间并刷新恢复，[实际设置截图](qa/special-event-settings.png)。

CI增加Whirly模型结构与加载/失败回退用例，更新首页用例名称匹配并加入两巡回实际建房用例。这里记录本地结果；GitHub检查状态以PR对应提交为准。
