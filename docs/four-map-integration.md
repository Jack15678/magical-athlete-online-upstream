# 四地图美术交付接入与复验

2026-10-24，基线 `eb03eebe87be1fb41a3e6698fd5a0654ce305f9b`，分支 `codex/four-map-art`。四个 `Magical_Athlete_Four_Maps_Part_*_of_4.zip` 合并到临时目录后，286 个清单文件均存在且大小匹配；使用完整补丁接入，未再叠加旧 Bridges/革命家 ZIP。

原工作区另有建房说明和 Whirly 共创开发，本任务使用独立 Git 工作树，保留那些提交和未提交文件。本分支不开放 Whirly，不改计分、规则、随机数、存档或联网协议。

## 接入内容

- Squiggle：沿路线收边的底座、花园、连续路缘和赛事设施。
- Boardwalks：水景、木质栈道与真实分叉，保留原格号、排名距离和悬浮选路。
- Bridges：四组桥层、开放桥墩、圆角连接及共享平滑坡面；棋子与桥面使用同一轮廓。相机跟随桥层高度。
- Twisty：嘉年华棚亭、旗帜和读取公开状态的 13/14 跨线标记；保留变化卡说明、镜像、筹码与公共巨口。
- 革命家：采用交付的新 GLB、Blender 源、预览及原有五段动画，选牌继续使用 SVG。

## 接入时修正

首轮全量测试 1119/1121，暴露两处遗漏：

1. 交付清单把革命家的 `avatar` 指向模型 PNG。已修正资源清单和源 JSON，分开保留 SVG 头像、模型预览，并修正生成脚本以免再次覆盖。同步清单总字节数。
2. 新造型继承了旧 `surface-mouth-v2` 标记，旧审核指纹仍对应重做前的模型。保留历史 46 个模型的审核记录，给本次授权替换增加独立资源指纹；移除新造型的旧修复标记。新增检查直接加载实际 GLB，核对五段动画、静态/蒙皮一致性，以及嘴部 60 个顶点与脸部的接触范围，不冒用旧造型精确 0.004 的中心线结论。

没有为通过测试删除原断言；旧审核继续验证其余 45 个模型，新革命家使用对应新造型的几何检查。本机没有重新运行 Blender，Blend 指纹仅确认所交付的可编辑文件身份。

## 本机验证

- 全量测试：1121/1121，通过。
- TypeScript 客户端/服务端与 Worker 检查：通过。
- 生产构建与 Worker dry-run：通过；保留原有大 chunk 提示，未执行部署。
- 真实浏览器：38/38，通过，约 5.6 分钟；包含四张地图及经典 mild/wild，1280×900、390×844、360×800，总览、近景、明确 economy 低画质、四图真实掷骰移动、八段桥面移动、四组桥层、革命家倒地/起立、六处分叉点击与刷新、双人 Twist 抽卡和恢复。
- 已目检本机生成的手机截图。这里是 Windows 浏览器的指定尺寸视口，不是实体手机 GPU 测试；未把交付方的软件 WebGL 性能数字当作本机测量。
- CI 新增地图几何、头像/模型资源及桥面移动/低画质必跑检查，沿用原赛程、技能与联机回归。

复现：

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test tests/browser/expansion-dioramas.spec.ts tests/browser/expansion-low.spec.ts tests/browser/expansion-bridges.spec.ts tests/browser/expansion-movement.spec.ts tests/browser/new-track-scenes.spec.ts
```

临时截图和采样输出到 `test-results/`；下列为本机复验的精选截图：

| 场景 | 截图 |
| --- | --- |
| Squiggle 手机总览 | [查看](qa/four-map-art/after-squiggle-390-overview.png) |
| Boardwalks 手机总览 | [查看](qa/four-map-art/after-boardwalks-390-overview.png) |
| Bridges 手机总览 | [查看](qa/four-map-art/after-bridges-390-overview.png) |
| Bridges 上下层近景 | [查看](qa/four-map-art/crossing-3-8.png) |
| Twisty 手机近景 | [查看](qa/four-map-art/after-twisty-twirl-390-close.png) |
| 革命家游戏内 | [查看](qa/four-map-art/revolutionary-game-standing.png) |
| 经典 mild / wild | [mild](qa/four-map-art/after-mild-390-overview.png) / [wild](qa/four-map-art/after-wild-390-overview.png) |

保持 Draft，不合并、不部署。GitHub CI 以对应提交的运行结果为准。
