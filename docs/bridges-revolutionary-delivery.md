# Bridges 与革命家：接入交付

> 以下保留 Dots 随包提供的交付记录，原始截图与日志见用户 ZIP；不是本机复验结论。本次实际接入、资源登记修正和验证结果见 [四地图接入复验](four-map-integration.md)。浏览器测试现在将临时截图输出到 `test-results/`。

## 基线与边界

- 主仓库 qiuh23/magical-athlete-online。开始时 PR #16 已合并，基线 `eb03eebe87be1fb41a3e6698fd5a0654ce305f9b`。
- 本地独立分支 `feat/bridges-revolutionary-3d`。未合并、未部署。GitHub connector 写入返回 403 `Resource not accessible by integration`，因此交付补丁而非声称已创建 PR。
- 没有使用子代理或 A/B 测试。对照图来自固定同一场景的改造前后截图，不是用户实验。
- 没有改计分、能力、合法边、格号、存档规则版本或其他角色资源。选牌 SVG 保持原文件。

## Bridges

只扩展展示坐标，保留 `0 → … → 30`、四对 `3/8, 10/13, 15/18, 20/23` 与第二弯道 15。增加上下坡的可用长度及低平台，用 `bridgeLeg` 同时构造平平台与坡道，并驱动棋子行走路径；不再用跨格曲线把棋子带离实际坡面。

上层暖色木质桥面、下层青灰通道，深色侧梁、开放式门架支撑、路线箭头及 `本格 → 下一格` 标识共同区分层次。立柱位于桥下行走线两侧；横梁位于桥下棋子净空之上。没有任何上下层换道连线。小地图、棋子、取景范围继续从同一份节点坐标读取。

Bridges 近景相机跟随所在高度，防止上层角色被顶栏遮住；其他地图的相机高度仍为 0。拖动缩放、减少动效及既有调度不替换。

## 革命家

重做连续弧线垂帽、融合鼻子的粉红头部、带翻领与衣襟的立体紫色外套、黑靴、包握手杖的手。保留原 ID 和 `toy_leaf-revolutionary` 根节点、五骨骼以及 idle/move/skill/fall/recover。倒地与起立仍由现有 ToyCharacter/棋子姿态链路处理，未加第二套动画系统。

规格：4,764 三角面，6 个材质/模型绘制 primitive，GLB 81,276 字节，宽 0.58714、高 0.98、深 0.31376，Y 向上、Z 正面、脚底原点，无游戏底座。6 次绘制不包括现有底座、阴影 pass 或其他场景物件。

原作者 BGG 登记页面本次访问返回 403，未取得原作者 PNG。依据是仓库 SVG 与登记识别特征；侧背衣服、帽形与雕塑细节为项目设计。manifest 明确 `originalAuthorImageChecked: false`，`referenceChecked` 指已核对的仓库参考，并非声称获得原作者原图。

压缩保留浮点位置，不进行会改变蒙皮 bind 几何的量化，避免既有“减少动效”静态路径变形。已为静态/动态一致性增加回归测试。

## 重建此角色（可选）

在仓库根目录运行：

```sh
blender -b --threads 2 --python scripts/generate-revolutionary.py
npm install --prefix .tools/revolutionary --no-package-lock @gltf-transform/core@4.5.1 @gltf-transform/extensions@4.5.1 @gltf-transform/functions@4.5.1 meshoptimizer@1.2.0
node scripts/finalize-revolutionary.mjs
```

后处理只改革命家 GLB、对应 JSON 及 manifest 的该条目/总字节数。没有调用其他角色的批量生成。Blender 脚本复用仓库既有建模辅助函数及动画 rig，但只写革命家资源。当前交付 GLB 已压缩，无需为使用游戏安装这些可选建模工具。

## 验证

详细日志在 `docs/evidence/bridges-revolutionary/`。浏览器测试通过本地真实 Node 房间服务与实际 Board3D/ToyCharacter 执行，不是单独离线模型 viewer。测试 fixture 设置比赛状态，动作通过原有日志/快照及游戏 UI 展示。

- `pnpm typecheck`：通过。
- `pnpm build`：通过；保留现有大于 500 KB 的 bundle 警告。
- 受影响单元/资源/规则测试：117 项通过，原断言未删除或放宽。
- 新增真实游戏视觉测试：14 项，覆盖桌面 1280×900、390×844、360×800 总览/近景，四组上下层同屏、8 条跨桥路径、模型站立/移动/倒地/起立/四人同格。路径中实际采样位置与桥面距离小于 0.09（包含现有步行动效抬脚）。
- 原 `new-track-scenes.spec.ts` 回归：8 项通过，包括前进/后退 6 个实际分叉点击、权限、刷新、Twist 卡片与规则入口。
- GLB 由现有 Three.js loader 重新加载，检查根节点、实际面数、边界、骨骼、五动画、静态和动画实例；不是仅检查导出命令成功。

执行可移植的浏览器验收（先安装 Playwright 浏览器，或设置 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指向本机 Chromium）：

```sh
pnpm exec playwright test -c playwright.art.config.ts
pnpm exec playwright test -c playwright.regression.config.ts
```

截图说明：`before-*` 是原版游戏实拍；`bridges-*`、`crossing-*`、`bridge-*-moving-*` 与 `revolutionary-game-*` 是改造后游戏实拍；`revolutionary-front/side/back` 是 Blender 离线预览，不能替代游戏验收。

## 未验证或限制

- 手机截图是云端 Chromium 的指定尺寸视口，不是真实手机 GPU、移动网络或长期帧率测试。
- 总览在 360px 屏幕上优先显示完整赛道，不能保证所有格号同时达到近景字号；通过标识、层次和近景核对具体路线。
- 未运行整个仓库的所有联机/能力组合测试，未验证远程部署。未创建远程 PR。
- 交付补丁基于上述基线；若 main 已有后续修改，先 `git apply --check`，人工解决真正的冲突，不覆盖他人工作。
